import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@ApiTags('User Transcription Favorites')
@Controller('transcription/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({
    summary: '필사할 문구 저장',
    description: '필사하고 싶은 문구를 저장합니다.',
  })
  @Post()
  addFavorite(@Request() req, @Body() createFavoriteDto: CreateFavoriteDto) {
    const userId = req.user?.id;
    return this.favoritesService.addFavorite(userId, createFavoriteDto);
  }

  @ApiOperation({
    summary: '저장한 문구 조회',
    description: '사용자가 저장한 필사할 문구를 조회합니다',
  })
  @Get()
  getFavoritesByUser(@Request() req) {
    const userId = req.user?.id;
    return this.favoritesService.getFavoritesByUser(userId);
  }
}
