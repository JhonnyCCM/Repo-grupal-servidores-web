import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CategoryResolver } from './category.resolver';
import { CategoryHttpService } from './category-http.service';

@Module({
  imports: [HttpModule],
  providers: [CategoryResolver, CategoryHttpService],
  exports: [CategoryHttpService],
})
export class CategoryModule {}