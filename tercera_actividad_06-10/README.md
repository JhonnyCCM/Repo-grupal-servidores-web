# Taller Práctico #3: Modelado de Dominio y Persistencia con TypeORM

## 📋 Información General

| Campo              | Detalle                                       |
| ------------------ | --------------------------------------------- |
| **Carrera**        | Software                                      |
| **Nivel**          | Quinto                                        |
| **Asignatura**     | Aplicación para el Servidor Web               |
| **Docente**        | John Cevallos                                 |
| **Período Lectivo**| 2025-2026(1)                                  |
| **Número de Taller**| 3                                             |
| **Paralelos**      | A y B                                         |
| **Fecha/Horas**    | Octubre 2025 (2 horas académicas)             |
| **Tecnología**     | Node.js con TypeScript (TypeORM Puro)         |

## 🎯 Objetivo del Taller

Modelar el dominio completo de tu proyecto autónomo definiendo entidades y relaciones robustas con TypeORM. Implementarás la conexión a la base de datos y la lógica CRUD (Crear, Leer, Actualizar, Eliminar) directamente a través del `DataSource` de TypeORM, sin usar frameworks como NestJS. El resultado se probará con un script de *seeding* y se visualizará en un Diagrama Entidad-Relación (DER).

## 👥 Trabajo en Equipo y Distribución de Tareas

El trabajo se realizará en **grupos de 3 personas**. Cada integrante será responsable de modelar e implementar la lógica de datos para un conjunto específico de entidades:

| Integrante   | Foco Principal                               | Entidades de Ejemplo                  |
|--------------|----------------------------------------------|---------------------------------------|
| **Integrante 1** | **Entidades Maestras** (Datos Estáticos)      | Catálogos, Configuraciones, Roles     |
| **Integrante 2** | **Entidades de Negocio** (Lógica Principal)  | Clientes, Productos, Usuarios         |
| **Integrante 3** | **Entidades Transaccionales** (Datos Dinámicos)| Ventas, Compras, Pedidos              |

---

## 🚀 Instrucciones Detalladas

Sigue estos pasos para completar el taller. La implementación se centrará en las capas de **Entidad** y **Servicio** (clases de TypeScript), interactuando directamente con el `DataSource` de TypeORM.

### Paso 1: Configuración del Proyecto y Conexión

1.  **Crear Proyecto:** Inicia un nuevo proyecto Node.js con TypeScript.
2.  **Inicializar Git:** Cada integrante debe trabajar en su propio repositorio Git individual.
3.  **Instalar Dependencias:** Instala TypeORM y el driver para tu base de datos.
    ```bash
    npm install typeorm reflect-metadata <driver-de-bd>
    ```
    > **Nota:** Reemplaza `<driver-de-bd>` con el paquete para tu base de datos (ej: `sqlite3`, `pg`, `mysql2`).
4.  **Configurar DataSource:** Crea un archivo `src/data-source.ts` para centralizar la configuración de la conexión a la base de datos, incluyendo el listado de todas tus entidades.

### Paso 2: Desarrollo del Modelo de Dominio (Entidades)

1.  **Crear Clases de Entidad:** Para cada recurso, crea una clase y decórala con `@Entity()`. Por ejemplo, para un catálogo de productos, crea `Producto.ts` con sus propiedades y relaciones.
2.  **Definir Propiedades:**
    *   Añade una clave primaria autoincremental con `@PrimaryGeneratedColumn()`.
    *   Define al menos 4 propiedades adicionales usando decoradores como `@Column()`. Asegúrate de incluir tipos de datos adecuados y restricciones como `nullable`, `unique`, etc.
3.  **Implementar Relaciones:** Usa los decoradores de TypeORM (`@OneToMany`, `@ManyToOne`, `@ManyToMany`) para establecer las relaciones entre tus entidades. Por ejemplo, un `Usuario` puede tener muchas `Ordenes`, pero una `Orden` pertenece a un solo `Usuario`.

### Paso 3: Implementación de la Lógica de Persistencia (Servicios)

1.  **Crear Clases de Servicio:** Por cada entidad, crea una clase de servicio (ej. `UsuarioService.ts`) que encapsule toda la lógica de acceso a datos.
2.  **Obtener Repositorio:** Dentro del servicio, accede al repositorio de la entidad usando el `DataSource` que configuraste en el paso 1. Por ejemplo:
    ```typescript
    import { AppDataSource } from "../data-source";
    import { Usuario } from "../entity/Usuario";
    
    export class UsuarioService {
        private usuarioRepository = AppDataSource.getRepository(Usuario);
    }
    ```
3.  **Implementar Métodos CRUD:** Cada clase de servicio debe tener los siguientes 5 métodos:
    *   `create(data)`: Guarda una nueva entidad en la base de datos.
    *   `findAll()`: Devuelve todos los registros.
    *   `findOne(id)`: Busca un registro por su ID.
    *   `update(id, data)`: Actualiza un registro existente.
    *   `remove(id)`: Elimina un registro por su ID.

### Paso 4: Prueba Funcional y Script de Seeding

1.  **Crear Script Principal:** Crea un archivo `src/main.ts` que servirá como punto de entrada para probar toda la lógica.
2.  **Inicializar Conexión:** En `main.ts`, lo primero que debes hacer es inicializar la conexión a la base de datos usando tu `DataSource`.
3.  **Implementar Seeding:** Dentro del script, instancia tus servicios e inserta datos de prueba. Asegúrate de crear registros que demuestren que las relaciones entre entidades funcionan correctamente. Por ejemplo, crea un `Usuario` y luego varias `Ordenes` que referencien a ese usuario.
4.  **Probar CRUD:** Después de insertar los datos, usa los otros métodos (`findAll`, `findOne`, `update`, `remove`) para demostrar que toda la funcionalidad CRUD opera como se espera. Imprime los resultados en la consola.

### Paso 5: Generación del Diagrama Entidad-Relación (DER)

*   Utiliza una herramienta o un plugin (como la CLI de TypeORM) para generar un diagrama visual del esquema de tu base de datos a partir de las entidades que has creado.

---

##  deliverables Entregables del Taller

1.  **Repositorio Git Individual:**
    *   Código fuente completo con todas las entidades y servicios implementados.
    *   Historial de `commits` que refleje tu trabajo.
2.  **Archivo `README.md` (Este archivo):**
    *   Documentación de tus entidades y sus relaciones.
    *   Instrucciones claras para instalar dependencias y ejecutar el script `main.ts`.
3.  **Diagrama Entidad-Relación (DER):**
    *   Una imagen (`.png`, `.jpg`, `.svg`) del esquema de la base de datos generado.
4.  **Demostración en Vivo:**
    *   Debes demostrar al docente la ejecución del script de seeding y las pruebas CRUD durante la revisión en clase. No se requieren capturas de pantalla de la consola en el repositorio.