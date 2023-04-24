// let isAudioContextStarted = false;

// function startAudioContext() {
//   if (!isAudioContextStarted) {
//     isAudioContextStarted = true;
//     audioContext.resume().then(() => {
//       console.log('AudioContext started');
//     });
//   }
// }

// document.addEventListener('click', startAudioContext);
// document.addEventListener('touchstart', startAudioContext);

// const audioContext = new AudioContext();
// navigator.mediaDevices.getUserMedia({audio: {deviceId: 'VBAudioVACWDM'}})
//   .then(stream => {
//     const source = audioContext.createMediaStreamSource(stream);
//     const analyser = audioContext.createAnalyser();
//     analyser.fftSize = 64;
//     source.connect(analyser);
//       const timeDomainData = new Uint8Array(analyser.frequencyBinCount);
//       analyser.getByteTimeDomainData(timeDomainData);

//       let amplitude = 0;
//       for (let i = 0; i < timeDomainData.length; i++) {
//         const sample = timeDomainData[i] / 128 - 1;
//         amplitude += sample * sample;
//       }
//       amplitude = Math.sqrt(amplitude / timeDomainData.length);
//   });
