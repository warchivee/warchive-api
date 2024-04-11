import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlatformService } from './platform.service';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Admin } from 'src/common/decorators/admin.decorator';

@ApiTags('Keywords')
@Controller('admin/platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '플랫폼 생성',
    description: '플랫폼을 생성합니다. 이름은 중복될 수 없습니다.',
  })
  @Post()
  create(@Body() createPlatformDto: CreatePlatformDto) {
    return this.platformService.create(createPlatformDto);
  }

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '플랫폼 목록 조회',
    description: '플랫폼 목록을 조회합니다.',
  })
  @Get()
  findAll() {
    return this.platformService.findAll();
  }

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '플랫폼 수정',
    description: '플랫폼의 이름을 수정합니다. 이름은 중복될 수 없습니다.',
  })
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePlatformDto: UpdatePlatformDto,
  ) {
    return this.platformService.update(+id, updatePlatformDto);
  }

  @Admin()
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: '플랫폼 삭제',
    description: '플랫폼을 삭제합니다.',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.platformService.remove(+id);
  }
}
