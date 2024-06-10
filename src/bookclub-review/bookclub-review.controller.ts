import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { BookclubReviewService } from './bookclub-review.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller('bookclub-review')
export class BookclubReviewController {
  constructor(private readonly bookclubReviewService: BookclubReviewService) {}

  @Public()
  @ApiOperation({
    summary: '북클럽 리뷰 반응 데이터 생성',
  })
  @Post()
  create(@Body() createReactionDto: CreateReactionDto) {
    return this.bookclubReviewService.create(createReactionDto);
  }

  @Public()
  @ApiOperation({
    summary: '북클럽 리뷰 반응 합계 데이터 전체 조회',
  })
  @Get()
  findReactionCount() {
    return this.bookclubReviewService.findReactionCount();
  }

  // @ApiOperation({
  //   summary: '북클럽 리뷰 유저 반응 데이터 조회',
  // })
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.bookclubReviewService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateBookclubReviewDto: UpdateBookclubReviewDto,
  // ) {
  //   return this.bookclubReviewService.update(+id, updateBookclubReviewDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.bookclubReviewService.remove(+id);
  // }
}
