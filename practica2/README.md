#  Instrucciones de la Práctica Complementaria

A continuación se detallan los pasos y requisitos para completar la práctica.

## 🎯 Objetivo

Implementar una arquitectura robusta y escalable para el dominio del emprendimiento, aplicando patrones de diseño, principios de código limpio y diferentes paradigmas de programación asíncrona en JavaScript/TypeScript para operaciones CRUD.

### Logros Esperados:
- **Diseñar e implementar** interfaces y clases que representen fielmente el dominio del emprendimiento.
- **Crear una arquitectura en capas** que separe responsabilidades y facilite el mantenimiento.
- **Aplicar diferentes patrones asíncronos**: Callbacks, Promises y Async/Await en operaciones CRUD.
- **Implementar repositorios de datos en memoria** con información de prueba optimizada.
- **Estructurar el proyecto** siguiendo principios de código limpio y arquitectura hexagonal.
- **Desarrollar un sistema de pruebas** funcional desde un archivo `main` centralizado.
- **Aplicar principios SOLID** y patrones de diseño en el desarrollo del backend.

---

## 🛠 Prerrequisitos (Materiales y Tecnologías)

### Software Requerido:
- **Node.js**: Versión 18 o superior.
- **TypeScript**: Para tipado estático.
- **Editor de Código**: Visual Studio Code (recomendado).
- **Git**: Para control de versiones.
- **Terminal/CLI**: Para ejecutar comandos.

---

## 📦 Stack Tecnológico

- **TypeScript**: Lenguaje principal.
- **UUID**: Para la generación de identificadores únicos.
- **ts-node**: Para ejecutar archivos TypeScript directamente.
- **Chalk** (opcional): Para mejorar la visualización en consola.

---

## 📖 Conceptos y Patrones a Aplicar

- **Arquitectura en Capas**: Domain, Infrastructure, Application, Presentation.
- **Patrón Repository**: Para abstraer el acceso a datos.
- **Principios SOLID**: Especialmente Responsabilidad Única e Inversión de Dependencias.
- **Inyección de Dependencias**: Para desacoplar componentes.
- **Domain-Driven Design (DDD)**: Enfocado en el dominio del negocio.

---

## ✅ Tareas a Realizar

Deberás implementar las operaciones CRUD utilizando diferentes enfoques de programación asíncrona.

### 1. Operación de Inserción (CREATE) con `CALLBACKS`
- Implementa una función de inserción que utilice un **callback** con el patrón `(error, resultado)`.
- El primer parámetro del callback debe ser para el manejo de errores.
- Simula una latencia de red (ej. con `setTimeout`).
- Añade validación de datos antes de realizar la inserción.

### 2. Operación de Modificación (UPDATE) con `PROMISES`
- Crea una función de modificación que retorne una **Promise**.
- Utiliza `.then()` para manejar el caso de éxito y `.catch()` para los errores.
- Valida que el registro a modificar exista antes de la operación.
- Permite la actualización parcial de los campos del registro.

### 3. Operación de Consulta (READ) con `ASYNC/AWAIT`
- Desarrolla funciones `async` que retornen una `Promise`.
- Usa `await` para gestionar las operaciones asíncronas de forma limpia.
- Implementa el manejo de errores con bloques `try/catch`.
- Crea funciones para consultar tanto registros individuales como listados completos.

### 4. Operación de Eliminación (DELETE) con `ASYNC/AWAIT`
- Valida la existencia del registro antes de proceder con la eliminación.
- La función debe retornar un `boolean` que indique si la operación fue exitosa.
- Decide si implementar una eliminación lógica (marcar como inactivo) o física.
- Asegura un manejo de errores elegante.
