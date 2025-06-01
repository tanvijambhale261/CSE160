class Model {
  constructor(objText) {
    this.ready = false;
    this.loader = new OBJLoader("bunny.obj"); 
    this.loader.parse(objText, 1.0, true).then(() => {
    this.info = this.loader.getModelData();
    console.log("Vertices array length:", this.info.vertices.length); 
    this.initBuffers();
      this.ready = true;
      console.log("Model loaded. Vertices:", this.info.vertices.length);
    });
  }

  initBuffers() {
    // Vertex buffer
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.info.vertices, gl.STATIC_DRAW);

    // Normal buffer
    this.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.info.normals, gl.STATIC_DRAW);

    // Count how many vertices to draw
    this.numVertices = this.info.vertices.length / 3;
    console.log("Vertex count to draw:", this.info.vertices.length / 3);

    if (!this.info.vertices || this.info.vertices.length === 0) {
  console.error("Model has no vertex data");
  return;
}

  }

  render(matrix, textureNum = -2) {
    if (!this.ready) return;

    gl.uniform1i(u_whichTexture, textureNum);
    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);

    // Normal matrix
    let normalMatrix = new Matrix4();
    normalMatrix.setInverseOf(matrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    // Position attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Normal attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);

    // Draw
    gl.disableVertexAttribArray(a_UV);
    gl.drawArrays(gl.TRIANGLES, 0, this.numVertices);
  }
}




