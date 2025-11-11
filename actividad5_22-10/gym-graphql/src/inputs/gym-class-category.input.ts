import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { StringFilter, DateFilter, PaginationInput, SortOrder, StringFilterOperator, DateFilterOperator } from './category.input';

export enum GymClassCategorySortField {
  ID = 'id',
  CLASS_ID = 'classId',
  CATEGORY_ID = 'categoryId',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

registerEnumType(GymClassCategorySortField, {
  name: 'GymClassCategorySortField',
  description: 'Campos disponibles para ordenar gym-class-categories',
});

@InputType()
export class GymClassCategorySort {
  @Field(() => GymClassCategorySortField)
  field: GymClassCategorySortField;

  @Field(() => SortOrder, { defaultValue: SortOrder.ASC })
  order: SortOrder;
}

@InputType()
export class CreateGymClassCategoryInput {
    @Field()
    classId: string;

    @Field()
    categoryId: string;
}

@InputType()
export class UpdateGymClassCategoryInput {
    @Field({ nullable: true })
    classId?: string;

    @Field({ nullable: true })
    categoryId?: string;
}

@InputType()
export class FilterGymClassCategoryInput {
    // Filtros básicos
    @Field({ nullable: true })
    id?: string;

    @Field({ nullable: true })
    classId?: string;

    @Field({ nullable: true })
    categoryId?: string;

    // Filtros avanzados de texto para IDs
    @Field(() => StringFilter, { nullable: true })
    classIdFilter?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    categoryIdFilter?: StringFilter;

    // Filtros de fecha
    @Field(() => DateFilter, { nullable: true })
    createdAtFilter?: DateFilter;

    @Field(() => DateFilter, { nullable: true })
    updatedAtFilter?: DateFilter;

    // Filtros de relaciones - múltiples valores
    @Field(() => [String], { nullable: true })
    classIds?: string[];

    @Field(() => [String], { nullable: true })
    categoryIds?: string[];

    // Filtros de exclusión
    @Field(() => [String], { nullable: true })
    excludeClassIds?: string[];

    @Field(() => [String], { nullable: true })
    excludeCategoryIds?: string[];

    // Lista de IDs para inclusión/exclusión
    @Field(() => [String], { nullable: true })
    includeIds?: string[];

    @Field(() => [String], { nullable: true })
    excludeIds?: string[];

    // Filtros de existencia de relaciones
    @Field({ nullable: true })
    hasValidClass?: boolean;

    @Field({ nullable: true })
    hasValidCategory?: boolean;

    // Ordenamiento
    @Field(() => [GymClassCategorySort], { nullable: true })
    sort?: GymClassCategorySort[];

    // Paginación
    @Field(() => PaginationInput, { nullable: true })
    pagination?: PaginationInput;

    // Filtros lógicos
    @Field(() => [FilterGymClassCategoryInput], { nullable: true })
    AND?: FilterGymClassCategoryInput[];

    @Field(() => [FilterGymClassCategoryInput], { nullable: true })
    OR?: FilterGymClassCategoryInput[];

    @Field(() => FilterGymClassCategoryInput, { nullable: true })
    NOT?: FilterGymClassCategoryInput;

    // Filtros de fecha de rango específico
    @Field({ nullable: true })
    createdAfter?: string;

    @Field({ nullable: true })
    createdBefore?: string;

    @Field({ nullable: true })
    updatedAfter?: string;

    @Field({ nullable: true })
    updatedBefore?: string;

    // Filtro por patrones de relación
    @Field({ nullable: true })
    categoryPattern?: string; // Para buscar categorías por patrón

    @Field({ nullable: true })
    classPattern?: string; // Para buscar clases por patrón
}