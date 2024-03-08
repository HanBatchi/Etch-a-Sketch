const container = document.querySelector("#display");
const colorChoice = document.querySelector("#colorChange");
const resetBtn = document.querySelector("#resetBtn");
const displaySizeInput = document.querySelector("#display-size");
const showSize = document.querySelector("#size-value");
const darkerBtn = document.querySelector(".darker-btn");
const eraserBtn = document.querySelector(".eraser-btn");
const randomBtn = document.querySelector(".random-btn");
const lighterBtn = document.querySelector(".lighter-btn");



function createSquares(numSquares) {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const squareSize = Math.sqrt((containerWidth * containerHeight) / numSquares);
  container.innerHTML = "";

  for(let i = 0; i < numSquares; i++) {
    const squares = document.createElement("div");
    squares.classList.add("square");
    setColor(squares);
    setSquarElement(squares, squareSize);
    container.appendChild(squares);
  }
}

function setSquarElement(e, size){
  e.style.backgroundColor = "white";
  e.style.width = size + "px";
  e.style.borderRadius = "3px"
  e.style.height = size + "px";
  e.style.transition = "0.1s";

}
function setColor(e){ 
  e.addEventListener("mouseover", () => {
    e.style.backgroundColor = colorChoice.value;
  });
}

colorChoice.addEventListener("change", () => {
  const squares = document.querySelectorAll(".square");
  squares.forEach(square => {
    square.addEventListener("mouseover", () =>{
      square.style.backgroundColor = colorChoice.value;
    });
  });
});
resetBtn.addEventListener("click", () =>{
  const squares = document.querySelectorAll(".square");
  squares.forEach(square =>{

    square.style.backgroundColor = "white";
  })
})

displaySizeInput.addEventListener("input", () =>{
  const numSquares = displaySizeInput.value ** 2;
  showSize.textContent = `${displaySizeInput.value} x ${displaySizeInput.value}`
  createSquares(numSquares)
});  


darkerBtn.addEventListener("click", () => {
  const currentColor = colorChoice.value;
  const darkerColor = darkenColor(currentColor);
  colorChoice.value = darkerColor;
  // Update the squares with the new darker color
  const squares = document.querySelectorAll(".square");
  squares.forEach(square => {
    square.addEventListener("mouseover", () => {
      square.style.backgroundColor = darkerColor;
    });
  });
});

function darkenColor(color) {
  // Convert hex color to RGB
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  // Convert RGB to HSL
  let hsl = rgbToHsl(r, g, b);

  // Decrease the lightness by 10% (clamp it to [0, 100])
  hsl[2] = Math.max(hsl[2] - 10, 0);

  // Convert HSL back to RGB
  const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

  // Convert the RGB values back to hex
  const darkerHex = "#" + rgb[0].toString(16).padStart(2, '0') + rgb[1].toString(16).padStart(2, '0') + rgb[2].toString(16).padStart(2, '0');

  return darkerHex;
}


lighterBtn.addEventListener("click", () => {
  const currentColor = colorChoice.value;
  const lighterColor = lightenColor(currentColor);
  colorChoice.value = lighterColor;
  // Update the squares with the new lighter color
  const squares = document.querySelectorAll(".square");
  squares.forEach(square => {
    square.addEventListener("mouseover", () => {
      square.style.backgroundColor = lighterColor;
    });
  });
});

function lightenColor(color) {

  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  let hsl = rgbToHsl(r, g, b);

  // Increase the lightness by 10% (clamp it to [0, 100])
  hsl[2] = Math.min(hsl[2] + 10, 100);

  const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

  const lighterHex = "#" + rgb[0].toString(16).padStart(2, '0') + rgb[1].toString(16).padStart(2, '0') + rgb[2].toString(16).padStart(2, '0');

  return lighterHex;
}

randomBtn.addEventListener("click", () => {
  const squares = document.querySelectorAll(".square");
  squares.forEach(square => {
    square.addEventListener("mouseover", () => {
      square.style.backgroundColor = getRandomColor();
      randomBtn.style.transition= "0.1s";
      randomBtn.style.backgroundColor = square.style.backgroundColor;

    });
    square.addEventListener("mouseout",() => {
      randomBtn.style.backgroundColor = black;
    })
  });
});

function getRandomColor() {
  // Generate random values for R, G, and B
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `rgb(${r},${g},${b})`;
}

eraserBtn.addEventListener("click", () =>{
  const currentColor = colorChoice.value;
  const erase = "white";
  colorChoice.value = erase;
  
  const squares = document.querySelectorAll(".square");
  squares.forEach(square => {
    square.addEventListener("mouseover",() => {
      square.style.backgroundColor = erase;
    });
  });
});


function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    // achromatic
    h = s = 0; 
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    // achromatic
    r = g = b = l; 
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


window.onload = () => {
  createSquares(196);
}