# CSE 160 – Assignment 4: Lighting 
# Tanvi Jambhale

### Lighting Implemented
This assignment implements dynamic lighting and environment effects in a first-person WebGL world. It features interactive movement, animated lighting, normal visualization, and characters. A day-night cycle enhances immersion, and textures are applied to various environmental elements.

## Features
- Multiple textures for ground, Callie, walls, and sky [day and night]
- Automatic day-night cycle every 15 seconds
- First-person camera with:
  - `W` [forward], `A` [left], `S` [backward], `D` [right] for movement
  - `Q` [turn left] and `E` [turn right] to rotate
  - Mouse drag to rotate view
- Immersive environmental design
- Wow Factor - the sky switches from day to night every 15 seconds 

### Lighting
- **Point light** with adjustable RGB color and position (sliders)
- **Specular + Diffuse + Ambient** lighting
- **Spotlight** controls
- Toggle lighting: ON / OFF
- Toggle spotlight: ON / OFF
- Normal visualization mode: ON / OFF

### OBJ Model (Extra Credit)
- Bunny `.obj` file loaded and rendered with lighting
- Integrated with normal matrix and phong shading

## How to Run
1. Start a local web server (textures and `.obj` files require it):
   ```bash
   python -m http.server
2. Open : http://localhost:8000/World.html
3. Test out the game! 

## Resources 
- Professor's Youtube Links : https://www.youtube.com/playlist?list=PLbyTU_tFIkcNbxNKJWEcjfBp97fKE2UuW 
- TA Youtube Links : https://www.youtube.com/playlist?list=PLbyTU_tFIkcMH-g6Bq9eBGtJTIFbvx0He 
- ChatGPT - debugging


