(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Menú móvil */
  var navToggle = document.querySelector(".nav-toggle");
  var navMobile = document.querySelector(".nav-mobile");

  function closeMobileNav() {
    if (!navToggle || !navMobile) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
    navMobile.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") !== "true";
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      navMobile.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    navMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", function (mq) {
      if (mq.matches) closeMobileNav();
    });
  }

  /* Enlace activo según la sección visible */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* Aparición al hacer scroll */
  var revealTargets = document.querySelectorAll(".reveal");
  if (revealTargets.length && "IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Puerta: pasada de laca al elegir color y cambio de acabado */
  var door = document.querySelector("[data-door]");
  if (door) {
    var swatches = Array.prototype.slice.call(document.querySelectorAll(".swatch"));
    var finishButtons = Array.prototype.slice.call(document.querySelectorAll(".finish-toggle button"));
    var readName = document.querySelector("[data-readout-name]");
    var readCode = document.querySelector("[data-readout-code]");
    var readFinish = document.querySelector("[data-readout-finish]");
    var pendingColor = null;

    function finishSpray() {
      door.style.setProperty("--coat", door.style.getPropertyValue("--next"));
      door.classList.remove("is-spraying");
      if (pendingColor) {
        var c = pendingColor;
        pendingColor = null;
        spray(c);
      }
    }

    function spray(color) {
      if (reduceMotion) {
        door.style.setProperty("--coat", color);
        return;
      }
      if (door.classList.contains("is-spraying")) {
        pendingColor = color;
        return;
      }
      door.style.setProperty("--next", color);
      void door.offsetWidth; // reinicia la animación
      door.classList.add("is-spraying");
    }

    door.querySelector(".door-coat--next").addEventListener("animationend", finishSpray);

    function selectSwatch(btn, focus) {
      swatches.forEach(function (s) {
        var on = s === btn;
        s.setAttribute("aria-checked", String(on));
        s.tabIndex = on ? 0 : -1;
      });
      if (focus) btn.focus();
      readName.textContent = btn.dataset.name;
      readCode.textContent = btn.dataset.code;
      spray(btn.dataset.color);
    }

    function selectFinish(btn, focus) {
      finishButtons.forEach(function (b) {
        var on = b === btn;
        b.setAttribute("aria-checked", String(on));
        b.tabIndex = on ? 0 : -1;
      });
      if (focus) btn.focus();
      door.dataset.finish = btn.dataset.finish;
      readFinish.textContent = btn.textContent.toLowerCase();
    }

    /* Grupos de radio accesibles: clic y flechas */
    function wireRadioGroup(items, onSelect) {
      items.forEach(function (item, i) {
        item.tabIndex = item.getAttribute("aria-checked") === "true" ? 0 : -1;
        item.addEventListener("click", function () { onSelect(item, false); });
        item.addEventListener("keydown", function (e) {
          var delta = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1
            : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0;
          if (!delta) return;
          e.preventDefault();
          onSelect(items[(i + delta + items.length) % items.length], true);
        });
      });
    }
    wireRadioGroup(swatches, selectSwatch);
    wireRadioGroup(finishButtons, selectFinish);

    /* Primera pasada al cargar: de imprimación gris al color inicial */
    var initial = swatches.filter(function (s) { return s.getAttribute("aria-checked") === "true"; })[0];
    if (initial) setTimeout(function () { spray(initial.dataset.color); }, reduceMotion ? 0 : 700);
  }

  /* Comparador antes / después */
  document.querySelectorAll("[data-compare]").forEach(function (compare) {
    var range = compare.querySelector(".compare-range");
    function update() { compare.style.setProperty("--pos", range.value + "%"); }
    range.addEventListener("input", update);
    update();
  });

  /* Línea del proceso: se dibuja al entrar en pantalla */
  var processEl = document.querySelector("[data-process]");
  if (processEl) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var processObserver = new IntersectionObserver(function (entries, observer) {
        if (entries[0].isIntersecting) {
          processEl.classList.add("is-drawn");
          observer.disconnect();
        }
      }, { threshold: 0.4 });
      processObserver.observe(processEl);
    } else {
      processEl.classList.add("is-drawn");
    }
  }

  /* Formulario de contacto */
  var form = document.querySelector(".contact-form");
  if (form) {
    var statusBox = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');
    var DEST_EMAIL = "hola@pinturasylacadospf.es"; // PENDIENTE: correo real
    var DEST_PHONE = "665 01 31 39";

    function setError(field, message) {
      var row = field.closest(".form-row");
      row.classList.toggle("has-error", Boolean(message));
      row.querySelector(".field-error").textContent = message || "";
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validate() {
      var checks = [
        [form.querySelector("#contact-name"), function (f) { return f.value.trim() ? "" : "Indica tu nombre."; }],
        [form.querySelector("#contact-phone"), function (f) { return f.value.replace(/\D/g, "").length >= 9 ? "" : "Indica un teléfono válido (al menos 9 dígitos)."; }],
        [form.querySelector("#contact-type"), function (f) { return f.value ? "" : "Elige el tipo de trabajo."; }],
        [form.querySelector("#contact-message"), function (f) { return f.value.trim() ? "" : "Cuéntame brevemente qué necesitas."; }],
        [form.querySelector("#contact-privacy"), function (f) { return f.checked ? "" : "Necesito tu permiso para responderte."; }]
      ];
      var firstInvalid = null;
      checks.forEach(function (c) {
        var msg = c[1](c[0]);
        setError(c[0], msg);
        if (msg && !firstInvalid) firstInvalid = c[0];
      });
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    }

    function setStatus(text, type) {
      statusBox.textContent = text;
      statusBox.className = "form-status" + (type ? " is-" + type : "");
    }

    function mailtoFallback() {
      var body =
        "Nombre: " + form.nombre.value.trim() + "\n" +
        "Teléfono: " + form.telefono.value.trim() + "\n" +
        "Tipo de trabajo: " + form.tipo.value + "\n\n" +
        form.mensaje.value.trim();
      window.location.href = "mailto:" + DEST_EMAIL +
        "?subject=" + encodeURIComponent("Presupuesto desde la web: " + form.tipo.value) +
        "&body=" + encodeURIComponent(body);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var honeypot = form.querySelector('input[name="empresa-web"]');
      if (honeypot && honeypot.value) return;

      if (!validate()) {
        setStatus("Revisa los campos marcados.", "error");
        return;
      }

      if (form.dataset.backend !== "connected") {
        mailtoFallback();
        setStatus("Se abrirá tu correo para enviar la consulta.", "success");
        return;
      }

      submitBtn.disabled = true;
      setStatus("Enviando…", "");

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          setStatus("Gracias, he recibido tu mensaje. Te contestaré lo antes posible.", "success");
          form.reset();
        })
        .catch(function () {
          setStatus("No se ha podido enviar. Llámame al " + DEST_PHONE + " o escríbeme a " + DEST_EMAIL + ".", "error");
        })
        .then(function () { submitBtn.disabled = false; });
    });
  }
})();
