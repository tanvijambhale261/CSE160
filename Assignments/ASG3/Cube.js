class Cube {
  constructor() {
    this.type = 'cube';
    // this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 0.7, 0.1, 1.0];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4();
    this.textureNum=-1;
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
}
