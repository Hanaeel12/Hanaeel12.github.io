/* =========================
   MENU MOBILE
========================= */
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

/* =========================
   REVEAL SCROLL
========================= */
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach((element) => {
    const windowHeight = window.innerHeight;
    const revealTop = element.getBoundingClientRect().top;

    if (revealTop < windowHeight - 100) {
      element.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
window.addEventListener("resize", revealOnScroll);


/* =========================
   GLOBAL CANVAS PARTICLES
========================= */
const siteCanvas = document.getElementById("site-bg-canvas");

if (siteCanvas) {
  const ctx = siteCanvas.getContext("2d");

  let particles = [];
  let mouse = {
    x: null,
    y: null,
    radius: 150
  };

  function resizeCanvas() {
    siteCanvas.width = window.innerWidth;
    siteCanvas.height = window.innerHeight;
    initParticles();
  }

   class Particle {
     constructor() {
       this.size = Math.random() * 2.4 + 1.4;
       this.x = Math.random() * siteCanvas.width;
       this.y = Math.random() * siteCanvas.height;
       this.vx = (Math.random() - 0.5) * 0.4;
       this.vy = (Math.random() - 0.5) * 0.4;
       this.alpha = Math.random() * 0.35 + 0.45;
     }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > siteCanvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > siteCanvas.height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;

          this.x += Math.cos(angle) * force * 1.1;
          this.y += Math.sin(angle) * force * 1.1;
        }
      }
    }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(95,190,255,${this.alpha})`;
        ctx.shadowColor = "rgba(95,190,255,0.35)";
        ctx.shadowBlur = 10;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
  }

  function initParticles() {
    particles = [];

    let count = Math.floor(window.innerWidth / 16);
    count = Math.max(45, Math.min(count, 120));

    if (window.innerWidth < 768) {
      count = 30;
    }

    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 170) {
          const opacity = 1 - dist / 140;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(120,200,255,${opacity * 0.22})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, siteCanvas.width, siteCanvas.height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animateCanvas);
  }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener("touchstart", () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  animateCanvas();
}

/* =========================
   SWITCH PARCOURS
========================= */
const switchButtons = document.querySelectorAll(".switch-btn");
const panels = document.querySelectorAll(".parcours-panel");

let focusAcademicLocation = () => {};
let focusProfessionalLocation = () => {};

switchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.target;

    switchButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    panels.forEach((panel) => panel.classList.remove("active"));

    const targetPanel = document.getElementById(target);
    if (targetPanel) {
      targetPanel.classList.add("active");
    }

    if (window.innerWidth > 992) {
      if (target === "academique" && window.academicMap) {
        setTimeout(() => {
          window.academicMap.invalidateSize();
          focusAcademicLocation("paris8");
        }, 200);
      }

      if (target === "professionnel" && window.professionalMap) {
        setTimeout(() => {
          window.professionalMap.invalidateSize();
          focusProfessionalLocation("enedis");
        }, 200);
      }
    }
  });
});

/* =========================
   CARTES (SEULEMENT DESKTOP)
========================= */
if (typeof L !== "undefined" && window.innerWidth > 992) {
  /* =========================
     CARTE ACADÉMIQUE
  ========================= */
  const academicMapContainer = document.getElementById("parcours-map");

  if (academicMapContainer) {
    const academicMap = L.map("parcours-map", {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([46.8, 2.5], 5);

    window.academicMap = academicMap;

    const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    });

    const cartoLight = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { attribution: "&copy; OpenStreetMap &copy; CARTO" }
    );

    const esriWorldImagery = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles &copy; Esri" }
    );

    esriWorldImagery.addTo(academicMap);

    const baseMapsAcademic = {
      "Orthophoto": esriWorldImagery,
      "Plan OSM": osm,
      "Fond clair": cartoLight
    };

    L.control.layers(baseMapsAcademic, null, {
      collapsed: false
    }).addTo(academicMap);

    const academicLocations = {
      paris8: {
        coords: [48.947, 2.363],
        zoom: 16,
        title: "Université Paris 8",
        text: "Master 2 • Géomatique"
      },
      orleans: {
        coords: [47.843, 1.934],
        zoom: 14,
        title: "Université d'Orléans",
        text: "Licence pro SIG"
      },
      meknes: {
        coords: [33.8935, -5.5473],
        zoom: 13,
        title: "ISGRT Meknès",
        text: "Technicien topographe"
      }
    };

    const academicMarkers = {};

    Object.keys(academicLocations).forEach((key) => {
      const loc = academicLocations[key];

      academicMarkers[key] = L.marker(loc.coords)
        .addTo(academicMap)
        .bindPopup(
          `<div class="map-popup"><h3>${loc.title}</h3><p>${loc.text}</p></div>`,
          {
            maxWidth: 200,
            minWidth: 120
          }
        );
    });

    focusAcademicLocation = function (key) {
      const loc = academicLocations[key];
      if (!loc) return;

      academicMap.closePopup();

      academicMap.flyTo(loc.coords, loc.zoom, {
        animate: true,
        duration: 3.2,
        easeLinearity: 0.25
      });

      document
        .querySelectorAll('.parcours-item[data-group="academique"]')
        .forEach((item) => item.classList.remove("active"));

      const activeItem = document.querySelector(
        `.parcours-item[data-group="academique"][data-location="${key}"]`
      );

      if (activeItem) {
        activeItem.classList.add("active");
      }
    };

    document
      .querySelectorAll('.parcours-item[data-group="academique"]')
      .forEach((item) => {
        item.addEventListener("click", () => {
          focusAcademicLocation(item.dataset.location);
        });
      });

    window.addEventListener("load", () => {
      setTimeout(() => {
        academicMap.invalidateSize();
        focusAcademicLocation("paris8");
      }, 300);
    });

    window.addEventListener("resize", () => {
      academicMap.invalidateSize();
    });
  }

  /* =========================
     CARTE PROFESSIONNELLE
  ========================= */
  const professionalMapContainer = document.getElementById("parcours-map-alt");

  if (professionalMapContainer) {
    const professionalMap = L.map("parcours-map-alt", {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([46.8, 2.5], 5);

    window.professionalMap = professionalMap;

    const osm2 = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap"
    });

    const cartoLight2 = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { attribution: "&copy; OpenStreetMap &copy; CARTO" }
    );

    const esriWorldImagery2 = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles &copy; Esri" }
    );

    esriWorldImagery2.addTo(professionalMap);

    const baseMapsProfessional = {
      "Orthophoto": esriWorldImagery2,
      "Plan OSM": osm2,
      "Fond clair": cartoLight2
    };

    L.control.layers(baseMapsProfessional, null, {
      collapsed: false
    }).addTo(professionalMap);

    const professionalLocations = {
      enedis: {
        coords: [48.8386, 2.5579],
        zoom: 15,
        title: "Enedis",
        text: "Alternante géomaticienne • Noisy-le-Grand"
      },
      terresconfluences: {
        coords: [44.0408, 1.1078],
        zoom: 14,
        title: "Terres des Confluences",
        text: "Stage SIG • Castelsarrasin"
      },
      terrain: {
        coords: [33.8935, -5.5473],
        zoom: 12,
        title: "Expériences terrain",
        text: "Topographie"
      }
    };

    const professionalMarkers = {};

    Object.keys(professionalLocations).forEach((key) => {
      const loc = professionalLocations[key];

      professionalMarkers[key] = L.marker(loc.coords)
        .addTo(professionalMap)
        .bindPopup(
          `<div class="map-popup"><h3>${loc.title}</h3><p>${loc.text}</p></div>`,
          {
            maxWidth: 200,
            minWidth: 120
          }
        );
    });

    focusProfessionalLocation = function (key) {
      const loc = professionalLocations[key];
      if (!loc) return;

      professionalMap.closePopup();

      professionalMap.flyTo(loc.coords, loc.zoom, {
        animate: true,
        duration: 3.2,
        easeLinearity: 0.25
      });

      document
        .querySelectorAll('.parcours-item[data-group="professionnel"]')
        .forEach((item) => item.classList.remove("active"));

      const activeItem = document.querySelector(
        `.parcours-item[data-group="professionnel"][data-location="${key}"]`
      );

      if (activeItem) {
        activeItem.classList.add("active");
      }
    };

    document
      .querySelectorAll('.parcours-item[data-group="professionnel"]')
      .forEach((item) => {
        item.addEventListener("click", () => {
          focusProfessionalLocation(item.dataset.location);
        });
      });

    window.addEventListener("resize", () => {
      professionalMap.invalidateSize();
    });
  }
}

/* =========================
   MOBILE / TABLETTE
========================= */
if (window.innerWidth <= 992) {
  const mapStickyBlocks = document.querySelectorAll(".map-sticky");
  mapStickyBlocks.forEach((block) => {
    block.style.display = "none";
  });
}
