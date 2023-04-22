import './style.css'
import * as THREE from 'three';

////////////////////////
// scene
////////////////////////

const scene = new THREE.Scene();
scene.background = new THREE.Color(0.3, 0.7, 2.0);
////////////////////////
// camera
////////////////////////

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;

////////////////////////
// renderer
////////////////////////

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

////////////////////////
// shapes
////////////////////////

const geometry = new THREE.TorusGeometry( 2, 1, 4, 3 );


const textureLoader = new THREE.TextureLoader();

// Load a texture image from a URL
const texture = textureLoader.load('src/textures/pexels-anni-roenkae-2832432.jpg');
const material = new THREE.MeshPhongMaterial({
  color: 0x3f7b9d,
  specular: 0x050505,
  shininess: 100,
  map: texture,
  bumpMap: texture,
  bumpScale: 0.1,
  reflectivity: 0.8
});


const torus = new THREE.Mesh( geometry, material );
scene.add( torus );

////////////////////////
// light
////////////////////////

const light = new THREE.PointLight(0xffffff, 1);
light.position.set(1, 5, 10);
scene.add(light);

////////////////////////
// audio
////////////////////////

const audioContext = new AudioContext();
navigator.mediaDevices.getUserMedia({audio: {deviceId: 'VBAudioVACWDM'}})
  .then(stream => {
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    ////////////////////////
    // animate
    ////////////////////////

    function animate() {
      requestAnimationFrame(animate);
      const timeDomainData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(timeDomainData);

      // Calculate the amplitude of the signal from the time-domain data
      let amplitude = 0;
      for (let i = 0; i < timeDomainData.length; i++) {
        const sample = timeDomainData[i] / 128 - 1;
        amplitude += sample * sample;
      }
      amplitude = Math.sqrt(amplitude / timeDomainData.length);

      
      torus.scale.set(amplitude + 3, amplitude + 3, amplitude + 3);

      renderer.render(scene, camera);
    }

    animate();


  });












  

















