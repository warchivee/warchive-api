import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WataService } from './wata.service';
import { CreateWataDto } from './dto/create-wata.dto';
import { UpdateWataDto } from './dto/update-wata.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Wata')
@Controller('wata')
export class WataController {
  constructor(private readonly wataService: WataService) {}

  @Post()
  create(@Body() createWataDto: CreateWataDto) {
    return this.wataService.create(createWataDto);
  }

  @Get()
  findAll() {
    return this.wataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWataDto: UpdateWataDto) {
    return this.wataService.update(+id, updateWataDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wataService.remove(+id);
  }
}
