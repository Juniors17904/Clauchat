# CLAUDE.md — Reglas del proyecto

## Idioma
- Responder SIEMPRE en español en el texto de respuesta (lo que ve el usuario)
- El razonamiento interno también en español
- Las descripciones de herramientas y comandos también en español
- TODO el código fuente en español: nombres de clases, archivos, métodos y atributos en español
- Solo se permite inglés en: APIs externas, nombres de librerías, acrónimos universales

---

## Reglas de código — CRÍTICAS
- NUNCA modificar, editar, crear ni borrar código sin que el usuario use palabras de acción explícitas: **hazlo, impleméntalo, cámbialo, ponlo, agrégalo, modifica, arréglalo, crea, borra, actualiza, pushealo, commitea, aplícalo**
- Si el usuario hace una pregunta → responder solo con texto, SIN tocar el código
- Si el usuario dice "no toques el código" → parar inmediatamente, solo texto
- Ante cualquier duda, preguntar antes de programar

---

## ⚠️ ARQUITECTURA POO — REGLA ABSOLUTA E INNEGOCIABLE ⚠️

TODO lo que se cree DEBE ser una clase. Sin excepciones. Sin atajos.

**PROHIBIDO:**
- Funciones sueltas
- Objetos literales como sustituto de instancias
- Métodos estáticos cuando la entidad tiene identidad propia
- Números o strings para representar entidades del dominio

**OBLIGATORIO:**
- Cada entidad nueva es una clase instanciable con sus propios atributos y métodos

---

## CADA CLASE VIVE EN SU PROPIO ARCHIVO

- El nombre del archivo debe coincidir con el nombre de la clase en snake_case español
- Ejemplos: `GestorPreguntas` → `gestor_preguntas.js`, `TarjetaEstudio` → `tarjeta_estudio.js`
- PROHIBIDO definir más de una clase por archivo

---

## Nombres en español obligatorio

- Clases: `GestorPreguntas`, `SesionEstudio`, `TarjetaFlashcard`
- Archivos: `gestor_preguntas.js`, `sesion_estudio.js`, `tarjeta_flashcard.js`
- Métodos y atributos: `iniciar()`, `verificar()`, `#puntuacion`, `#estado`
- PROHIBIDO nombres en inglés para entidades del proyecto

---

## 🚨 PROHIBICIÓN ABSOLUTA: OBJETOS LITERALES COMO ENTIDADES 🚨

NUNCA usar `{ }` para representar una entidad del dominio. SIEMPRE una clase.

```js
// ❌ GRAVÍSIMO — objeto literal como entidad
const pregunta = { texto: '¿Cuánto es 2+2?', respuesta: '4', nivel: 'fácil' };

// ✅ CORRECTO — clase instanciable en su propio archivo
// archivo: pregunta.js
class Pregunta {
    #texto;
    #respuesta;
    #nivel;
    constructor(texto, respuesta, nivel) {
        this.#texto = texto;
        this.#respuesta = respuesta;
        this.#nivel = nivel;
    }
    get texto() { return this.#texto; }
    verificar(intento) { return intento.trim() === this.#respuesta; }
}
```

**Checklist ANTES de escribir cualquier `{ }` con datos:**
- ¿Tiene nombre propio? → ES UNA CLASE
- ¿Tiene variantes? → ES UNA JERARQUÍA DE CLASES
- ¿Tiene más de 2 propiedades? → PROBABLEMENTE ES UNA CLASE

**La única excepción permitida para `{ }`:**
Variables locales temporales dentro de un método. Nunca como propiedad persistente.

---

## MVC obligatorio

- **Model** → datos y lógica de negocio. Sin lógica de vista.
- **View** → renderizado, componentes UI. Sin lógica de negocio.
- **Controller** → orquesta Model y View. Sin lógica de dominio ni de dibujo directo.

---

## POO obligatorio — checklist antes de escribir cualquier código nuevo

- ¿Tiene nombre propio? → clase con ese nombre en español
- ¿Tiene datos internos? → campos privados `#campo`
- ¿Tiene comportamiento? → métodos de instancia (no estáticos)
- ¿Hay variantes del mismo concepto? → subclases o clases separadas que comparten interfaz
- ¿Solo se expone lo necesario? → getters para lo que otros necesitan leer
- ¿Está en su propio archivo? → si no, moverla antes de continuar

---

## 🏗️ HERENCIA Y ENCAPSULAMIENTO — REGLA OBLIGATORIA

### Cuándo crear una superclase

Siempre que existan dos o más clases que comparten la misma interfaz pública, deben tener una superclase común.

**Señales de que falta una superclase:**
- Dos clases tienen los mismos nombres de métodos
- El código hace `if (tipo === 'x') ... else ...` para decidir cuál instanciar
- Se repite lógica similar en múltiples clases

```js
// ❌ MAL — sin superclase, el controller decide todo
if (modo === 'flashcard') {
    const m = new ModoFlashcard(); m.iniciar();
} else {
    const m = new ModoQuiz(); m.iniciar();
}

// ✅ BIEN — superclase define la interfaz, subclases la implementan
class ModoEstudio {           // superclase en su propio archivo
    iniciar() {}
    terminar() {}
}
class ModoFlashcard extends ModoEstudio { ... }
class ModoQuiz      extends ModoEstudio { ... }

// El controller solo conoce la interfaz:
this.#modo = new ModoFlashcard();
this.#modo.iniciar();
```

### Encapsulamiento — reglas estrictas

```js
// ❌ MAL — atributos públicos
class SesionEstudio {
    puntuacion = 0;
    estado = 'inactivo';
}

// ✅ BIEN — privados con # y exposición controlada
class SesionEstudio {
    #puntuacion = 0;
    #estado = 'inactivo';
    get puntuacion() { return this.#puntuacion; }
}
```

**Reglas:**
- Todo estado interno → campo privado `#campo`
- Solo agregar getter si otra clase necesita leer el valor
- Solo agregar setter si otra clase necesita escribir el valor con validación
- NUNCA exponer campos privados solo por comodidad

---

## Ejemplos correctos vs incorrectos

```js
// ❌ MAL — múltiples clases en un archivo
// pregunta.js contiene: Pregunta, PreguntaMultiple, PreguntaVerdaderoFalso

// ✅ BIEN — cada clase en su archivo
// pregunta.js            → class Pregunta
// pregunta_multiple.js   → class PreguntaMultiple
// pregunta_vf.js         → class PreguntaVerdaderoFalso

// ❌ MAL — nombre en inglés
class QuestionManager { }

// ✅ BIEN — nombre en español
class GestorPreguntas { }
```

---

## CADA CLASE DEBE TENER SENTIDO PROPIO

- Sus atributos y métodos deben pertenecer naturalmente a ella
- Si un atributo describe a otra clase, DEBE vivir en esa clase
- Cada clase tiene UNA responsabilidad clara
- Antes de agregar código suelto, preguntar: ¿a qué clase pertenece esto?
- NUNCA poner en una clase atributos o lógica que pertenezcan a otra clase

---

## Respuestas al terminar cada cambio

- **Al terminar cada cambio de código:** escribir un párrafo breve de conclusión en palabras simples explicando qué se hizo y por qué. El objetivo es que cualquier persona entienda el cambio sin saber programación avanzada.
- **Al terminar cada respuesta:** hacer exactamente 1 pregunta corta a modo de sugerencia sobre qué podría querer hacer el usuario a continuación. Formularla como opción concreta, no genérica.

---

## Diseño visual

- El estilo es similar a **Visual Studio Code**: fondo oscuro `#0d1117`, paneles `#161b22`, bordes `#30363d`, texto principal `#e6edf3`, texto secundario `#8b949e`
- Fuente monoespaciada (`font-mono`) para el editor SQL y datos; `font-sans` para textos de UI
- Sin modales grandes ni popups intrusivos — preferir **banners discretos** dentro de la misma pantalla
- Animaciones mínimas y funcionales, nunca decorativas

---

## Flujo de ejercicios

- El alumno **debe acertar** para poder avanzar al siguiente ejercicio
- La validación compara los **resultados** de la consulta (filas y columnas), no el texto SQL
- Al acertar: mostrar banner discreto de éxito con botón "Siguiente ejercicio"
- Al ser el último ejercicio del nivel: mostrar banner con botón "Volver a ejercicios"
- El **progreso se guarda en `localStorage`**: qué ejercicios completó el alumno por nivel
- Clase responsable del progreso: `GestorProgreso` en `gestor_progreso.js`

---

## Jerarquía de clases actual

| Superclase        | Subclases                                                        | Propósito                              |
|-------------------|------------------------------------------------------------------|----------------------------------------|
| EntidadCatalogo   | AreaEstudio, NivelEstudio                                        | Entidades con id, nombre, descripcion  |
| BaseDatos         | BaseDatosUniversidad, BaseDatosDeportes, BaseDatosHospital       | Bases de datos con esquemaSQL override |
| ControladorBase   | ControladorEditor                                                | Controladores con iniciar() y destruir() |

---

## Ramas y flujo de trabajo

- Desarrollar en la rama de feature designada para cada sesión
- Hacer commit con mensajes descriptivos en español
- Push a la rama de desarrollo al terminar cada cambio

### Flujo obligatorio para que Vercel despliegue

Vercel está conectado al repositorio de GitHub y despliega automáticamente cada vez que detecta un push a `master`. Por eso, después de cada cambio:

```
git push origin <rama-feature>
git checkout master
git merge <rama-feature>
git push origin master
```

- El sitio se sirve desde `master` (Vercel apunta a `master`)
- NUNCA dejar cambios solo en la rama de desarrollo sin mergear a `master`
- SIEMPRE hacer el merge y push a `master` al terminar cada cambio

---

## 📸 Cómo tomar capturas con Claude

**¿Qué hace?**
El script `tomar_captura.sh` levanta el servidor de desarrollo (`npm run dev`) en background, espera a que esté listo, luego usa Playwright + Xvfb (servidor X virtual) para automatizar un navegador Chromium y capturar la pantalla en dos orientaciones: portrait (390×844) y landscape (844×390).

**¿Cuándo usarlo?**
Cuando necesites visuales de cómo se ve la app en móvil. Útil para verificar diseño, responsive, y cambios visuales sin abrir manualmente un navegador.

**¿Cómo funciona internamente?**
1. Inicia `npm run dev -- --host 0.0.0.0` (servidor escuchando en todas las interfaces)
2. Espera 8 segundos a que esté listo
3. Crea un script Playwright temporal que:
   - Lanza Chromium en modo headless
   - Abre dos contextos de navegador (portrait y landscape)
   - Navega a `http://localhost:5173/`
   - Espera a que cargue (`networkidle`)
   - Toma screenshot de cada uno
4. Ejecuta el script con `xvfb-run` (entorno virtual X display)
5. Mata el proceso del servidor de desarrollo
6. Guarda capturas en `/tmp/captura_portrait.png` y `/tmp/captura_landscape.png`

**¿Por qué funciona?**
- Chromium como navegador real puede acceder a localhost aunque sea dentro de un contenedor
- Xvfb crea una pantalla virtual para que Playwright pueda renderizar
- Playwright automatiza el flujo completo sin intervención manual

**Ejecución:**
```bash
./tomar_captura.sh
```

Cuando Claude te pida capturar, ejecuta este script y las imágenes estarán listas para mostrar.
