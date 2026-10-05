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

- Teléfono y WhatsApp: 665 01 31 39
- Zona: toda Mallorca, con base en Porto Cristo (Manacor, 07680). Tiene furgoneta grande para recoger y entregar piezas.

## Pendiente de datos del cliente

Busca `PENDIENTE` en el código y `class="pending"` en las páginas legales.

| Dato | Dónde |
|---|---|
| Correo (ahora `hola@pinturasylacadospf.es`) | `index.html` y `main.js` (`DEST_EMAIL`) |
| Nombre completo, NIF, dirección fiscal | las tres páginas legales |
| Dominio (ahora `pinturasylacadospf.es`) | `canonical` y `og:url` de cada página, `robots.txt`, `sitemap.xml` |
| Fotos | ver abajo |

## Fotos

Ahora mismo la web no usa fotografías: la puerta del inicio, las muestras de color y el mueble de "Antes y después" están hechos con CSS.

Cuando lleguen las fotos reales:
1. **Antes y después**: sustituir el contenido de `.compare-before` y `.compare-after` por un `<img>` de cada foto (mismo encuadre en las dos). El control deslizante funciona igual.
2. **Galería de trabajos**: añadir una sección nueva después de "Antes y después".
3. **og:image** (1200x630) para compartir en redes.

Procesarlas con el pipeline de Pillow del proyecto Lacats Amengual (recorte, mejora y exportación a `.jpg` + `.webp`).

## Interacciones

- **Puerta del inicio**: al elegir un color se aplica una "pasada de laca" de arriba abajo. Mate, satinado y brillo cambian el reflejo. Funciona con teclado (flechas).
- **Antes y después**: comparador con un `<input type="range">` invisible encima, así funciona con ratón, dedo y teclado.
- **Cómo trabajo**: la línea entre los pasos se dibuja al aparecer en pantalla.
- Todo respeta `prefers-reduced-motion`.

## Despliegue (pendiente)

1. Repositorio en GitHub, conectado a Netlify (sin build, publicar la raíz).
2. **Crear la notificación por email del formulario** (Netlify no la crea sola, ver el playbook de Netlify).
3. Dominio + SSL, Search Console, Google Business Profile.
