import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CautionService } from './caution.service';
import { CreateCautionDto } from './dto/create-caution.dto';
import { UpdateCautionDto } from './dto/update-caution.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Keywords')
@Controller('admin/caution')
export class CautionController {
  constructor(private readonly cautionService: CautionService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '주의 키워드 생성',
    description: '주의 키워드를 생성합니다. 이름은 중복될 수 없습니다.',
  })
  @Post()
  create(@Body() createCautionDto: CreateCautionDto) {
    return this.cautionService.create(createCautionDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '주의 키워드 목록 조회',
    description: '주의 키워드 목록을 조회합니다.',
  })
  @Get()
  findAll() {
    return this.cautionService.findAll();
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '주의 키워드 수정',
    description: '주의 키워드의 이름을 수정합니다. 이름은 중복될 수 없습니다.',
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCautionDto: UpdateCautionDto) {
    return this.cautionService.update(+id, updateCautionDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '주의 키워드 삭제',
    description: '주의 키워드를 삭제합니다.',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cautionService.remove(+id);
  }
}
