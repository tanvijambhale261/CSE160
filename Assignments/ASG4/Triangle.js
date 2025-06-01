class Triangle{
  constructor(){
      this.type='triangle';
      this.position = [0.0, 0.0, 0.0]; 
      this.color = [1.0, 1.0, 1.0, 1.0]; 
      this.size = 5.0; 
  }
  render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size; 
  
      //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
      gl.uniform1f(u_Size, size)
      // Draw
      // gl.drawArrays(gl.POINTS, 0, 1);
      var d = this.size/200.0; 
      drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
  }
}

function drawTriangle(vertices) {
  var n = 3; 

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  //   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW); 

  //   var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  //   if (a_Position < 0) {
  //     console.log('Failed to get the storage location of a_Position');
  //     return -1;
  //   }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}


function drawTriangle3D(vertices) {
  var n = vertices.length / 3;

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW); 

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}


function drawTriangle3DUV(vertices, uv) {
  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  var uvBuffer = gl.createBuffer();
  if (!vertexBuffer || !uvBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind and write vertex positions
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // Bind and write texture coordinates
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);

  // Draw the triangles
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
}


// function drawTriangle3DUVNormal(verts, uv, normals) {
//   var n = verts.length / 3;

//   // Verts
//   var vertexBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
//   gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
//   gl.enableVertexAttribArray(a_Position);

//   // UVs
//   var uvBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
//   gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
//   gl.enableVertexAttribArray(a_UV);

//   // Normals
//   var normalBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
//   gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
//   gl.enableVertexAttribArray(a_Normal);

//   gl.drawArrays(gl.TRIANGLES, 0, n);
// }

function drawTriangle3DUVNormal(vertices, uv, normals) {
  // Bind and fill position buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // Bind and fill UV buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);

  // Bind and fill normal buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Normal);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}



