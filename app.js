const P = window.PERFIL, L = window.PROYECTOS;
const $ = s => document.querySelector(s);
const esc = t => String(t ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nombresEnlace = { experiencia: 'Abrir la experiencia', repo: 'Repositorio', video: 'Ver el video' };
const estrella = c => `<svg class="star ${c}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C13 8 16 11 24 12 16 13 13 16 12 24 11 16 8 13 0 12 8 11 11 8 12 0Z"/></svg>`;
let detenerEfectoCalorTitulo = () => {};
let detenerIntercambioProyectos = () => {};

function inicio() {
  return `<section class="band"><div class="wrap">
    <div class="hero-collage">
      <canvas class="title-heat-background" aria-hidden="true"></canvas>
      <div class="hero-copy">
        <h1 class="cover-title" aria-label="La metamorfosis del Diseño"><span class="title-line"><span class="title-word">La</span> <span class="title-word">metamorfosis</span></span><span class="title-line"><span class="title-word">del</span> <span class="title-word">Dise<span class="enye">n</span>o</span></span></h1>
      </div>
      <div class="hero-art" aria-hidden="true"></div>
    </div></div></section>
  ${about()}
  <section class="band projects-negro" id="proyectos"><div class="wrap"><div class="section-heading" data-reveal><h2>Proyectos</h2></div>
    <div class="project-swap" data-reveal>
      <div class="project-stack" role="group" aria-label="Tarjetas de proyectos">
        ${L.map((p, i) => `<article class="poster poster-${(i % 5) + 1} project-swap-card" data-swap-card data-title="${esc(p.titulo)}" aria-label="Proyecto ${esc(p.titulo)}">
          <div class="poster-copy"><small>${esc(p.ano)}${p.ramo ? ` · ${esc(p.ramo)}` : ''}</small><h3>${esc(p.titulo)}</h3>${p.mostrarResumenTarjeta ? `<p class="project-swap-summary">${esc(p.resumen)}</p>` : ''}<a class="project-open-link" data-project-open href="#p-${esc(p.id)}">Ver proyecto ↗</a></div>
        </article>`).join('')}
      </div>
      <div class="project-swap-controls">
        <div class="project-swap-navigation">
          <button class="project-swap-button" data-swap-previous type="button" aria-label="Proyecto anterior">←</button>
          <span class="project-swap-status" data-swap-status aria-live="polite" aria-atomic="true"></span>
          <button class="project-swap-button" data-swap-next type="button" aria-label="Proyecto siguiente">→</button>
        </div>
      </div>
    </div>
  </div></section>
  `;
}
function about() {
  const c = P.contacto;
  return `<section class="band" id="about"><div class="wrap">
    <div class="section-heading" data-reveal><p>01 / Perfil</p><h2>Sobre mí</h2></div>
    <div class="about-layout" data-reveal>
      <div class="perfil-imagen">
        ${P.imagen ? `<img src="${esc(P.imagen)}" alt="Retrato de Fernanda Cortés">` : '<span role="img" aria-label="Monograma de Fernanda Cortés">FC</span>'}
      </div>
      <div class="about-copy"><p class="lead">${esc(P.bio)}</p>
      <div class="about-contact">
      ${c.github ? `<a class="btn alt" href="${esc(c.github)}" target="_blank" rel="noopener">GitHub</a>` : ''}
      <span class="about-email">Correo: ${esc(c.email)}</span>
      ${c.linkedin ? `<a class="btn alt" href="${esc(c.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
      </div></div>
    </div></div></section>`;
}
function proyecto(p) {
  const enl = Object.entries(p.enlaces || {}).map(([k, u], i) =>
    `<a class="btn${i ? ' alt' : ''}" href="${esc(u)}" target="_blank" rel="noopener">${nombresEnlace[k] || esc(k)}</a>`).join('');
  const contenidoDetalle = p.videoProceso
    ? `<video class="project-process-video" controls autoplay muted preload="metadata" playsinline aria-label="Video del proceso de ${esc(p.titulo)}"><source src="${esc(p.videoProceso)}" type="video/mp4">Tu navegador no admite la reproducción de video. <a href="${esc(p.videoProceso)}">Abrir el video</a>.</video>`
    : p.descripcion && p.descripcion !== p.resumen
      ? `<p class="lead">${esc(p.descripcion)}</p>`
      : '';
  const galeria = Array.isArray(p.galeria) ? p.galeria : [];
  const claseGaleria = galeria.length ? ' project-page-gallery' : '';
  const imagenesGaleria = galeria.length
    ? `<div class="project-image-gallery" role="group" aria-label="Fotografías del proyecto ${esc(p.titulo)}">${galeria.map(imagen => `<figure><img src="${esc(imagen.src)}" alt="${esc(imagen.alt)}" loading="lazy" decoding="async"></figure>`).join('')}</div>`
    : '';
  const index = L.findIndex(proyecto => proyecto.id === p.id);
  return `<div class="project-page proyecto-color-${(index % 5) + 1}${p.videoProceso ? ' project-page-video' : claseGaleria}">
  <section class="band"><div class="wrap">
    <span class="sticker">${esc(p.ano)}</span>${p.ramo ? `<span class="sticker b">${esc(p.ramo)}</span>` : ''}
    <h1>${esc(p.titulo)}</h1><p class="lead">${esc(p.resumen)}</p>${enl}
  </div></section>
  <section class="band negro"><div class="wrap">
    ${contenidoDetalle}
    ${imagenesGaleria}
    <a class="btn alt" href="#inicio">← Volver al inicio</a></div></section></div>`;
}
function render() {
  const h = location.hash.slice(1) || 'inicio';
  let html, titulo = P.nombre, activa = 'inicio', ancla = null;
  if (h === 'about') { html = inicio(); activa = 'about'; ancla = 'about'; }
  else if (h.startsWith('p-') && L.find(p => p.id === h.slice(2))) {
    const p = L.find(p => p.id === h.slice(2)); html = proyecto(p); titulo = p.titulo + ' · ' + P.nombre; activa = 'proyectos';
  } else {
    html = inicio();
    if (h === 'proyectos') { ancla = 'proyectos'; activa = 'proyectos'; }
  }
  $('#contenido').innerHTML = html; document.title = titulo;
  iniciarEfectoCalorTitulo();
  iniciarIntercambioProyectos();
  document.querySelectorAll('nav a').forEach(a => a.dataset.r === activa ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  observarBloques();
  ancla ? document.getElementById(ancla).scrollIntoView() : window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    actualizarTituloAlBajar();
    actualizarTemaBarra();
  });
}
function iniciarIntercambioProyectos() {
  detenerIntercambioProyectos();
  const stack = $('.project-stack');
  if (!stack) return;

  const cards = [...stack.querySelectorAll('[data-swap-card]')];
  const status = $('[data-swap-status]');
  const previous = $('[data-swap-previous]');
  const next = $('[data-swap-next]');
  if (!cards.length || !status || !previous || !next) {
    console.error('Project card swap controls could not be initialized.');
    return;
  }

  const movimientoReducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cambioPendiente = 0;
  let limpiezaClick = 0;
  let tarjetaArrastrada = null;
  let arrastre = null;
  let intercambiando = false;

  function actualizar() {
    const tarjetaFrontal = stack.firstElementChild;
    cards.forEach(tarjeta => {
      const esFrontal = tarjeta === tarjetaFrontal;
      tarjeta.classList.toggle('is-front', esFrontal);
      const enlace = tarjeta.querySelector('[data-project-open]');
      if (enlace) enlace.tabIndex = esFrontal ? 0 : -1;
      if (esFrontal) tarjeta.removeAttribute('aria-hidden');
      else tarjeta.setAttribute('aria-hidden', 'true');
    });
    status.textContent = tarjetaFrontal.dataset.title;
  }

  function limpiarArrastre(tarjeta) {
    tarjeta.classList.remove('is-dragging');
    tarjeta.style.removeProperty('--drag-x');
    tarjeta.style.removeProperty('--drag-y');
    tarjeta.style.removeProperty('--drag-rotation');
  }

  function cambiarTarjeta(direccion) {
    if (intercambiando) return;
    const frontal = stack.firstElementChild;
    if (!frontal) return;

    intercambiando = true;
    frontal.classList.add(direccion === 'next' ? 'is-swapping-next' : 'is-swapping-previous');

    function terminarCambio() {
      if (direccion === 'next') stack.appendChild(frontal);
      else stack.insertBefore(stack.lastElementChild, frontal);
      frontal.classList.remove('is-swapping-next', 'is-swapping-previous');
      limpiarArrastre(frontal);
      intercambiando = false;
      cambioPendiente = 0;
      actualizar();
    }

    if (movimientoReducido) terminarCambio();
    else cambioPendiente = window.setTimeout(terminarCambio, 360);
  }

  function iniciarArrastre(event) {
    if (intercambiando || (event.pointerType === 'mouse' && event.button !== 0)) return;
    if (event.target.closest('[data-project-open]')) return;
    const tarjeta = event.target.closest('[data-swap-card]');
    if (!tarjeta || tarjeta !== stack.firstElementChild) return;
    arrastre = {
      tarjeta,
      pointerId: event.pointerId,
      inicioX: event.clientX,
      inicioY: event.clientY,
      deltaX: 0,
      deltaY: 0,
      activo: false,
      cancelado: false
    };
    tarjeta.setPointerCapture(event.pointerId);
  }

  function moverArrastre(event) {
    if (!arrastre || event.pointerId !== arrastre.pointerId || arrastre.cancelado) return;
    arrastre.deltaX = event.clientX - arrastre.inicioX;
    arrastre.deltaY = event.clientY - arrastre.inicioY;

    if (!arrastre.activo) {
      if (Math.abs(arrastre.deltaY) > 16 && Math.abs(arrastre.deltaY) > Math.abs(arrastre.deltaX)) {
        arrastre.cancelado = true;
        return;
      }
      if (Math.abs(arrastre.deltaX) < 10) return;
      arrastre.activo = true;
      arrastre.tarjeta.classList.add('is-dragging');
    }

    event.preventDefault();
    arrastre.tarjeta.style.setProperty('--drag-x', `${arrastre.deltaX}px`);
    arrastre.tarjeta.style.setProperty('--drag-y', `${Math.max(-18, Math.min(18, arrastre.deltaY * .15))}px`);
    arrastre.tarjeta.style.setProperty('--drag-rotation', `${arrastre.deltaX / 24}deg`);
  }

  function finalizarArrastre(event) {
    if (!arrastre || event.pointerId !== arrastre.pointerId) return;
    const actual = arrastre;
    arrastre = null;
    if (!actual.activo) return;

    event.preventDefault();
    tarjetaArrastrada = actual.tarjeta;
    window.clearTimeout(limpiezaClick);
    limpiezaClick = window.setTimeout(() => { tarjetaArrastrada = null; }, 500);
    const umbral = Math.max(70, stack.clientWidth * .14);
    if (Math.abs(actual.deltaX) >= umbral) {
      cambiarTarjeta(actual.deltaX < 0 ? 'next' : 'previous');
    } else {
      limpiarArrastre(actual.tarjeta);
    }
  }

  function cancelarArrastre(event) {
    if (!arrastre || event.pointerId !== arrastre.pointerId) return;
    limpiarArrastre(arrastre.tarjeta);
    arrastre = null;
  }

  function manejarClickTarjeta(event) {
    if (event.target.closest('[data-project-open]')) return;
    const tarjeta = event.target.closest('[data-swap-card]');
    if (!tarjeta || tarjeta !== stack.firstElementChild) return;
    if (tarjeta === tarjetaArrastrada) {
      event.preventDefault();
      event.stopPropagation();
      tarjetaArrastrada = null;
      window.clearTimeout(limpiezaClick);
      return;
    }
    cambiarTarjeta('next');
  }

  function manejarTeclado(event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      cambiarTarjeta('next');
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      cambiarTarjeta('previous');
    }
  }

  const mostrarAnterior = () => cambiarTarjeta('previous');
  const mostrarSiguiente = () => cambiarTarjeta('next');
  stack.addEventListener('pointerdown', iniciarArrastre);
  stack.addEventListener('pointermove', moverArrastre);
  stack.addEventListener('pointerup', finalizarArrastre);
  stack.addEventListener('pointercancel', cancelarArrastre);
  stack.addEventListener('click', manejarClickTarjeta);
  stack.addEventListener('keydown', manejarTeclado);
  previous.addEventListener('click', mostrarAnterior);
  next.addEventListener('click', mostrarSiguiente);
  actualizar();

  detenerIntercambioProyectos = () => {
    stack.removeEventListener('pointerdown', iniciarArrastre);
    stack.removeEventListener('pointermove', moverArrastre);
    stack.removeEventListener('pointerup', finalizarArrastre);
    stack.removeEventListener('pointercancel', cancelarArrastre);
    stack.removeEventListener('click', manejarClickTarjeta);
    stack.removeEventListener('keydown', manejarTeclado);
    previous.removeEventListener('click', mostrarAnterior);
    next.removeEventListener('click', mostrarSiguiente);
    window.clearTimeout(cambioPendiente);
    window.clearTimeout(limpiezaClick);
  };
}
function iniciarEfectoCalorTitulo() {
  detenerEfectoCalorTitulo();
  const canvas = $('.title-heat-background');
  if (!canvas) return;
  const escena = canvas.closest('.hero-collage');
  const titulo = escena && escena.querySelector('.cover-title');
  if (!escena || !titulo) return;

  const context = canvas.getContext('2d');
  const mascara = document.createElement('canvas');
  const mascaraContext = mascara.getContext('2d', { willReadFrequently: true });
  if (!context || !mascaraContext) {
    console.error('Canvas 2D is unavailable; the title heat effect could not be initialized.');
    return;
  }

  let width = 0;
  let height = 0;
  let ratio = 1;
  let step = 16;
  let puntos = [];
  let frame = 0;
  let calor = 0;
  let calorObjetivo = 0;
  let x = 0;
  let y = 0;
  let objetivoX = 0;
  let objetivoY = 0;
  let disposed = false;
  const movimientoReducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function dibujar(time) {
    frame = 0;
    calor += (calorObjetivo - calor) * .14;
    x += (objetivoX - x) * .2;
    y += (objetivoY - y) * .2;
    context.clearRect(0, 0, width, height);

    const radio = Math.max(70, Math.min(width, height) * .45);
    puntos.forEach(punto => {
      const dx = punto.x - x;
      const dy = punto.y - y;
      const cercania = Math.max(0, 1 - Math.hypot(dx, dy) / radio);
      const intensidad = cercania * cercania * calor;
      const pulso = movimientoReducido ? 0 : (Math.sin(time * .0014 + punto.fase) + 1) * .5;
      const radioPunto = punto.tamano * (.75 + pulso * .2 + intensidad * .65);
      const alpha = .16 + pulso * (punto.brillo ? .22 : .08) + intensidad * .5;
      const verde = Math.min(255, 220 + Math.round(pulso * 28 + intensidad * 7));
      const azul = Math.min(255, 190 + Math.round(pulso * 55 + intensidad * 65));
      if (punto.brillo || intensidad > .2) {
        const radioHalo = Math.max(5, punto.tamano * (punto.brillo ? 4.8 : 3.2) + intensidad * 3);
        const halo = context.createRadialGradient(punto.x, punto.y, 0, punto.x, punto.y, radioHalo);
        const fuerzaHalo = .14 + pulso * .12 + intensidad * .25;
        halo.addColorStop(0, `rgba(255, 247, 224, ${fuerzaHalo})`);
        halo.addColorStop(.28, `rgba(255, 190, 225, ${fuerzaHalo * .55})`);
        halo.addColorStop(1, 'rgba(255, 150, 210, 0)');
        context.fillStyle = halo;
        context.fillRect(punto.x - radioHalo, punto.y - radioHalo, radioHalo * 2, radioHalo * 2);
      }
      context.beginPath();
      context.arc(punto.x, punto.y, radioPunto, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, ${verde}, ${azul}, ${alpha})`;
      context.fill();
    });

    if (!disposed && (!movimientoReducido || calorObjetivo > .01 || calor > .01)) {
      frame = requestAnimationFrame(dibujar);
    }
  }

  function programarDibujo() {
    if (!frame) frame = requestAnimationFrame(dibujar);
  }

  function redimensionar() {
    const bounds = escena.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    if (!width || !height) return;

    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * ratio);
    canvas.height = Math.ceil(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    mascara.width = Math.ceil(width);
    mascara.height = Math.ceil(height);
    mascaraContext.clearRect(0, 0, width, height);
    mascaraContext.fillStyle = '#fff';
    mascaraContext.textAlign = 'center';
    mascaraContext.textBaseline = 'middle';

    const fontSize = parseFloat(getComputedStyle(titulo).fontSize);
    const lineHeight = fontSize * .95;
    const lines = [...titulo.querySelectorAll('.title-line')];
    lines.forEach((line, index) => {
      const text = line.textContent.replace(/\s+/g, ' ').trim();
      mascaraContext.save();
      mascaraContext.translate(width / 2, height / 2);
      mascaraContext.scale(1.06, 1.06);
      mascaraContext.transform(1, 0, -Math.tan(7 * Math.PI / 180), 1, 0, 0);
      mascaraContext.font = `${fontSize}px Pixelcastle`;
      mascaraContext.fillText(text, 0, (index - (lines.length - 1) / 2) * lineHeight);
      mascaraContext.restore();
    });

    const enye = titulo.querySelector('.enye');
    if (enye) {
      const enyeBounds = enye.getBoundingClientRect();
      const sceneBounds = escena.getBoundingClientRect();
      mascaraContext.fillRect(
        enyeBounds.left - sceneBounds.left - 4,
        enyeBounds.top - sceneBounds.top - fontSize * .45,
        enyeBounds.width + 8,
        enyeBounds.height + fontSize * .5
      );
    }

    const pixels = mascaraContext.getImageData(0, 0, mascara.width, mascara.height).data;
    step = Math.max(16, Math.round(width / 55));
    puntos = [];
    const textoCerca = (px, py) => {
      const margen = Math.ceil(step * .9);
      for (let y = py - margen; y <= py + margen; y += 2) {
        for (let x = px - margen; x <= px + margen; x += 2) {
          if (x < 0 || y < 0 || x >= mascara.width || y >= mascara.height) continue;
          if (pixels[(y * mascara.width + x) * 4 + 3] > 45) return true;
        }
      }
      return false;
    };
    const variacion = semilla => {
      const valor = Math.sin(semilla * 127.1 + 311.7) * 43758.5453;
      return valor - Math.floor(valor);
    };
    const columnas = Math.ceil(width / step);
    const filas = Math.ceil(height / step);
    for (let fila = 0; fila < filas; fila++) {
      for (let columna = 0; columna < columnas; columna++) {
        const semilla = columna * 127.1 + fila * 311.7;
        if (variacion(semilla) > .58) continue;
        const px = columna * step + (fila % 2 ? step * .5 : 0) + (variacion(semilla + 1) - .5) * step * .6;
        const py = fila * step + (variacion(semilla + 2) - .5) * step * .6;
        if (px < 0 || py < 0 || px >= width || py >= height || textoCerca(Math.round(px), Math.round(py))) continue;
        puntos.push({
          x: px,
          y: py,
          fase: semilla,
          tamano: 1 + variacion(semilla + 3) * 1.35,
          brillo: variacion(semilla + 4) > .86
        });
      }
    }

    x = objetivoX = width / 2;
    y = objetivoY = height / 2;
    programarDibujo();
  }

  function moverPuntero(event) {
    const bounds = escena.getBoundingClientRect();
    objetivoX = event.clientX - bounds.left;
    objetivoY = event.clientY - bounds.top;
    calorObjetivo = .55;
    programarDibujo();
  }

  function salirDelArea() {
    calorObjetivo = 0;
    programarDibujo();
  }

  if (!movimientoReducido) {
    escena.addEventListener('pointermove', moverPuntero);
    escena.addEventListener('pointerleave', salirDelArea);
  }
  window.addEventListener('resize', redimensionar);
  detenerEfectoCalorTitulo = () => {
    disposed = true;
    window.removeEventListener('resize', redimensionar);
    escena.removeEventListener('pointermove', moverPuntero);
    escena.removeEventListener('pointerleave', salirDelArea);
    if (frame) cancelAnimationFrame(frame);
    context.clearRect(0, 0, width, height);
  };
  document.fonts.ready.then(() => {
    if (!disposed && canvas.isConnected) redimensionar();
  });
}
function actualizarTemaBarra() {
  const header = $('header');
  const bandas = [...document.querySelectorAll('#contenido .band')];
  if (!bandas.length) {
    header.dataset.theme = 'black';
    return;
  }
  const limite = header.getBoundingClientRect().bottom + 1;
  const bandaActual = bandas.find(banda => {
    const rect = banda.getBoundingClientRect();
    return rect.top <= limite && rect.bottom > limite;
  }) || bandas.find(banda => banda.getBoundingClientRect().top > limite) || bandas[bandas.length - 1];
  header.dataset.theme = bandaActual.classList.contains('negro') || bandaActual.classList.contains('projects-negro')
    ? 'black'
    : 'pink';
  const activa = location.hash.startsWith('#p-')
    ? 'proyectos'
    : bandaActual.id === 'about'
      ? 'about'
      : bandaActual.id === 'proyectos' || bandaActual.classList.contains('projects-negro')
        ? 'proyectos'
        : 'inicio';
  document.querySelectorAll('nav a').forEach(enlace => {
    if (enlace.dataset.r === activa) enlace.setAttribute('aria-current', 'page');
    else enlace.removeAttribute('aria-current');
  });
}
function actualizarTituloAlBajar() {
  const lineas = document.querySelectorAll('.cover-title .title-line');
  if (!lineas.length) return;
  if (scrollY <= 3 || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lineas.forEach(linea => linea.classList.remove('is-active'));
    return;
  }
  const recorrido = Math.max(260, Math.min(innerHeight * .7, 440));
  const progreso = Math.max(0, Math.min(1, (scrollY - 3) / recorrido));
  lineas.forEach((linea, index) => {
    const fase = progreso - index * .5;
    linea.classList.toggle('is-active', fase >= 0 && fase < .46);
  });
}
let actualizacionTituloPendiente = false;
function programarActualizacionTitulo() {
  if (actualizacionTituloPendiente) return;
  actualizacionTituloPendiente = true;
  requestAnimationFrame(() => {
    actualizacionTituloPendiente = false;
    actualizarTituloAlBajar();
    actualizarTemaBarra();
  });
}
addEventListener('scroll', programarActualizacionTitulo, { passive: true });
addEventListener('resize', programarActualizacionTitulo);
let observadorBloques;
function observarBloques() {
  if (observadorBloques) observadorBloques.disconnect();
  const bloques = document.querySelectorAll('[data-reveal]');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    bloques.forEach(bloque => bloque.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: .12 });
  observadorBloques = observer;
  bloques.forEach(bloque => observer.observe(bloque));
}
$('#marca').textContent = P.nombre;
$('#pie').textContent = '© ' + new Date().getFullYear() + ' ' + P.nombre;
addEventListener('hashchange', render); render();
