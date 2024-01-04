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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Caution')
@Controller('admin/caution')
export class CautionController {
  constructor(private readonly cautionService: CautionService) {}

  @Post()
  create(@Body() createCautionDto: CreateCautionDto) {
    return this.cautionService.create(createCautionDto);
  }

  @Get()
  findAll() {
    return this.cautionService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCautionDto: UpdateCautionDto) {
    return this.cautionService.update(+id, updateCautionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cautionService.remove(+id);
  }
}
