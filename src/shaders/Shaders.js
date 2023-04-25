const vertexShader = () => {
  return `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
    `;
};

const fragmentShader = () => {
  return `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  uniform vec3 lightPosition;
  
  void main() {
    // calculate light direction
    vec3 lightDirection = normalize(lightPosition - vPosition);
  
    // calculate diffuse color
    float diffuse = max(dot(vNormal, lightDirection), 0.0);
    vec3 diffuseColor = vec3(diffuse);
  
    // calculate shadow factor
    float shadow = 0.0;
    float step = 0.01;
    float t = 0.0;
    for (int i = 0; i < 100; i++) {
      vec3 samplePosition = vPosition - lightDirection * t;
      float sampleHeight = texture2D(heightmap, samplePosition.xy).r;
      float sampleDepth = samplePosition.z;
      if (sampleDepth > sampleHeight) {
        shadow = 1.0;
        break;
      }
      t += step;
    }
  
    // apply shadow to diffuse color
    diffuseColor *= (1.0 - shadow);
  
    // output final color
    gl_FragColor = vec4(diffuseColor, 1.0);
  }
  `;
};

export { vertexShader, fragmentShader };