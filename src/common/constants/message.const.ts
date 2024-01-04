import { HttpStatus } from '@nestjs/common';

class ErrorCodeVo {
  readonly status;
  readonly message;

  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

export type ErrorCode = ErrorCodeVo;

export const UNABLE_DELETE_MERGED_DATA = new ErrorCodeVo(
  HttpStatus.FORBIDDEN,
  '취합완료된 데이터는 삭제할 수 없습니다.',
);

export const ENTITY_NOT_FOUND = new ErrorCodeVo(
  HttpStatus.NOT_FOUND,
  '데이터가 없습니다.',
);
