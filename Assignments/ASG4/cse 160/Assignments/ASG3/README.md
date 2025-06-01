# CSE 160 – Assignment 3: Blocky World

### Callie's Adventure: Find the Lost Cow!

This is a first-person world where your mission is to find Callie, a lost cow wandering in the wild! 
Navigate through a terrain made of textured blocks by using keyboard and mouse controls to explore 
and complete the mission duirng day and night time!

## Features

- Fully generated 32x32 world
- Multiple textures for ground, Callie, walls, and sky [day and night]
- Cow character placed randomly in the world
- Automatic day-night cycle every 15 seconds
- First-person camera with:
  - `W` [forward], `A` [left], `S` [backward], `D` [right] for movement
  - `Q` [turn left] and `E` [turn right] to rotate
  - Mouse drag to rotate view
- Add or remove blocks using: there is a certain angle to delete and remove blocks 
  - `Spacebar` – Add block
  - `X` – Remove block
- Immersive environmental design
- Wow Factor - the sky switches from day to night every 15 seconds 
- Simple story-based objective: find Callie!

## How to Run

1. Start a local web server (required to load textures):
   ```bash
   python -m http.server
2. Open : http://localhost:8000/World.html
3. Test out the game! 

## Resources 
- Professor's Youtube Links : https://www.youtube.com/watch?v=EBO9gk2feVY&list=PLbyTU_tFIkcOs7XVopOy5Oti-HGiIZx0J
- TA Youtube Links : https://www.youtube.com/playlist?list=PLbyTU_tFIkcMK5l9lUnM0O3I3wmko8lPa
- ChatGPT - debugging
- Time Uniform : https://stackoverflow.com/questions/45131804/how-to-set-a-time-uniform-in-webgl
