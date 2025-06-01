let rocketOffset = 0;
let starAngle = 0;
let launchInterval = null;
let spinInterval = null;

// Drawing the Rocket Scene Drawing 
function drawRocketScene(offset = 0, starRotation = 0) {
  // Clear only scene elements
  sceneObjects = []; 

  const red = [1.0, 0.0, 0.0, 1.0];
  const white = [1.0, 1.0, 1.0, 1.0];
  const blue = [0.5, 0.9, 1.0, 1.0];
  const orange = [1.0, 0.5, 0.0, 1.0];
  const yellow = [1.0, 1.0, 0.0, 1.0];

  const rocketParts = [
    new Triangle([0.0, 0.31 + offset], white, 10),
    new Triangle([0.0, 0.35 + offset], red, 10),
    new Triangle([-0.04, 0.28 + offset], red, 10),
    new Triangle([0.04, 0.28 + offset], red, 10),

    new Triangle([-0.04, 0.28 + offset], white, 10),
    new Triangle([0.04, 0.28 + offset], white, 10),
    new Triangle([0.0, 0.22 + offset], white, 10),
    new Triangle([-0.04, 0.22 + offset], white, 10),
    new Triangle([0.04, 0.22 + offset], white, 10),
    new Triangle([0.0, 0.16 + offset], white, 10),
    new Triangle([-0.04, 0.16 + offset], white, 10),
    new Triangle([0.04, 0.16 + offset], white, 10),
    new Triangle([0.0, 0.10 + offset], white, 10),
    new Triangle([-0.04, 0.10 + offset], white, 10),
    new Triangle([0.04, 0.10 + offset], white, 10),

    new Circle([0.0, 0.22 + offset], blue, 6, 30),

    new Triangle([-0.08, 0.08 + offset], red, 10),
    new Triangle([-0.08, 0.03 + offset], red, 10),
    new Triangle([0.08, 0.08 + offset], red, 10),
    new Triangle([0.08, 0.03 + offset], red, 10),

    new Triangle([0.0, -0.04 + offset], yellow, 10),
    new Triangle([-0.03, -0.10 + offset], orange, 10),
    new Triangle([0.03, -0.10 + offset], orange, 10),
    new Triangle([0.0, -0.16 + offset], yellow, 10)
  ];

  // Stars -- roating the triangles so they actually look like stars 
  const stars = [
    ...createStar(-0.6, 0.4, starRotation),
    ...createStar(0.6, 0.4, starRotation),
    ...createStar(-0.6, 0.0, starRotation),
    ...createStar(0.6, 0.0, starRotation),
    ...createStar(0.0, 0.6, starRotation)
  ];
  rocketParts.forEach((s) => sceneObjects.push(s));
  stars.forEach((s) => sceneObjects.push(s));  

  renderAllShapes();
}

// Stars 
function createStar(xOffset, yOffset, rotationAngle = 0, scale = 0.08) {
  const yellow = [1.0, 1.0, 0.0, 1.0];
  const triangles = [];

  const baseVerts = [
    xOffset, yOffset + scale,
    xOffset - scale * 0.6, yOffset - scale * 0.6,
    xOffset + scale * 0.6, yOffset - scale * 0.6
  ];

  const angles = [0, 72, 144, 216, 288];
  for (const angle of angles) {
    const rotatedVerts = rotateTriangle(baseVerts, xOffset, yOffset, angle + rotationAngle);
    triangles.push(new Triangle([xOffset, yOffset], yellow, 10, rotatedVerts));
  }

  return triangles;
}

// Roatating the triangles 
function rotateTriangle(verts, cx, cy, angleDegrees) {
  const angle = angleDegrees * Math.PI / 180;
  const rotated = [];

  for (let i = 0; i < verts.length; i += 2) {
    const x = verts[i];
    const y = verts[i + 1];
    const dx = x - cx;
    const dy = y - cy;

    const xRot = cx + dx * Math.cos(angle) - dy * Math.sin(angle);
    const yRot = cy + dx * Math.sin(angle) + dy * Math.cos(angle);

    rotated.push(xRot, yRot);
  }

  return rotated;
}

// Animation for Rocket launching 
function startRocketLaunch() {
  if (launchInterval) return;
  rocketOffset = 0;
  launchInterval = setInterval(() => {
    rocketOffset += 0.01;
    if (rocketOffset > 1.0) {
      clearInterval(launchInterval);
      launchInterval = null;
    }
    drawRocketScene(rocketOffset, starAngle);
  }, 30);
}

// Animation for Spinning Stars 
function startStarSpin() {
  if (spinInterval) return;
  spinInterval = setInterval(() => {
    starAngle = (starAngle + 5) % 360;
    drawRocketScene(rocketOffset, starAngle);
  }, 60);
}



// ------------------- PREVIOUS CODE BEFORE FINAL ALTERATIONS -----------------------------------------------------

// function drawRocketScene() {


//           const red = [1.0, 0.0, 0.0, 1.0];
//           const white = [1.0, 1.0, 1.0, 1.0];
//           const blue = [0.5, 0.9, 1.0, 1.0];
//           const orange = [1.0, 0.5, 0.0, 1.0];
//           const yellow = [1.0, 1.0, 0.0, 1.0];
        
//           const rocketParts = [
//             // Nose
//             new Triangle([0.0, 0.31], white, 10),
//             new Triangle([0.0, 0.35], red, 10),
//             new Triangle([-0.04, 0.28], red, 10),
//             new Triangle([0.04, 0.28], red, 10),
        
//             // Body
//             new Triangle([-0.04, 0.28], white, 10),
//             new Triangle([0.04, 0.28], white, 10),
//             new Triangle([0.0, 0.22], white, 10),
//             new Triangle([-0.04, 0.22], white, 10),
//             new Triangle([0.04, 0.22], white, 10),
//             new Triangle([0.0, 0.16], white, 10),
//             new Triangle([-0.04, 0.16], white, 10),
//             new Triangle([0.04, 0.16], white, 10),
//             new Triangle([0.0, 0.10], white, 10),
//             new Triangle([-0.04, 0.10], white, 10),
//             new Triangle([0.04, 0.10], white, 10),
        
//             // Window
//             new Circle([0.0, 0.22], blue, 6, 30),
        
//             // Fins
//             new Triangle([-0.08, 0.08], red, 10),
//             new Triangle([-0.08, 0.03], red, 10),
//             new Triangle([0.08, 0.08], red, 10),
//             new Triangle([0.08, 0.03], red, 10),
        
//             // Flame
//             new Triangle([0.0, -0.04], yellow, 10),
//             new Triangle([-0.03, -0.10], orange, 10),
//             new Triangle([0.03, -0.10], orange, 10),
//             new Triangle([0.0, -0.16], yellow, 10)
//           ];
        
//           rocketParts.forEach(s => shapesList.push(s));
        
//           // Stars
//           const stars = [
//             ...createStar(-0.6, 0.4),
//             ...createStar(0.6, 0.4),
//             ...createStar(-0.6, 0.0),
//             ...createStar(0.6, 0.0),
//             ...createStar(0.0, 0.6)
//           ];
//           stars.forEach(s => shapesList.push(s));
        
//           renderAllShapes();
//         }
        
//         function createStar(xOffset, yOffset, scale = 0.08) {
//           const yellow = [1.0, 1.0, 0.0, 1.0];
//           const triangles = [];
        
//           const baseVerts = [
//             xOffset, yOffset + scale,
//             xOffset - scale * 0.6, yOffset - scale * 0.6,
//             xOffset + scale * 0.6, yOffset - scale * 0.6
//           ];
        
//           const angles = [0, 72, 144, 216, 288];
        
//           for (const angle of angles) {
//             const rotatedVerts = rotateTriangle(baseVerts, xOffset, yOffset, angle);
//             triangles.push(new Triangle([xOffset, yOffset], yellow, 10, rotatedVerts));
//           }
        
//           return triangles;
//         }
        
//         function rotateTriangle(verts, cx, cy, angleDegrees) {
//           const angle = angleDegrees * Math.PI / 180;
//           const rotated = [];
        
//           for (let i = 0; i < verts.length; i += 2) {
//             const x = verts[i];
//             const y = verts[i + 1];
//             const dx = x - cx;
//             const dy = y - cy;
        
//             const xRot = cx + dx * Math.cos(angle) - dy * Math.sin(angle);
//             const yRot = cy + dx * Math.sin(angle) + dy * Math.cos(angle);
        
//             rotated.push(xRot, yRot);
//           }
        
//           return rotated;
//         }

// ------------------------------------------------------------------------------------------
        