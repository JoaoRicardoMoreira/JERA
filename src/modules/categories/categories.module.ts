import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma.module';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';
import { CATEGORIES_REPOSITORY } from './interfaces/category-repository.interface';
import { CATEGORIES_SERVICE } from './interfaces/category-service.interface';
import { CategoryValidator } from './validators/category.validator';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController],
  providers: [
    CategoryValidator,
    {
      provide: CATEGORIES_REPOSITORY,
      useClass: CategoriesRepository,
    },
    {
      provide: CATEGORIES_SERVICE,
      useClass: CategoriesService,
    },
    CategoriesService,
  ],
  exports: [CATEGORIES_SERVICE, CategoriesService],
})
export class CategoriesModule {}
