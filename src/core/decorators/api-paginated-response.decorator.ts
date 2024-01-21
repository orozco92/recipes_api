import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ListResponseDto } from '../models/list-response';

export const ApiListResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(ListResponseDto, model),
    ApiOkResponse({
      schema: {
        title: `ListResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(ListResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
