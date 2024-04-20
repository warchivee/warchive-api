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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateItemDto } from './dto/update-scapbook-item.dto';
import { ScrapbookService } from './scapbook.service';
import { CreateScrapbookDto } from './dto/create-scapbook.dto';
import { AddScrapbookItemListDto } from './dto/add-scapbook-item.dto';
import { DeleteScrapbookItemsDto } from './dto/delete-scapbook-item.dto';

@ApiTags('Scrapbook')
@Controller('scrapbook')
export class ScrapbookController {
  constructor(private readonly scrapbookService: ScrapbookService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 목록 조회',
    description: '사용자가 생성한 컬렉션 목록을 조회합니다.',
  })
  @Get()
  findAllScrapbooks(@Request() req) {
    return this.scrapbookService.findScrapbooks(req.user);
  }

  @Public()
  @ApiOperation({
    summary: '공유 컬렉션 조회',
    description: '단일 컬렉션 정보 및 해당 아이템들을 조회합니다.',
  })
  @Get('/shared/:sharedId')
  findScrapbook(@Param('sharedId') sharedId: string) {
    return this.scrapbookService.findShareScrapbook(sharedId);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 데이터 생성',
    description: '컬렉션 데이터를 생성합니다. 제목은 필수 입력값입니다.',
  })
  @Post()
  createScrapbook(
    @Request() req,
    @Body() createScrapbookDto: CreateScrapbookDto,
  ) {
    return this.scrapbookService.createScrapbook(req.user, createScrapbookDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 아이템 수정',
    description: '컬렉션 아이템을 여러건 수정합니다.',
  })
  @Patch('/items')
  updateItem(@Request() req, @Body() dto: UpdateItemDto[]) {
    return this.scrapbookService.updateItem(req.user, dto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 변경',
    description: '컬렉션 이름이나 내용을 변경합니다.',
  })
  @Patch(':id')
  updateScrapbook(
    @Param('id') id: number,
    @Request() req,
    @Body() updateScrapbookDto: CreateScrapbookDto,
  ) {
    return this.scrapbookService.updateScrapbook(
      id,
      req.user,
      updateScrapbookDto,
    );
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 데이터 삭제',
    description: '컬렉션 데이터를 삭제합니다.',
  })
  @Delete(':id')
  removeScrapbook(@Request() req, @Param('id') id: number) {
    return this.scrapbookService.removeScrapbook(req.user, +id);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 아이템 다건 저장',
    description: '컬렉션 아이템 저장합니다.',
  })
  @Post(':id/items')
  addItem(
    @Param('id') scrapbook_id: number,
    @Request() req,
    @Body() dto: AddScrapbookItemListDto,
  ) {
    return this.scrapbookService.addItem(req.user, scrapbook_id, dto.add_ids);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '컬렉션 아이템 다건 삭제',
    description: '컬렉션 아이템을 삭제합니다.',
  })
  @Delete(':id/items')
  removeItem(
    @Param('id') scrapbook_id: number,
    @Request() req,
    @Body() dto: DeleteScrapbookItemsDto,
  ) {
    return this.scrapbookService.removeItem(
      scrapbook_id,
      req.user,
      dto.delete_ids,
    );
  }
}
