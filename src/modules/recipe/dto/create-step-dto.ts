import { OmitType } from '@nestjs/swagger';
import { Step } from '../../../core/entities';

export class CreateStepDto extends OmitType(Step, [
  'id',
  'recipe',
  'createdAt',
  'updatedAt',
]) {}
