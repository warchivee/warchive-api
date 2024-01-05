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

import { WataService } from './wata.service';
import { CreateWataDto } from './dto/create-wata.dto';
import { UpdateWataDto } from './dto/update-wata.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateWataLabelDto } from './dto/update-wata-label.dto';

@ApiTags('Wata')
@Controller('admin/wata')
export class WataController {
  constructor(private readonly wataService: WataService) {}

  @Post()
  create(@Request() req, @Body() createWataDto: CreateWataDto) {
    return this.wataService.create(req.user, createWataDto);
  }

  @Get()
  findAll() {
    return this.wataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wataService.findOne(+id);
  }

  @Patch(':id/updating')
  updating(@Request() req, @Param('id') id: string) {
    return this.wataService.updating(req.user, +id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWataDto: UpdateWataDto,
  ) {
    return this.wataService.update(req.user, +id, updateWataDto);
  }

  @Patch(':id/label')
  updateLabel(
    @Request() req,
    @Param('id') id: string,
    @Body() updateWataLabelDto: UpdateWataLabelDto,
  ) {
    return this.wataService.updateLabel(req.user, +id, updateWataLabelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wataService.remove(+id);
  }
}
