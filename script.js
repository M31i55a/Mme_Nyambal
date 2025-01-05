import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';


//Counter&Loader
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(CustomEase);
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
    splitTextIntoSpans(".welcome_container h1");

    function animateCounter(){
        const counterElement = document.querySelector(".counter p");
        let currentValue = 0;
        let updateInterval = 200;
        const maxDuration = 2000;
        const endValue = 100;
        const startTime = Date.now();

        function updateCounter(){
            const elapsedTime = Date.now() - startTime;
            if(elapsedTime < maxDuration){
                currentValue = Math.min(currentValue + Math.floor(Math.random() * 30) + 5, endValue);

                counterElement.textContent = currentValue;
                setTimeout(updateCounter, updateInterval);
            }
            else{
                counterElement.textContent = currentValue;
                setTimeout(() => {
                    gsap.to(counterElement, {y: -20, duration: 1, ease: "power3.out", onStart:() => {
                        revealLandingPage();
                    }});
                }, -500)
            }
        }

        updateCounter();
    }

    gsap.to(".counter p", {
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1,
        onComplete: animateCounter,
    })

    function revealLandingPage(){
        gsap.to(".hero", {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
            duration: 2,
            ease: "hop",
            onStart: () => {
                gsap.to(".hero", {
                    transform: "translate(-50%, -50%) scale(1)",
                    duration: 2.25,
                    ease: "power3.inOut",
                    delay: 0.25,
                })

                gsap.to(".overlay", {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                    duration: 2,
                    delay: 0.5,
                    ease: "hop",
                })

                gsap.to(".hero-img img", {
                    transform: "scale(1)",
                    duration: 2.25,
                    ease: "power3.inOut",
                    delay: 0.25,
                })

                gsap.to(".header h1 span", {
                    y: 0,
                    stagger: 0.1,
                    duration: 2,
                    ease: "power4.inOut",
                    delay: 0.75,
                })
            }
        })
    }
})


//svg animation
let path = document.querySelector("path");
let pathLength = path.getTotalLength();
path.style.strokeDasharray = pathLength + " " + pathLength;
path.style.strokeDashoffset = pathLength;

const welcomeElement = document.querySelector('.welcome');

window.addEventListener("scroll", function (e) {
    const welcomeTop = welcomeElement.getBoundingClientRect().top + (welcomeElement.offsetHeight / 2);
    if (welcomeTop <= window.innerHeight / 2) {
        let scrollPercentage =
        (document.documentElement.scrollTop + document.body.scrollTop) /
        (document.documentElement.scrollHeight -
        document.documentElement.clientHeight);
        let drawLength = pathLength * scrollPercentage;
    path.style.strokeDashoffset = pathLength - drawLength;
    }
});

// Fade out SVG when .home hits the top
const homeElement = document.querySelector('.home');
const svgElement = document.querySelector('svg');

window.addEventListener('scroll', () => {
  const homeTop = homeElement.getBoundingClientRect().top;
  if (homeTop <= 0) {
    const opacity = Math.max(0, 1 - (window.scrollY / window.innerHeight));
    svgElement.style.opacity = opacity;
  } else {
    svgElement.style.opacity = 1;
  }
});



//Welcome animation
let text = document.getElementById("text");
window.addEventListener("scroll", function () {
  let value = window.scrollY;
  text.style.bottom = value * -0.7 + "px";
});


const stickySections = [...document.querySelectorAll('.lifestyle .description, .inspiration .description')];
const lifestyle = document.querySelector('.lifestyle');

window.addEventListener('scroll', (e) => {
    const lifestyleTop = lifestyle.getBoundingClientRect().top;
    if (lifestyleTop <= 0) {
        for (let i = 0; i < stickySections.length; i++) {
            transform(stickySections[i]);
        }
    }
});

function transform(section) {
    const offsetTop = section.parentElement.offsetTop;
    const scrollSection = section.querySelector('.scroll_section');
    let percentage = (window.scrollY - offsetTop) / (window.innerHeight) * 100;
    scrollSection.style.transform = `translate3d(${-(percentage)}vw, 0, 0)`;
}



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
