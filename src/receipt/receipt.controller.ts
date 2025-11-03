import {
  Controller,
  Get,
  Body,
  Patch,
  Request,
  Put,
  Post,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReceiptService } from './receipt.service';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { CreateReceiptDto } from './dto/create-receipt.dto';

@ApiTags('Receipt')
@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '영수증 목록 조회',
    description: '사용자가 생성한 영수증 목록을 조회합니다.',
  })
  @Get()
  findAll(@Request() req) {
    return this.receiptService.find(req.user);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '영수증 아이템 수정',
    description: '영수증 아이템을 수정합니다.',
  })
  @Put('/:id')
  update(
    @Request() req,
    @Param('id') id: number,
    @Body() dto: UpdateReceiptDto,
  ) {
    return this.receiptService.update(req.user, id, dto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '영수증 아이템 생성',
    description: '영수증 아이템을 생성합니다.',
  })
  @Post()
  create(@Request() req, @Body() dto: CreateReceiptDto) {
    return this.receiptService.create(req.user, dto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '영수증 아이템 삭제',
    description: '영수증 아이템 삭제합니다.',
  })
  @Delete('/:id')
  delete(@Request() req, @Param('id') id: number) {
    return this.receiptService.delete(req.user, id);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '영수증 아이템 수정',
    description: '영수증 아이템을 여러건 수정합니다.',
  })
  @Patch('/bulk')
  updateItem(@Request() req, @Body() dtos: UpdateReceiptDto[]) {
    return this.receiptService.bulkUpdate(req.user, dtos);
  }
}
