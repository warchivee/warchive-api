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
