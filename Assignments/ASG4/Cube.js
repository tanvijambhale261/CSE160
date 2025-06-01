class Cube {
  constructor() {
    this.type = 'cube';
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 0.7, 0.1, 1.0];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4();
    this.textureNum=-1;
    this.normalMatrix = new Matrix4();

  }

  render() {
    //let rgba = this.color;
    //gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // FRONT
    drawTriangle3DUV(
      [0, 0, 0,   1, 1, 0,   1, 0, 0],
      [0, 0,      1, 1,      1, 0]
    );
    drawTriangle3DUV(
      [0, 0, 0,   0, 1, 0,   1, 1, 0],
      [0, 0,      0, 1,      1, 1]
    );

    // TOP
    drawTriangle3DUV(
      [0, 1, 0,   0, 1, 1,   1, 1, 1],
      [0, 0,      0, 1,      1, 1]
    );
    drawTriangle3DUV(
      [0, 1, 0,   1, 1, 1,   1, 1, 0],
      [0, 0,      1, 1,      1, 0]
    );

    // BOTTOM
    drawTriangle3DUV(
      [0, 0, 0,   1, 0, 0,   1, 0, 1],
      [0, 0,      1, 0,      1, 1]
    );
    drawTriangle3DUV(
      [0, 0, 0,   1, 0, 1,   0, 0, 1],
      [0, 0,      1, 1,      0, 1]
    );

    // LEFT
    drawTriangle3DUV(
      [0, 0, 0,   0, 0, 1,   0, 1, 1],
      [0, 0,      1, 0,      1, 1]
    );
    drawTriangle3DUV(
      [0, 0, 0,   0, 1, 1,   0, 1, 0],
      [0, 0,      1, 1,      0, 1]
    );

    // RIGHT
    drawTriangle3DUV(
      [1, 0, 0,   1, 1, 0,   1, 1, 1],
      [0, 0,      0, 1,      1, 1]
    );
    drawTriangle3DUV(
      [1, 0, 0,   1, 1, 1,   1, 0, 1],
      [0, 0,      1, 1,      1, 0]
    );

    // BACK
    drawTriangle3DUV(
      [0, 0, 1,   1, 0, 1,   1, 1, 1],
      [0, 0,      1, 0,      1, 1]
    );
    drawTriangle3DUV(
      [0, 0, 1,   1, 1, 1,   0, 1, 1],
      [0, 0,      1, 1,      0, 1]
    );
  }

computeAndSendNormalMatrix(globalMatrix) {
  let model = new Matrix4(globalMatrix);
  model.multiply(this.matrix);
  this.normalMatrix.setInverseOf(model).transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
}




  renderFastTextured() {
  gl.uniform1i(u_whichTexture, this.textureNum); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

  const uv = [
    // FRONT
    0, 0,  1, 1,  1, 0,
    0, 0,  0, 1,  1, 1,

    // TOP
    0, 0,  0, 1,  1, 1,
    0, 0,  1, 1,  1, 0,

    // RIGHT
    0, 0,  0, 1,  1, 1,
    0, 0,  1, 1,  1, 0,

    // LEFT
    0, 0,  0, 1,  1, 1,
    0, 0,  1, 1,  1, 0,

    // BOTTOM
    0, 0,  0, 1,  1, 1,
    0, 0,  1, 1,  1, 0,

    // BACK
    0, 0,  1, 0,  1, 1,
    0, 0,  1, 1,  0, 1,
  ];

  const verts = [
    // FRONT
    0, 0, 0,  1, 1, 0,  1, 0, 0,
    0, 0, 0,  0, 1, 0,  1, 1, 0,

    // TOP
    0, 1, 0,  0, 1, 1,  1, 1, 1,
    0, 1, 0,  1, 1, 1,  1, 1, 0,

    // RIGHT
    1, 0, 0,  1, 1, 0,  1, 1, 1,
    1, 0, 0,  1, 1, 1,  1, 0, 1,

    // LEFT
    0, 0, 0,  0, 0, 1,  0, 1, 1,
    0, 0, 0,  0, 1, 1,  0, 1, 0,

    // BOTTOM
    0, 0, 0,  0, 0, 1,  1, 0, 1,
    0, 0, 0,  1, 0, 1,  1, 0, 0,

    // BACK
    0, 0, 1,  1, 0, 1,  1, 1, 1,
    0, 0, 1,  1, 1, 1,  0, 1, 1,
  ];

  drawTriangle3DUV(verts, uv);
}

renderWithNormals() {
  gl.uniform1i(u_whichTexture, -3);
  gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

  const uv = [
    // Repeat same UVs as before (reuse from renderFastTextured)
    0, 0,  1, 1,  1, 0,
    0, 0,  0, 1,  1, 1,

    0, 0,  0, 1,  1, 1,
    0, 0,  1, 1,  1, 0,

    0, 0,  0, 1,  1, 1,
    0, 0,  1, 1,  1, 0,

    0, 0,  0, 1,  1, 1,
    0, 0,  1, 1,  1, 0,

    0, 0,  0, 1,  1, 1,
    0, 0,  1, 1,  1, 0,

    0, 0,  1, 0,  1, 1,
    0, 0,  1, 1,  0, 1,
  ];

  const verts = [
    // Same vertex array as renderFastTextured
    0, 0, 0,  1, 1, 0,  1, 0, 0,
    0, 0, 0,  0, 1, 0,  1, 1, 0,

    0, 1, 0,  0, 1, 1,  1, 1, 1,
    0, 1, 0,  1, 1, 1,  1, 1, 0,

    1, 0, 0,  1, 1, 0,  1, 1, 1,
    1, 0, 0,  1, 1, 1,  1, 0, 1,

    0, 0, 0,  0, 0, 1,  0, 1, 1,
    0, 0, 0,  0, 1, 1,  0, 1, 0,

    0, 0, 0,  0, 0, 1,  1, 0, 1,
    0, 0, 0,  1, 0, 1,  1, 0, 0,

    0, 0, 1,  1, 0, 1,  1, 1, 1,
    0, 0, 1,  1, 1, 1,  0, 1, 1,
  ];

  // Normals (one per vertex), face-aligned
  const normals = [
    // FRONT (0, 0, -1)
    0, 0, -1,  0, 0, -1,  0, 0, -1,
    0, 0, -1,  0, 0, -1,  0, 0, -1,

    // TOP (0, 1, 0)
    0, 1, 0,  0, 1, 0,  0, 1, 0,
    0, 1, 0,  0, 1, 0,  0, 1, 0,

    // RIGHT (1, 0, 0)
    1, 0, 0,  1, 0, 0,  1, 0, 0,
    1, 0, 0,  1, 0, 0,  1, 0, 0,

    // LEFT (-1, 0, 0)
   -1, 0, 0, -1, 0, 0, -1, 0, 0,
   -1, 0, 0, -1, 0, 0, -1, 0, 0,

    // BOTTOM (0, -1, 0)
    0, -1, 0,  0, -1, 0,  0, -1, 0,
    0, -1, 0,  0, -1, 0,  0, -1, 0,

    // BACK (0, 0, 1)
    0, 0, 1,  0, 0, 1,  0, 0, 1,
    0, 0, 1,  0, 0, 1,  0, 0, 1,
  ];

  drawTriangle3DUVNormal(verts, uv, normals);
}

}
