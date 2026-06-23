# Cart•AI - Diseño Final y Arquitectura de la Landing Page

Este documento recopila la estrategia de diseño estético, decisiones de interfaz y la estructura técnica modular acordada para el frontend de **Cart•AI**.

---

## 1. Identidad Visual y Sistema de Diseño

### Paleta Cromática Estricta

Para evitar inconsistencias visuales y garantizar una integración limpia con los assets de marca, se define el siguiente esquema de color:

- **Fondo Principal (`#f8f9fa`):** Tono crema-hueso exacto extraído del logo original. Se utiliza en toda la landing page para fundir de manera nativa los bordes del logo sin recurrir a parches de opacidad o mezclas de color complejas.
- **Color Primario (`#0a192f`):** Azul marino profundo (extraído del texto "Cart"). Garantiza la máxima legibilidad en textos largos, títulos principales y componentes estructurales.
- **Color de Acento (`#e85d04`):** Naranja vibrante (extraído de las ruedas y el punto del logo). Su uso queda restringido exclusivamente a elementos de interacción crítica y llamadas a la acción (_Call to Action_ o CTA), asegurando que resalten inmediatamente sobre el fondo suave.

### Tipografía

- **Títulos principales y encabezados:** `Urbanist` (fuente sans-serif geométrica que aporta limpieza y modernidad).
- **Cuerpo de texto y descripciones:** `Lato` (fuente humanista optimizada para legibilidad en entornos web).

---

## 2. Integración de Assets Gráficos

### Gestión del Logo (Estrategia SVG)

- **Formato:** Uso obligatorio de la versión vectorial con fondo transparente para evitar problemas de escalado y pixelado en pantallas de alta densidad (Retina/4K).
- **Pipeline de Carga (Vite + TS):** Integración mediante el plugin `vite-plugin-svgr`. Permite importar y manipular el SVG directamente como si fuera un componente React.
- **Automatización contra Contenido Basura:** Se configura el optimizador **SVGO** en el archivo `vite.config.ts` mediante la regla `removeElements` para interceptar y destruir de manera automática la etiqueta `<ContainsAiGeneratedContent>` inyectada por herramientas de IA. Esto previene errores de referencia (`ReferenceError`) en tiempo de compilación sin requerir edición manual archivo por archivo.

---

## 3. Arquitectura de Componentes (Feature-Driven)

Para evitar la creación de un monolito visual inmanejable, la landing page se fragmenta siguiendo el patrón de desarrollo orientado a características (**FDD**):

```text
src/
├── components/             # UI Global y reutilizable (sin estado de negocio)
│   ├── ui/                 # Componentes atómicos (Button, Input, Badge)
│   └── layout/             # Estructuras de contenedor de página
├── features/               # Dominios aislados por lógica de negocio
│   └── landing/            # Módulo exclusivo de la página de bienvenida
│       ├── components/     # Navbar.tsx, HeroSection.tsx, FeatureCard.tsx
│       └── LandingPage.tsx # Componente orquestador
├── routes/                 # Centralización del enrutamiento
│   └── index.tsx
├── App.tsx                 # Inicializador de proveedores globales (Router)
└── main.tsx                # Punto de entrada al DOM
```

# Resumen de Estado Frontend: Cart•AI

## 1. Diseño y Arquitectura Base

- **Documentación:** Generado `cart-ai-diseno-arquitectura.md` con paleta estricta (`#f8f9fa`, `#0a192f`, `#e85d04`) y tipografía (Urbanist, Lato).
- **Assets:** Estrategia SVG establecida para el logo mediante `vite-plugin-svgr` y limpieza automática de metadatos con `SVGO`.
- **Estructura:** Implementación de Feature-Driven Development (FDD) en `src/features/landing/`.

## 2. Componentes UI (Landing Page)

Construidos e integrados los siguientes componentes puramente visuales:

- `Navbar.tsx`: Navegación principal y selector de idioma.
- `HeroSection.tsx`: Bloque de impacto principal.
- `FeatureCard.tsx`: Componente atómico para iterar características.
- `Footer.tsx`: Cierre estandarizado.
- `LandingPage.tsx`: Orquestador principal que ensambla la vista.

## 3. Internacionalización (i18n)

- **Tecnología:** `react-i18next`.
- **Configuración:** Creado motor de arranque en `config.ts` e inyectado en `main.tsx`.
- **Diccionarios:** Generados `en.json` y `es.json` aislando todos los textos de la interfaz.
- **Integración:** Refactorizados todos los componentes de la Landing Page para consumir el hook `useTranslation`.

---

## ⚠️ Estado Crítico y Siguientes Pasos

La vista actual es **estática y no enrutable**. Es un callejón sin salida arquitectónico hasta que se aplique la capa de navegación.

Acabar esto:

## Motor de Estado Global

- **Tecnología:** `zustand`.
- **Implementación:** Creado `cartStore.ts` con tipado estricto (`Product`, `CartItem`) y métodos inmutables (`addItem`, `removeItem`, `clearCart`).
- **Estado:** Conectado a `Navbar.tsx` para conteo reactivo.

**Tareas para el próximo agente:**

1. Instalar y configurar `react-router-dom` en `App.tsx`.
2. Extraer `Navbar` y `Footer` a un `MainLayout.tsx` global para persistencia de estado.
3. Crear vista `/catalog` para inyectar productos mock y validar el flujo real de Zustand.
4. Conectar con el backend para LOGAR y CREAR usuarios
