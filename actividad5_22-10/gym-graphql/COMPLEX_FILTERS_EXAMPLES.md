# Filtros Complejos para GraphQL - Gimnasio

Este archivo contiene ejemplos de consultas GraphQL complejas para las entidades Category y GymClassCategory.

## 📋 Referencia Rápida de Enums

### **DateFilterOperator**
- `EQUALS` - Fecha exacta
- `GREATER_THAN` - Después de (>)
- `GREATER_THAN_OR_EQUAL` - Después o igual (>=)
- `LESS_THAN` - Antes de (<)
- `LESS_THAN_OR_EQUAL` - Antes o igual (<=)
- `BETWEEN` - Entre dos fechas

### **StringFilterOperator**
- `EQUALS` - Texto exacto
- `CONTAINS` - Contiene el texto
- `STARTS_WITH` - Empieza con
- `ENDS_WITH` - Termina con
- `NOT_EQUALS` - No es igual
- `NOT_CONTAINS` - No contiene

### **CategorySortField**
- `ID` - Ordenar por ID
- `NAME` - Ordenar por nombre
- `DESCRIPTION` - Ordenar por descripción
- `CREATED_AT` - Ordenar por fecha de creación
- `UPDATED_AT` - Ordenar por fecha de actualización

### **SortOrder**
- `ASC` - Ascendente (A-Z, 1-9, más antiguo primero)
- `DESC` - Descendente (Z-A, 9-1, más reciente primero)

## Filtros para Categorías (Category)

### 1. Búsqueda avanzada con filtros de texto
```graphql
query SearchCategoriesAdvanced {
  categories(filter: {
    nameFilter: {
      operator: CONTAINS
      value: "fitness"
      caseSensitive: false
    }
    hasDescription: true
    sort: [
      { field: NAME, order: ASC }
    ]
    pagination: {
      skip: 0
      take: 10
    }
  }) {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```

### 2. Filtros de fecha con operadores complejos
```graphql
query CategoriesByDateRange {
  categories(filter: {
    createdAtFilter: {
      operator: BETWEEN
      value: "2025-10-20T00:00:00.000Z"
      endValue: "2025-10-25T23:59:59.999Z"
    }
    sort: [
      { field: CREATED_AT, order: DESC }
    ]
  }) {
    id
    name
    description
    createdAt
  }
}
```

### 2b. Ejemplo alternativo con fecha más amplia
```graphql
query CategoriesThisYear {
  categories(filter: {
    createdAtFilter: {
      operator: GREATER_THAN_OR_EQUAL
      value: "2025-01-01T00:00:00.000Z"
    }
    sort: [
      { field: CREATED_AT, order: DESC }
    ]
  }) {
    id
    name
    description
    createdAt
  }
}
```

### 3. Filtros lógicos combinados (AND/OR)
```graphql
query CategoriesComplexLogic {
  categories(filter: {
    OR: [
      {
        nameFilter: {
          operator: STARTS_WITH
          value: "cardio"
        }
      }
      {
        nameFilter: {
          operator: CONTAINS
          value: "strength"
        }
      }
    ]
    AND: [
      {
        hasDescription: true
      }
      {
        NOT: {
          excludeIds: ["70ba1666-f0b1-4d7c-b639-148b5b1e1b80"]
        }
      }
    ]
  }) {
    id
    name
    description
  }
}
```

**📝 Nota:** El filtro `excludeIds` puede no estar completamente implementado en el backend. Los filtros OR, AND y hasDescription funcionan correctamente.

### 4. Búsqueda de texto libre
```graphql
query SearchCategoriesFreeText {
  searchCategories(searchText: "yoga pilates", limit: 20) {
    id
    name
    description
  }
}
```

### 5. Categorías por patrón de nombre
```graphql
query CategoriesByNamePattern {
  categoriesByNamePattern(pattern: "aer", caseSensitive: false) {
    id
    name
    description
  }
}
```

### 6. Estadísticas de categorías (✅ Corregido)
```graphql
query CategoryStatistics {
  categoryStatistics {
    totalCategories
    categoriesWithDescription
    categoriesWithoutDescription
    averageDescriptionLength
  }
}
```

### 6b. Estadísticas con filtros de fecha (✅ Funciona)
```graphql
query CategoryStatisticsWithFilters {
  categoryStatistics(filter: {
    dateFrom: "2024-01-01"
    dateTo: "2024-12-31"
    limit: 5
    includeEmpty: true
  }) {
    totalCategories
    categoriesWithDescription
    categoriesWithoutDescription
    averageDescriptionLength
  }
}
```

**✅ Estado:** Estas consultas ahora funcionan correctamente. Se implementó el cálculo de estadísticas en memoria.

### 6c. Conteo simple de categorías (✅ Corregido)
```graphql
query CountCategories {
  categoriesCount
}
```

### 6c2. Conteo con filtros específicos (✅ Funciona)
```graphql
query CountCategoriesWithFilters {
  categoriesCount(filter: { 
    hasDescription: true 
  })
}
```

### 6d. Alternativa: Obtener todas las categorías para análisis manual
```graphql
query AllCategoriesForStats {
  categories {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```
```

### 7. Categorías populares
```graphql
query PopularCategories {
  popularCategories(limit: 10) {
    id
    name
    description
    createdAt
  }
}
```

## Filtros para Gym Class Category

### 1. Asociaciones por múltiples clases
```graphql
query GymClassCategoriesByMultipleClasses {
  gymClassCategoriesByMultipleClasses(classIds: ["class-001", "class-002", "class-003"]) {
    id
    classId
    categoryId
    createdAt
  }
}
```

### 2. Filtros complejos con exclusiones
```graphql
query GymClassCategoriesComplex {
  gymClassCategories(filter: {
    classIds: ["class-001", "class-002"]
    excludeCategoryIds: ["cat-999"]
    createdAfter: "2024-01-01T00:00:00.000Z"
    hasValidClass: true
    hasValidCategory: true
    sort: [
      { field: CREATED_AT, order: DESC }
    ]
    pagination: {
      skip: 0
      take: 50
    }
  }) {
    id
    classId
    categoryId
    createdAt
    updatedAt
  }
}
```

### 3. Asociaciones por rango de fechas
```graphql
query GymClassCategoriesByDateRange {
  gymClassCategoriesByDateRange(
    startDate: "2024-01-01T00:00:00.000Z"
    endDate: "2024-12-31T23:59:59.999Z"
  ) {
    id
    classId
    categoryId
    createdAt
  }
}
```

### 4. Filtros con patrones de texto
```graphql
query GymClassCategoriesWithPatterns {
  gymClassCategories(filter: {
    classIdFilter: {
      operator: STARTS_WITH
      value: "yoga"
    }
    categoryPattern: "fitness"
    pagination: {
      take: 25
    }
  }) {
    id
    classId
    categoryId
  }
}
```

### 5. IDs únicos de clases y categorías
```graphql
query UniqueClassAndCategoryIds {
  uniqueClassIds(filter: {
    createdAfter: "2024-01-01"
  })
  
  uniqueCategoryIds(filter: {
    hasValidCategory: true
  })
}
```

### 6. Estadísticas de asociaciones
```graphql
query GymClassCategoryStatistics {
  gymClassCategoryStatistics(filter: {
    dateFrom: "2024-01-01"
    dateTo: "2024-12-31"
    groupByPeriod: "week"
  }) {
    totalAssociations
    uniqueClasses
    uniqueCategories
    averageCategoriesPerClass
    averageClassesPerCategory
    classCategoryDistribution {
      classId
      categoryCount
    }
    categoryUsageStats {
      categoryId
      classCount
      usagePercentage
    }
    classUsageStats {
      classId
      categoryCount
      diversityIndex
    }
  }
}
```

### 7. Asociaciones más activas
```graphql
query MostActiveClassCategories {
  mostActiveClassCategories(limit: 15) {
    id
    classId
    categoryId
    createdAt
  }
}
```

### 8. Asociaciones recientes
```graphql
query RecentAssociations {
  recentAssociations(limit: 10, hours: 48) {
    id
    classId
    categoryId
    createdAt
  }
}
```

### 9. Asociaciones huérfanas (sin relaciones válidas)
```graphql
query OrphanedAssociations {
  orphanedAssociations {
    id
    classId
    categoryId
    createdAt
  }
}
```

### 10. Conteo de asociaciones con filtros
```graphql
query CountGymClassCategories {
  gymClassCategoriesCount(filter: {
    createdAfter: "2024-01-01"
    hasValidClass: true
    hasValidCategory: true
  })
}
```

## Mutaciones con validaciones

### 1. Crear categoría con validación
```graphql
mutation CreateCategory {
  createCategory(createCategoryInput: {
    name: "High Intensity Training"
    description: "Entrenamientos de alta intensidad para quemar grasa y mejorar resistencia"
  }) {
    id
    name
    description
    createdAt
  }
}
```

### 2. Actualizar categoría
```graphql
mutation UpdateCategory {
  updateCategory(
    id: "cat-001"
    updateCategoryInput: {
      description: "Descripción actualizada para la categoría"
    }
  ) {
    id
    name
    description
    updatedAt
  }
}
```

### 3. Crear asociación clase-categoría
```graphql
mutation CreateGymClassCategory {
  createGymClassCategory(createGymClassCategoryInput: {
    classId: "class-yoga-001"
    categoryId: "cat-wellness-001"
  }) {
    id
    classId
    categoryId
    createdAt
  }
}
```

## Consultas combinadas (usando fragmentos)

```graphql
fragment CategoryInfo on Category {
  id
  name
  description
  createdAt
  updatedAt
}

fragment AssociationInfo on GymClassCategory {
  id
  classId
  categoryId
  createdAt
  updatedAt
}

query CombinedQuery {
  # Obtener categorías populares
  popularCategories: popularCategories(limit: 5) {
    ...CategoryInfo
  }
  
  # Obtener asociaciones recientes
  recentAssociations: recentAssociations(limit: 10, hours: 24) {
    ...AssociationInfo
  }
  
  # Estadísticas generales
  categoryStats: categoryStatistics {
    totalCategories
    categoriesWithDescription
  }
  
  gymClassCategoryStats: gymClassCategoryStatistics {
    totalAssociations
    uniqueClasses
    uniqueCategories
  }
}
```

## Variables en consultas

```graphql
query CategoriesWithVariables($filter: FilterCategoryInput, $limit: Int = 10) {
  categories(filter: $filter) {
    id
    name
    description
  }
  
  recentCategories(limit: $limit) {
    id
    name
    createdAt
  }
}
```

Variables para la consulta anterior:
```json
{
  "filter": {
    "nameFilter": {
      "operator": "CONTAINS",
      "value": "fitness",
      "caseSensitive": false
    },
    "hasDescription": true,
    "sort": [
      {
        "field": "NAME",
        "order": "ASC"
      }
    ],
    "pagination": {
      "skip": 0,
      "take": 20
    }
  },
  "limit": 15
}
```