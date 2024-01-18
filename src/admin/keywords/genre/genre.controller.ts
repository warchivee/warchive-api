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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Keywords')
@Controller('admin/category/:categoryId/genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '장르 생성',
    description:
      '장르를 생성합니다. 이름은 중복될 수 없습니다. 상위 카테고리 id 를 필요로 합니다.',
  })
  @Post()
  create(
    @Param('categoryId')
    categoryId: number,
    @Body() createGenreDto: CreateGenreDto,
  ) {
    return this.genreService.create(+categoryId, createGenreDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '장르 목록 조회',
    description: '장르 목록을 조회합니다.',
  })
  @Get()
  findAll() {
    return this.genreService.findAll();
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '장르 수정',
    description:
      '장르의 이름을 수정합니다. 이름은 중복될 수 없습니다. 상위 카테고리 id 를 필요로 합니다.',
  })
  @Patch(':id')
  update(
    @Param('categoryId') categoryId: string,
    @Param('id') id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    return this.genreService.update(+categoryId, +id, updateGenreDto);
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '장르 삭제',
    description: '장르를 삭제합니다.',
  })
  @Delete(':id')
  remove(@Param('categoryId') categoryId: string, @Param('id') id: string) {
    return this.genreService.remove(+categoryId, +id);
  }
}
