import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { typeormConnection } from './database.config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  public createTypeOrmOptions():
    | TypeOrmModuleOptions
    | Promise<TypeOrmModuleOptions> {
    return typeormConnection;
  }
}
