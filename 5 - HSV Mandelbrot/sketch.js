let re_from = -1.8
let re_to = 0.8

let im_from = -1.3
let im_to = 1.3

let image_size = 750
let canvas_size = 1000
let r = (canvas_size/image_size)

// let min_iter_limit = 5
let iter_limit = 25
// let max_iter_limit = 100

let use_big_squares = true;

let recentImages = []

function setup() {
    noSmooth()

    // step_slider = createSlider(min_iter_limit, iter_limit, max_iter_limit, 1)
    // step_slider.position(10, 10)
    // step_slider.style('width', '100px')

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
        if (use_big_squares)
            square(min(new_start_x*r, mouseX), min(new_start_y*r, mouseY), max(abs(mouseX - new_start_x*r), abs(mouseY - new_start_y*r))) //max square
        else square(min(new_start_x*r, mouseX), min(new_start_y*r, mouseY), min(abs(mouseX - new_start_x*r), abs(mouseY - new_start_y*r))) //min square
        pop()
    }

}

let new_start_x;
let new_start_y;

function mousePressed(event) {
    
    if (event.button != 0) return
    if (mouseX/r < 0 || mouseY/r < 0 || mouseX/r > image_size || mouseY/r > image_size) return
    new_start_x = mouseX/r
    new_start_y = mouseY/r
}

function keyPressed() {
    if (keyCode == BACKSPACE && recentImages.length != 1) recentImages.pop()
}

function mouseReleased(event) {
    if (event.button != 0) return
    if (new_start_x && new_start_y) {

        new_start_x2 = mouseX/r
        new_start_y2 = mouseY/r

        re_from_t = map(min(new_start_x, new_start_x2), 0, image_size, re_from, re_to)
        im_from_t = map(min(new_start_y, new_start_y2), 0, image_size, im_from, im_to)

        if (use_big_squares)
            d = max(abs(new_start_x2 - new_start_x), abs(new_start_y2 - new_start_y)) //min square
        else d = min(abs(new_start_x2 - new_start_x), abs(new_start_y2 - new_start_y)) //max square

        re_to = map(min(new_start_x, new_start_x2) + d, 0, image_size, re_from, re_to)
        im_to = map(min(new_start_y, new_start_y2) + d, 0, image_size, im_from, im_to)

        re_from = re_from_t
        im_from = im_from_t

        new_start_x = undefined
        new_start_y = undefined

        recentImages.push(genMandelbrot())

    }
}

function genMandelbrot() {
    let mandelbrotColors = new Array(image_size)
    for (let i = 0; i < image_size; i++) {
        mandelbrotColors[i] = new Array(image_size)
    }

    let step = min((im_to - im_from) / image_size, (re_to - re_from) / image_size);

    for (let re = 0; re < image_size; re++) {
        for (let im = 0; im < image_size; im++) {
            let z_re = 0;
            let z_im = 0;
            let i = 0;
            while (dist(0, 0, z_im, z_re) <= 4 && i < iter_limit) {
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
    noStroke()
    colorMode(HSB, 100)
    for (let re = 0; re < image_size; re++) {
        for (let im = 0; im < image_size; im++) {
            if (mandelbrotColors[re][im] != iter_limit) {
                fill(color((mandelbrotColors[re][im]) * (100 / iter_limit), 100, 100))
                square(re * r, im * r, r)
            }
        }
    }
}

//TODO cleanup

//IDEA redistribute HSV colors as the zoom gets deeper  