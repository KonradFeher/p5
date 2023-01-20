let noiseZ = 0;

let use_relative_noise = false;

let step_slider;
let time_step_slider;
// ".005 - 0.03 works best"
let step = 0.02;
let time_step = 0.02;

let canvas_size = 900
const mesh_size = 40
let square_size;

let colors = [0, 255]

function setup() {
    
    square_size = floor(canvas_size / mesh_size)
    canvas_size = square_size * mesh_size

    createCanvas(canvas_size, canvas_size)
    noFill()
    noStroke()

    step_slider = createSlider(0.001, 0.1, step, 0);
    step_slider.position(10, 10);
    step_slider.style('width', '100px');

    time_step_slider = createSlider(0, 0.05, time_step, 0);
    time_step_slider.position(width - 110, 10);
    time_step_slider.style('width', '100px');
}

function draw() {

    step = step_slider.value()
    noiseZ += time_step_slider.value()

    let max_noise = 0;
    let min_noise = 1;

    if (use_relative_noise) {
        for (let i = 0; i < mesh_size; i++) {
            for (let j = 0; j < mesh_size; j++) {
                max_noise = max(timeNoise(i, j), max_noise)
                min_noise = min(timeNoise(i, j), min_noise)
            }
        }
        max_noise *= 1.001
        min_noise *= 0.999
    }
    for (let i = 0; i < mesh_size; i++) {
        for (let j = 0; j < mesh_size; j++) {
            let colorMap = map(timeNoise(i, j), min_noise, max_noise, 0, colors.length-1)

            let fromColor = color(colors[floor(colorMap)])
            let toColor = color(colors[floor(colorMap + 1)])

            let fillColor = lerpColor(fromColor, toColor, colorMap % 1)

            fill(fillColor)
            square(square_size*i, square_size*j, square_size)
        }
    }

}

function timeNoise(x, y) {
    return noise(x * step, y * step, noiseZ)
}
