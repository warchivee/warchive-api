import {
  ENTITY_NOT_FOUND,
  ErrorCode,
  UNABLE_DELETE_MERGED_DATA,
  UNABLE_UPDATE_DATA_BEFORE_UPDATING,
  UNABLE_UPDATING_DATA,
} from '../interface/error-code.type';

export const UnableUpdatingData = (username: string): ServiceException => {
  return new ServiceException(
    UNABLE_UPDATING_DATA,
    username + UNABLE_UPDATING_DATA.message,
  );
};

export const UnableUpdateDataBeforeUpdating = (): ServiceException => {
  return new ServiceException(UNABLE_UPDATE_DATA_BEFORE_UPDATING);
};

export const UnableDeleteMergedDataException = (): ServiceException => {
  return new ServiceException(UNABLE_DELETE_MERGED_DATA);
};

export const EntityNotFoundException = (message?: string): ServiceException => {
  return new ServiceException(ENTITY_NOT_FOUND, message);
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
