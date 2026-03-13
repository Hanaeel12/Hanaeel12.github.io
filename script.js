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
