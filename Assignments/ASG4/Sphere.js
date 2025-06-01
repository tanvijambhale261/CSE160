function cos(x){
   return Math.cos(x);
}

function sin(x){
   return Math.sin(x);
}

function normalize(v) {
  const len = Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2);
  return [v[0]/len, v[1]/len, v[2]/len];
}

class Sphere{
   constructor(){
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.textureNum = 5;
      this.verts32 = new Float32Array([]);
      this.normalBuffer = gl.createBuffer(); // <- create the buffer
      this.normalMatrix = new Matrix4();


      
   }

    // render() {
    // gl.uniform1i(u_whichTexture, g_normalVis ? -3 : this.textureNum);
    // gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    // // Enable the normal buffer before drawing
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    // gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(a_Normal);


    // let d = Math.PI / 10;
    // let dd = Math.PI / 10;

    // for (let t = 0; t < Math.PI; t += d) {
    //     for (let r = 0; r < 2 * Math.PI; r += d) {
    //     let p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
    //     let p2 = [Math.sin(t + dd) * Math.cos(r), Math.sin(t + dd) * Math.sin(r), Math.cos(t + dd)];
    //     let p3 = [Math.sin(t) * Math.cos(r + dd), Math.sin(t) * Math.sin(r + dd), Math.cos(t)];
    //     let p4 = [Math.sin(t + dd) * Math.cos(r + dd), Math.sin(t + dd) * Math.sin(r + dd), Math.cos(t + dd)];

    //     let uv1 = [t / Math.PI, r / (2 * Math.PI)];
    //     let uv2 = [(t + dd) / Math.PI, r / (2 * Math.PI)];
    //     let uv3 = [t / Math.PI, (r + dd) / (2 * Math.PI)];
    //     let uv4 = [(t + dd) / Math.PI, (r + dd) / (2 * Math.PI)];

    //     let v1 = [].concat(p1, p2, p4);
    //     let uvA = [].concat(uv1, uv2, uv4);
    //     drawTriangle3DUVNormal(v1, uvA, v1); // Use v1 for normals (unit sphere surface)

    //     let v2 = [].concat(p1, p4, p3);
    //     let uvB = [].concat(uv1, uv4, uv3);
    //     drawTriangle3DUVNormal(v2, uvB, v2);
    //     }
    // }
    // }

    render() {
  gl.uniform1i(u_whichTexture, g_normalVis ? -3 : this.textureNum);
  gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

  // ✅ Compute and send correct normal matrix
  let normalMatrix = new Matrix4();
  normalMatrix.setInverseOf(this.matrix).transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  let d = Math.PI / 10;
  let dd = Math.PI / 10;

  for (let t = 0; t < Math.PI; t += d) {
    for (let r = 0; r < 2 * Math.PI; r += d) {
      let p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
      let p2 = [Math.sin(t + dd) * Math.cos(r), Math.sin(t + dd) * Math.sin(r), Math.cos(t + dd)];
      let p3 = [Math.sin(t) * Math.cos(r + dd), Math.sin(t) * Math.sin(r + dd), Math.cos(t)];
      let p4 = [Math.sin(t + dd) * Math.cos(r + dd), Math.sin(t + dd) * Math.sin(r + dd), Math.cos(t + dd)];

      let uv1 = [t / Math.PI, r / (2 * Math.PI)];
      let uv2 = [(t + dd) / Math.PI, r / (2 * Math.PI)];
      let uv3 = [t / Math.PI, (r + dd) / (2 * Math.PI)];
      let uv4 = [(t + dd) / Math.PI, (r + dd) / (2 * Math.PI)];

      let v1 = [].concat(p1, p2, p4);
      let uvA = [].concat(uv1, uv2, uv4);
      drawTriangle3DUVNormal(v1, uvA, v1); // normals = positions on unit sphere

      let v2 = [].concat(p1, p4, p3);
      let uvB = [].concat(uv1, uv4, uv3);
      drawTriangle3DUVNormal(v2, uvB, v2);
    }
  }
}

computeAndSendNormalMatrix(globalMatrix) {
  let model = new Matrix4(globalMatrix);
  model.multiply(this.matrix);
  this.normalMatrix.setInverseOf(model).transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
}



}