let sketchCanvas;

function setup() {
  sketchCanvas = createCanvas(300, 300);
  sketchCanvas.parent('sketch-container');
  background(255);
}

function draw() {
  if (mouseIsPressed) {
    stroke(0);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}
