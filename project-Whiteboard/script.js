// Canvas setup
const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;

// State variables
let drawing = false;
let erasing = false;
let markerSize = 5;

// Event listeners
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

document.getElementById("colorPicker").addEventListener("change", (e) => {
  ctx.strokeStyle = e.target.value;
});

document.getElementById("clearButton").addEventListener("click", clearCanvas);
document.getElementById("increaseSize").addEventListener("click", () => {
  markerSize += 2; // Increase marker size
});
document.getElementById("decreaseSize").addEventListener("click", () => {
  markerSize = Math.max(2, markerSize - 2); // Decrease marker size (minimum size is 2)
});
document.getElementById("eraserToggle").addEventListener("click", () => {
  erasing = !erasing; // Toggle eraser mode
  ctx.strokeStyle = erasing ? "#ffffff" : document.getElementById("colorPicker").value;
});

// Drawing functions
function startDrawing(e) {
  drawing = true;
  draw(e);
}

function draw(e) {
  if (!drawing) return;

  ctx.lineWidth = markerSize;
  ctx.lineCap = "round";

  if (erasing) {
    ctx.globalCompositeOperation = "destination-out"; // Erase mode
  } else {
    ctx.globalCompositeOperation = "source-over"; // Normal draw mode
  }

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function stopDrawing() {
  drawing = false;
  ctx.beginPath();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
