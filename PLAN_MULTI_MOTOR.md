# ⚠️ PLAN DE TRABAJO — LEER ANTES DE EMPEZAR ⚠️

> **ADVERTENCIA:** Este documento describe el plan completo para integrar
> múltiples motores de base de datos (PostgreSQL, MySQL, Oracle, SQL Server).
> Leerlo COMPLETO antes de hacer cualquier cambio. Si hay alguna contradicción
> con el código actual o con CLAUDE.md, PARAR y preguntar al usuario.

---

## ESTADO ACTUAL DEL PROYECTO

### Motor SQL activo
- **PGlite** (PostgreSQL en WebAssembly) — ejecuta TODO en el navegador
- sql.js (SQLite) ya NO se usa, es residuo legacy en package.json
- No hay backend, API, ni serverless functions
- Todo es frontend puro desplegado como sitio estático en Vercel

### Estructura de datos existente
| Componente | Estado |
|---|---|
| Áreas (sql-estandar, postgresql, sql-server, mysql, oracle) | ✅ Definidas |
| Niveles por motor (pg-nivel1, ss-nivel1, etc.) | ✅ Generados automáticamente |
| Temas PostgreSQL (27 temas) | ✅ Definidos |
| Temas SQL Server (15 temas) | ✅ Definidos |
| Temas MySQL (14 temas) | ✅ Definidos |
| Temas Oracle (15 temas) | ✅ Definidos |
| Ejercicios SQL Estándar (niveles 1-3, ~70 ejercicios) | ✅ Hechos |
| Ejercicios SQL Estándar (niveles 4-8) | ❌ Faltan |
| Ejercicios PostgreSQL | ❌ Faltan todos |
| Ejercicios MySQL | ❌ Faltan todos |
| Ejercicios Oracle | ❌ Faltan todos |
| Ejercicios SQL Server | ❌ Faltan todos |
| Backend API | ❌ No existe |
| PantallaBaseDatos UI | ✅ Lista |

### Descubrimiento clave
**PGlite YA ES PostgreSQL.** Esto significa que la sintaxis específica de
PostgreSQL (ILIKE, SERIAL, array_agg, jsonb, RETURNING, etc.) ya funciona
en el motor actual sin ningún cambio. Los ejercicios de PostgreSQL se pueden
ejecutar LOCALMENTE sin backend.

---

## PLAN DE TRABAJO POR FASES

### FASE 1 — PostgreSQL (SIN backend, funciona ya)
**Costo: $0 | Dificultad: Baja**

PGlite ya ejecuta PostgreSQL real. Solo hay que:

1. **Crear ejercicios** para los 27 temas de PostgreSQL en `ejercicios.js`
   - Usar las bases de datos existentes (universidad, deportes, hospital)
   - Ejercicios con sintaxis específica: ILIKE, ||, RETURNING, array_agg, etc.
   - Cada tema necesita entre 3-6 ejercicios

2. **Crear bases de datos específicas** (si algún tema lo necesita)
   - Ej: una base con columnas JSONB o ARRAY para esos temas

3. **Habilitar PostgreSQL en la UI**
   - Cambiar estado de 'proximamente' a 'continuar' en PantallaBaseDatos
   - El flujo de navegación ya está listo (áreas → niveles → temas → editor)

4. **Adaptar ControladorEditor** (mínimo)
   - Actualmente funciona con PGlite para todo
   - Solo verificar que los ejercicios PG se ejecuten correctamente
   - No se necesita cambiar el motor

**Resultado:** PostgreSQL funcionando completo, sin backend, sin costo.

---

### FASE 2 — Backend API + MySQL
**Costo: $0 | Dificultad: Media**

MySQL no tiene motor WASM, necesita un servidor real.

1. **Crear cuenta en TiDB Cloud** (MySQL serverless gratuito)
   - Tier gratuito: 25 GiB storage, 250M Request Units/mes
   - Crear las bases de datos de ejemplo (universidad, deportes, hospital)

2. **Crear API en Vercel Functions**
   - Archivo: `api/ejecutar.js` (serverless function)
   - Recibe: { consulta, motor, baseDatosId }
   - Ejecuta la consulta en el motor correspondiente
   - Devuelve: { columnas, filas, error }
   - Seguridad: solo SELECT permitido, timeout de 5 segundos

3. **Crear clase EjecutorRemoto**
   - Nueva clase en `src/modelos/ejecutor_remoto.js`
   - Envía la consulta a la API cuando el motor no es PGlite
   - Retorna ResultadoConsulta (misma interfaz que PGlite)

4. **Modificar ControladorEditor**
   - Detectar el motor del ejercicio (por el nivelId: pg-, my-, ss-, or-)
   - Si es sql-estandar o postgresql → PGlite local
   - Si es mysql → EjecutorRemoto → API → TiDB

5. **Crear ejercicios MySQL** para los 14 temas definidos

6. **Habilitar MySQL en la UI**

**Resultado:** MySQL funcionando via API gratuita.

---

### FASE 3 — Oracle
**Costo: $0 | Dificultad: Media-Alta**

1. **Crear cuenta en Oracle Cloud Free Tier**
   - Autonomous Database gratuito (20 GB)
   - Crear las bases de datos de ejemplo

2. **Agregar Oracle a la API** de Vercel Functions
   - Nuevo driver: oracledb (npm)
   - Misma estructura que MySQL

3. **Crear ejercicios Oracle** para los 15 temas definidos

4. **Habilitar Oracle en la UI**

**Resultado:** Oracle funcionando via API gratuita.

---

### FASE 4 — SQL Server (CUANDO HAYA PRESUPUESTO)
**Costo: ~$5/mes | Dificultad: Media**

SQL Server no tiene tier gratuito en la nube.

**Opción A — VPS con Docker (~$5/mes)**
- Railway, Render o DigitalOcean
- Docker con SQL Server Express (gratuito, limitado a 10 GB)
- Agregar a la API existente

**Opción B — Azure SQL (tier gratuito limitado)**
- Azure ofrece 100K vCore-seconds/mes gratis
- Puede ser suficiente para ejercicios educativos

1. Configurar instancia SQL Server
2. Agregar driver mssql a la API
3. Crear ejercicios para los 15 temas
4. Habilitar en la UI

**Resultado:** Los 4 motores funcionando.

---

## ARQUITECTURA FINAL

```
┌─────────────────────────────────────┐
│         App (Vercel - Frontend)     │
│                                     │
│  SQL Estándar ──→ PGlite (local)   │
│  PostgreSQL   ──→ PGlite (local)   │
│  MySQL        ──→ API ──→ TiDB    │
│  Oracle       ──→ API ──→ Oracle  │
│  SQL Server   ──→ API ──→ Docker  │
└─────────────────────────────────────┘
```

SQL Estándar y PostgreSQL corren 100% en el navegador.
MySQL, Oracle y SQL Server necesitan la API.

---

## ARCHIVOS QUE SE CREAN O MODIFICAN POR FASE

### Fase 1 (PostgreSQL)
| Acción | Archivo |
|---|---|
| Modificar | `src/datos/ejercicios.js` — agregar ejercicios PG |
| Crear (si necesario) | `src/datos/base_*.js` — bases con tipos PG |
| Modificar | `src/vistas/pantallas/PantallaBaseDatos.jsx` — habilitar PG |

### Fase 2 (Backend + MySQL)
| Acción | Archivo |
|---|---|
| Crear | `api/ejecutar.js` — Vercel serverless function |
| Crear | `src/modelos/ejecutor_remoto.js` — cliente de la API |
| Modificar | `src/controladores/controlador_editor.js` — selector de motor |
| Modificar | `src/datos/ejercicios.js` — agregar ejercicios MySQL |
| Crear | `vercel.json` — configuración de API routes |
| Modificar | `package.json` — agregar drivers (mysql2) |

### Fase 3 (Oracle)
| Acción | Archivo |
|---|---|
| Modificar | `api/ejecutar.js` — agregar driver Oracle |
| Modificar | `src/datos/ejercicios.js` — agregar ejercicios Oracle |
| Modificar | `package.json` — agregar driver (oracledb) |

### Fase 4 (SQL Server)
| Acción | Archivo |
|---|---|
| Modificar | `api/ejecutar.js` — agregar driver SQL Server |
| Modificar | `src/datos/ejercicios.js` — agregar ejercicios SS |
| Modificar | `package.json` — agregar driver (mssql) |

---

## CONTRADICCIONES Y NOTAS

1. **propuesta de cambio.txt** menciona sql.js (SQLite) como motor activo.
   Esto es OBSOLETO — el motor real es PGlite (PostgreSQL en WASM).
   El archivo `propuesta de cambio.txt` queda como referencia histórica.

2. **sql.js en package.json** es un residuo. Se puede eliminar cuando se quiera.

3. **public/sql-wasm.wasm** también es residuo de sql.js. Se puede eliminar.

4. Los esquemas de las bases de datos (universidad, deportes, hospital) usan
   sintaxis PostgreSQL que ya funciona en PGlite. Para MySQL/Oracle/SQL Server
   habría que crear versiones adaptadas de esos esquemas.

5. CLAUDE.md exige POO estricta. La clase EjecutorRemoto (Fase 2) debe seguir
   el patrón: campos privados #, getters, archivo propio, nombre en español.

---

## ORDEN DE EJECUCIÓN

```
FASE 1 ← EMPEZAR AQUÍ (PostgreSQL, sin costo, sin backend)
  ↓
FASE 2 (MySQL + API, requiere cuenta TiDB)
  ↓
FASE 3 (Oracle, requiere cuenta Oracle Cloud)
  ↓
FASE 4 (SQL Server, requiere presupuesto)
```

Cada fase es independiente y se puede pausar entre fases.
