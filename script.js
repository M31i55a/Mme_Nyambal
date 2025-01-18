import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
gsap.registerPlugin(CustomEase);

let loading = document.querySelector(".loading_page");
document.addEventListener("DOMContentLoaded", (event) => {
    let video = document.getElementById("loader-video");
    video.addEventListener("ended", function () {
      loadContent();
    });
  });

  function loadContent() {
    let video = document.getElementById("loader-video");
    video.style.opacity = 0; // Fade out the video
    setTimeout(function () {
      video.style.display = "none";
    }, 1000); // Wait for the fade-out to complete
    let content = document.getElementById("welcome_page");
    content.style.opacity = 1; // Fade in the content gradually
    loading.style.display = "none";
  }

 loading.addEventListener('wheel', (event) => {
    event.preventDefault(); 
  });


  document.addEventListener("DOMContentLoaded", () => {
    
    CustomEase.create("hop", "M0,0 C0.126,0.382 0.2,0.64 0.3,0.64 0.4,0.64 0.4,0 0.6,0 0.8,0 0.8,1 1,1");

    function splitTextIntoSpans(selector){
        let elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            let text = element.innerText;
            let textArray = text.split("");
            let spans = textArray.map(char => `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`);
            element.innerHTML = spans.join("");
        });
    }
    splitTextIntoSpans(".content_body h1");

    gsap.to(".content_body h1 span", {
        y: 0,
        stagger: 0.1,
        duration: 2,
        ease: "power4.inOut",
        delay: 6,
    })   
})


let text = document.getElementById("text");
let koleteImg = document.querySelector(".content_body .image_container")
// let p = document.querySelector("p");
window.addEventListener("scroll", function () {
  let value = window.scrollY;
  text.style.bottom = value * -0.6 + "px";
  text.style.opacity = 1 - value * 0.001;
  koleteImg.style.bottom = value * -0.45 + "px";
//   p.style.bottom = value * 0.2 + "px";
});

//about
gsap.timeline({
  scrollTrigger: {
    trigger: "#about",
    start: "3.5% top",
    end: () => innerHeight * 3.65,
    scrub: true,
    pin: "#about .description",
    anticipatePin: 1
  }
})
.set("#about img", {width: "100%"})
.set("#about .description_block:nth-child(1)", {width: 0, autoAlpha: 0})
.set("#about .block_container:nth-child(1) .image_block", {autoAlpha: 0, width: "100%", duration: 0.4})
.to("#about .block_container:nth-child(1) .image_block", {duration: 0.4, autoAlpha: 1})
.to("#about .description_block:nth-child(1)", {width: "50%"})
.to("#about .block_container:nth-child(1) .image_block", {duration: 0.4, width: "50%"})
.to("#about .description_block:nth-child(1)", {y: "-10%" ,autoAlpha: 1, duration: 1.2});

  // Pin again and set opacity to 0
  gsap.timeline({
    scrollTrigger: {
      trigger: "#about .description",
      start: "top top",
      end: () => innerHeight * 3.62,
      pin: true,
      scrub: true,
      anticipatePin: 1
    }
  })
  .to("#about .block_container:nth-child(1)", {autoAlpha: 0, duration: 0.5})
  .to("#about .block_container:nth-child(2)", { y: "-17%" ,autoAlpha: 1, duration: 1});




//lifestyle scroll
gsap.registerPlugin(ScrollTrigger);
let proxy = { skew: 0 },
    skewSetter = gsap.quickSetter("#lifestyle img", "skewY", "deg"), // fast
    clamp = gsap.utils.clamp(-5, 5); // don't let the skew go beyond 20 degrees. 

ScrollTrigger.create({
  onUpdate: (self) => {
    let skew = clamp(self.getVelocity() / -100);
    // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
    if (Math.abs(skew) > Math.abs(proxy.skew)) {
      proxy.skew = skew;
      gsap.to(proxy, {skew: 0, duration: 0.5, ease: "power2", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
    }
  }
});

// make the right edge "stick" to the scroll bar. force3D: true improves performance
gsap.set("#lifestyle img", {transformOrigin: "top center", force3D: true});


    let getRatio = el => window.innerHeight / (window.innerHeight + el.offsetHeight/2.5);

    gsap.utils.toArray("#lifestyle .description_blocks .image_blocks img").forEach((img, i) => {
      // use function-based values in order to keep things responsive
      gsap.to(img,  {
        y: () => window.innerHeight * (1 - getRatio(img)),
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: () => i ? "top bottom" : "top top", 
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true // to make it responsive
        }
      });
    });

    // make the right edge "stick" to the scroll bar. force3D: true improves performance
    gsap.set("#lifestyle .description_blocks", {transformOrigin: "right center", force3D: true});




// Stars Animation

// Get canvas and context
const canvas0 = document.getElementById('stars');
const canvas_ctx = canvas0.getContext('2d');

// Set canvas dimensions
canvas0.width = window.innerWidth;
canvas0.height = window.innerHeight + window.innerWidth;

// Mouse coordinates
const mouse0 = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

let myMouse = {
  x: undefined,
  y: undefined
};

// Particle colors
const colors = ['#2185c5', '#7ecefd', '#fff6e5', '#ffff00'];

// Mouse down flag
let mousedown = false;
window.addEventListener('mousedown', () => {
  mousedown = true;
});
window.addEventListener('mouseup', () => {
  mousedown = false;
});
window.addEventListener('mousemove', (e) => {
  myMouse.x = e.clientX;
  myMouse.y = e.clientY;
})

// Particle class
class Particles {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw1() {
    canvas_ctx.beginPath();
    canvas_ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    canvas_ctx.fillStyle = this.color;
    canvas_ctx.shadowColor = this.color;
    canvas_ctx.shadowBlur = 20;
    canvas_ctx.fill();
    canvas_ctx.closePath();
    
  }

  update() {
    // this.draw1();
  }
}

// Initialize particles
let particles = [];

function init1() {
  particles = [];

  for (let i = 0; i < 1000; i++) {
    const canvasWidth = canvas0.width * 2;
    const canvasHeight = canvas0.height * 2;
    const x = Math.random() * canvasWidth - canvasWidth / 2;
    const y = Math.random() * canvasHeight - canvasHeight / 2;
    const radius = Math.random() * 1.3;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particles.push(new Particles(x, y, radius, color));
  }
}

// Animation function
let radians = 0;
let alpha = 1;

function animate1() {
  requestAnimationFrame(animate1);
  canvas_ctx.fillStyle = `rgba(10, 10, 10, ${alpha})`;
  canvas_ctx.fillRect(0, 0, canvas0.width, canvas0.height);

  canvas_ctx.save();
  canvas_ctx.translate(canvas0.width / 2, canvas0.height / 2);
  canvas_ctx.rotate(radians);

  particles.forEach((particle) => {
    //newly added
    particle.draw1();
    particle.update();
  })

  canvas_ctx.restore();

  radians += 0.001;

  if (mousedown && alpha >= 0.1) {
    alpha -= 0.05;
    radians += 0.015;
  } else if (!mousedown && alpha < 1) {
    alpha += 0.01;
  }
  
}

// Initialize and start animation
init1();
animate1();



// 3D rendering

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 21;

const scene = new THREE.Scene();
let bee;
let mixer;
const loader = new GLTFLoader();
loader.load('/assets/microphone.glb',
  function (gltf) {
      bee = gltf.scene;
      scene.add(bee);

      mixer = new THREE.AnimationMixer(bee);
      mixer.clipAction(gltf.animations[0]).play();
      modelMove();
  },
  function (xhr) {},
  function (error) {
      console.error('An error happened', error);
  }
);

// Add lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1).normalize();
scene.add(light);

//Point light
const pointLight = new THREE.PointLight(0xffffff, 20); 
pointLight.position.set(105, 100, 100); 
scene.add(pointLight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 20); // Soft white light 
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container3D').appendChild(renderer.domElement);

// Animation loop

const animate = () => {
  scene.rotation.y += 0.005;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('scroll', () => {
      if (bee) {
      const scrollY = window.scrollY;
      scene.rotation.y = scrollY * 0.005;
      light.position.set(0, scrollY, scrollY).normalize();
      pointLight.position.set(105, scrollY, scrollY);
  }
})

//audio list
let toggle = document.querySelector('.toggle');
let menu = document.querySelector('.menu');
let audio = document.querySelectorAll('#talk_with_me .menu li');
let play_content = document.querySelector('.play_content');
let h1 = document.querySelector('#talk_with_me h1');
let content = document.querySelector(".content");
let imgBx = document.querySelector(".image_container");

toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
  content.classList.toggle('display_playing');
  h1.classList.toggle('display');
  play_content.classList.toggle('display_playing');
});

audio.forEach((audio) => {
  audio.addEventListener('click', () => {
    const currentlyPlaying = document.querySelector('.playing');
    if (currentlyPlaying) {
      currentlyPlaying.classList.remove('playing');
    }
    audio.classList.toggle('playing');
    
  });
});
