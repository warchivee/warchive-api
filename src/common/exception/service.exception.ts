import {
  ENTITY_NOT_FOUND,
  ErrorCode,
  UNABLE_DELETE_MERGED_DATA,
  TOO_MANY_COLLECTION,
  TOO_MANY_COLLECTION_ITEM,
} from '../interface/error-code.type';

export const UnableDeleteMergedDataException = (): ServiceException => {
  return new ServiceException(UNABLE_DELETE_MERGED_DATA);
};

export const EntityNotFoundException = (message?: string): ServiceException => {
  return new ServiceException(ENTITY_NOT_FOUND, message);
};

export const TooManyCollectionException = (): ServiceException => {
  return new ServiceException(TOO_MANY_COLLECTION);
};

export const TooManyCollectionItemException = (): ServiceException => {
  return new ServiceException(TOO_MANY_COLLECTION_ITEM);
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
