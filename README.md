JavaScript Chess Game

A lightweight, interactive two-player web-based chess game built using pure JavaScript, jQuery, HTML5, and CSS3. It features move highlighting, turn-based play, piece captures, castling support, and custom visual styling with CSS animations

 🚀 Features

* **Interactive Board & Movement:** Click to select a piece, view valid moves highlighted in neon green, and click a highlighted square to execute the move.

* **Turn Management:** Tracks turn toggling between White and Black with custom UI notification banners.

* **Special Moves Support:** Castling support for both White and Black king-side rooks.
* **Line-of-Sight & Collision Logic:** Accurate sliding movement algorithms for Bishops, Rooks, and Queens, plus leap movements for Knights.
* **Visual Effects:** Smooth tile hover animations, CSS shakes, and neon glow effects for highlighted options.
* **No Heavy Frameworks:** Pure client-side implementation using jQuery 

 🛠️ Tech Stack

* **HTML5:** Board structure and coordinate labeling.
* **CSS3:** Board grid styling, tile positioning, hover state animations, and neon keyframe effects.
* **JavaScript / jQuery 3.2.1:** Game state management, movement validation, capture logic, and turn flow control.
* **HTML Entities:** Standard Unicode symbols for rendering chess pieces (`&#9812;` through `&#9823;`).

## 📂 Project Structure

```text
├── index.html   # Main HTML document containing board structure and script links
├── style.css    # Board styling, grid alignment, animations, and neon effects
└── script.js    # Core game logic, state variables, piece options, and click handlers
● How to Play
​Start: White always moves first.  
​Select Piece: Click on any piece corresponding to the current active turn to display available legal target squares.  
​Move / Capture:
​Click a highlighted green square to move into an empty space.  
​Click an enemy piece highlighted in green to capture it.  
​Castling: Click the King when eligible to trigger automatic double-square castling alongside the corresponding Rook.  
