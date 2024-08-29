import { CursorConnectionArgs } from '@/args/cursor-connection.arg'
import { GetByIdArgs } from '@/args/get-by-id.arg'
import { TagsPredictionArgs } from '@/tag/args/tags-prediction.arg'
import { TagConnectionType } from '@/tag/object-types/tag-connection.type'
import { TagType } from '@/tag/object-types/tag.type'
import { TagService } from '@/tag/tag.service'
import { Args, Query, Resolver } from '@nestjs/graphql'

@Resolver()
export class TagResolver {
    constructor(private readonly tagService: TagService) {}

    //

    @Query(() => TagConnectionType)
    tagsConnection(@Args({ type: () => CursorConnectionArgs }) args: CursorConnectionArgs): Promise<TagConnectionType> {
        return this.tagService.getConnection(args)
    }

    @Query(() => TagType)
    tag(@Args({ type: () => GetByIdArgs }) args: GetByIdArgs): Promise<TagType> {
        return this.tagService.getById(args)
    }

    @Query(() => TagConnectionType)
    tagsPrediction(@Args({ type: () => TagsPredictionArgs }) args: TagsPredictionArgs): Promise<TagConnectionType> {
        return this.tagService.getPrediction(args)
    }
}
