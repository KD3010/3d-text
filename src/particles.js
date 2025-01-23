import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);


const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
const particleMaterial = new THREE.PointsMaterial({color: 0xffffff, size: 0.01, sizeAttenuation: true});

for(let i = 0; i < 10000; i++) {
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.x = (Math.random() - 0.5) *20;
    particles.y = (Math.random() - 0.5) *20;
    particles.z = (Math.random() - 0.5) *20;
    particles.geometry.attributes.position.setXYZ(i, particles.x, particles.y, particles.z);
    scene.add(particles);

}

scene.add(camera);

camera.position.z = 3;

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener('resize', () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

