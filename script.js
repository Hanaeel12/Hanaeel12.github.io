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
const introSection = document.querySelector(".intro-section");
const mouseLight = document.querySelector(".mouse-light");

if (introSection && mouseLight) {
  introSection.addEventListener("mousemove", (e) => {
    const rect = introSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseLight.style.left = `${x}px`;
    mouseLight.style.top = `${y}px`;
  });

  introSection.addEventListener("mouseleave", () => {
    mouseLight.style.left = "60%";
    mouseLight.style.top = "40%";
  });
}

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
      this.reset();
      this.x = Math.random() * heroCanvas.width;
      this.y = Math.random() * heroCanvas.height;
    }

    reset() {
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

    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
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
