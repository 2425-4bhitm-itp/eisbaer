import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';

let avatarContainer = document.getElementById('avatarContainer');
const w = avatarContainer.offsetWidth;
const h = avatarContainer.offsetHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.x = 5;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
avatarContainer.appendChild(renderer.domElement);

const globalLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(globalLight);

var bearGLB;

const loader = new GLTFLoader();
loader.load('./3d/eisbaer.glb', function (glb) {
    bearGLB = glb.scene;
    scene.add(bearGLB);
}, undefined, function (error) {
    console.error(error);
});

function animate() {
    if (bearGLB) {
        bearGLB.rotation.y += 0.008;
    }
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );