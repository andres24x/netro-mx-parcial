/* ============================================================
   NETRO MX — Portafolio del Parcial · Equipo 8
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Fondo animado (respaldo y base del video) ---------- */
  (function bg() {
    var c = document.getElementById('bg-canvas');
    if (!c) return;
    var ctx = c.getContext('2d'), w, h, dpr, nodes = [], t = 0, raf;

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }
    function build() {
      var count = Math.max(26, Math.min(64, Math.round((w * h) / 26000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - .5) * .19, vy: (Math.random() - .5) * .19,
          r: Math.random() * 1.5 + .5,
          hot: Math.random() < .18
        });
      }
    }
    function draw() {
      t += .004;
      ctx.clearRect(0, 0, w, h);

      // halos suaves en movimiento
      var g1 = ctx.createRadialGradient(
        w * (.28 + Math.sin(t) * .1), h * (.2 + Math.cos(t * .8) * .09), 0,
        w * .3, h * .2, Math.max(w, h) * .62);
      g1.addColorStop(0, 'rgba(255,122,51,.16)');
      g1.addColorStop(1, 'rgba(255,122,51,0)');
      ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);

      var g2 = ctx.createRadialGradient(
        w * (.78 + Math.cos(t * .7) * .08), h * (.82 + Math.sin(t * .9) * .07), 0,
        w * .78, h * .82, Math.max(w, h) * .55);
      g2.addColorStop(0, 'rgba(90,120,255,.10)');
      g2.addColorStop(1, 'rgba(90,120,255,0)');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);

      // red de nodos = el mapa de la plataforma
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 155) {
            ctx.strokeStyle = 'rgba(255,255,255,' + (0.09 * (1 - d / 155)).toFixed(3) + ')';
            ctx.lineWidth = .6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        var pulse = n.hot ? (Math.sin(t * 9 + k) * .3 + .7) : 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, 6.2832);
        ctx.fillStyle = n.hot
          ? 'rgba(255,122,51,' + (0.85 * pulse).toFixed(2) + ')'
          : 'rgba(255,255,255,.3)';
        ctx.fill();
        if (n.hot) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 5 * pulse, 0, 6.2832);
          ctx.strokeStyle = 'rgba(255,122,51,.14)'; ctx.lineWidth = .7; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    }
    window.addEventListener('resize', size);
    size();
    if (reduce) { draw(); cancelAnimationFrame(raf); } else { draw(); }

    // el video sólo aparece si realmente carga
    var v = document.getElementById('bg-video');
    if (v && !reduce) {
      v.addEventListener('canplay', function () { v.classList.add('ready'); });
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    }
  })();

  /* ---------- 2. Actividades ---------- */
  var ACTS = [
    {
      n: '01', type: 'XLSX',
      title: 'Lienzo de Disrupción Digital y Modelos de Ingresos',
      what: 'El punto de partida. Desarmamos el subsector de prensa en cinco bloques: cómo operaba y cobraba antes, qué tecnología lo rompió, cómo funciona hoy, de dónde salen los ingresos ahora y quién ganó y quién perdió en el cambio.',
      learn: 'Lo que más nos marcó: el papel no cayó por falta de lectores, cayó porque imprimir, distribuir y colocar en punto de venta dejó de tener sentido frente a un costo digital casi nulo.',
      files: [{ f: '01-lienzo-disrupcion-digital-prensa.xlsx', label: 'Lienzo completo', size: '10 KB' }]
    },
    {
      n: '02', type: 'PDF',
      title: 'Bases del proyecto y propuesta de modelo de negocio',
      what: 'La actividad donde pasamos del diagnóstico a la propuesta. Aquí se define qué es NETRO MX, cómo navega el usuario (México → Estado → Municipio → Servidor), el mapa de accidentes y reportes con GPS, la prensa local por municipio, los foros comunitarios y la regla “sin seguidores”.',
      learn: 'Definir el modelo obligó a decidir algo raro para una plataforma: renunciar a los seguidores. Sin ellos, la visibilidad tiene que calcularse por relevancia, utilidad y participación — no por popularidad comprada.',
      files: [{ f: '02-bases-y-modelo-de-negocio-netro-mx.pdf', label: 'Bases + modelo de negocio', size: '748 KB' }]
    },
    {
      n: '03', type: 'HTML',
      title: 'Informe de Tendencias de Marca (Google Trends)',
      what: 'Medición de la categoría en México a 12 meses: interés en el tiempo, posicionamiento geográfico por subregión y consultas y temas relacionados, comparando “acontecimientos locales” contra periódicos locales y X. Incluye ficha del proyecto, dashboard ejecutivo y diagnóstico de branding.',
      learn: 'Las consultas en auge —accidentes, eventos, lugares cercanos, reportes ciudadanos— apuntaban todas al mismo lado: la gente ya busca información local con intención de ubicación. Ahí confirmamos las tres zonas prioritarias.',
      files: [{ f: '03-informe-tendencias-de-marca.html', label: 'Informe interactivo', size: '63 KB' }]
    },
    {
      n: '04', type: 'DOCX',
      title: 'Cuadro de Resultados de la Investigación',
      what: 'La evaluación formal, tendencia por tendencia, de qué tan bien la cubren los competidores: tiempo real, mapa y ubicación, reportes ciudadanos, comunidad local, información geolocalizada y negocios cercanos. Cada fila con calificación y observaciones.',
      learn: 'El cuadro separó lo que hay que mantener de lo que hay que construir. La comunidad local ya está bien atendida por ambos; el mapa, la información geolocalizada y los negocios cercanos no los resuelve nadie de forma estructurada.',
      files: [{ f: '04-cuadro-de-resultados-investigacion.docx', label: 'Cuadro + conclusión', size: '16 KB' }]
    },
    {
      n: '05', type: 'PDF',
      title: 'Informe de investigación: creación con perspectiva humanista',
      what: 'Investigación sobre responsabilidad social en plataformas cívicas y de información local. Revisa siete marcos activos entre 2025 y 2026 —periodismo constructivo, Civic Signals, gobernanza prosocial, tecnología humana, verificación comunitaria, alfabetización mediática de la UNESCO e infraestructura cívica digital— y los traduce en siete estrategias aplicadas a NETRO MX.',
      learn: 'Aquí nos tocó ser honestos con nuestro propio proyecto: preguntarnos si la plataforma ayudaría a la gente a entender su entorno o sólo la mantendría pegada a la pantalla. Varias de las siete estrategias salieron de admitir lo que aún nos faltaba.',
      files: [{ f: '05-informe-de-investigacion-humanista.pdf', label: 'Informe completo', size: '2.9 MB' }]
    },
    {
      n: '06', type: 'HTML',
      title: 'Prototipo web de NETRO MX',
      what: 'La propuesta hecha producto: navegación por mapa, el feed de “lo que está pasando”, el flujo para levantar un reporte, el dashboard comunitario, la sección de negocios y la lógica de publicación sin seguidores. Es el prototipo navegable del modelo descrito en la actividad 02.',
      learn: 'Bajar la idea a pantallas reveló las decisiones que en papel se pueden esquivar: qué ve primero el usuario, cómo se confirma un reporte y cómo se muestra utilidad sin caer en métricas de vanidad.',
      files: [
        { f: '06-prototipo-netro-mx.html', label: 'Prototipo', size: '88 KB' },
        { f: '07-prototipo-netro-mx-version-bundle.html', label: 'Versión empaquetada', size: '670 KB' }
      ]
    }
  ];

  var dlIcon = '<svg class="ico" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>';

  var grid = document.getElementById('acts-grid');
  if (grid) {
    grid.innerHTML = ACTS.map(function (a) {
      var btns = a.files.map(function (f) {
        return '<a class="dl glass r-full hoverable" href="' + f.f + '" download>' +
          '<span>' + f.label + '</span><span class="sz">' + f.size + '</span>' +
          '<span class="circle">' + dlIcon + '</span></a>';
      }).join('');
      return '<article class="act glass r-3xl reveal">' +
        '<div class="act-top"><span class="act-num">ACTIVIDAD ' + a.n + '</span>' +
        '<span class="act-type">' + a.type + '</span></div>' +
        '<h3>' + a.title + '</h3>' +
        '<p class="what">' + a.what + '</p>' +
        '<p class="learn">' + a.learn + '</p>' +
        '<div class="act-foot">' + btns + '</div>' +
        '</article>';
    }).join('');
  }

  /* ---------- 3. Integrantes ---------- */
  var TEAM = [
    { name: 'Yolssen Ares Yañez Rendón',        ini: 'YY' },
    { name: 'Juan Pablo Sotelo Rayas',          ini: 'JS' },
    { name: 'Andrés Arturo Figueroa Valdivia',  ini: 'AF' },
    { name: 'Christopher Josué Jaregui Ayala',  ini: 'CJ' },
    { name: 'Gael Fernando Tejeda Chávez',      ini: 'GT' },
    { name: 'Saúl Francisco Contreras de Anda', ini: 'SC' }
  ];

  function letters(str) {
    var out = '', i = 0;
    for (var c = 0; c < str.length; c++) {
      var ch = str[c];
      if (ch === ' ') { out += '<span class="sp"></span>'; continue; }
      out += '<span class="ch" style="transition-delay:' + (260 + i * 22) + 'ms">' + ch + '</span>';
      i++;
    }
    return out;
  }

  var tg = document.getElementById('team-grid');
  if (tg) {
    tg.innerHTML = TEAM.map(function (m, i) {
      var idx = ('0' + (i + 1)).slice(-2);
      return '<article class="member glass r-3xl" style="transition-delay:' + (i * 95) + 'ms">' +
        '<span class="aura"></span><span class="glow"></span><span class="sheen"></span>' +
        '<div class="m-head">' +
          '<div class="mono-badge"><span class="orbit"></span>' + m.ini + '</div>' +
          '<div><div class="m-idx">' + idx + ' / 06</div>' +
          '<div class="m-role">Integrante</div></div>' +
        '</div>' +
        '<h3 class="m-name">' + letters(m.name) + '</h3>' +
        '<div class="m-foot"><span class="m-bar"></span><span class="m-tag">EQUIPO 8</span></div>' +
        '</article>';
    }).join('');
  }

  /* ---------- 4. Reveal al hacer scroll ---------- */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' }) : null;

  var targets = document.querySelectorAll('.reveal, .member');
  if (io) { Array.prototype.forEach.call(targets, function (el) { io.observe(el); }); }
  else { Array.prototype.forEach.call(targets, function (el) { el.classList.add('in'); }); }

  /* ---------- 5. Tilt 3D + resplandor que sigue al cursor ---------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('.member'), function (card) {
      var raf = null, tx = 0, ty = 0;
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
        tx = (py - .5) * -11; ty = (px - .5) * 13;
        if (!raf) raf = requestAnimationFrame(function () {
          raf = null;
          card.style.transform = 'perspective(900px) rotateX(' + tx + 'deg) rotateY(' + ty +
            'deg) translateY(-7px) scale(1.025)';
        });
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('.act'), function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* ---------- 6. Parallax suave del hero ---------- */
  if (!reduce) {
    var center = document.querySelector('.hero-center');
    var onScroll = function () {
      var y = window.scrollY;
      if (center && y < window.innerHeight) {
        center.style.transform = 'translateY(' + (y * 0.16) + 'px)';
        center.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.8)));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
