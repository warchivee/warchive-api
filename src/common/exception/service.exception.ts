import {
  ENTITY_NOT_FOUND,
  ErrorCode,
  UNABLE_DELETE_MERGED_DATA,
  TOO_MANY_SCRAPBOOK,
  TOO_MANY_SCRAPBOOK_ITEM,
  WRONG_ENCRYPTEDTEXT,
  PERMISSION_DENIED,
} from '../interface/error-code.type';

export const UnableDeleteMergedDataException = (): ServiceException => {
  return new ServiceException(UNABLE_DELETE_MERGED_DATA);
};

export const EntityNotFoundException = (message?: string): ServiceException => {
  return new ServiceException(ENTITY_NOT_FOUND, message);
};

export const TooManyScrapbookException = (): ServiceException => {
  return new ServiceException(TOO_MANY_SCRAPBOOK);
};

export const TooManyScrapbookItemException = (): ServiceException => {
  return new ServiceException(TOO_MANY_SCRAPBOOK_ITEM);
};

export const WrongEncryptedText = (): ServiceException => {
  return new ServiceException(WRONG_ENCRYPTEDTEXT);
};

export const PermissionDenied = (): ServiceException => {
  return new ServiceException(PERMISSION_DENIED);
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
