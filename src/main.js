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
camera.position.set( 0, -600, 200 );

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



const terrainMaterial = new THREE.MeshLambertMaterial({
  color: 0x805080,
  reflectivity: 1,
  flatShading: true,
});

const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);

scene.add(terrainMesh);

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

  if (averageFrequency !== 0) {
    
    for (let y = startY0; y < startY0 + 5; y++) {
      let xoff = 0;
      for (let x = startX0; x < startX0 + 5; x++) {
        const noiseVal = simplex(xoff, yoff);
        let height = THREE.MathUtils.mapLinear(noiseVal, 2, 7, 35, 70);
  
        terrain[x][y] = height;
        terrainGeometry.attributes.position.setZ((x + y * cols), height*averageFrequency/20);
        xoff += 0.2
      }
      yoff += 0.2;
    }
  
    for (let y = startY1; y < startY1 + 5; y++) {
      let xoff = 0;
      for (let x = startX1; x < startX1 + 5; x++) {
        const noiseVal = simplex(xoff, yoff);
        let height = THREE.MathUtils.mapLinear(noiseVal, 2, 7, 35, 70);
  
        terrain[x][y] = height;
        terrainGeometry.attributes.position.setZ((x + y * cols), height*averageFrequency/20);
        xoff += 0.2
      }
      yoff += 0.2;
    }

  }

console.log(camera.position);

  // light.position.set( Math.sin(Date.now() * 0.001) * 1000, 1, Math.cos(Date.now() * 0.001) * 1000 );

  // const lightDirection = new THREE.Vector3();
  // light.getWorldDirection(lightDirection);

  // const vertices = terrainGeometry.attributes.position.array;
  // const normals = terrainGeometry.attributes.normal.array;

  // for (let i = 0; i < vertices.length; i += 3) {
  //   const vertex = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
  //   const normal = new THREE.Vector3(normals[i], normals[i + 1], normals[i + 2]);
  //   const intensity = normal.dot(lightDirection);
  //   const color = new THREE.Color().setHSL(0.1, 1, 0.75 + intensity * 0.25);
  //   terrainMaterial.vertexColors = true;
  //   terrainGeometry.setAttribute('color', new THREE.BufferAttribute(color, 3));
  //   terrainGeometry.attributes.color.setXYZ(i, color.r, color.g, color.b);
  // }

  

  // terrainGeometry.attributes.normal.needsUpdate = true;
  // terrainGeometry.attributes.color.needsUpdate = true;




  terrainGeometry.computeVertexNormals();






  terrainGeometry.attributes.position.needsUpdate = true;


  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  controls.update();


}

animate();
});














