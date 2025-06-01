class Circle {
          constructor(position, color, size, segments = 10) {
            this.type = 'circle';
            this.position = position;
            this.color = color;
            this.size = size;
            this.segments = segments;
          }
        
          render(a_Position, u_FragColor, u_Size) {
            const xy = this.position;
            const rgba = this.color;
            const d = this.size / 200.0;
        
            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
            const angleStep = 360 / this.segments;
            for (let angle = 0; angle < 360; angle += angleStep) {
              const angle1 = angle;
              const angle2 = angle + angleStep;
        
              const vec1 = [
                Math.cos(angle1 * Math.PI / 180) * d,
                Math.sin(angle1 * Math.PI / 180) * d
              ];
              const vec2 = [
                Math.cos(angle2 * Math.PI / 180) * d,
                Math.sin(angle2 * Math.PI / 180) * d
              ];
        
              const pt1 = [xy[0] + vec1[0], xy[1] + vec1[1]];
              const pt2 = [xy[0] + vec2[0], xy[1] + vec2[1]];
              const center = [xy[0], xy[1]];
        
              drawTriangle([
                center[0], center[1],
                pt1[0], pt1[1],
                pt2[0], pt2[1]
              ], a_Position);
            }
          }
        }
        
        
        