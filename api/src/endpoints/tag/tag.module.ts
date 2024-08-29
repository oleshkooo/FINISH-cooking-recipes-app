import { TagEntity } from '@/entities/tag.entity'
import { TagResolver } from '@/tag/tag.resolver'
import { TagService } from '@/tag/tag.service'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [TypeOrmModule.forFeature([TagEntity])],
    providers: [TagResolver, TagService],
})
export class TagModule {}
