import { HttpStatus } from '@nestjs/common';

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

export const TOO_MANY_COLLECTION = new ErrorCodeVo(
  'too many collection',
  HttpStatus.FORBIDDEN,
  '컬렉션 생성은 최대 20개까지만 가능합니다.',
);

export const TOO_MANY_COLLECTION_ITEM = new ErrorCodeVo(
  'too many collection',
  HttpStatus.FORBIDDEN,
  '컬렉션 아이템은 최대 500개까지만 추가할 수 있습니다.',
);
