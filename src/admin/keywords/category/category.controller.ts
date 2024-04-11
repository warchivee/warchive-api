import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/admin.decorator';

@ApiTags('Keywords')
@Controller('admin/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '카테고리 생성',
    description: '카테고리를 생성합니다. 이름은 중복될 수 없습니다.',
  })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '카테고리 목록 조회',
    description: '카테고리 목록을 조회합니다. 하위 장르들도 같이 조회됩니다.',
  })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '카테고리 수정',
    description: '카테고리의 이름을 수정합니다. 이름은 중복될 수 없습니다.',
  })
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '카테고리 삭제',
    description:
      '카테고리를 삭제합니다. 하위 장르들이 있다면 삭제할 수 없습니다. 장르를 먼저 삭제해주세요.',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoryService.remove(+id);
  }
}
