class Triangle {
          constructor(position, color, size, vertices = null)  {
            this.position = position; 
            this.color = color;      
            this.size = size;         
            this.vertices = vertices; 
          }
        
          render() {
            const [x, y] = this.position;
            const delta = this.size / 200;  // controls triangle size
        
            // Define triangle vertices centered around (x, y)
            const vertices = this.vertices
                    ? new Float32Array(this.vertices)
                    : new Float32Array([
                    x, y + delta,
                    x - delta, y - delta,
                    x + delta, y - delta
                    ]);

        
            const n = 3; 
        
            // Create and bind buffer
            const vertexBuffer = gl.createBuffer();
            if (!vertexBuffer) {
              console.log('Failed to create the buffer object');
              return;
            }
        
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
        
            // Connect to shader variables
            const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
            if (a_Position < 0) {
              console.log('Failed to get the storage location of a_Position');
              return;
            }
        
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(a_Position);
        
            const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
            gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        
            gl.drawArrays(gl.TRIANGLES, 0, n);
          }
        }
        

// ------------------- PREVIOUS CODE BEFORE FINAL ALTERATIONS -----------------------------------------------------

// function drawTraingle(vertices) {
//   // var vertices = new Float32Array([
//   //   0, 0.5,   -0.5, -0.5,   0.5, -0.5
//   // ]);
//   var n = 3; // The number of vertices

//   // Create a buffer object
//   var vertexBuffer = gl.createBuffer();
//   if (!vertexBuffer) {
//     console.log('Failed to create the buffer object');
//     return -1;
//   }

//   // Bind the buffer object to target
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

//   // Write date into the buffer object
//   // NEED TO ALTER THIS TO LET IN 32 somthing
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

//   var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
//   if (a_Position < 0) {
//     console.log('Failed to get the storage location of a_Position');
//     return -1;
//   }
//   // Assign the buffer object to a_Position variable
//   gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

//   // Enable the assignment to a_Position variable
//   gl.enableVertexAttribArray(a_Position);

//   gl.drawTriangle(gl.TRIANGLES, 0, n);

//   return n;
// }

// class Triangle {
//   constructor(position, color, size) {
//     this.position = position;
//     this.color = color;
//     this.size = size;
//   }

//   render(gl, a_Position, u_FragColor) {
//     const [x, y] = this.position;

//     // WebGL canvas goes from -1 to 1, so we normalize size
//     const delta = this.size / 200;  // adjust 200 to scale how large triangles are

//     const vertices = new Float32Array([
//       x, y + delta,         // top vertex
//       x - delta, y - delta, // bottom left
//       x + delta, y - delta  // bottom right
//     ]);

//     const vertexBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

//     gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
//     gl.enableVertexAttribArray(a_Position);

//     gl.uniform4f(u_FragColor, ...this.color);
//     gl.drawArrays(gl.TRIANGLES, 0, 3);
//   }
// }
