import { ObjectId, ObjectIdColumn } from 'typeorm';
import { Document } from '@tdqa/types';
import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class DocumentEntity extends BaseEntity implements Document {
  @ObjectIdColumn()
  public readonly _id!: ObjectId;

  @CreateDateColumn()
  public readonly created_at!: Date;

  @UpdateDateColumn()
  public readonly updated_at!: Date;
}
