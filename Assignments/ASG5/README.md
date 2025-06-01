# 🌸 CSE160 – Assignment 5: Spring Garden
### Tanvi Jambhale

This interactive WebGL scene was created using **Three.js**, combining animation, lighting, skyboxes, 3D models, 
textures, sound, and movement controls to build a relaxing **spring garden world**.

---

## Features & Interactions

✔️ **Mouse and Keyboard Navigation**  
- `W`, `A`, `S`, `D` – Move forward, left, back, right  
- `Q` / `E` – Rotate view [left/right]
- OrbitControls to freely pan around the world [use your mouse]

✔️ **Garden Scene**  
- Floating **petals** (animated!)  
- **Stepping stones** that gently rotate  
- Modeled **Japanese gazebo**  
- **Lanterns** that glow onto the ground
- pond
- cheery blossom tree

✔️ **Audio**  
- Footstep sounds play when you move (`footstep.mp3`)

✔️ **Lighting**  
- `AmbientLight` – General brightness  
- `PointLight` – For lanterns and glowing effects  
- `HemisphereLight` – Subtle tone blending  
- Adjusted **spotlight** to highlight the gazebo and the pond

✔️ **Texturing**  
- Ground (sand) uses `sand.jpg`  
- Stones use a realistic `rock.jpg` texture  
- Petals use transparent `petal.png`  
- Full cubemap skybox: `posx.jpeg`, `negx.jpeg`, etc.

---

## WOW Factor

**Petal Animation & Footsteps**  
- Delicate pink petals float down from the sky with randomized offsets and speeds,
  creating a tranquil and immersive garden atmosphere. The animation mimics gentle
  drifting motion using sine waves and gradual descent.
- Each time the user moves using WASD keys, a soft footstep sound is triggered,
  enhancing the feeling of presence and grounding the player within the environment.

--- 
**Resources**
- https://threejs.org/manual/#en/installation
- https://ucsc-cse-160.github.io/docs/labs/submission.html
- CSE 160 Teaching Team 
- ChatGPT - debugging
