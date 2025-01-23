import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import GUI from 'lil-gui';

const fontLoader = new FontLoader();
const textureLoader = new THREE.TextureLoader()

const matcapTexture = textureLoader.load('/matcaps/matcap2-512.png')
console.log(matcapTexture);
fontLoader.load('/fonts/playwrite.json', (font) => {
    console.log(font);
    // Use the font here
    const textGeometry = new TextGeometry('Kushagra', {
        font: font,
        size: 1,
        depth: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });

    textGeometry.center();

    const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
    const textMesh = new THREE.Mesh(textGeometry, material);
    scene.add(textMesh);

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 40, 45);

    for (let i = 0; i < 100; i++) {
        const donutMesh = new THREE.Mesh(donutGeometry, material);

        donutMesh.position.x = (Math.random() - 0.5) * 15;
        donutMesh.position.y = (Math.random() - 0.5) * 15;
        donutMesh.position.z = (Math.random() - 0.5) * 15;

        donutMesh.rotation.x = Math.random() * Math.PI;
        donutMesh.rotation.y = Math.random() * Math.PI;

        const scale = Math.random();
        donutMesh.scale.set(scale, scale, scale);

        scene.add(donutMesh);
    }
});

// Scene setup
const scene = new THREE.Scene();
const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, windowSize.width / windowSize.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    antialias: true
});

renderer.setSize(windowSize.width, windowSize.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Axes Helper
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// GUI
const gui = new GUI();

// Scene controls
const sceneFolder = gui.addFolder('Scene');
const sceneSettings = {
    backgroundColor: '#000000'
};
sceneFolder.addColor(sceneSettings, 'backgroundColor').onChange((value) => {
    scene.background = new THREE.Color(value);
});

// Orbit controls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();



camera.position.z = 6;

// Handle window resizing
window.addEventListener('resize', () => {
    // Update sizes
    windowSize.width = window.innerWidth;
    windowSize.height = window.innerHeight;

    // Update camera
    camera.aspect = windowSize.width / windowSize.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(windowSize.width, windowSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

renderer.render(scene, camera);