// import './style.css'
import * as THREE from 'three';
import { createNoise2D, createNoise3D } from 'simplex-noise';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import { vertexShader, fragmentShader } from './shaders/Shaders';

////////////////////////
// scene
////////////////////////

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set( 0, -5000, 700 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

////////////////////////
// geometry, materials, textures
////////////////////////

let cols, rows;
const scl = 10;
const w = 1000;
const h = 1000;
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
    let height = THREE.MathUtils.mapLinear(noiseVal, 0, 1, -100, 100);

    terrain[x][y] = height;
    terrainGeometry.attributes.position.setZ(index, height);
    xoff += 0.2;
  }
  yoff += 0.2;
}

const terrainMaterial = new THREE.MeshNormalMaterial({
  wireframe: true,
  side: THREE.DoubleSide,
});

const terrainMeshish = new THREE.Mesh(terrainGeometry, terrainMaterial);

const terrainMeshes = [];

for (let i = 0; i < 6; i++) {
  const terrainMesh = terrainMeshish.clone();
  terrainMeshes.push(terrainMesh);
}

// Set the positions and rotations of the cloned meshes to form a cube
terrainMeshes[0].position.set(w, 0, 0);
terrainMeshes[0].rotation.set(0, Math.PI / 2, 0);

terrainMeshes[1].position.set(-w, 0, 0);
terrainMeshes[1].rotation.set(0, -Math.PI / 2, 0);

terrainMeshes[2].position.set(0, w, 0);
terrainMeshes[2].rotation.set(-Math.PI / 2, 0, 0);

terrainMeshes[3].position.set(0, -w, 0);
terrainMeshes[3].rotation.set(Math.PI / 2, 0, 0);

terrainMeshes[4].position.set(0, 0, w);
terrainMeshes[4].rotation.set(0, 0, 0);

terrainMeshes[5].position.set(0, 0, -w);
terrainMeshes[5].rotation.set(0, Math.PI, 0);

// Add the cloned meshes to the scene
for (const terrainMesh of terrainMeshes) {
  scene.add(terrainMesh);
}


const cubes = [];
for (let i = -1; i <= 1; i++) {
  for (let j = -1; j <= 1; j++) {
    for (let k = -1; k <= 1; k++) {
      const cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
      const cubeMaterial = new THREE.MeshNormalMaterial();
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(i * 250, j * 250, k * 250);
      scene.add(cube);
      cubes.push(cube);
    }
  }
}















////////////////////////
// light
////////////////////////

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
light.castShadow = true;
scene.add(light);

////////////////////////
// animate & audio input
////////////////////////

let isAudioContextStarted = false;

function startAudioContext() {
  if (!isAudioContextStarted) {
    isAudioContextStarted = true;
    audioContext.resume().then(() => {
      console.log('AudioContext started');
    });
  }
}

document.addEventListener('click', startAudioContext);
document.addEventListener('touchstart', startAudioContext);

const audioContext = new AudioContext();

navigator.mediaDevices.getUserMedia({audio: {deviceId: 'VBAudioVACWDM'}})
  .then(stream => {
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 1024;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
  
    let startY0 = 0
    let startX0 = 0
    let startY1 = 0
    let startX1 = 0

    function updateTerrain() {
      const startX = Math.floor(Math.random() * (cols - 5));
      const startY = Math.floor(Math.random() * (rows - 5));
      startY0 = startY
      startX0 = startX
    }
    
    function updateTerrain1() {
      const startX2 = Math.floor(Math.random() * (cols - 5));
      const startY2 = Math.floor(Math.random() * (rows - 5));
      startY1 = startY2
      startX1 = startX2
    }

    setInterval(updateTerrain1, 1000);
    setInterval(updateTerrain, 1000);

    const cubePositions = cubes.map(cube => cube.position.clone());

function animate() {

  let dataArray = new Uint8Array(bufferLength);

  analyser.getByteFrequencyData(dataArray);
 
  const averageFrequency = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;

  const maxFrequency = Math.max(...dataArray);
  const maxIndex = dataArray.indexOf(maxFrequency);

  const midStart = Math.floor(bufferLength / 10 * 3);
  const midEnd = Math.floor(bufferLength / 10 * 7);
  const midRange = dataArray.slice(midStart, midEnd);

  const averageMidTone = midRange.reduce((acc, val) => acc + val, 0) / midRange.length;

  // console.log("Average frequency:", averageFrequency);
  // console.log("Maximum frequency:", maxFrequency, "at index", maxIndex);
  // console.log("Average midtone frequency:", averageMidTone);

  let midStart0 = Math.floor(cols / 2) - 5;
  const midEnd0 = Math.floor(cols / 2) + 5;

  flying -= 0.02;
  yoff = flying;

  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      const noiseVal = simplex(xoff, yoff);
      let height = THREE.MathUtils.mapLinear(noiseVal, 2, 7, 35, 70);

      terrain[x][y] = height;
      terrainGeometry.attributes.position.setZ((x + y * cols),height);
      xoff += 0.2;
      
    }
    
    yoff += 0.2;
  }

  if (averageFrequency > 0) {
    for (let y = startY0; y < startY0 + 10; y++) {
      let xoff = 0;
      for (let x = startX0; x < startX0 + 10; x++) {
        const noiseVal = simplex(xoff, yoff);
        let height = THREE.MathUtils.mapLinear(noiseVal, 2, 7, 31, 70);
  
        if (terrain[x] !== undefined && terrain[x][y] !== undefined) {
          terrain[x][y] = height;
          terrainGeometry.attributes.position.setZ((x + y * cols), height*averageFrequency/13);
        }
  
        xoff += 0.2
      }
      yoff += 0.2;
    }
  
    for (let y = startY1; y < startY1 + 13; y++) {
      let xoff = 0;
      for (let x = startX1; x < startX1 + 13; x++) {
        const noiseVal = simplex(xoff, yoff);
        let height = THREE.MathUtils.mapLinear(noiseVal, 2, 7, 35, 70);
  
        if (terrain[x] !== undefined && terrain[x][y] !== undefined) {
          terrain[x][y] = height;
          terrainGeometry.attributes.position.setZ((x + y * cols), height*averageFrequency/13);
        }
  
        xoff += 0.2
      }
      yoff += 0.2;
    }
  }
  
  const randomIndex = Math.floor(Math.random() * cubes.length);
  const randomAxis = Math.floor(Math.random() * 3); // 0 = x, 1 = y, 2 = z
  
  if (averageFrequency > 0) {
    let position = {};
    position[`xyz`[randomAxis]] = cubePositions[randomIndex][`xyz`[randomAxis]] + averageFrequency + (Math.floor(Math.random() * 601) - 300);
    gsap.to(cubes[randomIndex].position, {duration: 1, ...position});
  } else {
    gsap.to(cubes[randomIndex].position, {duration: 1, ...cubePositions[randomIndex]});
  }

  terrainGeometry.computeVertexNormals();

  terrainGeometry.attributes.position.needsUpdate = true;



  // camera.position.x += 1 ;
  // camera.position.y += 1 ;
  // camera.position.z += 1 ;

  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  controls.update();

}

animate();
});














