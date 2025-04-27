class Circle {
  constructor(segments = 10) {
    this.type = 'circle';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.position = [0.0, 0.0, 0.0];
    this.size = 1.0; 
    this.segments = segments; 
  }

  render() {
    let d = this.size / 2;
    gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

    for (let lat = 0; lat < this.segments; lat++) {
      let theta1 = lat * Math.PI / this.segments;
      let theta2 = (lat + 1) * Math.PI / this.segments;

      for (let lon = 0; lon < this.segments; lon++) {
        let phi1 = lon * 2 * Math.PI / this.segments;
        let phi2 = (lon + 1) * 2 * Math.PI / this.segments;

        let p1 = this.getVertex(theta1, phi1, d);
        let p2 = this.getVertex(theta2, phi1, d);
        let p3 = this.getVertex(theta1, phi2, d);
        let p4 = this.getVertex(theta2, phi2, d);

        drawTriangle3D([...p1, ...p2, ...p3]);
        drawTriangle3D([...p2, ...p4, ...p3]);
      }
    }
  }

  getVertex(theta, phi, radius) {
    let x = radius * Math.sin(theta) * Math.cos(phi) + this.position[0];
    let y = radius * Math.cos(theta) + this.position[1];
    let z = radius * Math.sin(theta) * Math.sin(phi) + this.position[2];
    return [x, y, z];
  }
}

