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
    noSmooth()

    square_size = floor(canvas_size / mesh_size)
    canvas_size = square_size * mesh_size

    colors = parseColors("yellow", "orchid")
    // colors = parseColors(2, "ivory", "black", 2, "white")

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
        for (let i = - mesh_size / 2; i < mesh_size / 2; i++) {
            for (let j = - mesh_size / 2; j < mesh_size / 2; j++) {
                max_noise = max(timeNoise(i, j), max_noise)
                min_noise = min(timeNoise(i, j), min_noise)
            }
        }
        //edge cases aren't checked while lerping 
        max_noise *= 1.001
        min_noise *= 0.999
    }

    for (let i = -mesh_size / 2; i < mesh_size / 2; i++) {
        for (let j = -mesh_size / 2; j < mesh_size / 2; j++) {
            let colorMap
            if (n_chromatic == 0) colorMap = map(timeNoise(i, j), min_noise, max_noise, 0, colors.length - 1)
            else colorMap = map(floor(map(timeNoise(i, j), min_noise, max_noise, 0, n_chromatic + 1)), 0, n_chromatic, 0, colors.length - 1, true)

            let fromColor = colors[floor(colorMap)]
            let toColor = colors[floor(colorMap + 1)]

            let fillColor = lerpColor(fromColor ?? colors[0], toColor ?? colors[colors.length - 1], colorMap % 1)

            fill(fillColor)
            square(square_size * (i + mesh_size / 2), square_size * (j + mesh_size / 2), square_size, 2)
        }
    }

}


function timeNoise(x, y) {
    return noise((mesh_size / 2) * max_step + step * x, (mesh_size / 2) * max_step + step * y, noiseZ)
}
