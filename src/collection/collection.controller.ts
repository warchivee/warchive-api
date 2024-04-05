import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddCollectionItemListDto } from './dto/add-collection-item.dto';
import { DeleteCollectionItemsDto } from './dto/delete-collection-item.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateItemDto } from './dto/update-item.dto';

@ApiTags('Collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 목록 조회',
    description: '사용자가 생성한 컬렉션 목록을 조회합니다.',
  })
  @Get()
  findAllCollections(@Request() req) {
    return this.collectionService.findCollections(req.user);
  }

  @Public()
  @ApiOperation({
    summary: '공유 컬렉션 조회',
    description: '단일 컬렉션 정보 및 해당 아이템들을 조회합니다.',
  })
  @Get(':sharedId')
  findCollection(@Param('sharedId') sharedId: string) {
    return this.collectionService.findShareCollection(sharedId);
  }

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
    summary: '컬렉션 아이템 수정',
    description: '컬렉션 아이템을 여러건 수정합니다.',
  })
  @Patch('/items')
  updateItem(@Request() req, @Body() dto: UpdateItemDto[]) {
    return this.collectionService.updateItem(req.user, dto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 변경',
    description: '컬렉션 이름이나 내용을 변경합니다.',
  })
  @Patch(':id')
  updateCollection(
    @Param('id') id: number,
    @Request() req,
    @Body() updateCollectionDto: CreateCollectionDto,
  ) {
    return this.collectionService.updateCollection(
      id,
      req.user,
      updateCollectionDto,
    );
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 데이터 삭제',
    description: '컬렉션 데이터를 삭제합니다.',
  })
  @Delete(':id')
  removeCollection(@Request() req, @Param('id') id: number) {
    return this.collectionService.removeCollection(req.user, +id);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 아이템 다건 저장',
    description: '컬렉션 아이템 저장합니다.',
  })
  @Post(':id/items')
  addItem(
    @Param('id') collection_id: number,
    @Request() req,
    @Body() dto: AddCollectionItemListDto,
  ) {
    return this.collectionService.addItem(req.user, collection_id, dto.add_ids);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 아이템 다건 삭제',
    description: '컬렉션 아이템을 삭제합니다.',
  })
  @Delete(':id/items')
  removeItem(
    @Param('id') collection_id: number,
    @Request() req,
    @Body() dto: DeleteCollectionItemsDto,
  ) {
    return this.collectionService.removeItem(
      collection_id,
      req.user,
      dto.delete_ids,
    );
  }
}
