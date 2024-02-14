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

import { WataService } from './wata.service';
import { FindWataDto } from './dto/find-wata.dto';
import { CreateWataDto } from './dto/create-wata.dto';
import { UpdateWataDto } from './dto/update-wata.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Wata')
@Controller('admin/wata')
export class WataController {
  constructor(private readonly wataService: WataService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '검수 데이터 생성',
    description: '검수 데이터를 생성합니다. 제목은 필수 입력값입니다.',
  })
  @Post()
  create(@Request() req, @Body() createWataDto: CreateWataDto) {
    return this.wataService.create(req.user, createWataDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '검수 데이터 목록 조회',
    description: '검수 데이터 목록을 조회합니다.',
  })
  @Get()
  findAll(@Query() findWataDto: FindWataDto) {
    return this.wataService.findAll(findWataDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '검수 데이터 단건 조회',
    description: '검수 데이터를 1개 조회합니다. ',
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wataService.findOne(+id);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '검수 데이터 수정',
    description: '검수 데이터를 수정합니다.',
  })
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: number,
    @Body() updateWataDto: UpdateWataDto,
  ) {
    return this.wataService.update(req.user, +id, updateWataDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '검수 데이터 삭제',
    description:
      '검수 데이터를 삭제합니다. 취합완료된 데이터는 삭제할 수 없습니다.',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.wataService.remove(+id);
  }
}
