const luminanceGradient = ['.', ',', '-', '~', ':', ';', '=', '!', '*', '#', '$', '@'];
const screen = document.querySelector('#canvas');

const thetaSpacing = 0.07;
const phiSpacing = 0.05;

const r1 = 1;
const r2 = 2;
const k2 = 5;
const k1 = screen.cols * k2 * 3 / (13 * (r1 + r2));

const render = (a=1, b=1) => {

  const sinA = Math.sin(a);
  const sinB = Math.sin(b);
  const cosA = Math.cos(a);
  const cosB = Math.cos(b);

  const zBuffer = [];
  const output = [];
  
  for (let i=0; i<=screen.cols; i++) {
    zBuffer.push([]);
    output.push([]);
    for (let j=0; j<=screen.rows; j++) {
      zBuffer[i][j] = 0;
      output[i][j] = ' ';
    }
  }

  for (let theta = 0; theta < 2*Math.PI; theta += thetaSpacing) {
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    for (let phi = 0; phi < 2*Math.PI; phi += phiSpacing) {
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const circleX = r2 + r1 * Math.cos(theta);
      const circleY = r1 * Math.sin(theta);

      const coordenate = {
        y: circleX * (sinB * cosPhi - sinA * cosB * sinPhi)
          + circleY * cosA * cosB,
        x: circleX * (cosB * cosPhi + sinA * sinB * sinPhi)
          - circleY * cosA * cosB,
        z: k2 + cosA * circleX * sinPhi + circleY * sinA
      };

      const projection = {
        y: Math.floor(screen.cols/2 + k1 * (1/coordenate.z) * coordenate.x),
        x: Math.floor(screen.rows/2 + k1 * (1/coordenate.z) * coordenate.y) - 10
      };

      const luminance = cosPhi * cosTheta * sinB - cosA * cosTheta * sinPhi -
        sinA * sinTheta + cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi);
      
      if (luminance > 0) {
        if(zBuffer.hasOwnProperty(projection.x))
          if (1/coordenate.z >= zBuffer[projection.x][projection.y]) {
            zBuffer[projection.x][projection.y] = (1/coordenate.z);
            const luminanceIndex = Math.floor(luminance * 8);
            output[projection.x][projection.y] = luminanceGradient[luminanceIndex];
          }
      }
    }
  }

  screen.value = '';

  for (row of output) {
    for (dot of row) {
      screen.value += `${dot}`;
    }
    screen.value += '\n';
  }

  setTimeout(function() {
    a += 0.08;
    render(a);
  }, 50);
};

render();



