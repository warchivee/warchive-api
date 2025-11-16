import { Controller, Get, Body, Request, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReceiptService } from './receipt.service';
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
    summary: '영수증 동기화 정보 조회',
    description: '동기화 정보를 조회합니다.',
  })
  @Get('/sync')
  findSyncInfo(@Request() req) {
    return this.receiptService.findSyncInfo(req.user);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '영수증 아이템 동기화',
    description: '영수증을 동기화합니다.',
  })
  @Put('/sync')
  update(@Request() req, @Body() dtos: CreateReceiptDto[]) {
    return this.receiptService.synchronize(req.user, dtos);
  }
}
