class Cube {
          constructor() {
            this.type = 'cube';
            // this.position = [0.0, 0.0, 0.0];
            this.color = [1.0, 0.1, 0.1, 1.0];
            //this.size = 5.0;
            //this.segments = 10;
            this.matrix = new Matrix4();
          }
        
          render() {
            // var xy = this.position;
            var rgba = this.color;
            // var size = this.size;
        
            // Pass the color of a point to u_FragColor variable
            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

            gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        

            gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

            // CAPYBARA MAIN BODY
            // FRONT 
            drawTriangle3D([0.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 0.0, 0.0]);
            drawTriangle3D([0.0, 0.0, 0.0,   0.0, 1.0, 0.0,   1.0, 1.0, 0.0]);

            // TOP 
            gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
            drawTriangle3D([0.0, 1.0, 0.0,   0.0, 1.0, 1.0,   1.0, 1.0, 1.0]);
            drawTriangle3D([0.0, 1.0, 0.0,   1.0, 1.0, 1.0,   1.0, 1.0, 0.0]);

            // BOTTOM 
            gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
            drawTriangle3D([0.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 1.0]);
            drawTriangle3D([0.0, 0.0, 0.0,   1.0, 0.0, 1.0,   0.0, 0.0, 1.0]);

            // LEFT 
            gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
            drawTriangle3D([0.0, 0.0, 0.0,   0.0, 0.0, 1.0,   0.0, 1.0, 1.0]);
            drawTriangle3D([0.0, 0.0, 0.0,   0.0, 1.0, 1.0,   0.0, 1.0, 0.0]);

            // RIGHT
            gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
            drawTriangle3D([1.0, 0.0, 0.0,   1.0, 1.0, 0.0,   1.0, 1.0, 1.0]);
            drawTriangle3D([1.0, 0.0, 0.0,   1.0, 1.0, 1.0,   1.0, 0.0, 1.0]);

            // BACK 
            gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
            drawTriangle3D([0.0, 0.0, 1.0,   1.0, 0.0, 1.0,   1.0, 1.0, 1.0]);
            drawTriangle3D([0.0, 0.0, 1.0,   1.0, 1.0, 1.0,   0.0, 1.0, 1.0]);
          
          }
        }
        