import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@ObjectType()
export class UserStats {
    @Field(() => Int)
    totalUsers: number;

    @Field(() => Int)
    activeUsers: number;

    @Field(() => Int)
    inactiveUsers: number;

    @Field(() => Int)
    adminUsers: number;

    @Field(() => Int)
    regularUsers: number;

    @Field(() => Int)
    coachUsers: number;
}

@ObjectType()
export class ClassStats {
    @Field(() => Int)
    totalClasses: number;

    @Field(() => Int)
    activeClasses: number;

    @Field(() => Int)
    beginnerClasses: number;

    @Field(() => Int)
    intermediateClasses: number;

    @Field(() => Int)
    advancedClasses: number;

    @Field(() => Int)
    classesWithoutCoach: number;
}

@ObjectType()
export class EquipmentStats {
    @Field(() => Int)
    totalEquipment: number;

    @Field(() => Int)
    availableEquipment: number;

    @Field(() => Int)
    inactiveEquipment: number;

    @Field(() => Int)
    maintenanceEquipment: number;
}

// Nuevas estadísticas para categorías
@ObjectType()
export class CategoryStats {
  @Field(() => Int)
  totalCategories: number;

  @Field(() => Int)
  categoriesWithDescription: number;

  @Field(() => Int)
  categoriesWithoutDescription: number;

  @Field()
  averageDescriptionLength: number;

  @Field(() => [CategoryByDateStats])
  categoriesByDate: CategoryByDateStats[];

  @Field(() => [MostUsedCategory])
  mostUsedCategories: MostUsedCategory[];
}

@ObjectType()
export class CategoryByDateStats {
  @Field()
  date: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class MostUsedCategory {
  @Field()
  categoryId: string;

  @Field()
  categoryName: string;

  @Field(() => Int)
  usageCount: number;
}

// Estadísticas para gym-class-category
@ObjectType()
export class GymClassCategoryStats {
  @Field(() => Int)
  totalAssociations: number;

  @Field(() => Int)
  uniqueClasses: number;

  @Field(() => Int)
  uniqueCategories: number;

  @Field()
  averageCategoriesPerClass: number;

  @Field()
  averageClassesPerCategory: number;

  @Field(() => [ClassCategoryDistribution])
  classCategoryDistribution: ClassCategoryDistribution[];

  @Field(() => [CategoryUsageStats])
  categoryUsageStats: CategoryUsageStats[];

  @Field(() => [ClassUsageStats])
  classUsageStats: ClassUsageStats[];
}

@ObjectType()
export class ClassCategoryDistribution {
  @Field()
  classId: string;

  @Field(() => Int)
  categoryCount: number;
}

@ObjectType()
export class CategoryUsageStats {
  @Field()
  categoryId: string;

  @Field(() => Int)
  classCount: number;

  @Field()
  usagePercentage: number;
}

@ObjectType()
export class ClassUsageStats {
  @Field()
  classId: string;

  @Field(() => Int)
  categoryCount: number;

  @Field()
  diversityIndex: number; // Índice de diversidad de categorías
}

// Input para configurar estadísticas
@InputType()
export class StatsFilterInput {
  @Field({ nullable: true })
  dateFrom?: string;

  @Field({ nullable: true })
  dateTo?: string;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number;

  @Field({ nullable: true, defaultValue: true })
  includeEmpty?: boolean;

  @Field({ nullable: true })
  groupByPeriod?: string; // 'day', 'week', 'month', 'year'
}