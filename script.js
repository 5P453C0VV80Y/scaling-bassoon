const image = document.getElementById('sourceImage');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
 
// Get all the sliders of the image
const brightnessSlider = document.getElementById("brightnessSlider");
const contrastSlider = document.getElementById("contrastSlider");
const grayscaleSlider = document.getElementById("grayscaleSlider");
const hueRotateSlider = document.getElementById("hueRotateSlider");
const saturateSlider = document.getElementById("saturationSlider");
const drawToggler = document.getElementById("drawToggler");
const drawColor = document.getElementById("drawColor");
const sepiaSlider = document.getElementById("sepiaSlider");

let isDrawingEnabled = false;
let currentDrawingColor = "#000";

document.addEventListener("keydown", (e) => {
	if (e.key === "e") {
		toggleDrawing()
	}

	if (e.key === "r") {
		resetImage();
	}
});

drawToggler.addEventListener("click", () => toggleDrawing());
drawColor.addEventListener("change", ({ target }) => {
	currentDrawingColor = target.value;
	consolidateDrawPaths();
});
// canvas.addEventListener("mouseup", () => consolidateDrawPaths()); //* <- esli nuzhno budet stop
canvas.addEventListener("mousemove", (e) => {
	if (isDrawingEnabled) {
		draw(e);
	}
});


function uploadImage(event) {
    // Set the source of the image from the uploaded file
    image.src = URL.createObjectURL(event.target.files[0]);
 
    image.onload = function () {
        // Set the canvas the same width and height of the image
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.crossOrigin = "anonymous";
        applyFilter();
    };
 
    // Show the image editor controls and hide the help text
    document.querySelector('.help-text').style.display = "none";
    document.querySelector('.image-save').style.display = "block";
    document.querySelector('.image-controls').style.display = "block";
    document.querySelector('.preset-filters').style.display = "block";
};

// This function is used to update the image
// along with all the filter values
function applyFilter() {
 
    // Create a string that will contain all the filters
    // to be used for the image
    let filterString =
        "brightness(" + brightnessSlider.value + "%" +
        ") contrast(" + contrastSlider.value + "%" +
        ") grayscale(" + grayscaleSlider.value + "%" +
        ") saturate(" + saturateSlider.value + "%" +
        ") sepia(" + sepiaSlider.value + "%" +
        ") hue-rotate(" + hueRotateSlider.value + "deg" + ")";
 
    // Apply the filter to the image
    context.filter = filterString;
 
    // Draw the edited image to canvas
    context.drawImage(image, 0, 0);
}

// A series of functions that handle the preset filters
// Each of these will first reset the image
// and then apply a certain parameter before
// redrawing the image
function brightenFilter() {
    resetImage();
    brightnessSlider.value = 130;
    contrastSlider.value = 120;
    saturateSlider.value = 120;
    applyFilter();
}
 
function bwFilter() {
    resetImage();
    grayscaleSlider.value = 100;
    brightnessSlider.value = 120;
    contrastSlider.value = 120;
    applyFilter();
}
 
function funkyFilter() {
    resetImage();
 
    // Set a random hue rotation everytime
    hueRotateSlider.value =
        Math.floor(Math.random() * 360) + 1;
    contrastSlider.value = 120;
    applyFilter();
}
 
function vintageFilter() {
    resetImage();
    brightnessSlider.value = 120;
    saturateSlider.value = 120;
    sepiaSlider.value = 150;
    applyFilter();
}

function randomFilter() {
    resetImage();

    // Set a random hue rotation everytime
    grayscaleSlider.value =
        Math.floor(Math.random() * 360) + 1;
    brightnessSlider.value =
        Math.floor(Math.random() * 360) + 1;
    contrastSlider.value =
        Math.floor(Math.random() * 360) + 1;
    sepiaSlider.value =
        Math.floor(Math.random() * 360) + 1;
    saturationSlider.value =
        Math.floor(Math.random() * 360) + 1;
    hueRotateSlider.value =
        Math.floor(Math.random() * 360) + 1;
      applyFilter();
}

// Reset all the slider values to there default values
function resetImage() {
		brightnessSlider.value = 100;
    contrastSlider.value = 100;
    grayscaleSlider.value = 0;
    hueRotateSlider.value = 0;
    saturateSlider.value = 100;
    sepiaSlider.value = 0;
    applyFilter();
		resetDrawing();
}
 
function saveImage() {
    // Select the temporary element we have created for
    // helping to save the image
    let linkElement = document.getElementById('link');
    linkElement.setAttribute(
      'download', 'edited_image.png'
    );
 
    // Convert the canvas data to a image data URL
    let canvasData = canvas.toDataURL("image/png")
 
    // Replace it with a stream so that
    // it starts downloading
    canvasData.replace(
      "image/png", "image/octet-stream"
    )
 
    // Set the location href to the canvas data
    linkElement.setAttribute('href', canvasData);
 
    // Click on the link to start the download 
    linkElement.click();
}

function consolidateDrawPaths() {
	if (isDrawingEnabled) {
		context.beginPath();
	}
}

function resetDrawing() {
	consolidateDrawPaths();
	isDrawingEnabled = false;
	drawToggler.innerText = "Подключить кисть";
}


function toggleDrawing() {
	if (isDrawingEnabled) {
		drawToggler.innerText = "Подключить кисть";
		isDrawingEnabled = false;
	}
	else {
		drawToggler.innerText = "Отключить кисть";
		isDrawingEnabled = true;
	}
}

function draw(e) {
	context.lineWidth = 5;
	context.lineCap = "butt";
	context.strokeStyle = currentDrawingColor;

	let x = e.clientX - canvas.offsetLeft;
	let y = e.clientY - canvas.offsetTop;
	
	context.lineTo(x, y);
	context.stroke();

	context.beginPath();
	context.moveTo(x, y);
}

