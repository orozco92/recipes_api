import { PartialType } from '@nestjs/swagger';
import { Step } from '../../../core/entities';

export class UpdateStepDto extends PartialType(Step) {}
