import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNumber } from 'class-validator';
import { enumToArray } from 'src/common/utils/enum.util';

export function QueryValidNumberArray() {
  return applyDecorators(
    ApiProperty({
      type: String,
      required: false,
      description: 'number id 값을 , 로 연결하여 전송해주세요. ex) 1,2,3',
    }),
    IsArray(),
    IsNumber({}, { each: true }),
    Transform(({ value }) => value.split(',')?.map((item) => Number(item))),
  );
}

export function QueryValidEnumArray(enumObj: Record<string, string>) {
  return applyDecorators(
    ApiProperty({
      type: String,
      required: false,
      description: `[${enumToArray(enumObj).join(
        ' / ',
      )}] 을 , 로 연결하여 전송해주세요 ex) ENUM1,ENUM2,ENUM3`,
    }),
    IsArray(),
    IsEnum(enumObj, { each: true }),
    Transform(({ value }) => value.split(',')),
  );
}
