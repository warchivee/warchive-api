import { Injectable } from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { ConfigService } from '@nestjs/config';
import { google, sheets_v4 } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookclubReviewService {
  constructor(private readonly configService: ConfigService) {}

  // authenticate the service account
  private googleAuth: any = new google.auth.JWT(
    this.configService.get('CLIENT_EMAIL'),
    null,
    this.configService.get('PRIVATE_KEY').replace(/\\n/g, '\n'),
    'https://www.googleapis.com/auth/spreadsheets',
  );

  private generateUuid(): string {
    return uuidv4();
  }

  private convertToBoolean(value: any): boolean {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  }

  async create(createReactionDto: CreateReactionDto) {
    // const uuid = this.generateUuid();
    // console.log(uuid);

    // google sheet instance
    const sheetInstance = await google.sheets({
      version: 'v4',
      auth: this.googleAuth,
    });
    // read data in the range in a sheet
    const infoObjectFromSheet = await sheetInstance.spreadsheets.values.get({
      auth: this.googleAuth,
      spreadsheetId: this.configService.get('GOOGLE_SHEET_ID'),
      range: `${this.configService.get('GOOGLE_SHEET_REACTION')}!A:J`,
    });

    const rowIndex = infoObjectFromSheet.data.values.length;
    const range = `${this.configService.get('GOOGLE_SHEET_REACTION')}!A${
      rowIndex + 1
    }:J${rowIndex + 1}`;
    const newRow = {
      values: [
        [
          createReactionDto.book_id,
          createReactionDto.review_id,
          createReactionDto.uuid,
          createReactionDto.is_best,
          createReactionDto.is_funny,
          createReactionDto.is_interested,
          createReactionDto.is_empathized,
          createReactionDto.is_amazed,
          new Date(),
          new Date(),
        ],
      ],
    };

    await sheetInstance.spreadsheets.values.update({
      spreadsheetId: this.configService.get('GOOGLE_SHEET_ID'),
      range,
      valueInputOption: 'RAW',
      requestBody:
        newRow as sheets_v4.Params$Resource$Spreadsheets$Values$Update['requestBody'],
    });
  }

  async findReactionCount() {
    try {
      // google sheet instance
      const sheetInstance = await google.sheets({
        version: 'v4',
        auth: this.googleAuth,
      });
      // read data in the range in a sheet
      const infoObjectFromSheet = await sheetInstance.spreadsheets.values.get({
        auth: this.googleAuth,
        spreadsheetId: this.configService.get('GOOGLE_SHEET_ID'),
        range: `${this.configService.get('GOOGLE_SHEET_COUNT')}!A2:G`,
      });

      const valuesFromSheet = infoObjectFromSheet.data.values.map(
        (row, index) => {
          return {
            rowIndex: index + 2,
            book_id: Number(row[0]),
            review_id: Number(row[1]),
            is_best: Number(row[2]),
            is_funny: Number(row[3]),
            is_interested: Number(row[4]),
            is_empathized: Number(row[5]),
            is_amazed: Number(row[6]),
          };
        },
      );
      return valuesFromSheet;
    } catch (err) {
      return ['readSheet func() error', err];
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} bookclubReview`;
  // }

  // update(id: number, updateBookclubReviewDto: UpdateBookclubReviewDto) {
  //   return `This action updates a #${id} bookclubReview`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} bookclubReview`;
  // }
}
