import { ApiProperty } from '@nestjs/swagger';
import { Document } from '@tdqa/types';
import { ObjectId } from 'typeorm';

export class DocumentDto implements Document {
  @ApiProperty({ type: () => String, readOnly: true, format: 'uuid' })
  public readonly _id!: ObjectId;

  @ApiProperty({ readOnly: true, type: () => Date })
  public readonly created_at!: Date;

  @ApiProperty({ readOnly: true, type: () => Date })
  public readonly updated_at!: Date;
}
