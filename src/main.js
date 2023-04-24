import './style.css'
import * as THREE from 'three';
import { createNoise2D, createNoise3D } from 'simplex-noise';

////////////////////////
// scene
////////////////////////

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(5, 50, 50);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

////////////////////////
// geometry, materials, textures
////////////////////////

let cols, rows;
const scl = 20;
const w = 1320;
const h = 1320;
let flying = 0;

cols = w / scl;
rows = h / scl;

const terrainGeometry = new THREE.PlaneGeometry(w, h, cols - 1, rows - 1);
const terrain = new Array(cols).fill(null).map(() => new Array(rows).fill(0));


const simplex = createNoise2D();
let yoff = 0;
for (let y = 0; y < rows; y++) {
  let xoff = 0;
  for (let x = 0; x < cols; x++) {
    const index = x + y * cols;
    const noiseVal = simplex(xoff, yoff);
    const height = THREE.MathUtils.mapLinear(noiseVal, 0, 1, -100, 100);
    terrain[x][y] = height;
    terrainGeometry.attributes.position.setZ(index, height);
    xoff += 0.2;
  }
  yoff += 0.2;
}

const terrainMaterial = new THREE.MeshStandardMaterial({color: 0x808080, wireframe: true});
const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
scene.add(terrainMesh);

////////////////////////
// light
////////////////////////

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

////////////////////////
// animate
////////////////////////

function animate() {
  requestAnimationFrame( animate );

  // Update terrain
  flying -= 0.02;
  yoff = flying;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      const noiseVal = simplex(xoff, yoff);
      const height = THREE.MathUtils.mapLinear(noiseVal, 0, 1, -5, 5);
      terrain[x][y] = height;
      terrainGeometry.attributes.position.setZ((x + y * cols), height);
      xoff += 0.2;
    }
    yoff += 0.2;
  }
  terrainGeometry.attributes.position.needsUpdate = true;

  // Rotate camera
  camera.rotation.x = Math.PI / 3;

  // Render scene
  renderer.render( scene, camera );
}
animate();















