// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFG7zikKRASr9VUbd_hZhjFt1S7Ew3oSE",
  authDomain: "project-whiteboard-4e298.firebaseapp.com",
  databaseURL: "https://project-whiteboard-4e298-default-rtdb.firebaseio.com",
  projectId: "project-whiteboard-4e298",
  storageBucket: "project-whiteboard-4e298.appspot.com",
  messagingSenderId: "18950636605",
  appId: "1:18950636605:web:d10bdd28844d6eaed0d654",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const drawingsRef = ref(database, "drawings");

// Canvas setup
const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;

let isDrawing = false;
let color = "#000000"; // Default color

// Color picker setup
const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", (event) => {
  color = event.target.value; // Update marker color
});

// Mouse events for drawing
canvas.addEventListener("mousedown", () => {
  isDrawing = true;
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  ctx.beginPath(); // Reset the path
});

canvas.addEventListener("mouseout", () => {
  isDrawing = false; // Stop drawing if the mouse leaves the canvas
});

canvas.addEventListener("mousemove", (event) => {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Send drawing data to Firebase
  push(drawingsRef, { x, y, color });

  // Draw on canvas locally
  drawOnCanvas(x, y, color);
});

// Draw on canvas function
function drawOnCanvas(x, y, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}
const clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", () => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Clear Firebase database
  remove(drawingsRef).catch((error) => console.error("Error clearing database:", error));
});
// Listen for new drawings from Firebase
onChildAdded(drawingsRef, (snapshot) => {
  const { x, y, color } = snapshot.val();
  drawOnCanvas(x, y, color);
});

