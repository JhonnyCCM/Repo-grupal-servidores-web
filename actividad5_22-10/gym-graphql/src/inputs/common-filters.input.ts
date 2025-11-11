import { InputType, Field, registerEnumType, Int } from '@nestjs/graphql';

// Operadores para filtros numéricos
export enum NumericFilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL = 'lte',
  BETWEEN = 'between',
  IN = 'in',
  NOT_IN = 'not_in',
}

// Operadores para filtros booleanos
export enum BooleanFilterOperator {
  IS = 'is',
  IS_NOT = 'is_not',
}

registerEnumType(NumericFilterOperator, {
  name: 'NumericFilterOperator',
  description: 'Operadores para filtros numéricos',
});

registerEnumType(BooleanFilterOperator, {
  name: 'BooleanFilterOperator',
  description: 'Operadores para filtros booleanos',
});

@InputType()
export class NumericFilter {
  @Field(() => NumericFilterOperator)
  operator: NumericFilterOperator;

  @Field(() => Int)
  value: number;

  @Field(() => Int, { nullable: true })
  endValue?: number; // Para el operador BETWEEN

  @Field(() => [Int], { nullable: true })
  values?: number[]; // Para los operadores IN y NOT_IN
}

@InputType()
export class BooleanFilter {
  @Field(() => BooleanFilterOperator)
  operator: BooleanFilterOperator;

  @Field()
  value: boolean;
}

@InputType()
export class IdFilter {
  @Field(() => [String], { nullable: true })
  in?: string[];

  @Field(() => [String], { nullable: true })
  notIn?: string[];

  @Field({ nullable: true })
  equals?: string;

  @Field({ nullable: true })
  notEquals?: string;

  @Field({ nullable: true })
  contains?: string;

  @Field({ nullable: true })
  startsWith?: string;

  @Field({ nullable: true })
  endsWith?: string;
}

// Filtro de agregación para estadísticas
@InputType()
export class AggregationFilter {
  @Field({ nullable: true })
  groupBy?: string;

  @Field(() => [String], { nullable: true })
  having?: string[];

  @Field({ nullable: true })
  minCount?: number;

  @Field({ nullable: true })
  maxCount?: number;
}

// Filtro geográfico (por si necesitan ubicaciones en el futuro)
@InputType()
export class GeoFilter {
  @Field({ nullable: true })
  latitude?: number;

  @Field({ nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  radius?: number; // en kilómetros

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  country?: string;
}