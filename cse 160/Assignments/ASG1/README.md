# 🚀 Assignment 1 : Painting 

**Tanvi Jambhale** for **CSE 160**

## Features Implemented

### Basic Drawing
- Draw **triangles** and **circles** with:
  - Adjustable RGB color sliders
  - Size and segment sliders for customization
  - Dynamic shape rendering using mouse clicks or dragging

### UI Improvements
- Buttons are styled for better usability
- Sliders are color-coded:
  - Red = 🔴
  - Green = 🟢
  - Blue = 🔵
- Controls organized into clean rows

### Rocket Scene (Hardcoded)
  - Pressing `Draw Rocket Scene` displays a:
    - Custom rocket built from triangles and circles
    - Five stars arranged in the background to make a star 

### Animation Buttons
- `Launch Rocket` – Animates rocket moving up
- `Spin Stars` – Continuously rotates the stars around their center

### Stickers (Interactive)
Click to place unlimited planet-themed stickers:
- 🌕 **Moon** – Gray circle with craters
- ☄️ **Comet** – Circular head with flame trails
- 🌍 **Earth** – Blue base with green triangles as land
- 👽 **Alien** – Green head with black eyes

### Smart Drawing Logic
- Stickers can be placed at any location on the black canvas
- Regular shapes (circle/triangle) can still be drawn normally while the animations run in the background 
- Animations do not block other drawing actions

### Canvas Control
- `Clear Canvas` removes **only user drawings**


## How to Use and Draw! 

### Draw Your Own Shapes
- **Pick a shape**: Click `Draw Triangle` or `Draw Circle`
- **Customize**:
  - Adjust the **R/G/B sliders** to pick a color
  - Use the **Size slider** to control how big the shape is
  - For circles, try changing the **Segments slider** to make it more or less round
- **Click on the canvas** to place your shape
- **Click and drag** for continuous drawing

### Add Space-Themed Stickers
- Choose a sticker: `Moon`, `Comet`, `Earth`, or `Alien`
- Click on the canvas to place the sticker at that exact spot
- Place **as many as you want** – decorate your galaxy :) 

### Rocket Features
- Click `Draw Rocket Scene` to draw a static rocket and stars
- Click `Launch Rocket` to animate the rocket flying upward
- Click `Spin Stars` to animate the stars rotating in place

### Canvas
- Press `Clear Canvas` to remove all your drawings (stickers and shapes)
