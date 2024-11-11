import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.x = 5;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

var bear;

const loader = new GLTFLoader();
loader.load('./eisbaer.glb', function (glb) {
    bear = glb.scene;
    scene.add(bear);
}, undefined, function (error) {
    console.error(error);
});

function animate() {
    if (bear) {
        bear.rotation.y += 0.008;
    }
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );