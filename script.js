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

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach((element) => {
    const windowHeight = window.innerHeight;
    const revealTop = element.getBoundingClientRect().top;
    const revealPoint = 100;

    if (revealTop < windowHeight - revealPoint) {
      element.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* =========================
   HERO CANVAS
========================= */
const heroSection = document.querySelector(".intro-section");
const heroCanvas = document.getElementById("hero-canvas");

if (heroSection && heroCanvas) {
  const ctx = heroCanvas.getContext("2d");

  let particles = [];
  let mouse = {
    x: null,
    y: null,
    radius: 140
  };

  function resizeCanvas() {
    heroCanvas.width = heroSection.offsetWidth;
    heroCanvas.height = heroSection.offsetHeight;
    initParticles();
  }

  class Particle {
    constructor() {
      this.size = Math.random() * 2.2 + 1.2;
      this.x = Math.random() * heroCanvas.width;
      this.y = Math.random() * heroCanvas.height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.alpha = Math.random() * 0.5 + 0.35;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > heroCanvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > heroCanvas.height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += Math.cos(angle) * force * 1.4;
          this.y += Math.sin(angle) * force * 1.4;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.fillStyle = `rgba(95, 190, 255, ${this.alpha})`;
      ctx.shadowColor = "rgba(95, 190, 255, 0.35)";
      ctx.shadowBlur = 10;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    particles = [];
    let count = Math.floor(heroCanvas.width / 18);
    count = Math.max(45, Math.min(count, 95));

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

        if (dist < 130) {
          const opacity = 1 - dist / 130;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(120, 200, 255, ${opacity * 0.16})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseGlow() {
    if (mouse.x === null || mouse.y === null) return;

    const gradient = ctx.createRadialGradient(
      mouse.x,
      mouse.y,
      0,
      mouse.x,
      mouse.y,
      180
    );

    gradient.addColorStop(0, "rgba(124, 196, 255, 0.12)");
    gradient.addColorStop(0.4, "rgba(143, 211, 193, 0.07)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
    ctx.fill();
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    drawMouseGlow();

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    drawConnections();
    requestAnimationFrame(animateCanvas);
  }

  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroSection.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  animateCanvas();
}

/* =========================
   CARTE PARCOURS LEAFLET
========================= */
const mapContainer = document.getElementById("parcours-map");

if (mapContainer && typeof L !== "undefined") {
  const parcoursMap = L.map("parcours-map", {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([46.8, 2.5], 5);

  /* Fonds de carte */
  const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
  });

  const cartoLight = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO"
  });

  const esriWorldImagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles &copy; Esri"
    }
  );

  /* Fond affiché par défaut */
  esriWorldImagery.addTo(parcoursMap);

  /* Contrôle de couches */
  const baseMaps = {
    "Orthophoto": esriWorldImagery,
    "Plan OSM": osm,
    "Fond clair": cartoLight
  };

  L.control.layers(baseMaps, null, {
    collapsed: false
  }).addTo(parcoursMap);

  const locations = {
    paris8: {
      coords: [48.947, 2.363],
      zoom: 16,
      title: "Université Paris 8",
      text: "Master Géomatique • Alternance chez Enedis"
    },
    orleans: {
      coords: [47.843, 1.934],
      zoom: 14,
      title: "Université d'Orléans",
      text: "Licence pro topographie, cartographie et SIG"
    },
    meknes: {
      coords: [33.8935, -5.5473],
      zoom: 13,
      title: "ISGRT de Meknès",
      text: "Technicien spécialisé en topographie"
    }
  };

  const markers = {};

  Object.keys(locations).forEach((key) => {
    const loc = locations[key];

    const popupContent = `
      <div class="map-popup">
        <h3>${loc.title}</h3>
        <p>${loc.text}</p>
      </div>
    `;

  markers[key] = L.marker(loc.coords)
    .addTo(parcoursMap)
    .bindPopup(popupContent,{
        maxWidth: 200,
        minWidth: 120
    });

  function focusLocation(key) {
    const loc = locations[key];
    if (!loc) return;
  
    parcoursMap.closePopup();
  
    parcoursMap.flyTo(loc.coords, loc.zoom, {
      animate: true,
      duration: 3.8,
      easeLinearity: 0.25
    });
  
    document.querySelectorAll(".parcours-item").forEach((item) => {
      item.classList.remove("active");
    });
  
    const activeItem = document.querySelector(
      `.parcours-item[data-location="${key}"]`
    );
  
    if (activeItem) {
      activeItem.classList.add("active");
    }
  }

  document.querySelectorAll(".parcours-item").forEach((item) => {
    item.addEventListener("click", () => {
      const key = item.dataset.location;
      focusLocation(key);
    });
  });

  window.addEventListener("load", () => {
    setTimeout(() => {
      parcoursMap.invalidateSize();
      focusLocation("paris8");
    }, 300);
  });

  window.addEventListener("resize", () => {
    parcoursMap.invalidateSize();
  });
}

/* Popup Leaflet plus compact et aux couleurs du site */
.leaflet-popup-content-wrapper {
  border-radius: 18px !important;
  padding: 0 !important;
  overflow: hidden;
  box-shadow: 0 14px 35px rgba(46, 94, 138, 0.18) !important;
  border: none !important;
  background: transparent !important;
}

.leaflet-popup-content {
  margin: 0 !important;
  min-width: 0 !important;
}

.leaflet-popup-tip {
  background: linear-gradient(135deg, #8bcfff, #9fdfcf) !important;
}

.map-popup {
  background: linear-gradient(135deg, #8bcfff, #9fdfcf);
  color: #17415f;
  padding: 12px 14px;
  font-family: Arial, Helvetica, sans-serif;
  border-radius: 18px;
  min-width: 180px;
  max-width: 220px;
}

.map-popup h3 {
  margin: 0 0 4px 0;
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.3;
}

.map-popup p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.45;
  color: #24506d;
}

.leaflet-popup-close-button {
  color: #17415f !important;
  font-weight: bold;
  padding: 6px 8px 0 0 !important;
}
