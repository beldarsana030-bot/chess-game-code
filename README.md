.JavaScript Chess Game

A lightweight, interactive two-player web-based chess game built using pure JavaScript, jQuery, HTML5, and CSS3[span_0](start_span)[span_0](end_span)[span_1](start_span)[span_1](end_span)[span_2](start_span)[span_2](end_span). It features move highlighting, turn-based play, piece captures, castling support, and custom visual styling with CSS animations[span_3](start_span)[span_3](end_span)[span_4](start_span)[span_4](end_span).

---

## 🚀 Features

* **Interactive Board & Movement:** Click to select a piece, view valid moves highlighted in neon green, and click a highlighted square to execute the move[span_5](start_span)[span_5](end_span)[span_6](start_span)[span_6](end_span).
* **Turn Management:** Tracks turn toggling between White and Black with custom UI notification banners[span_7](start_span)[span_7](end_span).
* **Special Moves Support:** Castling support for both White and Black king-side rooks[span_8](start_span)[span_8](end_span).
* **Line-of-Sight & Collision Logic:** Accurate sliding movement algorithms for Bishops, Rooks, and Queens, plus leap movements for Knights[span_9](start_span)[span_9](end_span).
* **Visual Effects:** Smooth tile hover animations, CSS shakes, and neon glow effects for highlighted options[span_10](start_span)[span_10](end_span).
* **No Heavy Frameworks:** Pure client-side implementation using jQuery DOM manipulation[span_11](start_span)[span_11](end_span)[span_12](start_span)[span_12](end_span).

---

## 🛠️ Tech Stack

* **HTML5:** Board structure and coordinate labeling[span_13](start_span)[span_13](end_span).
* **CSS3:** Board grid styling, tile positioning, hover state animations, and neon keyframe effects[span_14](start_span)[span_14](end_span).
* **JavaScript / jQuery 3.2.1:** Game state management, movement validation, capture logic, and turn flow control[span_15](start_span)[span_15](end_span)[span_16](start_span)[span_16](end_span).
* **HTML Entities:** Standard Unicode symbols for rendering chess pieces (`&#9812;` through `&#9823;`)[span_17](start_span)[span_17](end_span).

---

## 📂 Project Structure

```text
├── index.html   # Main HTML document containing board structure and script links
├── style.css    # Board styling, grid alignment, animations, and neon effects
└── script.js    # Core game logic, state variables, piece options, and click handlers
