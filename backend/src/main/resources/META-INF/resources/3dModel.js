import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';

let avatarContainer = document.getElementById('avatarContainer');
const w = (avatarContainer.style.width).slice(0, -2) //slice to retrieve only the int value
const h = (avatarContainer.style.height).slice(0, -2)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
avatarContainer.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera( 75, w, h, 0.1, 1000 );
camera.position.z = 2;

const globalLight = new THREE.AmbientLight(0x404040, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xcccccc)

const loader = new GLTFLoader();
loader.load('./3d/eisbaer.gltf', function (gltf) {


    scene.add(gltf.scene);
})


const controls = new OrbitControls(camera, renderer.domElement);

renderer.render(scene, camera);