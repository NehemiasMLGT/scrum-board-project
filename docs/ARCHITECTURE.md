# Documento de Arquitectura de Software: Scrum Meeting Board

**Versión:** 2.0.0  
**Fecha:** Noviembre 2026  
**Rol:** Arquitecto de Software Senior  
**Estado:** Aprobado para Construcción  
**Objetivo de Plataforma:** Vista única de escritorio (Desktop Web App para Google Chrome y Apple Safari en macOS y Windows. Sin diseño móvil).

---

## 1. Visión General del Sistema

**Scrum Meeting Board** es una aplicación web de escritorio especializada en la gestión y facilitación de reuniones de Scrum (Daily Standups, Refinamiento y Sprint Planning) para equipos ágiles. La experiencia de usuario está optimizada para pantallas grandes, salas de conferencia y sesiones de pantalla compartida.

### 1.1 Objetivos Clave
- **Control Estricto de Tiempos por Turno:** Cronómetro por integrante con semáforo cromático dinámico y persistencia por equipo.
- **Flujo de Turnos Automatizado y Flexible:** Gestión de turnos con estados visuales (Reloj/Pendiente, Check verde/Completado, X roja/Omitido) y ordenamiento configurable (Alfabético o Aleatorio).
- **Tablero Scrum Nativo Exclusivo e Interactivo:** Tablero Drag & Drop fluido con 4 columnas canónicas, tarjetas con story points y gestión ágil de tareas sin dependencias externas.
- **Internacionalización Multilingüe (i18n):** Soporte de múltiples idiomas (Inglés por defecto, Español, Alemán) con arquitectura modular y escalable para futuras incorporaciones.
- **Guía Asistida de Scrum Stand-up:** Modal interactivo de ayuda con las reglas esenciales de stand-up y las 3 preguntas clave en el idioma seleccionado.
- **Persistencia Relacional Transaccional:** Almacenamiento en MySQL 8.0 vía Connection Pool (`mysql2/promise`).
- **Testabilidad E2E Robusta con Playwright + Java:** Convención exhaustiva y obligatoria de selectores `data-testid` que garantizan automatización sin fragilidad visual ni dependencias de clases CSS.

---

## 2. Diagrama de Arquitectura del Sistema

```text
+--------------------------------------------------------------------------------------------------------+
|                                    NAVEGADOR DE ESCRITORIO (Mac / Windows)                             |
|                                       Google Chrome 120+ / Safari 17+                                  |
|                                                                                                        |
|  +--------------------------------------------------------------------------------------------------+  |
|  |                                  SINGLE VIEW LAYOUT (React + Vite)                               |  |
|  |                                                                                                  |  |
|  |  +--------------------------------------------------------------------------------------------+  |  |
|  |  |                                   HEADER (20% Alto)                                        |  |  |
|  |  |   [Mitad Izq: Nombre Team (Right-click: Edit)]     [Mitad Der: Cronómetro editable (Color)]    |  |  |
|  |  |   [Botón: Agregar Team]                            [Botones: Play/Pausa | Skip]               |  |  |
|  |  |                                                    [Select Idioma (EN/ES/DE) | Botón Help (?)] |  |  |
|  |  +--------------------------------------------------------------------------------------------+  |  |
|  |  |                               PANEL INFERIOR (80% Alto)                                    |  |  |
|  |  |  +---------------------------------------+-----------------------------------------------+  |  |
|  |  |  |    PANEL IZQUIERDO (20% Ancho)        |          PANEL CENTRAL (80% Ancho)           |  |  |
|  |  |  |  - Selectores: Modo / Team            |  - Botón: "+ New Task"                        |  |  |
|  |  |  |  - Lista Miembros (Icono + Turno)    |  - Tablero Scrum Nativo Drag & Drop           |  |  |
|  |  |  |    (Right-click: Restablecer/Edit/Del)|    (To Do | In Progress | Code Review | Done) |  |  |
|  |  |  |  - Opciones: +Miembro, Reset, Random  |    (Fichas arrastrables con Story Points)     |  |  |
|  |  |  +---------------------------------------+-----------------------------------------------+  |  |
|  +--------------------------------------------------------------------------------------------------+  |
+---------------------------------------------------+----------------------------------------------------+
                                                    |
                                                    | HTTP REST / JSON (CORS)
                                                    v
+--------------------------------------------------------------------------------------------------------+
|                                  BACKEND API (Node.js + Express)                                       |
|                                                                                                        |
|  - Middleware: CORS, Morgan, express.json(), Centralized Error Handler                                 |
|  - Routers:                                                                                            |
|      /api/teams          -> CRUD Teams, auto-creación de columnas por defecto, configuración           |
|      /api/members        -> Gestión de miembros, estados ('pending','completed','skipped'), shuffle  |
|      /api/columns        -> Gestión de columnas por equipo                                             |
|      /api/tasks          -> CRUD tareas y reordenamiento atómico Drag & Drop (transacciones)           |
|  - Driver: mysql2/promise (Connection Pool)                                                           |
+---------------------------------------------------+----------------------------------------------------+
                                                    |
                                                    | TCP / Port 3306 (Connection Pool)
                                                    v
+--------------------------------------------------------------------------------------------------------+
|                                    BASE DE DATOS (Docker Container)                                    |
|                                                                                                        |
|  - Motor: MySQL 8.0 Community Server (Docker Compose)                                                  |
|  - Esquema: teams, team_members, board_columns, tasks                                                  |
|  - Charset: utf8mb4_unicode_ci                                                                         |
|  - Persistencia: Volumen nombrado mysql_data                                                           |
+--------------------------------------------------------------------------------------------------------+
```

---

## 3. Modelo Entidad-Relación (DER) y Diccionario de Datos

### 3.1 Diagrama Entidad-Relación (Mermaid)

```mermaid
erDiagram
    TEAMS ||--o{ TEAM_MEMBERS : "pertenecen a"
    TEAMS ||--o{ BOARD_COLUMNS : "posee"
    BOARD_COLUMNS ||--o{ TASKS : "contiene"
    TEAM_MEMBERS ||--o{ TASKS : "asignado a (nullable)"

    TEAMS {
        int id PK
        varchar(100) name
        int default_timer_seconds "DEFAULT 120"
        enum presentation_mode "'alphabetical', 'random'"
        boolean use_external_board "DEFAULT FALSE"
        varchar(500) external_board_url "NULLABLE"
        datetime created_at
        datetime updated_at
    }

    TEAM_MEMBERS {
        int id PK
        int team_id FK
        varchar(100) name
        enum status "'pending', 'completed', 'skipped'"
        int sort_order
        datetime created_at
        datetime updated_at
    }

    BOARD_COLUMNS {
        int id PK
        int team_id FK
        varchar(50) name
        int position
        datetime created_at
    }

    TASKS {
        int id PK
        int column_id FK
        varchar(200) title
        text description
        int assigned_member_id FK "NULLABLE"
        int story_points "DEFAULT 0"
        int position
        datetime created_at
        datetime updated_at
    }
```

### 3.2 Especificación de Tablas

#### Tabla: `teams`
| Campo | Tipo | Nulo | Por Defecto | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | NO | PK | Identificador único del equipo |
| `name` | VARCHAR(100) | NO | - | Nombre del equipo |
| `default_timer_seconds` | INT | NO | 120 | Duración del cronómetro por turno en segundos |
| `presentation_mode` | ENUM('alphabetical','random') | NO | 'alphabetical' | Modo de ordenamiento de los miembros |
| `use_external_board` | BOOLEAN | NO | FALSE | Bandera para usar URL externa en lugar del Scrum Board nativo |
| `external_board_url` | VARCHAR(500) | SÍ | NULL | Enlace al tablero externo (Jira, Miro, etc.) |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | Última modificación |

#### Tabla: `team_members`
| Campo | Tipo | Nulo | Por Defecto | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | NO | PK | Identificador único del miembro |
| `team_id` | INT | NO | FK | Referencia a `teams(id)` ON DELETE CASCADE |
| `name` | VARCHAR(100) | NO | - | Nombre del integrante |
| `status` | ENUM('pending','completed','skipped') | NO | 'pending' | Estado del turno en la reunión |
| `sort_order` | INT | NO | 0 | Orden secuencial en la lista de turnos |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | Última modificación |

#### Tabla: `board_columns`
| Campo | Tipo | Nulo | Por Defecto | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | NO | PK | Identificador de columna |
| `team_id` | INT | NO | FK | Referencia a `teams(id)` ON DELETE CASCADE |
| `name` | VARCHAR(50) | NO | - | Nombre visible (ej. To Do, In Progress, Code Review, Done) |
| `position` | INT | NO | 1 | Posición de visualización de izquierda a derecha |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | Fecha de creación |

#### Tabla: `tasks`
| Campo | Tipo | Nulo | Por Defecto | Descripción |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | NO | PK | Identificador de la tarea |
| `column_id` | INT | NO | FK | Referencia a `board_columns(id)` ON DELETE CASCADE |
| `title` | VARCHAR(200) | NO | - | Título de la tarea |
| `description` | TEXT | SÍ | NULL | Descripción detallada |
| `assigned_member_id` | INT | SÍ | FK | Referencia a `team_members(id)` ON DELETE SET NULL |
| `story_points` | INT | NO | 0 | Puntuación de esfuerzo |
| `position` | INT | NO | 0 | Posición relativa de orden dentro de la columna |
| `created_at` | DATETIME | NO | CURRENT_TIMESTAMP | Fecha de creación |
| `updated_at` | DATETIME | NO | CURRENT_TIMESTAMP ON UPDATE | Última modificación |

---

## 4. Reglas de Negocio y Lógica de Interacción

### 4.1 Header (20% del alto total)
- **Mitad Izquierda:**
  - Muestra el nombre del Team activo.
  - Al hacer **clic derecho sobre el nombre del Team**, se despliega la opción "Editar Nombre", que abre un modal de confirmación Sí/No antes de persistir los cambios.
  - Debajo del nombre se sitúa el botón **"Agregar Team"**, que abre un modal para ingresar el nuevo nombre.
  - *Regla de creación:* Al crear un Team, el backend automáticamente genera sus 4 columnas canónicas (`To Do`, `In Progress`, `Code Review`, `Done`).
- **Mitad Derecha:**
  - **Cronómetro:** Formato `MM:SS`. Al hacer clic o clic derecho, se abre un modal de edición con confirmación Sí/No para fijar nuevos segundos por defecto (persistidos en `teams.default_timer_seconds`).
  - **Semáforo Cromático del Cronómetro:**
    - Del 100% al 31% del tiempo: **Negro** (`text-slate-900` o `#000000`).
    - Del 30% al 11% del tiempo: **Amarillo** (`text-amber-500` o `#EAB308`).
    - Del 10% al 0% del tiempo: **Rojo** (`text-rose-600` o `#DC2626`).
  - **Controles de Reproducción:**
    - Botón **Play / Pausa**: Inicia o detiene la cuenta regresiva.
    - Debajo, botón **Skip**: Salta el turno del miembro actual.

### 4.2 Flujo del Turno y Transición de Estados
- **Al llegar el cronómetro a 00:00:**
  1. El miembro en turno activo pasa de **Reloj** (`status: 'pending'`) a **Check verde** (`status: 'completed'`).
  2. El cronómetro se detiene automáticamente.
  3. El foco del turno se transfiere al siguiente miembro con estado `pending`.
  4. El cronómetro se reinicia al tiempo base (`default_timer_seconds`) y queda pausado en espera de que el facilitador presione **Play**.
- **Al presionar el botón Skip:**
  1. El miembro en turno activo pasa inmediatamente a **X roja** (`status: 'skipped'`).
  2. El turno avanza al siguiente miembro con estado `pending`.
  3. Si existen miembros pendientes: el cronómetro se reinicia al tiempo base esperando **Play**.
  4. Si era el **último miembro pendiente**: el cronómetro NO se reinicia, se detiene en su estado actual y se notifica que la ronda ha finalizado.

### 4.3 Panel Izquierdo (20% del ancho)
- **Selectores de Configuración (Orden de visualización):**
  1. **Selector de Modo de Presentación:** `Alfabético` / `Random` (sincronizado con `teams.presentation_mode`).
  2. **Selector de Team:** Conmuta el equipo activo.
- **Lista de Miembros:**
  - Cada ítem muestra el estado actual mediante icono:
    - `Reloj` (Pendiente)
    - `Check verde` (Completado)
    - `X roja` (Omitido)
  - El miembro con el turno activo cuenta con un **destacado visual de alto contraste** (borde y fondo diferencial).
  - **Regla de cambio de orden a media reunión:** Si se cambia el Modo de Presentación a Alfabético o Aleatorio a media reunión, **únicamente se reordenan los miembros que estén pendientes de presentar (estado Reloj / `pending`)**. Los miembros que ya hayan sido Completados (`completed`) u Omitidos (`skipped`) conservan su posición previa inalterada.
  - **Asignación del Turno Activo:** 
    - Si aún restan miembros pendientes: el primer miembro pendiente del nuevo orden toma el turno activo con su destacado visual de alto contraste y el cronómetro se reinicia esperando Play.
    - Si **todos los miembros ya están en estado Completado u Omitido**: se ejecuta el reordenamiento pero **ya no se muestra la marca de "Turno"** en ningún integrante, dado que no hay nadie pendiente de presentar.
  - Al hacer **clic derecho** sobre cualquier miembro se abre un menú contextual con:
    1. **Restablecer a Reloj:** Cambia el estado a `pending`. Requiere modal de confirmación Sí/No.
    2. **Editar:** Modifica el nombre del miembro. Requiere modal de confirmación Sí/No.
    3. **Eliminar:** Elimina al miembro. Requiere modal de confirmación Sí/No.
- **Acciones Rápidas (al final del listado en este orden exacto):**
  1. **"Agregar nuevo miembro"**: Abre modal para registrar nombre y agregarlo con estado `pending`.
  2. **"Reiniciar reunión"**: Restablece a todos los miembros del equipo a Reloj (`pending`) para iniciar una nueva ronda completa (modal Sí/No).
  3. **"Reordenar aleatoriamente"**: Baraja los integrantes pendientes y actualiza el modo a `random`. El turno activo pasa automáticamente al primer pendiente (o se oculta si ya no quedan pendientes).

### 4.4 Panel Central (80% del ancho) — Scrum Board Nativo Exclusivo
- **Enfoque 100% Nativo:** El panel central está dedicado de forma exclusiva e ininterrumpida al **Scrum Board interactivo** propio de la aplicación, optimizado para monitores de escritorio y salas de reunión.
- **Estructura del Tablero:**
  - Barra superior con botón de acción directa **"+ New Task / + Nueva Tarea"** (`btn-create-task`).
  - 4 Columnas fijas de izquierda a derecha: `To Do`, `In Progress`, `Code Review`, `Done`.
  - Fichas de tareas arrastrables que muestran: Título, Miembro asignado del Team, Descripción, Story Points (Fibonacci) y botones de acción (Editar y Eliminar).
  - **Drag & Drop fluido:** Soporte completo de arrastre y soltado entre columnas y reordenamiento vertical con actualización optimista inmediata (cero lag visual durante la reunión) y sincronización transaccional al backend (`PATCH /api/tasks/:id/move`).

### 4.5 Sistema de Internacionalización (i18n) Escalable
- **Idioma por defecto:** Inglés (`en`).
- **Idiomas disponibles:** Inglés (`en`), Español (`es`), Alemán (`de`).
- **Arquitectura de Traducción:**
  - Módulos de localización desacoplados en `frontend/src/i18n/locales/{code}.js`.
  - Contexto de React (`I18nContext.jsx`) con hook `useI18n()` que provee la función reactiva `t(key, params)`, `language` y `setLanguage`.
  - Soporte de claves anidadas e interpolación de variables dinámicas (ej. `{name}`, `{seconds}`).
  - Persistencia de la preferencia del usuario en `localStorage` con fallback automático al inglés en caso de claves faltantes.
  - **Extensibilidad:** Para añadir un nuevo idioma en el futuro, únicamente se requiere crear el archivo `frontend/src/i18n/locales/{nuevo_idioma}.js` y registrarlo en `AVAILABLE_LANGUAGES`.
- **Selector de Idioma:** Ubicado de manera accesible en el Header (`language-select-dropdown`).

### 4.6 Modal de Ayuda para Reuniones Scrum (Stand-up Guide)
- **Acceso:** Botón de ayuda situado en el Header junto al selector de idioma (`btn-help-modal`).
- **Contenido Educativo en el Idioma Activo:**
  - **Concepto Stand-up:** Explica que la reunión debe ser breve (máximo 15 minutos), ágil y tradicionalmente de pie para mantener la energía y el foco.
  - **Las 3 Preguntas Clave:**
    1. *¿En qué trabajé ayer?* (Avances que apoyan el Objetivo del Sprint).
    2. *¿Qué haré hoy?* (Compromisos concretos del día).
    3. *¿Qué bloqueos o impedimentos tengo?* (Trabas técnicas o dependencias para que el equipo o Scrum Master puedan ayudar).
  - **Reglas de Oro:** Respeto estricto del cronómetro individual (1 a 2 minutos por persona), evitar debates técnicos extensos durante la reunión y mantener la atención del equipo.

---

## 5. Convención Estricta de Atributos `data-testid` (Playwright + Java)

Para asegurar la máxima compatibilidad, estabilidad y facilidad de automatización en suites de prueba con **Playwright en Java**, se adopta un estándar riguroso de atributos `data-testid`. **Ningún selector de prueba debe depender de clases CSS o jerarquías DOM frágiles.**

### 5.1 Header, Cronómetro e Internacionalización
| Elemento UI | Atributo `data-testid` | Notas / Formato |
|---|---|---|
| Contenedor Header | `header-container` | Contenedor 20% alto |
| Nombre del Team en Header | `header-team-name` | Permite click derecho |
| Botón Agregar Team | `header-btn-add-team` | Abre modal creación |
| Display del Cronómetro | `timer-display` | Texto `MM:SS` (refleja clase de color) |
| Botón Play / Pausa | `timer-btn-toggle` | Cambia entre Play y Pause |
| Botón Skip | `timer-btn-skip` | Salta al siguiente miembro |
| Selector de Idioma | `language-select-dropdown` | `<select>` con opciones: English (en), Español (es), Deutsch (de) |
| Botón de Ayuda (Stand-up Guide) | `btn-help-modal` | Abre modal con reglas de la reunión Scrum |

### 5.2 Panel Izquierdo (Miembros y Controles de Turno)
| Elemento UI | Atributo `data-testid` | Notas / Formato |
|---|---|---|
| Contenedor Panel Izquierdo | `left-panel-container` | Contenedor 20% ancho |
| Selector de Modo (Alfabético/Random) | `presentation-mode-select` | Primer selector arriba |
| Selector de Team | `team-select-dropdown` | Segundo selector arriba |
| Contenedor Lista de Miembros | `member-list-container` | `<div>` con scroll vertical |
| Fila de Miembro | `member-item-<id>` | Ejemplo: `member-item-3` |
| Nombre de Miembro | `member-name-<id>` | Texto con el nombre |
| Indicador de Turno Activo | `member-active-indicator-<id>` | Presente solo en el miembro en turno |
| Icono de Estado Reloj | `member-status-clock-<id>` | Estado `pending` |
| Icono de Estado Check Verde | `member-status-check-<id>` | Estado `completed` |
| Icono de Estado X Roja | `member-status-skip-<id>` | Estado `skipped` |
| Menú Contextual de Miembro | `member-context-menu` | Desplegado al click derecho |
| Opción Menú: Restablecer a Reloj | `context-menu-opt-reset` | Opción del menú |
| Opción Menú: Editar | `context-menu-opt-edit` | Opción del menú |
| Opción Menú: Eliminar | `context-menu-opt-delete` | Opción del menú |
| Botón Acción 1: Agregar nuevo miembro | `btn-add-member` | Opción fija 1 al pie |
| Botón Acción 2: Reiniciar reunión | `btn-reset-all-members` | Opción fija 2 al pie |
| Botón Acción 3: Reordenar aleatoriamente | `btn-randomize-members` | Opción fija 3 al pie |

### 5.3 Panel Central (Scrum Board Nativo Exclusivo)
| Elemento UI | Atributo `data-testid` | Notas / Formato |
|---|---|---|
| Contenedor Panel Central | `center-panel-container` | Contenedor 80% ancho |
| Botón Crear Nueva Tarea | `btn-create-task` | Abre modal creación de tarea |
| Contenedor Scrum Board | `scrum-board-container` | Rejilla de 4 columnas |
| Columna del Tablero | `board-column-<id>` | Identificador de columna |
| Título de Columna | `column-title-<id>` | Texto del título |
| Contador de Tareas de Columna | `column-task-count-<id>` | Número de tareas |
| Zona Drop de Columna | `column-drop-zone-<id>` | Área de drop para DnD |
| Tarjeta de Tarea | `task-card-<id>` | Ficha arrastrable |
| Título de Tarea | `task-title-<id>` | Texto del título |
| Asignado de Tarea | `task-assignee-<id>` | Nombre del miembro asignado |
| Story Points de Tarea | `task-points-<id>` | Puntuación numérica |
| Descripción de Tarea | `task-description-<id>` | Texto de la descripción |
| Botón Editar Tarea | `btn-edit-task-<id>` | Abre modal de edición |
| Botón Eliminar Tarea | `btn-delete-task-<id>` | Elimina la tarea |

### 5.4 Modales de Confirmación, Formularios y Ayuda
| Elemento UI | Atributo `data-testid` | Notas / Formato |
|---|---|---|
| Contenedor de Modal Genérico | `modal-dialog-container` | Backdrop / modal activo |
| Título del Modal | `modal-dialog-title` | Encabezado descriptivo |
| Mensaje del Modal | `modal-dialog-message` | Texto explicativo de la acción |
| Botón Confirmar (Sí) | `modal-btn-confirm` | Acción afirmativa / Guardar |
| Botón Cancelar (No) | `modal-btn-cancel` | Descartar o cancelar |
| Input de Formulario en Modal | `modal-form-input` | Campo de texto principal |
| Input de Segundos de Timer | `modal-timer-seconds-input` | Para edición de cronómetro |
| Modal de Ayuda Standup | `help-modal-dialog` | Modal con las 3 preguntas Scrum y reglas |
| Botón Cerrar Modal de Ayuda | `help-modal-close-btn` | Cierra el modal de ayuda |

---

## 6. Endpoints de la API REST

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/teams` | Lista todos los equipos |
| `GET` | `/api/teams/:id` | Obtiene equipo completo con miembros, columnas y tareas |
| `POST` | `/api/teams` | Crea un equipo y genera sus 4 columnas por defecto |
| `PUT` | `/api/teams/:id` | Actualiza propiedades del equipo (nombre, timer, modo, board externo) |
| `DELETE` | `/api/teams/:id` | Elimina equipo y cascadas |
| `POST` | `/api/teams/:teamId/members` | Agrega un nuevo integrante al equipo |
| `PUT` | `/api/members/:id` | Edita nombre del integrante |
| `DELETE` | `/api/members/:id` | Elimina integrante |
| `PATCH` | `/api/members/:id/status` | Actualiza estado individual (`pending`, `completed`, `skipped`) |
| `POST` | `/api/teams/:teamId/members/reset-status` | Reinicia todos los miembros del equipo a `pending` |
| `POST` | `/api/teams/:teamId/members/reorder` | Reordena miembros (`alphabetical` o `random`) y actualiza `sort_order` |
| `GET` | `/api/teams/:teamId/columns` | Lista columnas de un equipo con sus tareas ordenadas |
| `POST` | `/api/teams/:teamId/columns` | Crea una nueva columna |
| `PUT` | `/api/columns/:id` | Actualiza nombre o posición de columna |
| `DELETE` | `/api/columns/:id` | Elimina una columna |
| `POST` | `/api/tasks` | Crea una nueva tarea |
| `PUT` | `/api/tasks/:id` | Actualiza tarea (título, descripción, asignado, story points) |
| `PATCH` | `/api/tasks/:id/move` | Mueve de columna y reordena posición relativa con transacción SQL |
| `DELETE` | `/api/tasks/:id` | Elimina tarea |
