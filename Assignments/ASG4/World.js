
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;

  attribute vec3 a_Normal;
  varying vec3 v_Normal;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_NormalMatrix;

  varying vec3 v_VertPos;

  

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_VertPos = (u_ModelMatrix * a_Position).xyz;
    v_UV = a_UV;
    v_Normal = normalize((u_NormalMatrix * vec4(a_Normal, 0.0)).xyz);
  }`


var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform int u_whichTexture;
  uniform sampler2D u_Sampler1; 
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;  
  uniform sampler2D u_Sampler4; 
  uniform sampler2D u_Sampler5;

  varying vec3 v_Normal;

  uniform vec3 u_lightPos;
  varying vec3 v_VertPos;

  uniform bool u_lightOn;

  uniform vec3 u_lightColor;

  uniform bool u_spotOn;
  uniform vec3 u_spotDirection;
  uniform float u_spotCutoff;




  void main() {

    vec3 ambient = 0.5 * vec3(1.0); // ambient always on
    vec3 diffuse = vec3(0.0);
    vec3 specular = vec3(0.0);
    

    // if (u_lightOn) {
    //   // Compute lighting only if light is on
    //   vec3 lightVector = normalize(u_lightPos - v_VertPos);
    //   float diff = max(dot(normalize(v_Normal), lightVector), 0.0);
    //   //diffuse = diff * 2.0 * vec3(1.0);
    //   diffuse = diff * 2.0 * u_lightColor;



    //   vec3 viewDir = normalize(-v_VertPos);
    //   vec3 reflectDir = reflect(-lightVector, normalize(v_Normal));
    //   float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);
    //   specular = 0.4 * spec * vec3(1.0);
    // }


    if (u_lightOn) {
      vec3 lightVector = normalize(u_lightPos - v_VertPos);
      float diff = max(dot(normalize(v_Normal), lightVector), 0.0);
      vec3 diffuseColor = u_lightColor;
      
      // Calculate spotlight intensity
      float spotEffect = 1.0;
      if (u_spotOn) {
        float theta = dot(-lightVector, normalize(u_spotDirection));
        spotEffect = smoothstep(u_spotCutoff, u_spotCutoff + 0.05, theta);
      }

      diffuse = diff * 2.0 * diffuseColor * spotEffect;

      vec3 viewDir = normalize(-v_VertPos);
      vec3 reflectDir = reflect(-lightVector, normalize(v_Normal));
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);
      specular = 0.4 * spec * vec3(1.0) * spotEffect;
    }


    vec4 baseColor;

    if (u_whichTexture == -2) {
      baseColor = u_FragColor;
    }
    else if (u_whichTexture == -3) {
      baseColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
    }
    else if (u_whichTexture == -1) {
      baseColor = vec4(v_UV, 1.0, 1.0);
    } 
    else if (u_whichTexture == 0) {
      baseColor = texture2D(u_Sampler0, v_UV);
    } 
    else if (u_whichTexture == 1) {
      baseColor = texture2D(u_Sampler1, v_UV);
    } 
    else if (u_whichTexture == 2) {  
      baseColor = texture2D(u_Sampler2, v_UV);
    }
    else if (u_whichTexture == 3) {                
      baseColor = texture2D(u_Sampler3, v_UV);
    }
    else if (u_whichTexture == 4) {                
      baseColor = texture2D(u_Sampler4, v_UV);
    }
    else if (u_whichTexture == 5) {
      baseColor = texture2D(u_Sampler5, v_UV);
    }
    else {
      baseColor = vec4(1.0, 0.2, 0.2, 1.0); // fallback error color
    }

    // Final color after lighting
    gl_FragColor = vec4(baseColor.rgb * (ambient + diffuse) + specular, baseColor.a);


  }`

  

// ------------------------------------------------------------------------------------------

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2; 
let u_Sampler3; 
let u_Sampler4;
let u_Sampler5;



let u_whichTexture;


let g_backLeftCalfAngle = 0;
let g_backLeftFootAngle = 0; 
let g_backLeftCalfAnimation = false;
let g_backLeftFootAnimation = false;

let g_backRightCalfAngle = 0;
let g_backRightFootAngle = 0;
let g_backRightCalfAnimation = false;
let g_backRightFootAnimation = false;

let g_frontLeftCalfAngle = 0;
let g_frontLeftFootAngle = 0;
let g_frontLeftCalfAnimation = false;
let g_frontLeftFootAnimation = false;

let g_frontRightCalfAngle = 0;
let g_frontRightFootAngle = 0;
let g_frontRightCalfAnimation = false;
let g_frontRightFootAnimation = false;

let g_pokeAnimation = false;
let g_noseWiggleAngle = 0;

let g_mainAnimation = false;
let g_bodyBob = 0; 
let g_headBob = 0;

let g_normalVis = false;
let a_Normal;

let g_lightPos = [0, 4, 0]; 
//let g_lightColor = [1.0, 1.0, 0.0, 1.0]; 
let u_lightPos;

let u_lightOn;
let g_lightOn = true; 

let u_NormalMatrix;



const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_globalAngle = 0;
// let g_yellowAngle = 0;
// let g_magentaAngle = 0;
// let g_yellowAnimation = false;
// let g_magentaAnimation = false;

let g_startTime = performance.now();
let g_seconds = 0;
let g_lastFrameTime = performance.now();


let isDragging = false;
let lastX = 0;


let isNight = false;

let u_lightColor;
let g_lightColor = [1.0, 1.0, 1.0];  // RGB default


let u_spotOn;
let u_spotDirection;
let u_spotCutoff;
let g_spotOn = false; 
let g_spotDirection = [0.0, -1.0, 0.0]; // pointing down
let g_spotCutoff = Math.cos(15 * Math.PI / 180); // 15 degrees in radians

let g_bunny = null;



// ------------------------------------------------------------------------------------------


function useNormalVis() {
  g_normalVis = !g_normalVis;
  renderAllShapes();
}



// ------------------------------------------------------------------------------------------

function setupWebGL() {
  canvas = document.getElementById('webgl');

  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

// ------------------------------------------------------------------------------------------

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }


  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // COW
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  // SKY
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  // WALL
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) { 
    console.log('Failed to get u_Sampler2'); return; 
  }

  // GRASS - FLOOR
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) { 
    console.log('Failed to get u_Sampler3'); return; 
  }

  // NIGHT 
  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return;
  }

  u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
  if (!u_Sampler5) {
    console.log('Failed to get the storage location of u_Sampler5');
    return;
  }


  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }

  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log('Failed to get the storage location of u_lightColor');
    return;
  }

  u_spotOn = gl.getUniformLocation(gl.program, 'u_spotOn');
  u_spotDirection = gl.getUniformLocation(gl.program, 'u_spotDirection');
  u_spotCutoff = gl.getUniformLocation(gl.program, 'u_spotCutoff');

  gl.uniform3fv(u_spotDirection, g_spotDirection); 



  // a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  // if (a_Normal < 0) {
  //   console.log('Failed to get a_Normal');
  // }
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');



  // Set an initial value for model matrix
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// ------------------------------------------------------------------------------------------

function addActionsForHtmlUI() {
  // Size Slider Events
  document.getElementById("angleSlide").addEventListener("mousemove", function () {
    g_globalAngle = this.value;
  });

  document.getElementById("normOn").onclick = function () {
    g_normalVis = true;
    renderAllShapes();
  };

  document.getElementById("normOff").onclick = function () {
    g_normalVis = false;
    renderAllShapes();
  };

    // LIGHT SLIDERS
  document.getElementById("lightXSlide").addEventListener("mousemove", function (ev) {
    if (ev.buttons == 0) return;
    g_lightPos[0] = this.value;
    renderAllShapes();
  });
  document.getElementById("lightYSlide").addEventListener("mousemove", function (ev) {
    if (ev.buttons == 0) return;
    g_lightPos[1] = this.value;
    renderAllShapes();
  });
  document.getElementById("lightZSlide").addEventListener("mousemove", function (ev) {
    if (ev.buttons == 0) return;
    g_lightPos[2] = this.value;
    renderAllShapes();
  });

    document.getElementById("lightOnButton").onclick = function () {
    g_lightOn = true;
    renderAllShapes();
  };

  document.getElementById("lightOffButton").onclick = function () {
    g_lightOn = false;
    renderAllShapes();
  };

  document.getElementById("lightRSlide").addEventListener("input", function () {
  g_lightColor[0] = parseFloat(this.value);
  renderAllShapes();
  });

  document.getElementById("lightGSlide").addEventListener("input", function () {
    g_lightColor[1] = parseFloat(this.value);
    renderAllShapes();
  });

  document.getElementById("lightBSlide").addEventListener("input", function () {
    g_lightColor[2] = parseFloat(this.value);
    renderAllShapes();
  });

  document.getElementById("spotOn").onclick = function () {
    g_spotOn = true;
    renderAllShapes();
  };

  document.getElementById("spotOff").onclick = function () {
    g_spotOn = false;
    renderAllShapes();
  };

}

// ------------------------------------------------------------------------------------------

function initTextures() {
  let imagesLoaded = 0;
  const want = 6;  // we now have 4 images to wait for

  loadTex('cow.jpg',   0, u_Sampler0);
  loadTex('sky.jpg',   1, u_Sampler1);
  loadTex('wall.jpg',  2, u_Sampler2);
  loadTex('floor.jpg', 3, u_Sampler3);   
  loadTex('night.jpg', 4, u_Sampler4);
  loadTex('grassForCow.jpg', 5, u_Sampler5);



  function loadTex(src, unit, sampler) {
    const img = new Image();
    img.onload = () => {
      sendImageToTextureUnit(img, unit, sampler);
      if (++imagesLoaded === want) requestAnimationFrame(tick);
    };
    img.src = src;
  }
}

// ------------------------------------------------------------------------------------------

function sendImageToTextureUnit(image, texUnitIndex, samplerUniform) {
  const texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create texture object');
    return;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);         
  gl.activeTexture(gl['TEXTURE' + texUnitIndex]);     
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);

  // link this texture unit to the sampler in the shader
  gl.uniform1i(samplerUniform, texUnitIndex);

  console.log(`Loaded ${image.src} into TEXTURE${texUnitIndex}`);
}

// ------------------------------------------------------------------------------------------

let g_camera;

// ------------------------------------------------------------------------------------------

function main() {
  setupWebGL();

  gl.vertexBuffer = gl.createBuffer();
  gl.uvBuffer = gl.createBuffer();
  gl.normalBuffer = gl.createBuffer();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  g_camera = new Camera();

    canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastX = e.clientX;
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastX;
    lastX = e.clientX;

    const threshold = 1;
    if (Math.abs(dx) > threshold) {
      if (dx > 0) g_camera.turnRight();
      else g_camera.turnLeft();
    }

    renderAllShapes();
  });

  document.onkeydown = keydown;

  initTextures();

  gl.clearColor(0.0, 0.0, 0.0, 0);

  document.getElementById("angleSlide").addEventListener("input", function () {
          g_globalAngle = Number(this.value);
        });    
        
  fetch('bunny.obj')
  .then(response => response.text())
  .then(data => {
    g_bunny = new Model(data);  
  });
}

// ------------------------------------------------------------------------------------------

function tick() {
  // Time tracking
  let now = performance.now();
  g_seconds = (now - g_startTime) / 1000.0;

  g_lightPos[0] = 3 * Math.cos(g_seconds);
  g_lightPos[2] = 3 * Math.sin(g_seconds);

  let fps = 1000.0 / (now - g_lastFrameTime);
  g_lastFrameTime = now;

  // Update DOM
  document.getElementById("fps").innerText = fps.toFixed(1);
  document.getElementById("frametime").innerText = now.toFixed(1);

  // Update day/night toggle every 15 seconds
  isNight = Math.floor(g_seconds / 15) % 2 === 1;


  // Make the spotlight direction aim toward the origin (or any point of interest)
  let target = [0, 0, 0];  // the point you're aiming the spotlight at
  g_spotDirection = [
    target[0] - g_lightPos[0],
    target[1] - g_lightPos[1],
    target[2] - g_lightPos[2],
  ];

  // Normalize it
  let mag = Math.sqrt(
    g_spotDirection[0] ** 2 +
    g_spotDirection[1] ** 2 +
    g_spotDirection[2] ** 2
  );
  g_spotDirection = g_spotDirection.map(v => v / mag);


  // Redraw the scene
  renderAllShapes();

  // Next frame
  requestAnimationFrame(tick);
}

// ------------------------------------------------------------------------------------------

// Trying to make the block not see through - like you can't through it [did not nece. work]
function isBlocked(x, z) {
  const mapX = Math.floor(x + 16);
  const mapZ = Math.floor(z + 16);
  if (mapX < 0 || mapX >= 32 || mapZ < 0 || mapZ >= 32) return true; // treat out of bounds as blocked
  return g_map[mapZ][mapX] > 0;
}

// ------------------------------------------------------------------------------------------

// Key function 

function keydown(ev) {
  switch(ev.key) {
    case 'w':
      g_camera.forward();
      break;
    case 's':
      g_camera.back();
      break;
    case 'a':
      g_camera.left();
      break;
    case 'd':
      g_camera.right();
      break;
    case 'q':
      g_camera.turnLeft();
      break;
    case 'e':
      g_camera.turnRight();
      break;
    // case 'f': 
    //   addBlockInFront(); 
    //   break;
    // case 'r': 
    //   removeBlockInFront(); 
    //   break;
    case ' ':
      addBlockInFront();
      break;
    case 'x':
      removeBlockInFront();
      break;

  }
  renderAllShapes();
}

// ------------------------------------------------------------------------------------------

// Start off with small map and then make it bigger

var g_map = new Array(32).fill(null).map(() => new Array(32).fill(0));

const smallMap = [
  [0,0,1,0,0,0,0,0],
  [0,0,0,0,1,0,0,0],
  [0,1,0,0,0,0,0,0],
  [1,0,0,0,0,0,1,0],
  [0,0,0,0,0,1,0,0],
  [0,0,0,1,0,0,0,0],
  [0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0],
];

const xOffset = Math.floor((32 - 8) / 2);  
const yOffset = Math.floor((32 - 8) / 2);  

for (let y = 0; y < 32; y++) {
  for (let x = 0; x < 32; x++) {
    g_map[y][x] = smallMap[y % 8][x % 8];
  }
}

// ------------------------------------------------------------------------------------------

// Draw the main map which is 32x32

function drawMap() {
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const height = g_map[y][x];

      for (let h = 0; h < g_map[y][x]; h++) {
        let cube = new Cube();
        cube.textureNum = 2;
        cube.matrix.translate(0, -0.75, 0);
        cube.matrix.scale(0.8, 0.8, 0.8);
        cube.matrix.translate(x - 16, h * 1.0, y - 16);
        cube.renderFastTextured();
      }
    }
  }
}

// ------------------------------------------------------------------------------------------

// Adds / Deletes Blocks -- you have to be at a certain camera angle to delete and add 

function getBlockInFront() {
  let dir = new Vector3(g_camera.at.elements).sub(g_camera.eye).normalize();
  let target = new Vector3(g_camera.eye.elements).add(dir);

  let x = Math.floor(target.elements[0] + 16);
  let y = Math.floor(target.elements[2] + 16); // Z is grid Y

  return { x, y };
}


function addBlockInFront() {
  const { x, y } = getBlockInFront();
  if (x >= 0 && x < 32 && y >= 0 && y < 32) {
    g_map[y][x] = Math.min(4, g_map[y][x] + 1);  // max height 4
  }
}


function removeBlockInFront() {
  const { x, y } = getBlockInFront();
  if (x >= 0 && x < 32 && y >= 0 && y < 32 && g_map[y][x] > 0) {
    g_map[y][x] -= 1;
  }
}

// ------------------------------------------------------------------------------------------

function renderAllShapes() {
          var projMat = new Matrix4();
          projMat.setPerspective(60, canvas.width / canvas.height, 0.1, 100);
          gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

          // View Matrix
          let viewMat = new Matrix4();
          viewMat.setLookAt(
            g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
            g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
            g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]
          );          
          gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
          


          // Apply global rotation
          var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
          gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
          
        
          // Clear <canvas>
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          
        
          gl.uniform3fv(u_lightPos, g_lightPos);
          gl.uniform1i(u_lightOn, g_lightOn);


          gl.uniform3fv(u_lightColor, g_lightColor);

          // gl.uniform1i(u_spotOn, g_spotOn);
          // gl.uniform3fv(u_spotDirection, g_spotDirection);
          // gl.uniform1f(u_spotCutoff, g_spotCutoff);

          gl.uniform1i(u_spotOn, g_spotOn);
          gl.uniform1f(u_spotCutoff, g_spotCutoff);
          gl.uniform3fv(u_spotDirection, g_spotDirection); 




          // sphere 
          let sphere = new Sphere();
          sphere.matrix.translate(0, 2, 0); // Position sphere
          sphere.render();


          var sky = new Cube();
          sky.color = [1,0,0,1];
          //sky.textureNum =1;
          sky.textureNum = isNight ? 4 : 1; // 4 is night sky, 1 is day sky
          sky.matrix.scale(50,50,50);
          sky.matrix.translate(-.5, -.5, -.5);
          sky.render();
          // if (g_normalVis) {
          //   sky.renderWithNormals();
          // } else {
          //   sky.renderFastTextured();
          // }



          // floor 
          let floor = new Cube();
          floor.color = [1.0, 0.0, 0.0, 1.0];
          floor.textureNum = 3;
          floor.matrix.translate(0.0, -0.82, 0.0);
          floor.matrix.scale(25.6, 0, 25.6);  
          floor.matrix.translate(-0.5, 0, -0.5);

          let floorNormalMatrix = new Matrix4();
          floorNormalMatrix.setInverseOf(floor.matrix).transpose();
          gl.uniformMatrix4fv(u_NormalMatrix, false, floorNormalMatrix.elements);
          
          floor.render();



          // // ----- WALL LEFT -----
          // let wallLeft = new Cube();
          // wallLeft.textureNum = 2; // wall.jpg
          // wallLeft.matrix.setTranslate(-2, -0.75, -1); // shift left
          // wallLeft.matrix.scale(0.2, 5, 10); // tall + thin wall


          // if (g_normalVis) {
          //   let wallLeftNormalMatrix = new Matrix4();
          //   wallLeftNormalMatrix.setInverseOf(wallLeft.matrix).transpose();
          //   gl.uniformMatrix4fv(u_NormalMatrix, false, wallLeftNormalMatrix.elements);

          //   wallLeft.renderWithNormals();
          // } else {
          //   wallLeft.renderFastTextured();
          // }

          // // ----- WALL BACK -----
          // let wallBack = new Cube();
          // wallBack.textureNum = 2; // wall.jpg
          // wallBack.matrix.setTranslate(-2, -0.75, -1); // shift back
          // wallBack.matrix.scale(10, 5, 0.2); // wide + thin wall


          // if (g_normalVis) {

          //   let wallBackNormalMatrix = new Matrix4();
          //   wallBackNormalMatrix.setInverseOf(wallBack.matrix).transpose();
          //   gl.uniformMatrix4fv(u_NormalMatrix, false, wallBackNormalMatrix.elements);

          //   wallBack.renderWithNormals();
          // } else {
          //   wallBack.renderFastTextured();
          // }

          // ----- WALL LEFT -----
          let wallLeft = new Cube();
          wallLeft.textureNum = 2;
          wallLeft.matrix.setTranslate(-2, -0.75, -1);
          wallLeft.matrix.scale(0.2, 5, 10);

          wallLeft.computeAndSendNormalMatrix(globalRotMat);
          if (g_normalVis) {
            wallLeft.renderWithNormals();
          } else {
            wallLeft.renderFastTextured();
          }


          // ----- WALL BACK -----
          let wallBack = new Cube();
          wallBack.textureNum = 2;
          wallBack.matrix.setTranslate(-2, -0.75, -1);
          wallBack.matrix.scale(10, 5, 0.2);

          wallBack.computeAndSendNormalMatrix(globalRotMat);
          if (g_normalVis) {
            wallBack.renderWithNormals();
          } else {
            wallBack.renderFastTextured();
          }





          let cowBaseMatrix = new Matrix4();
          cowBaseMatrix.translate(5, 0, 5); 
          cowBaseMatrix.rotate(-50, 0, 1, 0);


          //drawMap();

          // capybara body
          // var body = new Cube();
          // body.color = [0.6, 0.4, 0.2, 1.0]; 
          // body.textureNum = 0;
          // body.matrix.translate(-0.3, -0.5 + g_bodyBob, 0.05);
          // body.matrix.scale(0.6, 0.4, 0.4);
          // if (g_normalVis) {
          //   let bodyNormalMatrix = new Matrix4();
          //   bodyNormalMatrix.setInverseOf(body.matrix).transpose();
          //   gl.uniformMatrix4fv(u_NormalMatrix, false, bodyNormalMatrix.elements);
          //   body.renderWithNormals();
          // } else {
          //   body.renderFastTextured();
          // }

          let body = new Cube();
          body.textureNum = 0;

          body.matrix = new Matrix4(cowBaseMatrix);

          body.matrix.translate(-0.3, -0.5 + g_bodyBob, 0.05);
          body.matrix.scale(0.6, 0.4, 0.4);

          body.computeAndSendNormalMatrix(globalRotMat);
          if (g_normalVis) {
            body.renderWithNormals();
          } else {
            body.renderFastTextured();
          }





          // Draw the four legs: foot and calf

          // Back-left - THIGH/ CALF
          let originalMatrix = new Matrix4();
          var backLeftCalf = new Cube();
          backLeftCalf.color = [0.6, 0.4, 0.2, 1.0];
          backLeftCalf.textureNum = 0;

          originalMatrix = new Matrix4(cowBaseMatrix); 

          backLeftCalf.matrix = originalMatrix;  
          backLeftCalf.matrix.translate(-0.25, -0.58, 0.1); 
          backLeftCalf.matrix.rotate(g_backLeftCalfAngle, 0, 0, 1);

          let calfMatrixBeforeScaling = new Matrix4(backLeftCalf.matrix); 
          backLeftCalf.matrix.scale(0.1, 0.08, 0.1);  
          //backLeftCalf.render();

          // let backLeftCalfNormalMatrix = new Matrix4();
          // backLeftCalfNormalMatrix.setInverseOf(backLeftCalf.matrix).transpose();
          // gl.uniformMatrix4fv(u_NormalMatrix, false, backLeftCalfNormalMatrix.elements);

          backLeftCalf.computeAndSendNormalMatrix(globalRotMat);
          if (g_normalVis) {
            backLeftCalf.renderWithNormals();
          } else {
            backLeftCalf.renderFastTextured();
          }



          // Back-left - FOOT
          var backLeftFoot = new Cube();
          backLeftFoot.color = [0.5, 0.3, 0.15, 1.0];
          backLeftFoot.textureNum = 0;
          backLeftFoot.matrix = calfMatrixBeforeScaling; 
          backLeftFoot.matrix.translate(0.0, -0.08, 0.0); 
          backLeftFoot.matrix.rotate(g_backLeftFootAngle, 0, 0, 1); 
          backLeftFoot.matrix.scale(0.1, 0.08, 0.1);
          //backLeftFoot.render();

          let backLeftFootNormalMatrix = new Matrix4();
          backLeftFootNormalMatrix.setInverseOf(backLeftFoot.matrix).transpose();
          gl.uniformMatrix4fv(u_NormalMatrix, false, backLeftFootNormalMatrix.elements);
        backLeftFoot.computeAndSendNormalMatrix(globalRotMat);
        if (g_normalVis) {
          backLeftFoot.renderWithNormals();
        } else {
          backLeftFoot.renderFastTextured();
        }


// --------------------------------------------------------------
          // Front-left - THIGH/ CALF
          let originalMatrixFrontLeft = new Matrix4(cowBaseMatrix);

          var frontLeftCalf = new Cube();
          frontLeftCalf.color = [0.6, 0.4, 0.2, 1.0];
          frontLeftCalf.textureNum = 0;
          frontLeftCalf.matrix = originalMatrixFrontLeft;
          frontLeftCalf.matrix.translate(0.15, -0.58, 0.1);
          frontLeftCalf.matrix.rotate(g_frontLeftCalfAngle, 0, 0, 1);
          let frontLeftCalfMatrixBeforeScaling = new Matrix4(frontLeftCalf.matrix);
          frontLeftCalf.matrix.scale(0.1, 0.08, 0.1);
          //frontLeftCalf.render();

          // let frontLeftCalfNormalMatrix = new Matrix4();
          // frontLeftCalfNormalMatrix.setInverseOf(frontLeftCalf.matrix).transpose();
          // gl.uniformMatrix4fv(u_NormalMatrix, false, frontLeftCalfNormalMatrix.elements);

          frontLeftCalf.computeAndSendNormalMatrix(globalRotMat);
          if (g_normalVis) {
            frontLeftCalf.renderWithNormals();
          } else {
            frontLeftCalf.renderFastTextured();
          }

          // Front-left - FOOT
          var frontLeftFoot = new Cube();
          frontLeftFoot.color = [0.5, 0.3, 0.15, 1.0];
          frontLeftFoot.textureNum = 0;
          frontLeftFoot.matrix = frontLeftCalfMatrixBeforeScaling;
          frontLeftFoot.matrix.translate(0.0, -0.08, 0.0);
          frontLeftFoot.matrix.rotate(g_frontLeftFootAngle, 0, 0, 1);
          frontLeftFoot.matrix.scale(0.1, 0.08, 0.1);
          //frontLeftFoot.render();

          // let frontLeftFootNormalMatrix = new Matrix4();
          // frontLeftFootNormalMatrix.setInverseOf(frontLeftFoot.matrix).transpose();
          // gl.uniformMatrix4fv(u_NormalMatrix, false, frontLeftFootNormalMatrix.elements);

          frontLeftFoot.computeAndSendNormalMatrix(globalRotMat);
          if (g_normalVis) {
            frontLeftFoot.renderWithNormals();
          } else {
            frontLeftFoot.renderFastTextured();
          }

// ---------------------------------------------------------------
          // Back-right - CALF
          let backRightCalfMatrix = new Matrix4(cowBaseMatrix);

          var backRightCalf = new Cube();
          backRightCalf.color = [0.6, 0.4, 0.2, 1.0];
          backRightCalf.textureNum = 0;
          backRightCalf.matrix = backRightCalfMatrix;
          backRightCalf.matrix.translate(-0.25, -0.58, 0.3);
          backRightCalf.matrix.rotate(g_backRightCalfAngle, 0, 0, 1);

          let calfMatrixBeforeScalingRight = new Matrix4(backRightCalf.matrix); 
          backRightCalf.matrix.scale(0.1, 0.08, 0.1);
          //backRightCalf.render();

          // let backRightCalfNormalMatrix = new Matrix4();
          // backRightCalfNormalMatrix.setInverseOf(backRightCalf.matrix).transpose();
          // gl.uniformMatrix4fv(u_NormalMatrix, false, backRightCalfNormalMatrix.elements);

          backRightCalf.computeAndSendNormalMatrix(globalRotMat);
          if (g_normalVis) {
            backRightCalf.renderWithNormals();
          } else {
            backRightCalf.renderFastTextured();
          }

          // Back-right - FOOT
          var backRightFoot = new Cube();
          backRightFoot.color = [0.5, 0.3, 0.15, 1.0];
          backRightFoot.textureNum = 0;
          backRightFoot.matrix = calfMatrixBeforeScalingRight;
          backRightFoot.matrix.translate(0.0, -0.08, 0.0);
          backRightFoot.matrix.rotate(g_backRightFootAngle, 0, 0, 1);
          backRightFoot.matrix.scale(0.1, 0.08, 0.1);
          //backRightFoot.render();

          // let backRightFootNormalMatrix = new Matrix4();
          // backRightFootNormalMatrix.setInverseOf(backRightFoot.matrix).transpose();
          // gl.uniformMatrix4fv(u_NormalMatrix, false, backRightFootNormalMatrix.elements);

          backRightFoot.computeAndSendNormalMatrix(globalRotMat);
          if (g_normalVis) {
            backRightFoot.renderWithNormals();
          } else {
            backRightFoot.renderFastTextured();
          }

//----------------------------------------------------------------
          // Front-right - THIGH/ CALF
          let originalMatrixFrontRight = new Matrix4(cowBaseMatrix);

          var frontRightCalf = new Cube();
          frontRightCalf.color = [0.6, 0.4, 0.2, 1.0];
          frontRightCalf.textureNum = 0;
          frontRightCalf.matrix = originalMatrixFrontRight;
          frontRightCalf.matrix.translate(0.15, -0.58, 0.3);
          frontRightCalf.matrix.rotate(g_frontRightCalfAngle, 0, 0, 1);
          let frontRightCalfMatrixBeforeScaling = new Matrix4(frontRightCalf.matrix);
          frontRightCalf.matrix.scale(0.1, 0.08, 0.1);
          //frontRightCalf.render();

          // let frontRightCalfNormalMatrix = new Matrix4();
          // frontRightCalfNormalMatrix.setInverseOf(frontRightCalf.matrix).transpose();
          // gl.uniformMatrix4fv(u_NormalMatrix, false, frontRightCalfNormalMatrix.elements);

          frontRightCalf.computeAndSendNormalMatrix(globalRotMat);
          if (g_normalVis) {
            frontRightCalf.renderWithNormals();
          } else {
            frontRightCalf.renderFastTextured();
          }

          // Front-right - FOOT
          var frontRightFoot = new Cube();
          frontRightFoot.color = [0.5, 0.3, 0.15, 1.0];
          frontRightFoot.textureNum = 0;
          frontRightFoot.matrix = frontRightCalfMatrixBeforeScaling;
          frontRightFoot.matrix.translate(0.0, -0.08, 0.0);
          frontRightFoot.matrix.rotate(g_frontRightFootAngle, 0, 0, 1);
          frontRightFoot.matrix.scale(0.1, 0.08, 0.1);
          //frontRightFoot.render();

          // let frontRightFootNormalMatrix = new Matrix4();
          // frontRightFootNormalMatrix.setInverseOf(frontRightFoot.matrix).transpose();
          // gl.uniformMatrix4fv(u_NormalMatrix, false, frontRightFootNormalMatrix.elements);

          frontRightFoot.computeAndSendNormalMatrix(globalRotMat);
          if (g_normalVis) {
            frontRightFoot.renderWithNormals();
          } else {
            frontRightFoot.renderFastTextured();
          }

// ---------------------------------------------------------------
          // Capybara Face
          var face = new Cube();
          face.color = [0.6, 0.4, 0.2, 1.0];
          face.textureNum = 0;
          face.matrix = new Matrix4(cowBaseMatrix);
          face.matrix.translate(0.3, -0.2 + g_headBob, 0.08);
          var faceMatrixCopy = new Matrix4(face.matrix);
          face.matrix.scale(0.35, 0.35, 0.35); 
          //face.render();

          // let faceNormalMatrix = new Matrix4();
          // faceNormalMatrix.setInverseOf(face.matrix).transpose();
          // gl.uniformMatrix4fv(u_NormalMatrix, false, faceNormalMatrix.elements);

          face.computeAndSendNormalMatrix(globalRotMat);    
          if (g_normalVis) {
            face.renderWithNormals();
          } else {
            face.renderFastTextured();
          }

// ---------------------------------------------------------------
          // Nose
          let nose = new Circle(20);
          nose.color = [0.0, 0.0, 0.0, 1.0];
          
          if (g_pokeAnimation) {
              let wiggleOffset = 0.05 * Math.sin(20 * g_seconds);
              nose.position = [1.1 + wiggleOffset, 0.5, 0.5];
          } else {
              nose.position = [1.1, 0.5, 0.5]; 
          }
          
          nose.size = 0.4;
          //nose.render();  

          // let noseNormalMatrix = new Matrix4();
          // noseNormalMatrix.setIdentity(); 
          // gl.uniformMatrix4fv(u_NormalMatrix, false, noseNormalMatrix.elements);

          let noseNormalMatrix = new Matrix4();
          noseNormalMatrix.setIdentity(); // Circles are usually billboarded or 2D
          gl.uniformMatrix4fv(u_NormalMatrix, false, noseNormalMatrix.elements);

          if (g_normalVis) {
            nose.render();
          } else {
            nose.render();
          }
// ---------------------------------------------------------------
          // Eyes
          let leftEye = new Circle(20);  
          leftEye.color = [0.0, 0.0, 0.0, 1.0]; 
          leftEye.position = [1, 0.7, 0.15];  
          leftEye.size = 0.2;  
          //leftEye.render();

          let leftEyeNormalMatrix = new Matrix4();
          leftEyeNormalMatrix.setIdentity(); // or compute if needed
          gl.uniformMatrix4fv(u_NormalMatrix, false, leftEyeNormalMatrix.elements);

          //leftEye.computeAndSendNormalMatrix(globalRotMat); 
          if (g_normalVis) {
            leftEye.render();
          } else {
            leftEye.render();
          }

          let rightEye = new Circle(20);
          rightEye.color = [0.0, 0.0, 0.0, 1.0];
          rightEye.position = [1, 0.7, 0.85]; 
          rightEye.size = 0.2;
          //rightEye.render();

          let rightEyeNormalMatrix = new Matrix4();
          rightEyeNormalMatrix.setIdentity(); // or compute if needed
          gl.uniformMatrix4fv(u_NormalMatrix, false, rightEyeNormalMatrix.elements);

          //rightEye.computeAndSendNormalMatrix(globalRotMat); 
          if (g_normalVis) {
            rightEye.render();
          } else {
            rightEye.render();
          }
// ---------------------------------------------------------------
          // Ears 
          var leftEar = new Cube();
          leftEar.color = [0.4, 0.2, 0.1, 1.0]; 
          leftEar.textureNum = 0;
          leftEar.matrix = new Matrix4(faceMatrixCopy);  
          leftEar.matrix.translate(0.0, 0.35, 0); 
          leftEar.matrix.scale(0.15, 0.1, 0.15); 
          //leftEar.render();

          let leftEarNormalMatrix = new Matrix4();
          leftEarNormalMatrix.setInverseOf(leftEar.matrix).transpose();
          gl.uniformMatrix4fv(u_NormalMatrix, false, leftEarNormalMatrix.elements);


          //leftEar.computeAndSendNormalMatrix(globalRotMat); 
          if (g_normalVis) {
            leftEar.renderWithNormals();
          } else {
            leftEar.renderFastTextured();
          }
          
          var rightEar = new Cube();
          rightEar.color = [0.4, 0.2, 0.1, 1.0]; 
          rightEar.textureNum = 0;
          rightEar.matrix = new Matrix4(faceMatrixCopy); 
          rightEar.matrix.translate(0.0, 0.35, 0.2); 
          rightEar.matrix.scale(0.15, 0.1, 0.15);
          //rightEar.render();

          let rightEarNormalMatrix = new Matrix4();
          rightEarNormalMatrix.setInverseOf(rightEar.matrix).transpose();
          gl.uniformMatrix4fv(u_NormalMatrix, false, rightEarNormalMatrix.elements);


          //rightEar.computeAndSendNormalMatrix(globalRotMat); 
          if (g_normalVis) {
            rightEar.renderWithNormals();
          } else {
            rightEar.renderFastTextured();
          }


          //let sphere = new Sphere();
          //sphere.color = [1.0, 0.5, 0.5, 1.0];
          sphere.textureNum = 5;
          sphere.matrix.translate(-2.2, -0.5, -3.5);
          sphere.matrix.scale(0.5, 0.5, 0.5);

          let sphereNormalMatrix2 = new Matrix4();
          sphereNormalMatrix2.setInverseOf(sphere.matrix).transpose();
          gl.uniformMatrix4fv(u_NormalMatrix, false, sphereNormalMatrix2.elements);


          let lightMarker = new Sphere();
          lightMarker.color = [1, 1, 0, 1];        
          lightMarker.textureNum = -2;           
          lightMarker.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
          lightMarker.matrix.scale(0.1, 0.1, 0.1);  
          gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1.0);  
          lightMarker.render();


          if (g_bunny && g_bunny.ready) {
            let bunnyMat = new Matrix4();
            bunnyMat.translate(7, -1, 3);
            bunnyMat.scale(.2, .2, .2);
            gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
            g_bunny.render(bunnyMat);
          }



        } 