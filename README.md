# ConversaDesk 💬

**Mini bandeja de atención al cliente**, desarrollada como proyecto demostrativo full stack con **React, JavaScript, Node.js y Express**.

> Proyecto educativo de portafolio de Hillary Almachi. No está asociado a Nouz ni conectado a WhatsApp, Instagram o servicios reales. Las empresas y conversaciones mostradas son ficticias.

## ¿Qué problema resuelve?

Un equipo que recibe consultas de varios canales necesita una vista centralizada: identificar el asunto, buscar conversaciones, responder y dar seguimiento a su estado. ConversaDesk simula ese flujo desde una sola interfaz.

## Funcionalidades

- ✅ Visualización de conversaciones y mensajes simulados
- ✅ Búsqueda por nombre, empresa, asunto o canal
- ✅ Filtros: **Todas**, **Abiertas**, **En espera** y **Resueltas**
- ✅ Cambio de estado a través de una API REST
- ✅ Envío de respuestas simuladas desde React hacia Express
- ✅ Tarjetas con métricas calculadas por el backend
- ✅ Validación de mensajes y respuestas de error HTTP
- ✅ Interfaz adaptable a pantallas pequeñas
- ✅ Pruebas automatizadas de la API con `node:test`
- ✅ Workflow GitHub Actions para comprobar pruebas y compilación tras cada cambio

## Tecnologías

| Capa | Tecnología | ¿Para qué se usa? |
|---|---|---|
| Frontend | React + Vite + CSS | Interfaz, filtros, selección de conversación |
| Backend | Node.js + Express | API REST, validación y lógica de negocio |
| Comunicación | `fetch` + JSON | Peticiones HTTP entre cliente y servidor |
| Pruebas | Node.js test runner | Comprueba rutas y validación de la API |

## Ejecutar en Windows con Visual Studio Code

**Requisitos:** Node.js **22.12 o superior**, npm y VS Code.

1. Descarga este repositorio como ZIP y extráelo, o clónalo.
2. Abre la carpeta raíz `conversadesk-hillary` en VS Code.
3. Ve a **Terminal → Nueva terminal** y ejecuta:

   ```powershell
   npm install
   npm run dev
   ```

4. Abre **http://localhost:5173** en el navegador.

> Nota: si Windows bloquea scripts `.ps1`, usa una terminal **Command Prompt (CMD)** en VS Code o escribe `npm.cmd install` y `npm.cmd run dev` en PowerShell. No necesitas cambiar políticas de seguridad.

La interfaz se ejecuta en `localhost:5173` y el servidor API en `localhost:3001`. Vite redirige las llamadas `/api` hacia Express.

## Probar el funcionamiento

1. Selecciona la conversación **Camila Torres**.
2. Escribe una respuesta y presiona **Enviar**.
3. Cambia el estado de la conversación a **Resuelta**.
4. Verifica que cambian las métricas y los filtros.
5. Prueba el buscador escribiendo `Instagram`.

### Pruebas automatizadas

```powershell
npm test
```

### Compilación del frontend

```powershell
npm run build
```

## Endpoints de la API

| Método | Ruta | Resultado |
|---|---|---|
| GET | `/api/health` | Estado del servicio |
| GET | `/api/stats` | Totales por estado |
| GET | `/api/conversations` | Listado y mensajes recientes |
| GET | `/api/conversations/:id` | Detalle de una conversación |
| PATCH | `/api/conversations/:id/status` | Actualiza estado (`open`, `pending`, `resolved`) |
| POST | `/api/conversations/:id/messages` | Agrega una respuesta simulada |

Ejemplo de cuerpo JSON para responder:

```json
{ "text": "¡Hola! Te comparto los detalles." }
```

## Estructura del repositorio

```text
conversadesk-hillary/
├── client/
│   ├── src/
│   │   ├── App.jsx           # Interfaz y solicitudes HTTP
│   │   ├── main.jsx          # Punto de entrada de React
│   │   └── styles.css        # Diseño responsivo
│   └── vite.config.js        # Proxy hacia Express
├── server/
│   ├── app.js                # Rutas y validaciones
│   ├── app.test.js           # Pruebas automáticas
│   ├── data.js               # Datos ficticios
│   └── index.js              # Inicio del servidor
├── .gitignore
├── LICENSE
└── README.md
```

## Decisiones técnicas y limitaciones

- **Sin base de datos por ahora:** las conversaciones están en memoria. **Los cambios desaparecen al reiniciar el backend.** Esto simplifica el aprendizaje y las demostraciones.
- **Sin integración con terceros:** los mensajes no se envían a WhatsApp, Instagram o personas reales.
- **Sin autenticación:** es una demo local; no debe exponerse como servicio público sin añadir seguridad, autenticación, almacenamiento persistente y controles adicionales.
- **Sin IA:** no se anuncia como aplicación con inteligencia artificial. Una mejora futura sería un asistente de respuestas conectado a una API, con autorización y límites de uso.
- **Siguiente mejora sugerida:** añadir PostgreSQL o SQLite, autenticación y pruebas del frontend.

## Autoría y uso

Este proyecto es una base de aprendizaje guiada por IA para revisar, modificar y comprender. Antes de mostrarlo en una entrevista, personaliza su diseño, agrega mejoras propias y prepárate para explicar cada pieza. **No lo presentes como un desarrollo realizado sin ayuda.**

**Hillary Almachi** · Ingeniería en Tecnologías de la Información · Ecuador.

Licencia MIT.
