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



/* =========================
   HERO CANVAS PARTICLES
========================= */

const heroSection = document.querySelector(".intro-section");
const heroCanvas = document.getElementById("hero-canvas");

if (heroSection && heroCanvas) {

  const ctx = heroCanvas.getContext("2d");

  let particles = [];
  let mouse = { x:null, y:null, radius:140 };

  function resizeCanvas(){
    heroCanvas.width = heroSection.offsetWidth;
    heroCanvas.height = heroSection.offsetHeight;
    initParticles();
  }

  class Particle{

    constructor(){
      this.size = Math.random()*2 + 1;
      this.x = Math.random()*heroCanvas.width;
      this.y = Math.random()*heroCanvas.height;
      this.vx = (Math.random()-0.5)*0.4;
      this.vy = (Math.random()-0.5)*0.4;
      this.alpha = Math.random()*0.5 + 0.3;
    }

    update(){

      this.x += this.vx;
      this.y += this.vy;

      if(this.x<0 || this.x>heroCanvas.width) this.vx *= -1;
      if(this.y<0 || this.y>heroCanvas.height) this.vy *= -1;

      if(mouse.x!==null){

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if(dist < mouse.radius){

          const angle = Math.atan2(dy,dx);
          const force = (mouse.radius-dist)/mouse.radius;

          this.x += Math.cos(angle)*force*1.2;
          this.y += Math.sin(angle)*force*1.2;

        }

      }

    }

    draw(){

      ctx.beginPath();
      ctx.fillStyle = `rgba(95,190,255,${this.alpha})`;
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fill();

    }

  }

  function initParticles(){

    particles = [];

    let count = Math.floor(heroCanvas.width/18);
    count = Math.max(25,Math.min(count,90));

    if(window.innerWidth < 768){
      count = 25;
    }

    for(let i=0;i<count;i++){
      particles.push(new Particle());
    }

  }

  function drawConnections(){

    for(let i=0;i<particles.length;i++){

      for(let j=i+1;j<particles.length;j++){

        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;

        const dist = Math.sqrt(dx*dx + dy*dy);

        if(dist < 130){

          const opacity = 1 - dist/130;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(120,200,255,${opacity*0.15})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.stroke();

        }

      }

    }

  }

  function animateCanvas(){

    ctx.clearRect(0,0,heroCanvas.width,heroCanvas.height);

    particles.forEach(p=>{
      p.update();
      p.draw();
    });

    drawConnections();

    requestAnimationFrame(animateCanvas);

  }

  heroSection.addEventListener("mousemove",(e)=>{

    const rect = heroSection.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

  });

  heroSection.addEventListener("mouseleave",()=>{
    mouse.x=null;
    mouse.y=null;
  });

  window.addEventListener("resize",resizeCanvas);

  resizeCanvas();
  animateCanvas();

}



/* =========================
   SWITCH PARCOURS
========================= */

const switchButtons = document.querySelectorAll(".switch-btn");
const panels = document.querySelectorAll(".parcours-panel");

switchButtons.forEach((button)=>{

  button.addEventListener("click",()=>{

    const target = button.dataset.target;

    switchButtons.forEach(btn=>btn.classList.remove("active"));
    button.classList.add("active");

    panels.forEach(panel=>panel.classList.remove("active"));

    const targetPanel = document.getElementById(target);

    if(targetPanel){
      targetPanel.classList.add("active");
    }

    if(window.innerWidth>992){

      if(target==="academique"){

        setTimeout(()=>{

          if(window.academicMap){
            window.academicMap.invalidateSize();
            focusAcademicLocation("paris8");
          }

        },200);

      }

      if(target==="professionnel"){

        setTimeout(()=>{

          if(window.professionalMap){
            window.professionalMap.invalidateSize();
            focusProfessionalLocation("enedis");
          }

        },200);

      }

    }

  });

});



/* =========================
   MAPS
========================= */

let focusAcademicLocation = ()=>{};
let focusProfessionalLocation = ()=>{};


if(typeof L !== "undefined" && window.innerWidth > 992){


/* =========================
   CARTE ACADÉMIQUE
========================= */

const academicMapContainer = document.getElementById("parcours-map");

if(academicMapContainer){

const academicMap = L.map("parcours-map",{zoomControl:true}).setView([46.8,2.5],5);

window.academicMap = academicMap;

L.tileLayer(
"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
{ attribution:"Esri"}
).addTo(academicMap);

const academicLocations = {

paris8:{
coords:[48.947,2.363],
zoom:16,
title:"Université Paris 8",
text:"Master 2 • Géomatique"
},

orleans:{
coords:[47.843,1.934],
zoom:14,
title:"Université d'Orléans",
text:"Licence pro SIG"
},

meknes:{
coords:[33.8935,-5.5473],
zoom:13,
title:"ISGRT Meknès",
text:"Technicien topographe"
}

};

Object.keys(academicLocations).forEach(key=>{

const loc = academicLocations[key];

L.marker(loc.coords)
.addTo(academicMap)
.bindPopup(`<div class="map-popup"><h3>${loc.title}</h3><p>${loc.text}</p></div>`);

});

focusAcademicLocation = function(key){

const loc = academicLocations[key];

if(!loc) return;

academicMap.flyTo(loc.coords,loc.zoom,{
animate:true,
duration:2.6
});

};

window.addEventListener("load",()=>{

setTimeout(()=>{
academicMap.invalidateSize();
focusAcademicLocation("paris8");
},300);

});

}



/* =========================
   CARTE PROFESSIONNELLE
========================= */

const professionalMapContainer = document.getElementById("parcours-map-alt");

if(professionalMapContainer){

const professionalMap = L.map("parcours-map-alt",{zoomControl:true}).setView([46.8,2.5],5);

window.professionalMap = professionalMap;

L.tileLayer(
"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
{ attribution:"Esri"}
).addTo(professionalMap);

const professionalLocations = {

enedis:{
coords:[48.8386,2.5579],
zoom:15,
title:"Enedis",
text:"Alternante géomaticienne"
},

terresconfluences:{
coords:[44.0408,1.1078],
zoom:14,
title:"Terres des Confluences",
text:"Stage SIG"
},

terrain:{
coords:[33.8935,-5.5473],
zoom:12,
title:"Expériences terrain",
text:"Topographie"
}

};

Object.keys(professionalLocations).forEach(key=>{

const loc = professionalLocations[key];

L.marker(loc.coords)
.addTo(professionalMap)
.bindPopup(`<div class="map-popup"><h3>${loc.title}</h3><p>${loc.text}</p></div>`);

});

focusProfessionalLocation = function(key){

const loc = professionalLocations[key];

if(!loc) return;

professionalMap.flyTo(loc.coords,loc.zoom,{
animate:true,
duration:2.6
});

};

}

}
