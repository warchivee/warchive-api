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
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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
  create(@Request() req, @Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(req.user, createCollectionDto);
  }

  @Get()
  findAll() {
    return this.collectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(+id);
  }

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
  remove(@Param('id') id: number) {
    return this.collectionService.remove(+id);
  }
}
