import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { FindAllCollectionDto } from './dto/find-all-collection.dto';
import { FindCollectionDto } from './dto/find-collection.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddCollectionItemListDto } from './dto/add-collection-item.dto';
import { DeleteCollectionItemsDto } from './dto/delete-collection-item.dto';

@ApiTags('Collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 데이터 생성',
    description: '컬렉션 데이터를 생성합니다. 제목은 필수 입력값입니다.',
  })
  @Post()
  createCollection(
    @Request() req,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    return this.collectionService.createCollection(
      req.user,
      createCollectionDto,
    );
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '전체 컬렉션 조회',
    description: '사용자가 생성한 컬렉션 전체 목록을 조회합니다.',
  })
  @Get('/list')
  findAllCollections(
    @Query() FindallCollectionDto: FindAllCollectionDto,
    @Request() req,
  ) {
    return this.collectionService.findAllCollections(
      FindallCollectionDto,
      req.user,
    );
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 조회',
    description: '단일 컬렉션 정보 및 해당 아이템들을 조회합니다.',
  })
  @Get()
  findCollection(@Query() findCollectionDto: FindCollectionDto) {
    return this.collectionService.findCollection(findCollectionDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 이름 변경',
    description: '컬렉션 이름을 변경합니다.',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionService.update(+id, updateCollectionDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 데이터 삭제',
    description: '컬렉션 데이터를 삭제합니다.',
  })
  @Delete(':id')
  removeCollection(@Param('id') id: number) {
    return this.collectionService.removeCollection(+id);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 아이템 저장',
    description: '컬렉션 아이템 저장합니다.',
  })
  @Post(':id/add-item')
  addItem(
    @Param('id') collection_id: number,
    @Request() req,
    @Body() dto: AddCollectionItemListDto,
  ) {
    return this.collectionService.addItem(collection_id, req.user, dto.data);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 아이템 삭제',
    description: '컬렉션 아이템을 삭제합니다.',
  })
  @Delete(':id/delete-item')
  removeItem(
    @Param('id') collection_id: number,
    @Body() dto: DeleteCollectionItemsDto,
  ) {
    return this.collectionService.removeItem(collection_id, dto.data);
  }
}
