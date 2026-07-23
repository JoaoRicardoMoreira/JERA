import { ClassSerializerInterceptor, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SerializationInterceptor extends ClassSerializerInterceptor {
  constructor(reflector: Reflector) {
    super(reflector, {
      enableImplicitConversion: false,
    });
  }
}
