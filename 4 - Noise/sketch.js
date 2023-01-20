let noiseZ = 0;

let use_relative_noise = false;

let step_slider;
let time_step_slider;
// ".005 - 0.03 works best"
let step = 0.02;
let time_step = 0.02;

const canvas_size = 900
const mesh_size = 40
let square_size = canvas_size / mesh_size

function setup() {
    createCanvas(canvas_size, canvas_size)
    noFill()
    noStroke()

    step_slider = createSlider(0, 0.2, step, 0);
    step_slider.position(10, 10);
    step_slider.style('width', '100px');

    time_step_slider = createSlider(0, 0.1, time_step, 0);
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
    }
    for (let i = 0; i < mesh_size; i++) {
        for (let j = 0; j < mesh_size; j++) {
            let rel_noise = map(timeNoise(i, j), min_noise, max_noise, 0, 1)
            fill(rel_noise < 0.5 ? lerpColor(color("yellow"), color("white"), 2 * rel_noise) : lerpColor(color("white"), color("green"), 2*(rel_noise - .5)))
            square(square_size * i, square_size * j, square_size)

        }
    }

}

function timeNoise(x, y) {
    return noise(x * step, y * step, noiseZ)
}
