import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';

let avatarContainer = document.getElementById('avatarContainer');
const w = avatarContainer.offsetWidth;
const h = avatarContainer.offsetHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
avatarContainer.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 2;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const globalLight = new THREE.AmbientLight(0x404040, 1);
scene.add(globalLight);

const loader = new GLTFLoader();
loader.load('./3d/eisbaer.gltf', function (gltf) {
    scene.add(gltf.scene);
}, undefined, function (error) {
    console.error(error);
});

const controls = new OrbitControls(camera, renderer.domElement);

// Animation loop to render continuously
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Only necessary if controls.enableDamping or other dynamic settings are used
    renderer.render(scene, camera);
}
animate();
