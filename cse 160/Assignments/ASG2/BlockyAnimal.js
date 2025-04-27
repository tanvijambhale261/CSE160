// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }
`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;

let g_globalAngle = 0;

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


function setupWebGL() {
  // Retrieve canvas element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas); ← standard version (commented out)
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}


function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // Get the storage location of attribute a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of uniform u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of uniform u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of uniform u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix)
  {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Set an initial vlaue for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}


// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related to UI elements
let g_selectedColor = [1.0, 0.1, 0.1, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;



function addActionsForHtmlUI() {

  // Animation for Back Left Calf and Foot
  document.getElementById('animationBackLeftCalfOnButton').onclick = function () {
    g_backLeftCalfAnimation = true;};
  document.getElementById('animationBackLeftCalfOffButton').onclick = function () {
    g_backLeftCalfAnimation = false;};
  document.getElementById('animationBackLeftFootOnButton').onclick = function () {
    g_backLeftFootAnimation = true;};
  document.getElementById('animationBackLeftFootOffButton').onclick = function () {
    g_backLeftFootAnimation = false;};  
  // Back Left Calf Slider 
  document.getElementById('backLeftCalfSlider').addEventListener('mousemove', function () {
    g_backLeftCalfAngle = this.value;
    renderAllShapes(); });
  // Back Left Foot Slider
  document.getElementById('backLeftFootSlide').addEventListener('mousemove', function() {
    g_backLeftFootAngle = this.value;
    renderAllShapes();});
// ---------------------------------------------
  // Animation for Back Right Calf and Foot
  document.getElementById('animationBackRightCalfOnButton').onclick = function () {
    g_backRightCalfAnimation = true;};
  document.getElementById('animationBackRightCalfOffButton').onclick = function () {
    g_backRightCalfAnimation = false;};
  document.getElementById('animationBackRightFootOnButton').onclick = function () {
    g_backRightFootAnimation = true;};
  document.getElementById('animationBackRightFootOffButton').onclick = function () {
    g_backRightFootAnimation = false;};
  // Back Right Calf Slider
  document.getElementById('backRightCalfSlider').addEventListener('mousemove', function () {
    g_backRightCalfAngle = this.value;
    renderAllShapes();});
  // Back Right Foot Slider
  document.getElementById('backRightFootSlide').addEventListener('mousemove', function () {
    g_backRightFootAngle = this.value;
    renderAllShapes();});

// -----------------------------------------
  // Front Left Calf/Foot Animation
  document.getElementById('animationFrontLeftCalfOnButton').onclick = function () {
    g_frontLeftCalfAnimation = true;};
  document.getElementById('animationFrontLeftCalfOffButton').onclick = function () {
    g_frontLeftCalfAnimation = false;};
  document.getElementById('animationFrontLeftFootOnButton').onclick = function () {
    g_frontLeftFootAnimation = true;};
  document.getElementById('animationFrontLeftFootOffButton').onclick = function () {
    g_frontLeftFootAnimation = false;};
  // Front Left Calf/Foot Slider
  document.getElementById('frontLeftCalfSlider').addEventListener('mousemove', function() {
    g_frontLeftCalfAngle = this.value;
    renderAllShapes();});
  document.getElementById('frontLeftFootSlider').addEventListener('mousemove', function() {
    g_frontLeftFootAngle = this.value;
    renderAllShapes();});
//----------------------------------------
  // Front Right Calf/Foot Animation
  document.getElementById('animationFrontRightCalfOnButton').onclick = function () {
    g_frontRightCalfAnimation = true;};
  document.getElementById('animationFrontRightCalfOffButton').onclick = function () {
    g_frontRightCalfAnimation = false;};
  document.getElementById('animationFrontRightFootOnButton').onclick = function () {
    g_frontRightFootAnimation = true;};
  document.getElementById('animationFrontRightFootOffButton').onclick = function () {
    g_frontRightFootAnimation = false;};
  // Front Right Calf/Foot Slider
  document.getElementById('frontRightCalfSlider').addEventListener('mousemove', function() {
    g_frontRightCalfAngle = this.value;
    renderAllShapes();});
  document.getElementById('frontRightFootSlider').addEventListener('mousemove', function() {
    g_frontRightFootAngle = this.value;
    renderAllShapes();});
// -----------------------------------------
  // Main Animation
  document.getElementById('mainAnimationOnButton').onclick = function() {
    g_mainAnimation = true;};
  document.getElementById('mainAnimationOffButton').onclick = function() {
    g_mainAnimation = false;};
// -----------------------------------------
  // Angle Slider
  document.getElementById('angleSlide').addEventListener('mousemove', function () {
    g_globalAngle = this.value; 
    renderAllShapes();
  });

}


function main() {
          // Set up canvas and gl variables
          setupWebGL();
        
          // Set up GLSL shader programs and connect GLSL variables
          connectVariablesToGLSL();
        
          // Set up actions for the HTML UI elements
          addActionsForHtmlUI();

          canvas.onclick = function(ev) {
            if (ev.shiftKey) {
              g_pokeAnimation = !g_pokeAnimation;  
            }
          };

          let isMouseDown = false;
          let lastMouseX = 0;
        
          canvas.addEventListener('mousedown', function(ev) {
            isMouseDown = true;
            lastMouseX = ev.clientX;
          });
        
          canvas.addEventListener('mouseup', function(ev) {
            isMouseDown = false;
          });
        
          canvas.addEventListener('mousemove', function(ev) {
            if (isMouseDown) {
              let deltaX = ev.clientX - lastMouseX;
              g_globalAngle += deltaX * 0.5; // adjust 0.5 if needed
              lastMouseX = ev.clientX;
            }
          });
        
          // Specify the color for clearing <canvas>
          gl.clearColor(0.74, 0.83, 0.73, 1.0); 

        
          // Render
          //renderAllShapes();

          requestAnimationFrame(tick);
        }

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

function tick(){

          g_seconds = performance.now()/1000.0-g_startTime;
          console.log(g_seconds);
          updateAnimationAngles(); 
          renderAllShapes();
          requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  if (g_pokeAnimation) {
    g_noseWiggleAngle = 10 * Math.sin(20 * g_seconds);
  } 
  else if (g_mainAnimation) {
    g_backLeftCalfAngle = 30 * Math.sin(g_seconds);
    g_backLeftFootAngle = 15 * Math.sin(2 * g_seconds);
    g_backRightCalfAngle = 30 * Math.sin(g_seconds + Math.PI); 
    g_backRightFootAngle = 15 * Math.sin(2 * g_seconds + Math.PI);

    g_frontLeftCalfAngle = 30 * Math.sin(g_seconds + Math.PI);
    g_frontLeftFootAngle = 15 * Math.sin(2 * g_seconds + Math.PI);
    g_frontRightCalfAngle = 30 * Math.sin(g_seconds);
    g_frontRightFootAngle = 15 * Math.sin(2 * g_seconds);
    
    g_globalAngle += 0.2 * Math.sin(1 * g_seconds);
    g_bodyBob = 0.02 * Math.sin(g_seconds); 
    g_headBob = 0.02 * Math.sin(g_seconds + Math.PI / 2);

  }
  else{
    if (g_backLeftCalfAnimation) {
    g_backLeftCalfAngle = (45 * Math.sin(g_seconds));
    }
    if (g_backLeftFootAnimation) {
      g_backLeftFootAngle = 20 * Math.sin(2 * g_seconds);
    }
    if (g_backRightCalfAnimation) {
      g_backRightCalfAngle = 45 * Math.sin(g_seconds + 1.5);  
    }
    if (g_backRightFootAnimation) {
      g_backRightFootAngle = 20 * Math.sin(2 * g_seconds + 1.5);
    }
    if (g_frontLeftCalfAnimation) {
      g_frontLeftCalfAngle = 45 * Math.sin(g_seconds);
    }
    if (g_frontLeftFootAnimation) {
      g_frontLeftFootAngle = 20 * Math.sin(2 * g_seconds);
    }
    if (g_frontRightCalfAnimation) {
      g_frontRightCalfAngle = 45 * Math.sin(g_seconds);
    }
    if (g_frontRightFootAnimation) {
      g_frontRightFootAngle = 20 * Math.sin(2 * g_seconds);
    }
  }
}

  

function renderAllShapes() {
          // Check the time at the start of this function
          var startTime = performance.now();

          var globalRotMat = new Matrix4().rotate(g_globalAngle,0,1,0);
          gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
        
          // Clear <canvas>
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          //gl.clear(gl.COLOR_BUFFER_BIT);

          // capybara body
          var body = new Cube();
          body.color = [0.6, 0.4, 0.2, 1.0]; 
          //body.matrix = leftBackCoordinatesMat;
          body.matrix.translate(-0.3, -0.5 + g_bodyBob, 0.05);
          body.matrix.scale(0.6, 0.4, 0.4); 
          body.render();

          // Draw the four legs: foot and calf

          // Back-left - THIGH/ CALF
          let originalMatrix = new Matrix4();
          var backLeftCalf = new Cube();
          backLeftCalf.color = [0.6, 0.4, 0.2, 1.0];
          backLeftCalf.matrix = originalMatrix;  
          backLeftCalf.matrix.translate(-0.25, -0.58, 0.1); 

          backLeftCalf.matrix.rotate(g_backLeftCalfAngle, 0, 0, 1);

          let calfMatrixBeforeScaling = new Matrix4(backLeftCalf.matrix); 
          backLeftCalf.matrix.scale(0.1, 0.08, 0.1);  
          backLeftCalf.render();

          // Back-left - FOOT
          var backLeftFoot = new Cube();
          backLeftFoot.color = [0.5, 0.3, 0.15, 1.0];
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
          frontLeftCalf.matrix = originalMatrixFrontLeft;
          frontLeftCalf.matrix.translate(0.15, -0.58, 0.1);
          frontLeftCalf.matrix.rotate(g_frontLeftCalfAngle, 0, 0, 1);
          let frontLeftCalfMatrixBeforeScaling = new Matrix4(frontLeftCalf.matrix);
          frontLeftCalf.matrix.scale(0.1, 0.08, 0.1);
          frontLeftCalf.render();

          // Front-left - FOOT
          var frontLeftFoot = new Cube();
          frontLeftFoot.color = [0.5, 0.3, 0.15, 1.0];
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
          backRightCalf.matrix = backRightCalfMatrix;
          backRightCalf.matrix.translate(-0.25, -0.58, 0.3);
          backRightCalf.matrix.rotate(g_backRightCalfAngle, 0, 0, 1);

          let calfMatrixBeforeScalingRight = new Matrix4(backRightCalf.matrix); 
          backRightCalf.matrix.scale(0.1, 0.08, 0.1);
          backRightCalf.render();

          // Back-right - FOOT
          var backRightFoot = new Cube();
          backRightFoot.color = [0.5, 0.3, 0.15, 1.0];
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
          frontRightCalf.matrix = originalMatrixFrontRight;
          frontRightCalf.matrix.translate(0.15, -0.58, 0.3);
          frontRightCalf.matrix.rotate(g_frontRightCalfAngle, 0, 0, 1);
          let frontRightCalfMatrixBeforeScaling = new Matrix4(frontRightCalf.matrix);
          frontRightCalf.matrix.scale(0.1, 0.08, 0.1);
          frontRightCalf.render();

          // Front-right - FOOT
          var frontRightFoot = new Cube();
          frontRightFoot.color = [0.5, 0.3, 0.15, 1.0];
          frontRightFoot.matrix = frontRightCalfMatrixBeforeScaling;
          frontRightFoot.matrix.translate(0.0, -0.08, 0.0);
          frontRightFoot.matrix.rotate(g_frontRightFootAngle, 0, 0, 1);
          frontRightFoot.matrix.scale(0.1, 0.08, 0.1);
          frontRightFoot.render();

// ---------------------------------------------------------------
          // Capybara Face
          var face = new Cube();
          face.color = [0.6, 0.4, 0.2, 1.0];
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
          leftEar.matrix = new Matrix4(faceMatrixCopy);  
          leftEar.matrix.translate(0.0, 0.35, 0); 
          leftEar.matrix.scale(0.15, 0.1, 0.15); 
          leftEar.render();
          
          var rightEar = new Cube();
          rightEar.color = [0.4, 0.2, 0.1, 1.0]; 
          rightEar.matrix = new Matrix4(faceMatrixCopy); 
          rightEar.matrix.translate(0.0, 0.35, 0.2); 
          rightEar.matrix.scale(0.15, 0.1, 0.15);
          rightEar.render();

// ---------------------------------------------------------------

          // Check the time at the end and show it on page
          var duration = performance.now() - startTime;
          sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration), "numdot");
        }


function sendTextToHTML(text, htmlID) {
          var htmlElem = document.getElementById(htmlID);
          if (!htmlElem) {
            console.log("Failed to get " + htmlID + " from HTML");
            return;
          }
          htmlElem.innerHTML = text;
        }
        
        
        





