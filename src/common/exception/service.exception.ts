import {
  ENTITY_NOT_FOUND,
  ErrorCode,
  UNABLE_DELETE_MERGED_DATA,
} from '../interface/error-code.type';

export const UnableDeleteMergedDataException = (): ServiceException => {
  return new ServiceException(UNABLE_DELETE_MERGED_DATA);
};

export const EntityNotFoundException = (): ServiceException => {
  return new ServiceException(ENTITY_NOT_FOUND);
};

export class ServiceException extends Error {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    if (!message) {
      message = errorCode.message;
    }

    super(message);

    this.errorCode = errorCode;
  }
}
