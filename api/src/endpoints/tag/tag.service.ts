import { CursorConnectionArgs } from '@/args/cursor-connection.arg'
import { GetByIdArgs } from '@/args/get-by-id.arg'
import { TagEntity } from '@/entities/tag.entity'
import { TagsPredictionArgs } from '@/tag/args/tags-prediction.arg'
import { TagConnectionType } from '@/tag/object-types/tag-connection.type'
import { TagType } from '@/tag/object-types/tag.type'
import {
    getCursorLimit,
    getCursorPaginationCondition,
    getCursorOrderDirection,
    processCursorConnection,
} from '@/utils/cursor-connection'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Like, Repository } from 'typeorm'

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,
    ) {}

    //

    getConnection({ limit, nextPageCursor, prevPageCursor }: CursorConnectionArgs): Promise<TagConnectionType> {
        const whereCondition = getCursorPaginationCondition<TagEntity>()

        const getData = () =>
            this.tagRepository.find({
                where: whereCondition,
                take: getCursorLimit(limit),
                order: {
                    id: getCursorOrderDirection(prevPageCursor),
                },
            })

        return processCursorConnection<TagEntity, TagType>({
            limit,
            nextPageCursor,
            prevPageCursor,
            condition: whereCondition,
            getData,
            aggregateData: this.aggregateMany.bind(this),
        })
    }

    async getById({ id }: GetByIdArgs): Promise<TagType> {
        const item = await this.tagRepository.findOne({
            where: { id },
        })
        if (!item) {
            throw new NotFoundException(`Tag with ID ${id} not found`)
        }
        return this.aggregateOne(item)
    }

    getPrediction({ name, limit, nextPageCursor, prevPageCursor }: TagsPredictionArgs): Promise<TagConnectionType> {
        const whereCondition = getCursorPaginationCondition<TagEntity>({
            name: Like(`%${name}%`),
        })

        const getData = () =>
            this.tagRepository.find({
                where: whereCondition,
                take: getCursorLimit(limit),
                order: {
                    id: getCursorOrderDirection(prevPageCursor),
                },
            })

        return processCursorConnection<TagEntity, TagType>({
            limit,
            nextPageCursor,
            prevPageCursor,
            condition: whereCondition,
            getData,
            aggregateData: this.aggregateMany.bind(this),
        })
    }

    //

    aggregateOne({ id, name }: TagEntity): TagType {
        return {
            id,
            name,
        }
    }

    aggregateMany(tags: TagEntity[]): TagType[] {
        return tags.map(tag => this.aggregateOne(tag))
    }
}
