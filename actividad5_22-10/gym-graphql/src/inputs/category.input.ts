import { InputType, Field, registerEnumType } from '@nestjs/graphql';

// Enums para filtros
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum CategorySortField {
  ID = 'id',
  NAME = 'name', 
  DESCRIPTION = 'description',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum StringFilterOperator {
  EQUALS = 'equals',
  CONTAINS = 'contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  NOT_EQUALS = 'not_equals',
  NOT_CONTAINS = 'not_contains',
}

export enum DateFilterOperator {
  EQUALS = 'equals',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL = 'gte', 
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL = 'lte',
  BETWEEN = 'between',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
  description: 'Orden de clasificación',
});

registerEnumType(CategorySortField, {
  name: 'CategorySortField',
  description: 'Campos disponibles para ordenar categorías',
});

registerEnumType(StringFilterOperator, {
  name: 'StringFilterOperator',
  description: 'Operadores para filtros de texto',
});

registerEnumType(DateFilterOperator, {
  name: 'DateFilterOperator',
  description: 'Operadores para filtros de fecha',
});

@InputType()
export class StringFilter {
  @Field(() => StringFilterOperator)
  operator: StringFilterOperator;

  @Field()
  value: string;

  @Field({ nullable: true })
  caseSensitive?: boolean;
}

@InputType()
export class DateFilter {
  @Field(() => DateFilterOperator)
  operator: DateFilterOperator;

  @Field()
  value: string;

  @Field({ nullable: true })
  endValue?: string; // Para el operador BETWEEN
}

@InputType()
export class CategorySort {
  @Field(() => CategorySortField)
  field: CategorySortField;

  @Field(() => SortOrder, { defaultValue: SortOrder.ASC })
  order: SortOrder;
}

@InputType()
export class PaginationInput {
  @Field({ nullable: true, defaultValue: 0 })
  skip?: number;

  @Field({ nullable: true, defaultValue: 10 })
  take?: number;
}

@InputType()
export class CreateCategoryInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;
}

@InputType()
export class UpdateCategoryInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;
}

@InputType()
export class FilterCategoryInput {
    // Filtros básicos
    @Field({ nullable: true })
    id?: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    description?: string;

    // Filtros avanzados de texto
    @Field(() => StringFilter, { nullable: true })
    nameFilter?: StringFilter;

    @Field(() => StringFilter, { nullable: true })
    descriptionFilter?: StringFilter;

    // Filtros de fecha
    @Field(() => DateFilter, { nullable: true })
    createdAtFilter?: DateFilter;

    @Field(() => DateFilter, { nullable: true })
    updatedAtFilter?: DateFilter;

    // Búsqueda de texto libre
    @Field({ nullable: true })
    searchText?: string;

    // Filtros de existencia
    @Field({ nullable: true })
    hasDescription?: boolean;

    // Lista de IDs para inclusión/exclusión
    @Field(() => [String], { nullable: true })
    includeIds?: string[];

    @Field(() => [String], { nullable: true })
    excludeIds?: string[];

    // Ordenamiento
    @Field(() => [CategorySort], { nullable: true })
    sort?: CategorySort[];

    // Paginación
    @Field(() => PaginationInput, { nullable: true })
    pagination?: PaginationInput;

    // Filtros lógicos
    @Field(() => [FilterCategoryInput], { nullable: true })
    AND?: FilterCategoryInput[];

    @Field(() => [FilterCategoryInput], { nullable: true })
    OR?: FilterCategoryInput[];

    @Field(() => FilterCategoryInput, { nullable: true })
    NOT?: FilterCategoryInput;
}