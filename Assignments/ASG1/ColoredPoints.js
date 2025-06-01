  let rSlider, gSlider, bSlider, sizeSlider;
  let shapesList = [];
  let gl; 
  let currentShape = 'point';
  let segmentSlider;
  let vars;

  // stickers 
  let currentSticker = null;

   // user drawings
  let sceneObjects = []; 




// Vertex shader
  var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader
  var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';


  // Main function 
  function main() {
    const result = setupWebGL();
    if (!result) return;
    gl = result.gl;
    const canvas = result.canvas;
  
    vars = connectVariablesToGLSL(gl);
    if (!vars) return;
  
    // Sliders
    rSlider = document.getElementById('red');
    gSlider = document.getElementById('green');
    bSlider = document.getElementById('blue');
    sizeSlider = document.getElementById('size');
    segmentSlider = document.getElementById('segments');

  
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    canvas.onmousedown = (ev) => click(ev, canvas);
    canvas.onmousemove = (ev) => { if (ev.buttons === 1) click(ev, canvas); };
  
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.onclick = clearCanvas;
  }


// ------------------- PREVIOUS CODE BEFORE FINAL ALTERATIONS -----------------------------------------------------

  // function main() {
  //   // Set up WebGL context
  //   const result = setupWebGL();
  //   if (!result) return;
  //   gl = result.gl;
  //   const canvas = result.canvas;
  
  //   // Connect GLSL variables
  //   vars = connectVariablesToGLSL(gl);
  //   if (!vars) return;
  
  //   // Connect sliders
  //   rSlider = document.getElementById('red');
  //   gSlider = document.getElementById('green');
  //   bSlider = document.getElementById('blue');
  //   sizeSlider = document.getElementById('size');
  //   segmentsSlider = document.getElementById('segments');

  
  //   // Set up canvas
  //   gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //   gl.clear(gl.COLOR_BUFFER_BIT);
  
  //   // Mouse click handler
  //   canvas.onmousedown = function (ev) {
  //     click(ev, canvas);
  //   };
  
  //   // Clear button handler
  //   const clearBtn = document.getElementById('clearBtn');
  //   if (clearBtn) {
  //     clearBtn.onclick = clearCanvas;
  //   }

  //   // draw when moving mouse
  //   canvas.onmousemove = function (ev) {
  //     if (ev.buttons === 1) {  // 1 means left button is being held down
  //       click(ev, canvas);
  //     }
  //   };
  // }
// ------------------------------------------------------------------------------------------

// Draw Triangle 
  function drawTriangle(vertices, a_Position) {
    const n = 3;
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

// WEBGL 
  function setupWebGL() {
    const canvas = document.getElementById('webgl');
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    if (!gl) {
      console.log('Failed to get WebGL context');
      return null;
    }
    return { gl, canvas };
  }
  
// Connecting Var. 
  function connectVariablesToGLSL(gl) {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to initialize shaders');
      return null;
    }
  
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    const u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  
    if (a_Position < 0 || !u_FragColor || !u_Size) {
      console.log('Failed to get shader variable locations');
      return null;
    }
  
    return { a_Position, u_FragColor, u_Size };
  }
  

// Point Class 
  class Point {
    constructor(position, color, size) {
      this.position = position;
      this.color = color;
      this.size = size;
    }
  
    render(gl, a_Position, u_FragColor, u_Size) {
      gl.vertexAttrib3f(a_Position, this.position[0], this.position[1], 0.0);
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.uniform1f(u_Size, this.size);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }

  // ------------------- PREVIOUS CODE BEFORE FINAL ALTERATIONS -----------------------------------------------------

  // function click(ev, canvas) {
  //   const x = ((ev.clientX - canvas.getBoundingClientRect().left) - canvas.width / 2) / (canvas.width / 2);
  //   const y = (canvas.height / 2 - (ev.clientY - canvas.getBoundingClientRect().top)) / (canvas.height / 2);
  
  //   const r = rSlider.value / 100;
  //   const g = gSlider.value / 100;
  //   const b = bSlider.value / 100;
  //   const size = sizeSlider.value;
  
  //   const point = new Point([x, y], [r, g, b, 1.0], size);
  //   shapesList.push(point);
  //   renderAllShapes();
  // }

  // function click(ev, canvas) {
  //   const rect = canvas.getBoundingClientRect();
  //   const x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
  //   const y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
  
  //   const r = rSlider.value / 100;
  //   const g = gSlider.value / 100;
  //   const b = bSlider.value / 100;
  //   const size = parseFloat(sizeSlider.value);
  //   const segments = parseInt(segmentSlider.value);
  
  //   let shape;
  //   if (currentShape === 'triangle') {
  //     shape = new Triangle([x, y], [r, g, b, 1.0], size);
  //   } else if (currentShape === 'circle') {
  //     shape = new Circle([x, y], [r, g, b, 1.0], size, segments);
  //   } else {
  //     shape = new Point([x, y], [r, g, b, 1.0], size);
  //   }
  
  //   shapesList.push(shape);
  //   renderAllShapes();
  // }
  // -------------------------------------------------------------------------------------

  // Click function 
  function click(ev, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
    const y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
  
    const r = rSlider.value / 100;
    const g = gSlider.value / 100;
    const b = bSlider.value / 100;
    const size = parseFloat(sizeSlider.value);
    const segments = parseInt(segmentSlider.value);
  
    // Stickers
    if (currentSticker === 'moon') {
      drawMoon(x, y);
    } else if (currentSticker === 'comet') {
      drawComet(x, y);
    } else if (currentSticker === 'earth') {
      drawEarth(x, y);
    } else if (currentSticker === 'alien') {
      drawAlien(x, y);
    } else {
      let shape;
      if (currentShape === 'triangle') {
        shape = new Triangle([x, y], [r, g, b, 1.0], size);
      } else if (currentShape === 'circle') {
        shape = new Circle([x, y], [r, g, b, 1.0], size, segments);
      } else {
        shape = new Point([x, y], [r, g, b, 1.0], size);
      }
      shapesList.push(shape);
    }
  
    renderAllShapes();
  }
  
// ------------------- PREVIOUS CODE BEFORE FINAL ALTERATIONS -----------------------------------------------------

  // function renderAllShapes() {
  //   gl.clear(gl.COLOR_BUFFER_BIT);
  //   for (let shape of shapesList) {
  //     shape.render(vars.a_Position, vars.u_FragColor, vars.u_Size);
  //   }
  // }

// ----------------------------------------------------------------------------------------------------------------

// Rendering 
  function renderAllShapes() {
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    for (let shape of sceneObjects) {
      shape.render(vars.a_Position, vars.u_FragColor, vars.u_Size);
    }
  
    for (let shape of shapesList) {
      shape.render(vars.a_Position, vars.u_FragColor, vars.u_Size);
    }
  }
  
// Clear Canvas 
  function clearCanvas() {
    // Stop the rocket and star animations if they're running
    if (launchInterval) {
      clearInterval(launchInterval);
      launchInterval = null;
    }
    if (spinInterval) {
      clearInterval(spinInterval);
      spinInterval = null;
    }
  
    // Clear all drawn content
    shapesList = [];
    sceneObjects = [];
    renderAllShapes();
  }
  

// Sticker Functions
  function drawMoon(x, y) {
    shapesList.push(new Circle([x, y], [0.85, 0.85, 0.85, 1.0], 20, 40)); 
    shapesList.push(new Circle([x - 0.02, y + 0.02], [0.6, 0.6, 0.6, 1.0], 4, 20)); 
    shapesList.push(new Circle([x + 0.03, y - 0.01], [0.5, 0.5, 0.5, 1.0], 3, 20));
  }
  
  function drawEarth(x, y) {
    shapesList.push(new Circle([x, y], [0.0, 0.4, 1.0, 1.0], 20, 40)); 
    shapesList.push(new Triangle([x + 0.02, y + 0.02], [0.0, 0.8, 0.3, 1.0], 5)); 
    shapesList.push(new Triangle([x - 0.03, y - 0.02], [0.0, 0.8, 0.3, 1.0], 5));
  }
  
  function drawComet(x, y) {
    shapesList.push(new Circle([x, y], [1.0, 1.0, 0.8, 1.0], 10, 20));
    shapesList.push(new Triangle([x - 0.01, y - 0.01], [1.0, 0.6, 0.0, 1.0], 6)); 
    shapesList.push(new Triangle([x - 0.03, y - 0.015], [1.0, 0.3, 0.0, 1.0], 6));
  }
  
  function drawAlien(x, y) {
    shapesList.push(new Circle([x, y], [0.0, 1.0, 0.0, 1.0], 12, 30)); 
    shapesList.push(new Circle([x - 0.01, y + 0.01], [0.0, 0.0, 0.0, 1.0], 3, 10));
    shapesList.push(new Circle([x + 0.01, y + 0.01], [0.0, 0.0, 0.0, 1.0], 3, 10));
  }
  
  main();
