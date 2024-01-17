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
import { ApiTags } from '@nestjs/swagger';
import { UpdateWataLabelDto } from './dto/update-wata-label.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('Wata')
@Controller('admin/wata')
export class WataController {
  constructor(private readonly wataService: WataService) {}

  @Public()
  @Post()
  create(@Request() req, @Body() createWataDto: CreateWataDto) {
    return this.wataService.create(req.user, createWataDto);
  }

  @Public()
  @Get()
  findAll(@Query() findWataDto: FindWataDto) {
    return this.wataService.findAll(findWataDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wataService.findOne(+id);
  }

  @Public()
  @Patch(':id/updating')
  updating(@Request() req, @Param('id') id: string) {
    return this.wataService.updating(req.user, +id);
  }

  @Public()
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
