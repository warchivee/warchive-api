import { HttpStatus } from '@nestjs/common';
import {
  SCRAPBOOKS_LIMMIT_COUNT,
  SCRAPBOOK_ITEMS_LIMIT_COUNT,
} from '../utils/scrapbook.const';

class ErrorCodeVo {
  readonly error;
  readonly status;
  readonly message;

  constructor(error, status, message) {
    this.error = error;
    this.status = status;
    this.message = message;
  }
}

export type ErrorCode = ErrorCodeVo;

export const UNABLE_DELETE_MERGED_DATA = new ErrorCodeVo(
  'Unable Delete Merged Data',
  HttpStatus.FORBIDDEN,
  '취합완료된 데이터는 삭제할 수 없습니다.',
);

export const ENTITY_NOT_FOUND = new ErrorCodeVo(
  'Data Not Found',
  HttpStatus.NOT_FOUND,
  '데이터가 없습니다.',
);

export const TOO_MANY_SCRAPBOOK = new ErrorCodeVo(
  'too many scrapbook',
  HttpStatus.FORBIDDEN,
  `스크랩북 생성은 최대 ${SCRAPBOOKS_LIMMIT_COUNT}개까지만 가능합니다.`,
);

export const TOO_MANY_SCRAPBOOK_ITEM = new ErrorCodeVo(
  'too many scrapbook',
  HttpStatus.FORBIDDEN,
  `스크랩북 아이템은 최대 ${SCRAPBOOK_ITEMS_LIMIT_COUNT}개까지만 추가할 수 있습니다.`,
);

export const WRONG_ENCRYPTEDTEXT = new ErrorCodeVo(
  'bad decrypt',
  HttpStatus.BAD_REQUEST,
  '조회 아이디를 확인해 주세요.',
);

export const PERMISSION_DENIED = new ErrorCodeVo(
  'permission denied',
  HttpStatus.FORBIDDEN,
  '권한이 없습니다.',
);
