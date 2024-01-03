import { CursorConnectionArgs } from '@/args/cursor-connection.arg'
import { PageInfoType } from '@/object-types/page-info.type'
import { FindOneOptions, FindOperator, LessThanOrEqual, MoreThan } from 'typeorm'

type FindOperatorCondition = {
    id: FindOperator<number>
    [x: string | number | symbol]: unknown
}

export const getCursorLimit = (limit: CursorConnectionArgs['limit']): number => {
    return limit + 1
}

export const getCursorOrderDirection = (prevPageCursor: CursorConnectionArgs['prevPageCursor']): 'ASC' | 'DESC' => {
    return prevPageCursor ? 'DESC' : 'ASC'
}

export const getCursorPaginationCondition = <T>(options?: FindOneOptions<T>['where']) => {
    return {
        ...options,
        id: MoreThan(0),
    }
}

export const processCursors = ({
    condition,
    nextPageCursor,
    prevPageCursor,
}: {
    condition: FindOperatorCondition
} & Pick<CursorConnectionArgs, 'nextPageCursor' | 'prevPageCursor'>) => {
    if (nextPageCursor) {
        condition.id = MoreThan(nextPageCursor)
    } else if (prevPageCursor) {
        condition.id = LessThanOrEqual(prevPageCursor)
    }
}

export const createCursorConnectionResponse = <T extends { id: number }>({
    nodes,
    limit,
    nextPageCursor,
    prevPageCursor,
}: { nodes: T[] } & Omit<PageInfoType, 'hasNextPage' | 'hasPrevPage'>): { nodes: T[]; pageInfo: PageInfoType } => {
    const newNextPageCursor: PageInfoType['nextPageCursor'] = (() => {
        if (prevPageCursor) {
            return prevPageCursor
        }
        if (nodes?.length && nodes.length > limit) {
            nodes.pop()
            return nodes.at(-1)?.id || null
        }
        return null
    })()
    const newPrevPageCursor: PageInfoType['prevPageCursor'] = (() => {
        if (nextPageCursor) {
            return nextPageCursor
        }
        if (nodes?.length && nodes.length > limit) {
            const firstNodeId = nodes.at(0)?.id
            nodes.shift()
            return firstNodeId || null
        }
        return null
    })()

    const hasNextPage = newNextPageCursor != null
    const hasPrevPage = newPrevPageCursor != null

    return {
        nodes,
        pageInfo: {
            limit,
            hasNextPage,
            nextPageCursor: newNextPageCursor,
            hasPrevPage,
            prevPageCursor: newPrevPageCursor,
        },
    }
}

export const processCursorConnection = async <
    E,
    T extends {
        id: number
    },
>({
    limit,
    nextPageCursor,
    prevPageCursor,
    condition,
    getData,
    aggregateData,
}: {
    condition: FindOperatorCondition
    getData: () => Promise<E[]>
    aggregateData: (data: E[]) => T[]
} & CursorConnectionArgs): Promise<ReturnType<typeof createCursorConnectionResponse<T>>> => {
    processCursors({ condition, nextPageCursor, prevPageCursor })

    const data = await getData()
    if (prevPageCursor) {
        data.reverse()
    }

    return createCursorConnectionResponse({
        nodes: aggregateData(data),
        limit,
        nextPageCursor,
        prevPageCursor,
    })
}
