# Manual de Operación y Guía de Ejecución (Runbook)

**Proyecto:** Scrum Meeting Board  
**Versión:** 2.0.0  
**Fecha:** Noviembre 2026  
**Plataforma Objetivo:** Google Chrome 120+ y Apple Safari 17+ en macOS y Windows (Desktop Web App).

---

## 1. Visión General del Sistema

**Scrum Meeting Board** es una aplicación web de escritorio diseñada específicamente para optimizar y dinamizar las reuniones diarias de Scrum (*Daily Standups*), refinamientos de backlog y sesiones de planificación de sprint. Proporciona:
- **Control de Tiempo por Integrante:** Cronómetro con semáforo cromático dinámico sincronizado por equipo.
- **Flujo de Turnos Automatizado:** Seguimiento visual en vivo de quién presenta, quién ya presentó y quién fue omitido.
- **Scrum Board Nativo Interactivo:** Tablero Drag & Drop de 4 columnas canónicas (`To Do`, `In Progress`, `Code Review`, `Done`) con fichas de tareas, asignaciones y Story Points.
- **Internacionalización (i18n):** Interfaz multilingüe en Inglés (por defecto), Español y Alemán con arquitectura extensible.
- **Guía Asistida de Stand-up:** Modal educativo con la dinámica Scrum y las 3 preguntas clave.
- **Automatización E2E sin Fragilidad:** Convención exhaustiva de selectores `data-testid` diseñada para suites con **Playwright + Java**.

---

## 2. Requisitos Previos del Entorno

Asegúrese de contar con las siguientes herramientas instaladas en el sistema anfitrión:

| Herramienta | Versión Mínima Recomendada | Propósito |
|---|---|---|
| **Docker & Docker Compose** | Docker 24+ / Compose v2+ | Contenedor de base de datos MySQL 8.0 |
| **Node.js** | v18.0.0 o superior (v20+ LTS recomendado) | Entorno de ejecución para Backend y Frontend |
| **npm** | v9.0.0 o superior | Gestor de paquetes |
| **Google Chrome / Apple Safari** | Chrome 120+ / Safari 17+ | Navegadores certificados para visualización |

---

## 3. Puesta en Marcha Rápida (Quickstart)

### Paso 1: Levantar la Base de Datos MySQL en Docker
El contenedor Docker inicializa la base de datos `scrum_board_db` con el esquema relacional y datos semilla canónicos (`Alpha Warriors` y `Beta Builders`):

```bash
# Iniciar el servicio de base de datos en segundo plano
docker compose up -d

# Verificar que el contenedor esté corriendo y saludable (healthy)
docker ps --filter "name=scrum_board_mysql"
```

> [!NOTE]
> Para reiniciar completamente la base de datos desde cero (incluyendo volúmenes):
> ```bash
> docker compose down -v && docker compose up -d
> ```

### Paso 2: Configurar e Iniciar el Backend API
El backend está construido con Express y el pool transaccional `mysql2/promise`:

```bash
cd backend

# Instalar dependencias
npm install

# Verificar configuración de variables de entorno (.env)
# Si no existe, crear a partir del archivo .env.example:
cp .env.example .env

# Iniciar servidor en modo desarrollo con recarga automática
npm run dev
```

El servidor API estará disponible y respondiendo en: **`http://localhost:5000`**.  
Endpoint de verificación rápida:
```bash
curl http://localhost:5000/api/teams
```

### Paso 3: Configurar e Iniciar el Frontend Web App
El frontend está construido con Vite, React 18 y Tailwind CSS:

```bash
cd ../frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo Vite
npm run dev
```

Abra el navegador en: **`http://localhost:3000`** (o `http://127.0.0.1:3000`).

---

## 4. Estructura de la Aplicación y Atributos `data-testid`

La aplicación sigue una distribución de pantalla optimizada para salas de reunión y proyectores (relación 20% Header / 80% Panel Inferior):

```text
+----------------------------------------------------------------------------------------------------+
| HEADER (20% Alto): Team Name, Timer, Play/Pause, Skip, Language Selector, Help Modal (?)           |
+------------------------------------+---------------------------------------------------------------+
| LEFT PANEL (20% Ancho):            | CENTER PANEL (80% Ancho):                                     |
| - Selectores (Modo y Equipo)       | - Barra de acción: "+ New Task"                               |
| - Lista de Miembros (Reloj/Check/X)| - 4 Columnas: To Do | In Progress | Code Review | Done         |
| - 3 Botones de acción inferior     | - Fichas arrastrables con Drag & Drop                         |
+------------------------------------+---------------------------------------------------------------+
```

### Catálogo Completo de Selectores `data-testid` para Automatización

#### A. Header y Controles de Reproducción
| Selector | Descripción |
|---|---|
| `[data-testid="header-container"]` | Contenedor principal del Header |
| `[data-testid="header-team-name"]` | Nombre del equipo activo (permite clic derecho para editar) |
| `[data-testid="header-btn-add-team"]` | Botón para abrir modal de creación de equipo |
| `[data-testid="timer-display"]` | Cronómetro en formato `MM:SS` (aplica colores de semáforo) |
| `[data-testid="timer-btn-toggle"]` | Botón conmutable Play / Pausa |
| `[data-testid="timer-btn-skip"]` | Botón Skip para omitir el turno actual |
| `[data-testid="language-select-dropdown"]` | Selector `<select>` de idioma (en, es, de) |
| `[data-testid="btn-help-modal"]` | Botón `?` para abrir la guía Scrum Stand-up |

#### B. Panel Izquierdo (Miembros y Turnos)
| Selector | Descripción |
|---|---|
| `[data-testid="left-panel-container"]` | Contenedor principal del Panel Izquierdo |
| `[data-testid="presentation-mode-select"]` | Selector de Modo (Alfabético / Random) |
| `[data-testid="team-select-dropdown"]` | Selector de Equipo activo |
| `[data-testid="member-list-container"]` | Contenedor de la lista de miembros |
| `[data-testid="member-item-{id}"]` | Fila individual de miembro |
| `[data-testid="member-name-{id}"]` | Nombre del integrante |
| `[data-testid="member-active-indicator-{id}"]` | Indicador "TURNO" del integrante en presentación |
| `[data-testid="member-status-clock-{id}"]` | Icono de estado pendiente (Reloj) |
| `[data-testid="member-status-check-{id}"]` | Icono de estado completado (Check verde) |
| `[data-testid="member-status-skip-{id}"]` | Icono de estado omitido (X roja) |
| `[data-testid="btn-add-member"]` | Acción 1: "Agregar nuevo miembro" |
| `[data-testid="btn-reset-all-members"]` | Acción 2: "Reiniciar reunión" |
| `[data-testid="btn-randomize-members"]` | Acción 3: "Reordenar aleatoriamente" |
| `[data-testid="member-context-menu"]` | Menú flotante al hacer clic derecho sobre un miembro |
| `[data-testid="context-menu-opt-reset"]` | Opción del menú: Restablecer a Reloj |
| `[data-testid="context-menu-opt-edit"]` | Opción del menú: Editar nombre |
| `[data-testid="context-menu-opt-delete"]` | Opción del menú: Eliminar miembro |

#### C. Panel Central (Scrum Board Nativo)
| Selector | Descripción |
|---|---|
| `[data-testid="center-panel-container"]` | Contenedor principal del Panel Central |
| `[data-testid="btn-create-task"]` | Botón "+ New Task" / "+ Nueva Tarea" |
| `[data-testid="scrum-board-container"]` | Cuadrícula de 4 columnas del tablero |
| `[data-testid="board-column-{id}"]` | Contenedor de columna |
| `[data-testid="column-title-{id}"]` | Título de columna |
| `[data-testid="column-task-count-{id}"]` | Contador de tareas en la columna |
| `[data-testid="column-drop-zone-{id}"]` | Zona sensible a Drag & Drop |
| `[data-testid="task-card-{id}"]` | Tarjeta de tarea arrastrable |
| `[data-testid="task-title-{id}"]` | Título de la tarea |
| `[data-testid="task-assignee-{id}"]` | Nombre del miembro asignado |
| `[data-testid="task-points-{id}"]` | Puntos de historia (Story Points) |
| `[data-testid="task-description-{id}"]` | Descripción de la tarea |
| `[data-testid="btn-edit-task-{id}"]` | Botón para editar la tarea |
| `[data-testid="btn-delete-task-{id}"]` | Botón para eliminar la tarea |

#### D. Modales de Diálogo y Formularios
| Selector | Descripción |
|---|---|
| `[data-testid="modal-dialog-container"]` | Backdrop / contenedor del modal activo |
| `[data-testid="modal-dialog-title"]` | Encabezado del diálogo |
| `[data-testid="modal-dialog-message"]` | Texto explicativo del diálogo |
| `[data-testid="modal-btn-confirm"]` | Botón afirmativo / Guardar / Sí |
| `[data-testid="modal-btn-cancel"]` | Botón de cancelación / Descartar / No |
| `[data-testid="modal-form-input"]` | Campo de entrada genérico para nombres |
| `[data-testid="modal-timer-seconds-input"]` | Campo de entrada numérico para segundos del timer |
| `[data-testid="help-modal-dialog"]` | Modal de Guía Scrum Stand-up |
| `[data-testid="help-modal-close-btn"]` | Botón para cerrar la guía |
| `[data-testid="task-input-title"]` | Campo de título en formulario de tarea |
| `[data-testid="task-input-desc"]` | Campo de descripción en formulario de tarea |
| `[data-testid="task-input-column"]` | Selector de columna en formulario de tarea |
| `[data-testid="task-input-points"]` | Campo de Story Points en formulario de tarea |
| `[data-testid="task-input-assignee"]` | Selector de integrante asignado |
| `[data-testid="task-submit-btn"]` | Botón para guardar tarea |
| `[data-testid="task-cancel-btn"]` | Botón para cancelar creación de tarea |

---

## 5. Ejemplos de Automatización E2E con Playwright (Java)

A continuación se presentan ejemplos canónicos de cómo interactuar con los elementos utilizando **Playwright en Java**:

### Ejemplo 1: Conmutar Idioma y Validar Reactividad
```java
package com.scrumboard.tests;

import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class LanguageSwitchTest {
    static Playwright playwright;
    static Browser browser;
    BrowserContext context;
    Page page;

    @BeforeAll
    static void launchBrowser() {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
    }

    @BeforeEach
    void createContextAndPage() {
        context = browser.newContext();
        page = context.newPage();
        page.navigate("http://localhost:3000");
    }

    @Test
    void testSwitchToSpanishAndVerifyUI() {
        // Seleccionar Español en el dropdown
        Locator langDropdown = page.getByTestId("language-select-dropdown");
        langDropdown.selectOption("es");

        // Validar que el botón de nueva tarea se tradujo a Español
        Locator newTaskBtn = page.getByTestId("btn-create-task");
        assertTrue(newTaskBtn.innerText().contains("Nueva Tarea"));

        // Validar que el botón de reinicio dice "Reiniciar reunión"
        Locator resetBtn = page.getByTestId("btn-reset-all-members");
        assertTrue(resetBtn.innerText().contains("Reiniciar reunión"));
    }

    @AfterEach
    void closeContext() {
        context.close();
    }

    @AfterAll
    static void closeBrowser() {
        playwright.close();
    }
}
```

### Ejemplo 2: Flujo de Cronómetro y Salto de Turno (Skip)
```java
@Test
void testTimerAndSkipFlow() {
    // Verificar que el cronómetro está visible
    Locator timerDisplay = page.getByTestId("timer-display");
    assertTrue(timerDisplay.isVisible());

    // Iniciar el cronómetro
    Locator playBtn = page.getByTestId("timer-btn-toggle");
    playBtn.click();
    
    // Esperar 2 segundos
    page.waitForTimeout(2000);

    // Omitir el turno con el botón Skip
    Locator skipBtn = page.getByTestId("timer-btn-skip");
    skipBtn.click();

    // Validar que el miembro anterior ahora tiene el icono de omitido (X roja)
    Locator skippedIcon = page.locator("[data-testid^='member-status-skip-']").first();
    assertTrue(skippedIcon.isVisible());
}
```

### Ejemplo 3: Crear Tarea en el Scrum Board
```java
@Test
void testCreateTaskInScrumBoard() {
    // Abrir modal de nueva tarea
    page.getByTestId("btn-create-task").click();

    // Rellenar formulario
    page.getByTestId("task-input-title").fill("Implementar Auth con OAuth2");
    page.getByTestId("task-input-desc").fill("Integración con Google Identity");
    page.getByTestId("task-input-points").fill("5");

    // Guardar
    page.getByTestId("task-submit-btn").click();

    // Validar que la tarjeta aparece en el tablero
    Locator createdTask = page.locator("[data-testid^='task-title-']", new Page.LocatorOptions().setHasText("Implementar Auth con OAuth2"));
    assertTrue(createdTask.isVisible());
}
```

---

## 6. Resolución de Problemas Frecuentes (Troubleshooting)

### A. El contenedor de MySQL no inicia o reporta conflicto de puerto 3306
- **Causa:** Hay otro servicio local de MySQL o MariaDB corriendo en el puerto 3306.
- **Solución:**
  1. Detenga el servicio local: `brew services stop mysql` (en macOS) o `sudo systemctl stop mysql` (en Linux).
  2. O configure un puerto mapeado diferente en `docker-compose.yml` (por ejemplo `"3307:3306"`) y ajuste `DB_PORT=3307` en `backend/.env`.

### B. El backend no conecta a la base de datos (`ECONNREFUSED`)
- **Causa:** El contenedor de MySQL aún no ha completado su rutina de inicialización o está reiniciando.
- **Solución:**
  1. Verifique el estado del contenedor: `docker ps`. Debe decir `(healthy)`.
  2. Inspeccione los logs: `docker logs scrum_board_mysql`.
  3. Espere unos segundos hasta que aparezca el mensaje `ready for connections`.

### C. Añadir un nuevo idioma al sistema i18n
Para incorporar un nuevo idioma (por ejemplo, Francés `fr`):
1. Cree el diccionario de traducción: `frontend/src/i18n/locales/fr.js` copiando la estructura de `en.js`.
2. Abra `frontend/src/i18n/I18nContext.jsx`.
3. Importe el archivo e incorpórelo a `TRANSLATIONS` y `AVAILABLE_LANGUAGES`:
   ```javascript
   import fr from './locales/fr';
   // ...
   const TRANSLATIONS = { en, es, de, fr };
   export const AVAILABLE_LANGUAGES = [
     { code: 'en', label: 'English', flag: '🇺🇸' },
     { code: 'es', label: 'Español', flag: '🇪🇸' },
     { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
     { code: 'fr', label: 'Français', flag: '🇫🇷' },
   ];
   ```
4. El nuevo idioma aparecerá automáticamente en el selector del Header.

---

## 7. Mantenimiento y Construcción para Producción

Para compilar los artefactos estáticos listos para desplegar en un servidor web (Nginx, Caddy, Apache o CDN):

```bash
cd frontend
npm run build
```

Los archivos optimizados y minificados se generarán en la carpeta `frontend/dist/`.
