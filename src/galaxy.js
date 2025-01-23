import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui'

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/3d-text/star_04.png");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100);

// Parameters
const parameters = {}
parameters.particleCount = 10000;
parameters.particleSize = 0.03;
parameters.radius = 6; 
parameters.branches = 3;
parameters.spin = 1.5;
parameters.randomness = 3;
parameters.outsideColor = "#1b3984"
parameters.insideColor = "#fb3984"

// Generate Galaxy function
let geometry;
let material;
let points;
const generateGalaxy = () => {
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.particleCount * 3);
    const colors = new Float32Array(parameters.particleCount * 3);

    if(points !== null) {
        geometry.dispose();
        scene.remove(points);
    }

    const innerColor = new THREE.Color(parameters.insideColor);
    const outerColor = new THREE.Color(parameters.outsideColor)

    for(let i=0; i < parameters.particleCount; i++) {
        const j = i*3;
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const angle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
        // Position
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1);

        positions[j] = Math.cos(angle + spinAngle) * radius + randomX
        positions[j+1] = randomY
        positions[j+2] = Math.sin(angle + spinAngle) * radius + randomZ

        // Color
        const mixedColor = innerColor.clone()
        mixedColor.lerp(outerColor, radius / parameters.radius)
        console.log(mixedColor)

        colors[j] = mixedColor.r
        colors[j+1] = mixedColor.g
        colors[j+2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size: parameters.particleSize,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.ActivateBlending,
        vertexColors: true
    })

    points = new THREE.Points(geometry, material)
    scene.add(points);
}

generateGalaxy()

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// lil gui
const gui = new GUI();
const particleFolder = gui.addFolder('Particles')
particleFolder.add(parameters, "particleCount").min(100).max(100000).step(100).onFinishChange(generateGalaxy)
particleFolder.add(parameters, "particleSize").min(0.01).max(0.1).step(0.01).onFinishChange(generateGalaxy)
particleFolder.add(parameters, "radius").min(1).max(20).step(1).onFinishChange(generateGalaxy)
particleFolder.add(parameters, "branches").min(3).max(10).step(1).onFinishChange(generateGalaxy)
particleFolder.add(parameters, "spin").min(0).max(5).step(0.1).onFinishChange(generateGalaxy)
particleFolder.add(parameters, "randomness").min(0).max(5).step(0.1).onFinishChange(generateGalaxy)
particleFolder.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
particleFolder.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

// Scene controls
const sceneFolder = gui.addFolder('Scene');
const sceneSettings = {
    backgroundColor: '#000000'
};
sceneFolder.addColor(sceneSettings, 'backgroundColor').onChange((value) => {
    scene.background = new THREE.Color(value);
});

camera.position.z = 8;
camera.position.y = 6;

scene.add(camera);

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene, camera)
}

animate()