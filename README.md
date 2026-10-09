# Pinturas y Lacados PF: web estática

Web de una sola página para un lacador y pintor autónomo. HTML, CSS y JavaScript sin framework ni build. Pensada para Netlify (formulario con Netlify Forms).

## Archivos

```
index.html                 página principal
aviso-legal.html           páginas legales (con datos pendientes marcados)
politica-privacidad.html
politica-cookies.html
styles.css                 todo el CSS (colores en :root, modo oscuro automático)
main.js                    menú, puerta interactiva, comparador, formulario
robots.txt, sitemap.xml, site.webmanifest
assets/favicon.svg
```

Para verla en local: `python -m http.server 8080` y abrir http://localhost:8080.

## Datos del negocio

- Titular: Llorenç Peñas Santandreu (autónomo), NIF 41.574.884-S
- Domicilio fiscal: C/ Ponent, 21 A, 07680 Porto Cristo (Manacor). Solo aparece en las páginas legales; en la web y en el JSON-LD figura la localidad, porque trabaja a domicilio.
- Teléfono y WhatsApp: 665 01 31 39
- Correo: llorensps94@gmail.com (recibe también los avisos del formulario)
- Más de 10 años de experiencia. Horario: lunes a viernes de 7:00 a 15:00; por la tarde si el trabajo lo requiere.
- Zona: toda Mallorca, con base en Porto Cristo (Manacor, 07680). Tiene furgoneta grande para recoger y entregar piezas.

## Pendiente de datos del cliente

Busca `PENDIENTE` en el código.

| Dato | Dónde |
|---|---|
| Dominio (ahora `pinturasylacadospf.es`) | `canonical` y `og:url` de cada página, `robots.txt`, `sitemap.xml` |
| Fotos | ver abajo |
| Reseñas de Google | hueco marcado con `PENDIENTE` antes de las preguntas frecuentes; añadir también `aggregateRating` real al JSON-LD |

## Fotos

Ahora mismo la web no usa fotografías: la puerta del inicio, las muestras de color y el mueble de "Antes y después" están hechos con CSS. La imagen para compartir (`assets/og-image.jpg`) es una captura de la portada; cámbiala por una foto real cuando la haya.

Cuando lleguen las fotos reales:
1. **Antes y después**: sustituir el contenido de `.compare-before` y `.compare-after` por un `<img>` de cada foto (mismo encuadre en las dos). El control deslizante funciona igual.
2. **Galería de trabajos**: añadir una sección nueva después de "Antes y después".
3. **og:image** (1200x630) para compartir en redes.

Procesarlas con el pipeline de Pillow del proyecto Lacats Amengual (recorte, mejora y exportación a `.jpg` + `.webp`).

## Interacciones

- **Puerta del inicio**: al elegir un color se aplica una "pasada de laca" de arriba abajo. Mate y satinado cambian el reflejo. Funciona con teclado (flechas).
- **Antes y después**: comparador con un `<input type="range">` invisible encima, así funciona con ratón, dedo y teclado.
- **Cómo trabajo**: la línea entre los pasos se dibuja al aparecer en pantalla.
- Todo respeta `prefers-reduced-motion`.

## Despliegue

- Netlify: sitio `pinturas-lacados-pf` (id `d3e6570b-15bd-4d07-ab05-f98365a8f65a`), https://pinturas-lacados-pf.netlify.app
- Despliegue automático: cada push a `main` en GitHub publica la web (sin build, se publica la raíz).
- Formulario `contacto` registrado en Netlify Forms y probado con un envío real.
- Aviso por email de cada envío a llorensps94@gmail.com (hook `submission_created`, creado el 2026-10-09).
- Revisar de vez en cuando la carpeta **Spam** del formulario en Netlify: los envíos marcados como spam no disparan la notificación por email.
- Cabeceras de seguridad y caché en `netlify.toml`. El distintivo "Built with Netlify" está desactivado (inyectaba un script que la CSP bloquea).
- Lighthouse móvil (2026-10-05): rendimiento 97, accesibilidad 100, buenas prácticas 100, SEO 100.

Pendiente:
1. Dominio + SSL, Search Console, Google Business Profile.

## Logo

`assets/favicon.svg` y el SVG de `.brand-mark` en cada página: silueta de una F cuyo ojo de P queda cerrado entre los dos brazos (P y F fusionadas). Los colores salen de `--accent` / `--on-accent`, así que cambia solo con el modo oscuro.
