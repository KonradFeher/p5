let re_from = -1.8
let re_to = 0.8

let im_from = -1.3
let im_to = 1.3

let canvas_size = 300

let recentImages = []

function setup() {
    createCanvas(canvas_size, canvas_size);
    recentImages.push(genMandelbrot());
}

function draw() {

    if (recentImages.length != 0)
        drawMandelbrot(recentImages[recentImages.length - 1])

    if (new_start_x && new_start_y) {
        push()
        fill(color(200, 166, 50, 30))
        stroke(color(200, 166, 40, 100))
        square(min(new_start_x, mouseX), min(new_start_y, mouseY), min(abs(mouseX - new_start_x), abs(mouseY - new_start_y)))
        pop()
    }

}

let new_start_x;
let new_start_y;

function mousePressed() {
    new_start_x = mouseX
    new_start_y = mouseY
}

function mouseReleased() {
    if (new_start_x && new_start_y) {

        new_start_x2 = mouseX
        new_start_y2 = mouseY

        re_from_t = map(min(new_start_x, new_start_x2), 0, canvas_size, re_from, re_to)
        im_from_t = map(min(new_start_y, new_start_y2), 0, canvas_size, im_from, im_to)

        d = min(abs(new_start_x2 - new_start_x), abs(new_start_y2 - new_start_y))

        re_to = map(min(new_start_x, new_start_x2) + d, 0, canvas_size, re_from, re_to)
        im_to = map(min(new_start_y, new_start_y2) + d, 0, canvas_size, im_from, im_to)

        re_from = re_from_t
        im_from = im_from_t

        new_start_x = undefined
        new_start_y = undefined

        recentImages.push(genMandelbrot())

    }
}

function genMandelbrot() {
    let mandelbrotColors = new Array(canvas_size)
    for (let i = 0; i < canvas_size; i++) {
        mandelbrotColors[i] = new Array(canvas_size)
    }

    let step = min((im_to - im_from) / canvas_size, (re_to - re_from) / canvas_size);

    for (let re = 0; re < canvas_size; re++) {
        for (let im = 0; im < canvas_size; im++) {
            let z_re = 0;
            let z_im = 0;
            let i = 0;
            while (dist(0, 0, z_im, z_re) <= 4 && i < 25) {
                let temp = z_re ** 2 - z_im ** 2 + re_from + re * step;
                z_im = 2 * z_re * z_im + im_from + im * step;
                z_re = temp;
                i++;
            }
            mandelbrotColors[re][im] = i
        }
    }
    return mandelbrotColors;
}

function drawMandelbrot(mandelbrotColors) {
    background(0)
    colorMode(HSB, 100)
    for (let re = 0; re < canvas_size; re++) {
        for (let im = 0; im < canvas_size; im++) {
            if (mandelbrotColors[re][im] != 25) {
                stroke(color((mandelbrotColors[re][im]) * 4, 100, 100))
                point(re, im)
            }
        }
    }
}

//TODO cleanup

//TODO canvas size vs image size performance optimization  