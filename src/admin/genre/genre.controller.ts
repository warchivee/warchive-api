import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Genre')
@Controller('admin/category/:categoryId/genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  create(
    @Param('categoryId') categoryId: string,
    @Body() createGenreDto: CreateGenreDto,
  ) {
    return this.genreService.create(+categoryId, createGenreDto);
  }

  @Get()
  findAll() {
    return this.genreService.findAll();
  }

  @Patch(':id')
  update(
    @Param('categoryId') categoryId: string,
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    return this.genreService.update(+categoryId, +id, updateGenreDto);
  }

  @Delete(':id')
  remove(@Param('categoryId') categoryId: string, @Param('id') id: string) {
    return this.genreService.remove(+categoryId, +id);
  }
}
