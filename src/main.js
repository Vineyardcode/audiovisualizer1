import './style.css'
import * as THREE from 'three';
import { createNoise2D, createNoise3D } from 'simplex-noise';

////////////////////////
// scene
////////////////////////

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(1, 5, 17);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

////////////////////////
// geometry, materials, textures
////////////////////////

const terrainSize = 15;
const terrainGeometry = new THREE.PlaneGeometry(terrainSize, terrainSize, terrainSize - 1, terrainSize - 1);
terrainGeometry.rotateX( - Math.PI / 2 );

// Generate random heights for the terrain


// Create a material for the terrain
const terrainMaterial = new THREE.MeshStandardMaterial({color: 0x808080, flatShading: true});

const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
scene.add(terrainMesh);

////////////////////////
// light
////////////////////////

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

////////////////////////
// audio
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
    analyser.fftSize = 64;
    source.connect(analyser);

    ////////////////////////
    // animate
    ////////////////////////

    function animate() {
      // const timeDomainData = new Uint8Array(analyser.frequencyBinCount);
      // analyser.getByteTimeDomainData(timeDomainData);

      // let amplitude = 0;
      // for (let i = 0; i < timeDomainData.length; i++) {
      //   const sample = timeDomainData[i] / 128 - 1;
      //   amplitude += sample * sample;
      // }
      // amplitude = Math.sqrt(amplitude / timeDomainData.length);
      const position = terrainGeometry.attributes.position;
      for (let i = 0; i < position.count; i+=2) {
          position.setY(i, 2); // generate heights between -1.5 and 1.5
      }

      position.needsUpdate = true;
        requestAnimationFrame(animate);
     
      renderer.render(scene, camera);


    }

    setInterval(animate, 1000/10);

  });












  

















