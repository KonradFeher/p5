let noiseZ = 0

//recalculates color limits on each frame, resulting in more rapidly changing, untrue noise
let use_relative_noise_cb
let use_relative_noise = false

let step_slider
let time_step_slider
let chroma_slider

// ".005 - 0.03 works best"
let min_step = 0.001
let step = 0.02
let max_step = 0.1

let min_time_step = 0
let time_step = 0.005
let max_time_step = 0.02

let canvas_size = 900
const mesh_size = 50
let square_size

let colors
// 0 -> continuous colors, n -> n colors
let n_chromatic = 0
let max_chromatics = 30

function setup() {

    square_size = floor(canvas_size / mesh_size)
    canvas_size = square_size * mesh_size

    // colors = ["yellow", "orchid"]
    colors = parseColors("yellow", "orchid")
    // colors = parseColors(1, "yellow", 1, "orchid")
    // colors = ["ivory", "ivory", "black", "ivory", "ivory"]
    // colors = parseColors(2, "ivory", "black", 2, "ivory")

    createCanvas(canvas_size, canvas_size)
    noFill()
    noStroke()

    use_relative_noise_cb = createCheckbox('', false)
    use_relative_noise_cb.changed(() => { use_relative_noise = !use_relative_noise })
    use_relative_noise_cb.style('width', '10px')
    use_relative_noise_cb.style('height', '10px')
    use_relative_noise_cb.position(canvas_size - 20, canvas_size - 20)

    step_slider = createSlider(min_step, max_step, step, 0)
    step_slider.position(10, 10)
    step_slider.style('width', '100px')

    time_step_slider = createSlider(min_time_step, max_time_step, time_step, 0)
    time_step_slider.position(canvas_size - 110, 10)
    time_step_slider.style('width', '100px')

    chroma_slider = createSlider(0, max_chromatics, n_chromatic, 1)
    chroma_slider.position(10, canvas_size - 10 - chroma_slider.size().height)
    chroma_slider.style('width', '100px')


    // only takes string colors
    function parseColors(...colorStrings) {
        let colors = []

        for (let i = 0; i < arguments.length; ++i) {
            if (typeof (arguments[i]) == "number") {
                for (let n = 0; n < arguments[i]; ++n) {
                    colors.push(color(arguments[i + 1]))
                }
                i++
            } else colors.push(color(arguments[i]))
        }

        return colors;
    }

}

function draw() {

    background(colors[1])

    //get values from sliders
    step = step_slider.value()
    noiseZ += time_step_slider.value()
    n_chromatic = chroma_slider.value()

    let max_noise = 1;
    let min_noise = 0;

    if (use_relative_noise) {
        max_noise = 0;
        min_noise = 1;
        for (let i = 0; i < mesh_size; i++) {
            for (let j = 0; j < mesh_size; j++) {
                max_noise = max(timeNoise(i, j), max_noise)
                min_noise = min(timeNoise(i, j), min_noise)
            }
        }
        //edge cases aren't checked while lerping 
        max_noise *= 1.001
        min_noise *= 0.999
    }

    for (let i = 0; i < mesh_size; i++) {
        for (let j = 0; j < mesh_size; j++) {
            let colorMap
            if (n_chromatic == 0)
                colorMap = map(timeNoise(i, j), min_noise, max_noise, 0, colors.length - 1)
            else colorMap = map(round(map(timeNoise(i, j), min_noise, max_noise, -0.5, n_chromatic - 0.5)), 0, n_chromatic, 0, colors.length - 1)

            let fromColor = color(colors[floor(colorMap)])
            let toColor = color(colors[floor(colorMap + 1)])

            let fillColor = lerpColor(fromColor, toColor, colorMap % 1)

            fill(fillColor)
            square(square_size * i, square_size * j, square_size, 2)
        }
    }

}


function timeNoise(x, y) {
    return noise(x * step, y * step, noiseZ)
}
