# Mundo Pokémon
## Resumen
Aplicación web interactiva que simula el mundo Pokémon. Permite a los usuarios elegir su nombre de entrenador, seleccionar un Pokémon inicial y enfrentarse a Pokémon salvajes en batallas por turnos.
Implementada con HTML, CSS y JavaScript (módulos ES). Utiliza SweetAlert2 para diálogos interactivos y la PokeAPI para obtener Pokémon enemigos aleatorios.

## Estructura de carpetas
```
📁 index.html       -> Archivo de inicio
📁 assets/          -> Imágenes de Pokémon
  - bulbasaur.png
  - charmander.png
  - squirtle.png
  - pokeball.png
📁 css/
  - styles.css      -> Estilos de la interfaz
📁 js/
  - main.js         -> Punto de entrada y flujo principal
  - data.js         -> Datos de Pokémon iniciales
  - dom.js          -> Manipulación del DOM
  - ui.js           -> Funciones de interfaz (SweetAlert2)
  - storage.js      -> Gestión de localStorage
  - battle.js       -> Lógica de combate y conexión con PokeAPI
🗒️ README.md        -> Documentación (este archivo)
```

## Funcionalidad principal
- **Ingreso de nickname**: El usuario ingresa su nombre de entrenador.
- **Selección de Pokémon inicial**: Elegir entre Bulbasaur, Charmander o Squirtle.
- **Sistema de batallas**: Enfrentarse a Pokémon salvajes obtenidos de la PokeAPI.
- **Persistencia de datos**: Guardar progreso usando localStorage.
- **Notificaciones**: Confirmaciones y alertas usando SweetAlert2.

## Arquitectura y decisiones
**Patrón**: Aplicación cliente (SPA simple).

**Separación de responsabilidades**:
- `index.html`: Estructura base y referencias a recursos.
- `css/styles.css`: Estilos visuales del juego.
- `js/main.js`: Flujo principal y eventos del usuario.
- `js/data.js`: Datos estáticos de Pokémon iniciales.
- `js/dom.js`: Renderizado dinámico de elementos.
- `js/ui.js`: Interfaz de usuario con SweetAlert2.
- `js/storage.js`: Gestión de localStorage con manejo de errores.
- `js/battle.js`: Lógica de combate e integración con PokeAPI.

**Dependencias**: 
- SweetAlert2 (CDN)
- PokeAPI (https://pokeapi.co)

**Sin backend**: Toda la lógica se ejecuta en el cliente.

## Cómo ejecutar

### 1. Clonar el repositorio
```bash
git clone https://github.com/LucioBrandoni/Mundo-Pokemon
```

### 2. Abrir index.html
Abrir el archivo `index.html` en un navegador moderno.

### 3. (Opcional) Levantar un servidor local
Para evitar restricciones CORS:
- Usar Live Server en VS Code.
- O ejecutar: `python -m http.server 8000`

### 4. Despliegue en GitHub Pages
El proyecto está desplegado en: https://luciobrandoni.github.io/Mundo-Pokemon/

## Características técnicas
- **Módulos ES6**: Código organizado en módulos importables.
- **Async/Await**: Para llamadas a la PokeAPI.
- **LocalStorage**: Persistencia de datos del entrenador y Pokémon.
- **API REST**: Integración con PokeAPI para Pokémon aleatorios.
- **Validación de imágenes**: Fallback a imagen por defecto si falla la carga.

## Notas para desarrolladores
- El localStorage se limpia automáticamente al abrir la página en GitHub Pages para garantizar una experiencia consistente.
- Las imágenes de Pokémon se cargan desde múltiples fuentes de la PokeAPI con validación.
- El sistema de combate usa estadísticas base más valores aleatorios para variedad.

## Tecnologías utilizadas
- HTML5
- CSS3
- JavaScript ES6+
- SweetAlert2
- PokeAPI
- GitHub Pages

## Licencia
Proyecto educativo para el curso de JavaScript de Coderhouse.
Uso educativo y modificaciones personales permitidas.

## Autor
Lucio Brandoni - [GitHub](https://github.com/LucioBrandoni)

---
**¡Que comience tu aventura Pokémon!** 🎮
