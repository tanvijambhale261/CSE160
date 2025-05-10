class Camera {
  constructor() {
    this.eye = new Vector3([10, 0.3, 10]);    
    this.at  = new Vector3([9, 0.3, 9]);      
    this.up = new Vector3([0, 1, 0]);  
    this.speed = 0.1;                 
    this.rotationSpeed = 3.0;         
  }
  forward() {
    let f = new Vector3(this.at.elements);
    f.sub(this.eye);
    f.normalize();
    f.mul(this.speed);
        
    this.eye.add(f);
    this.at.add(f);
    }
        
  back() {
    let f = new Vector3(this.eye.elements);
    f.sub(this.at);
    f.normalize();
    f.mul(this.speed);
    this.eye.add(f);
    this.at.add(f);
    }
        
  left() {
    const f = new Vector3(this.at.elements).sub(this.eye).normalize();
            
    const s = new Vector3();
    s.elements[0] = f.elements[1]*this.up.elements[2] - f.elements[2]*this.up.elements[1];
    s.elements[1] = f.elements[2]*this.up.elements[0] - f.elements[0]*this.up.elements[2];
    s.elements[2] = f.elements[0]*this.up.elements[1] - f.elements[1]*this.up.elements[0];
    s.normalize().mul(this.speed);
            
    this.eye.sub(s);
    this.at.sub(s);
  }
          

  right() {
    const f = new Vector3(this.at.elements).sub(this.eye).normalize();
          
    const s = new Vector3();
    s.elements[0] = f.elements[1] * this.up.elements[2] - f.elements[2] * this.up.elements[1];
    s.elements[1] = f.elements[2] * this.up.elements[0] - f.elements[0] * this.up.elements[2];
    s.elements[2] = f.elements[0] * this.up.elements[1] - f.elements[1] * this.up.elements[0];
    s.normalize().mul(this.speed);
          
    this.eye.add(s);
    this.at.add(s);
  }
          
          
        
  turnLeft() {
    let dir = new Vector3(this.at.elements).sub(this.eye);
    let rotationMatrix = new Matrix4().setRotate(this.rotationSpeed, 0, 1, 0);

    let newDir = new Vector3([
      rotationMatrix.elements[0] * dir.elements[0] + rotationMatrix.elements[4] * dir.elements[1] + rotationMatrix.elements[8] * dir.elements[2],
      rotationMatrix.elements[1] * dir.elements[0] + rotationMatrix.elements[5] * dir.elements[1] + rotationMatrix.elements[9] * dir.elements[2],
      rotationMatrix.elements[2] * dir.elements[0] + rotationMatrix.elements[6] * dir.elements[1] + rotationMatrix.elements[10] * dir.elements[2],
    ]);

    this.at.set(this.eye).add(newDir);
  }

  turnRight() {
    let dir = new Vector3(this.at.elements).sub(this.eye);
    let rotationMatrix = new Matrix4().setRotate(-this.rotationSpeed, 0, 1, 0);

    let newDir = new Vector3([
      rotationMatrix.elements[0] * dir.elements[0] + rotationMatrix.elements[4] * dir.elements[1] + rotationMatrix.elements[8] * dir.elements[2],
      rotationMatrix.elements[1] * dir.elements[0] + rotationMatrix.elements[5] * dir.elements[1] + rotationMatrix.elements[9] * dir.elements[2],
      rotationMatrix.elements[2] * dir.elements[0] + rotationMatrix.elements[6] * dir.elements[1] + rotationMatrix.elements[10] * dir.elements[2],
    ]);

    this.at.set(this.eye).add(newDir);
  }
}