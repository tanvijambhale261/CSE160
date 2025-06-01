   // DrawRectangle.js
   function main() {
    // Retrieve <canvas> element                                  <- (1)
     var canvas = document.getElementById('example');
     if (!canvas) {
       console.log('Failed to retrieve the <canvas> element');
       return;
     }

   // Get the rendering context for 2DCG                          <- (2)
   var ctx = canvas.getContext('2d');

   // Draw a black                                    <- (3)
   ctx.fillStyle = 'black';
   ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
   
   // red vector line
   let v1 = new Vector3([2.25, 2.25, 0]);
   drawVector(v1, 'red');
  }

  // drawing the vector 
  function drawVector(v, color)
  {
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
  
    ctx.beginPath();         
    ctx.moveTo(200, 200);     
    ctx.lineTo(200 + v.elements[0] * 10, 200 - v.elements[1] * 10);
    ctx.strokeStyle = color;  
    ctx.lineWidth = 2;
    ctx.stroke();   

  }

  // handle draw button
  function handleDrawEvent() {
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
  
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Vector 1 
    var x = parseFloat(document.getElementById('x-input').value);
    var y = parseFloat(document.getElementById('y-input').value);
  
    let v1 = new Vector3([x, y, 0]);
    drawVector(v1, 'red');

    // Vector 2 
    var x2 = parseFloat(document.getElementById('x2-input').value);
    var y2 = parseFloat(document.getElementById('y2-input').value);
    let v2 = new Vector3([x2, y2, 0]);
    drawVector(v2, 'blue');
  }


  // operations functions drawing 
  function handleDrawOperationEvent() {
    var canvas = document.getElementById('example');
    var ctx = canvas.getContext('2d');
  
    // clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // get v1 and v2 inputs
    let x1 = parseFloat(document.getElementById('x-input').value);
    let y1 = parseFloat(document.getElementById('y-input').value);
    let x2 = parseFloat(document.getElementById('x2-input').value);
    let y2 = parseFloat(document.getElementById('y2-input').value);
  
    let v1 = new Vector3([x1, y1, 0]);
    let v2 = new Vector3([x2, y2, 0]);
  
    // drawing the 2 vectors 
    drawVector(v1, 'red');
    drawVector(v2, 'blue');
  
    let operation = document.getElementById('operation-select').value;
    let scalar = parseFloat(document.getElementById('scalar-input').value);
  
    // operations
    if (operation === 'add') 
    {
      let v3 = new Vector3([x1, y1, 0]).add(v2);
      drawVector(v3, 'green');
    } 
    else if (operation === 'sub') 
    {
      let v3 = new Vector3([x1, y1, 0]).sub(v2);
      drawVector(v3, 'green');
    } 
    else if (operation === 'mul') 
    {
      let v3 = new Vector3([x1, y1, 0]).mul(scalar);
      let v4 = new Vector3([x2, y2, 0]).mul(scalar);
      drawVector(v3, 'green');
      drawVector(v4, 'green');
    } 
    else if (operation === 'div') 
    {
      let v3 = new Vector3([x1, y1, 0]).div(scalar);
      let v4 = new Vector3([x2, y2, 0]).div(scalar);
      drawVector(v3, 'green');
      drawVector(v4, 'green');
    }
    // magnitude 
    else if (operation === 'mag') 
    {
      console.log("Magnitude v1:", v1.magnitude());
      console.log("Magnitude v2:", v2.magnitude());
    } 
    // normalized 
    else if (operation === 'norm') 
    {
      let v1Normalized = new Vector3([x1, y1, 0]).normalize();
      let v2Normalized = new Vector3([x2, y2, 0]).normalize();
      drawVector(v1Normalized, 'green');
      drawVector(v2Normalized, 'green');
    }
    // angle between 
    else if (operation === 'angle') 
    {
      let angle = angleBetween(v1, v2);
      if (angle !== null) {
        console.log("Angle between v1 and v2:", angle.toFixed(2), "degrees");
      } else {
        console.log("Cannot compute angle with zero-length vector.");
      }
    }
    // area 
    else if (operation === 'area') 
    {
      let area = areaTriangle(v1, v2);
      console.log("Area of the triangle:", area);
    }
    
  }


  // angle between 
  function angleBetween(v1, v2) {
    let dotProduct = Vector3.dot(v1, v2);
    let mag1 = v1.magnitude();
    let mag2 = v2.magnitude();
  
    if (mag1 === 0 || mag2 === 0) return null; 
  
    let cosTheta = dotProduct / (mag1 * mag2);
    let angleRad = Math.acos(cosTheta);       // in radians
    let angleDeg = angleRad * (180 / Math.PI); // convert to degrees
  
    return angleDeg;
  }


  // area triangle 
  function areaTriangle(v1, v2) {
    let crossProduct = Vector3.cross(v1, v2);
    let areaParallelogram = crossProduct.magnitude(); // ||v1 x v2||
    return 0.5 * areaParallelogram; 
  }
  
  
  
  

