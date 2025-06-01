import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
// -------------------------------------------------------------------

const keysPressed = {};
document.addEventListener('keydown', (e) => keysPressed[e.key.toLowerCase()] = true);
document.addEventListener('keyup', (e) => keysPressed[e.key.toLowerCase()] = false);

// -------------------------------------------------------------------

// Scene setup
const scene = new THREE.Scene();

// -------------------------------------------------------------------

// Skybox
const cubeLoader = new THREE.CubeTextureLoader();
cubeLoader.setPath('./');

const skybox = cubeLoader.load([
  'posx.jpeg', // right
  'negx.jpeg', // left
  'posy.jpeg', // top
  'negy.jpeg', // bottom
  'posz.jpeg', // back
  'negz.jpeg'  // front
]);

scene.background = skybox;

// -------------------------------------------------------------------

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

camera.position.set(0, 2, 11);     
camera.lookAt(new THREE.Vector3(0, 0.5, 0)); 

// -------------------------------------------------------------------

// Pond
gltfLoader.load('pond.glb', (gltf) => {
  const pond = gltf.scene;
  pond.scale.set(0.3, 0.3, 0.3);         
  pond.position.set(-6, 0, 2);            
  scene.add(pond);
}, undefined, (error) => {
  console.error('Error loading pond model:', error);
});


// -------------------------------------------------------------------

// Footsteps Sound - when you move
const listener = new THREE.AudioListener();
camera.add(listener);

const footstepSound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

audioLoader.load('footstep.mp3', function(buffer) {
  footstepSound.setBuffer(buffer);
  footstepSound.setLoop(false);  // one sound per step
  footstepSound.setVolume(0.5);  
});


// -------------------------------------------------------------------

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

//const controls = new THREE.OrbitControls(camera, renderer.domElement);


// -------------------------------------------------------------------

// Lights

// // ambient
// scene.add(new THREE.AmbientLight(0xffffff, 0.5));
// const dirLight = new THREE.DirectionalLight(0xffffff, 1);
// dirLight.position.set(5, 10, 7.5);
// scene.add(dirLight);


// // point
// const pointLight = new THREE.PointLight(0xffcc88, 1, 15);
// pointLight.position.set(0, 3, 0);
// scene.add(pointLight);

// // hemisphere
// const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.6);
// scene.add(hemiLight);

// // spotlight at pond
// const spotLight = new THREE.SpotLight(0x88ccff, 1.5, 10, Math.PI / 6, 0.3, 1);
// spotLight.position.set(-4, 5, 3); 
// spotLight.target.position.set(-6, 0, 2); 

// AMBIENT LIGHT — softer
scene.add(new THREE.AmbientLight(0xffffff, 0.2));

// DIRECTIONAL LIGHT — main sunlight
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// POINT LIGHT — for local glow
const pointLight = new THREE.PointLight(0xffcc88, 0.4, 10); // lowered intensity & range
pointLight.position.set(0, 3, 0);
scene.add(pointLight);

// HEMISPHERE LIGHT — subtle skylight
const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.2);
scene.add(hemiLight);

// SPOTLIGHT — focused effect near pond
const spotLight = new THREE.SpotLight(0x88ccff, 0.8, 10, Math.PI / 6, 0.3, 1);
spotLight.position.set(-4, 5, 3); 
spotLight.target.position.set(-6, 0, 2);
scene.add(spotLight);
scene.add(spotLight.target); // You MUST add the target to scene



// -------------------------------------------------------------------

// Sand
const sandTexture = new THREE.TextureLoader().load('sand.jpg');
sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
sandTexture.repeat.set(10, 10);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: sandTexture,
    color: 0x888888 
  })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);


// -------------------------------------------------------------------

// Gazebo
const gazeboSpot = new THREE.SpotLight(0xffccaa, 1.2, 15, Math.PI / 4, 0.3);
gazeboSpot.position.set(2, 6, 2);
gazeboSpot.target.position.set(5.5, 0, -5); 
scene.add(gazeboSpot);
scene.add(gazeboSpot.target);

gltfLoader.load('japanbesedka.glb', (gltf) => {
  const gazebo = gltf.scene;
  gazebo.scale.set(1.4, 1.4, 1.4); 
  gazebo.position.set(5.5, 0, -5);      
  gazebo.rotation.y = Math.PI/2;     

  scene.add(gazebo);
}, undefined, (error) => {
  console.error('Error loading Gazebo model:', error);
});

// -------------------------------------------------------------------

// Petals
const petalTexture = new THREE.TextureLoader().load('petal.png');

const petalMaterial = new THREE.MeshBasicMaterial({
  map: petalTexture,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
});

// -------------------------------------------------------------------

// Tree
// gltfLoader.load('tree/scene.gltf', (gltf) => {
//   const flowerTree = gltf.scene;

//   // Wrap in container
//   const treeContainer = new THREE.Group();
//   treeContainer.add(flowerTree);

//   // Move the whole group instead of individual parts
//   treeContainer.scale.set(2, 2, 2);
//   treeContainer.position.set(6, 0, 9);  // Adjust X/Y/Z
//   treeContainer.rotation.y = Math.PI / 4;

//   scene.add(treeContainer);
// }, undefined, (error) => {
//   console.error('Error loading flower tree:', error);
// });
gltfLoader.load('tree/scene.gltf', (gltf) => {
  const flowerTree = gltf.scene;

  flowerTree.traverse((child) => {
    if (child.isMesh) {
      const pos = new THREE.Vector3();
      child.getWorldPosition(pos);

      const tooFar = Math.abs(pos.x) > 10 || Math.abs(pos.y) > 10 || Math.abs(pos.z) > 10;
      if (tooFar) {
        child.visible = false; 
      }

      child.frustumCulled = false;
    }
  });

  const treeContainer = new THREE.Group();
  treeContainer.add(flowerTree);
  treeContainer.scale.set(2, 2, 2);
  treeContainer.position.set(6, 0, 9);
  treeContainer.rotation.y = Math.PI / 4;

  scene.add(treeContainer);
});


// -------------------------------------------------------------------

// Lights - Using 2 shapes (sphere and cube)

const lanternGlows = []; 

function createLantern(x, z) {
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

  const lanternBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 1, 0.2),
    baseMaterial
  );
  lanternBase.position.set(x, 0.5, z); 
  scene.add(lanternBase);

  const lightSphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc88,
    emissive: 0xffaa44,
    emissiveIntensity: 1,
  });
  const lightSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 32, 32),
    lightSphereMaterial
  );
  lightSphere.position.set(x, 1.1, z); 
  scene.add(lightSphere);

  const glow = new THREE.PointLight(0xffcc88, 2, 5);
  glow.position.set(x, 1.1, z);
  scene.add(glow);

}

const lanternZs = [-6,-4, -2, 0, 2, 4, 6, 8];
lanternZs.forEach((z, i) => {
  const x = i % 2 === 0 ? -1.2 : 1.2;
  createLantern(x, z);
});


// -------------------------------------------------------------------

// Rock Pathway - Using 1 shape (cylinder) + texture
const steppingStones = []; 

const rockTexture = new THREE.TextureLoader().load('rock.jpg');
const steppingStonePositions = [
  new THREE.Vector3(0, 0.1, 9),
  new THREE.Vector3(0.5, 0.1, 8),
  new THREE.Vector3(0, 0.1, 7),
  new THREE.Vector3(0.5, 0.1, 6),
  new THREE.Vector3(0, 0.1, 5),
  new THREE.Vector3(0.5, 0.1, 4),
  new THREE.Vector3(0, 0.1, 3),
  new THREE.Vector3(0.5, 0.1, 2),
  new THREE.Vector3(0, 0.1, 1),
  new THREE.Vector3(0.5, 0.1, 0),
  new THREE.Vector3(0, 0.1, -1),
  new THREE.Vector3(0.5, 0.1, -2),
  new THREE.Vector3(0, 0.1, -3),
  new THREE.Vector3(0.5, 0.1, -4),
  new THREE.Vector3(0, 0.1, -5),
  new THREE.Vector3(0.5, 0.1, -6),
  new THREE.Vector3(0, 0.1, -7),
  new THREE.Vector3(0.5, 0.1, -8),
  new THREE.Vector3(0, 0.1, -9)
];

// animating the pathway stones 
for (const pos of steppingStonePositions) {
  const step = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16),
    new THREE.MeshStandardMaterial({ map: rockTexture })
  );
  step.position.copy(pos);
  scene.add(step);
  steppingStones.push(step); 
}

// -------------------------------------------------------------------

// petals floating
const petals = [];

function createFloatingPetals(count = 50) {
  for (let i = 0; i < count; i++) {
    const petal = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, 0.2),
      petalMaterial
    );
    
    petal.position.set(
      Math.random() * 30 - 15,
      Math.random() * 8 + 4,   
      Math.random() * 30 - 15  
    );

    petal.rotation.y = Math.random() * Math.PI * 2;

    petal.userData = {
      offset: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.01
    };

    scene.add(petal);
    petals.push(petal);
  }
}

createFloatingPetals();

// -------------------------------------------------------------------

let lastStepTime = 0;
const stepInterval = 350; 

function animate() {
  const moveSpeed = 0.05;
  const rotationSpeed = 0.005;
  const currentTime = performance.now();

  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  let moved = false;

  if (keysPressed['q']) camera.rotation.y += rotationSpeed;
  if (keysPressed['e']) camera.rotation.y -= rotationSpeed;

  forward.set(Math.sin(camera.rotation.y), 0, Math.cos(camera.rotation.y));
  right.set(Math.cos(camera.rotation.y), 0, -Math.sin(camera.rotation.y));

  if (keysPressed['w']) {
    camera.position.addScaledVector(forward, -moveSpeed);
    moved = true;
  }
  if (keysPressed['s']) {
    camera.position.addScaledVector(forward, moveSpeed);
    moved = true;
  }
  if (keysPressed['a']) {
    camera.position.addScaledVector(right, -moveSpeed);
    moved = true;
  }
  if (keysPressed['d']) {
    camera.position.addScaledVector(right, moveSpeed);
    moved = true;
  }

  // Footstep sound
  if (moved && currentTime - lastStepTime > stepInterval) {
    if (footstepSound.isPlaying) footstepSound.stop();
    footstepSound.play();
    lastStepTime = currentTime;
  }

  // spin the pathway stones
  steppingStones.forEach((stone) => {
    //stone.position.z += 0.0003;
    stone.rotation.y += 0.002; 
  });


  // petals falling
  petals.userData = {
    offset: Math.random() * Math.PI * 2,
    speed: 0.01 + Math.random() * 0.01
  };

  petals.forEach((petal) => {
  const time = performance.now() * 0.001;
  petal.position.y -= petal.userData.speed;

  petal.position.x += Math.sin(time + petal.userData.offset) * 0.002;
  petal.rotation.z += 0.001;
  });

  const time = performance.now() * 0.001;
  petals.forEach((petal) => {
    petal.position.y -= petal.userData.speed;
    petal.position.x += Math.sin(time + petal.userData.offset) * 0.002;
    petal.rotation.z += 0.001;

    if (petal.position.y < 0) {
      petal.position.set(
        Math.random() * 30 - 15,
        Math.random() * 8 + 4,
        Math.random() * 30 - 15
      );
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
