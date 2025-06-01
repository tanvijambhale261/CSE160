var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
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


  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;                     // Use color
    } 
      else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);            // Use UV debug color
    } 
      else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);     // Use texture0 -- the cow print
    } 
      else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);     // Use texture1 -- the sky print
    } 
      else if (u_whichTexture == 2) {  
      gl_FragColor = texture2D(u_Sampler2, v_UV);   // Use texture2 -- the wall print
    }
    else if (u_whichTexture == 3) {                
      gl_FragColor = texture2D(u_Sampler3, v_UV);  // Use texture3 -- the grass print
    }
    else if (u_whichTexture == 4) {                
      gl_FragColor = texture2D(u_Sampler4, v_UV);  // Use texture4 -- the night print
    }
      else {
      gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);         // Error, show reddish
    }
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
  // u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  // if (!u_FragColor) {
  //   console.log('Failed to get the storage location of u_FragColor');
  //   return;
  // }

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
}

// ------------------------------------------------------------------------------------------

function initTextures() {
  let imagesLoaded = 0;
  const want = 4;  // we now have 4 images to wait for

  loadTex('cow.jpg',   0, u_Sampler0);
  loadTex('sky.jpg',   1, u_Sampler1);
  loadTex('wall.jpg',  2, u_Sampler2);
  loadTex('floor.jpg', 3, u_Sampler3);   
  loadTex('night.jpg', 4, u_Sampler4);


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
}

// ------------------------------------------------------------------------------------------

function tick() {
  // Time tracking
  let now = performance.now();
  g_seconds = (now - g_startTime) / 1000.0;
  let fps = 1000.0 / (now - g_lastFrameTime);
  g_lastFrameTime = now;

  // Update DOM
  document.getElementById("fps").innerText = fps.toFixed(1);
  document.getElementById("frametime").innerText = now.toFixed(1);

  // Update day/night toggle every 15 seconds
  isNight = Math.floor(g_seconds / 15) % 2 === 1;

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

          // // Set the view matrix (camera setup)
          // var viewMat = new Matrix4();
          // //viewMat.setLookAt(0, 0, 3, 0, 0, 0, 0, 1, 0); // eye, at, up
          // viewMat.setLookAt(
          //   g_eye[0], g_eye[1], g_eye[2],
          //   g_at[0], g_at[1], g_at[2],
          //   g_up[0], g_up[1], g_up[2]
          // );
          // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

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
          
          
          // // View Matrix (camera)
          // let viewMat = new Matrix4();
          // viewMat.setLookAt(0, 0, 3, 0, 0, 0, 0, 1, 0); // eye, at, up
          // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

          // // Projection Matrix
          // let projMat = new Matrix4();
          // projMat.setPerspective(60, canvas.width / canvas.height, 0.1, 100);
          // gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);


          // var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
          // gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
        
          // Clear <canvas>
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          //gl.clear(gl.COLOR_BUFFER_BIT);

          var sky = new Cube();
          sky.color = [1,0,0,1];
          //sky.textureNum =1;
          sky.textureNum = isNight ? 4 : 1; // 4 is night sky, 1 is day sky
          sky.matrix.scale(50,50,50);
          sky.matrix.translate(-.5, -.5, -.5);
          sky.render();

          // // Draw the floor
          // let floor = new Cube();
          // floor.color = [1.0, 0.0, 0.0, 1.0];
          // floor.textureNum = 3;
          // floor.matrix.translate(0.0, -0.75, 0.0);
          // floor.matrix.scale(10, 0, 10);
          // floor.matrix.translate(-0.5, 0, -0.5);  // center it
          // floor.render();
          let floor = new Cube();
          floor.color = [1.0, 0.0, 0.0, 1.0];
          floor.textureNum = 3;
          floor.matrix.translate(0.0, -0.82, 0.0);
          floor.matrix.scale(25.6, 0, 25.6);  
          floor.matrix.translate(-0.5, 0, -0.5);
          floor.render();

          drawMap();

          // capybara body
          var body = new Cube();
          body.color = [0.6, 0.4, 0.2, 1.0]; 
          //body.matrix = leftBackCoordinatesMat;
          body.textureNum = 0;
          body.matrix.translate(-0.3, -0.5 + g_bodyBob, 0.05);
          body.matrix.scale(0.6, 0.4, 0.4); 
          body.render();

          // Draw the four legs: foot and calf

          // Back-left - THIGH/ CALF
          let originalMatrix = new Matrix4();
          var backLeftCalf = new Cube();
          backLeftCalf.color = [0.6, 0.4, 0.2, 1.0];
          backLeftCalf.textureNum = 0;
          backLeftCalf.matrix = originalMatrix;  
          backLeftCalf.matrix.translate(-0.25, -0.58, 0.1); 

          backLeftCalf.matrix.rotate(g_backLeftCalfAngle, 0, 0, 1);

          let calfMatrixBeforeScaling = new Matrix4(backLeftCalf.matrix); 
          backLeftCalf.matrix.scale(0.1, 0.08, 0.1);  
          backLeftCalf.render();

          // Back-left - FOOT
          var backLeftFoot = new Cube();
          backLeftFoot.color = [0.5, 0.3, 0.15, 1.0];
          backLeftFoot.textureNum = 0;
          backLeftFoot.matrix = calfMatrixBeforeScaling; 
          backLeftFoot.matrix.translate(0.0, -0.08, 0.0); 
          backLeftFoot.matrix.rotate(g_backLeftFootAngle, 0, 0, 1); 
          backLeftFoot.matrix.scale(0.1, 0.08, 0.1);
          backLeftFoot.render();
// --------------------------------------------------------------
          // Front-left - THIGH/ CALF
          let originalMatrixFrontLeft = new Matrix4();
          var frontLeftCalf = new Cube();
          frontLeftCalf.color = [0.6, 0.4, 0.2, 1.0];
          frontLeftCalf.textureNum = 0;
          frontLeftCalf.matrix = originalMatrixFrontLeft;
          frontLeftCalf.matrix.translate(0.15, -0.58, 0.1);
          frontLeftCalf.matrix.rotate(g_frontLeftCalfAngle, 0, 0, 1);
          let frontLeftCalfMatrixBeforeScaling = new Matrix4(frontLeftCalf.matrix);
          frontLeftCalf.matrix.scale(0.1, 0.08, 0.1);
          frontLeftCalf.render();

          // Front-left - FOOT
          var frontLeftFoot = new Cube();
          frontLeftFoot.color = [0.5, 0.3, 0.15, 1.0];
          frontLeftFoot.textureNum = 0;
          frontLeftFoot.matrix = frontLeftCalfMatrixBeforeScaling;
          frontLeftFoot.matrix.translate(0.0, -0.08, 0.0);
          frontLeftFoot.matrix.rotate(g_frontLeftFootAngle, 0, 0, 1);
          frontLeftFoot.matrix.scale(0.1, 0.08, 0.1);
          frontLeftFoot.render();

// ---------------------------------------------------------------
          // Back-right - CALF
          let backRightCalfMatrix = new Matrix4();
          var backRightCalf = new Cube();
          backRightCalf.color = [0.6, 0.4, 0.2, 1.0];
          backRightCalf.textureNum = 0;
          backRightCalf.matrix = backRightCalfMatrix;
          backRightCalf.matrix.translate(-0.25, -0.58, 0.3);
          backRightCalf.matrix.rotate(g_backRightCalfAngle, 0, 0, 1);

          let calfMatrixBeforeScalingRight = new Matrix4(backRightCalf.matrix); 
          backRightCalf.matrix.scale(0.1, 0.08, 0.1);
          backRightCalf.render();

          // Back-right - FOOT
          var backRightFoot = new Cube();
          backRightFoot.color = [0.5, 0.3, 0.15, 1.0];
          backRightFoot.textureNum = 0;
          backRightFoot.matrix = calfMatrixBeforeScalingRight;
          backRightFoot.matrix.translate(0.0, -0.08, 0.0);
          backRightFoot.matrix.rotate(g_backRightFootAngle, 0, 0, 1);
          backRightFoot.matrix.scale(0.1, 0.08, 0.1);
          backRightFoot.render();

//----------------------------------------------------------------
          // Front-right - THIGH/ CALF
          let originalMatrixFrontRight = new Matrix4();
          var frontRightCalf = new Cube();
          frontRightCalf.color = [0.6, 0.4, 0.2, 1.0];
          frontRightCalf.textureNum = 0;
          frontRightCalf.matrix = originalMatrixFrontRight;
          frontRightCalf.matrix.translate(0.15, -0.58, 0.3);
          frontRightCalf.matrix.rotate(g_frontRightCalfAngle, 0, 0, 1);
          let frontRightCalfMatrixBeforeScaling = new Matrix4(frontRightCalf.matrix);
          frontRightCalf.matrix.scale(0.1, 0.08, 0.1);
          frontRightCalf.render();

          // Front-right - FOOT
          var frontRightFoot = new Cube();
          frontRightFoot.color = [0.5, 0.3, 0.15, 1.0];
          frontRightFoot.textureNum = 0;
          frontRightFoot.matrix = frontRightCalfMatrixBeforeScaling;
          frontRightFoot.matrix.translate(0.0, -0.08, 0.0);
          frontRightFoot.matrix.rotate(g_frontRightFootAngle, 0, 0, 1);
          frontRightFoot.matrix.scale(0.1, 0.08, 0.1);
          frontRightFoot.render();

// ---------------------------------------------------------------
          // Capybara Face
          var face = new Cube();
          face.color = [0.6, 0.4, 0.2, 1.0];
          face.textureNum = 0;
          face.matrix.translate(0.3, -0.2 + g_headBob, 0.08);
          var faceMatrixCopy = new Matrix4(face.matrix);
          face.matrix.scale(0.35, 0.35, 0.35); 
          face.render();

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
          nose.render();  
// ---------------------------------------------------------------
          // Eyes
          let leftEye = new Circle(20);  
          leftEye.color = [0.0, 0.0, 0.0, 1.0]; 
          leftEye.position = [1, 0.7, 0.15];  
          leftEye.size = 0.2;  
          leftEye.render();

          let rightEye = new Circle(20);
          rightEye.color = [0.0, 0.0, 0.0, 1.0];
          rightEye.position = [1, 0.7, 0.85]; 
          rightEye.size = 0.2;
          rightEye.render();
// ---------------------------------------------------------------
          // Ears 
          var leftEar = new Cube();
          leftEar.color = [0.4, 0.2, 0.1, 1.0]; 
          leftEar.textureNum = 0;
          leftEar.matrix = new Matrix4(faceMatrixCopy);  
          leftEar.matrix.translate(0.0, 0.35, 0); 
          leftEar.matrix.scale(0.15, 0.1, 0.15); 
          leftEar.render();
          
          var rightEar = new Cube();
          rightEar.color = [0.4, 0.2, 0.1, 1.0]; 
          rightEar.textureNum = 0;
          rightEar.matrix = new Matrix4(faceMatrixCopy); 
          rightEar.matrix.translate(0.0, 0.35, 0.2); 
          rightEar.matrix.scale(0.15, 0.1, 0.15);
          rightEar.render();

        }