let re_from = -2
let re_to = 1

let im_from = -1.3
let im_to = 1.3

function setup() {
    colorMode(HSB, 100)
    createCanvas(600, 600);
    drawMandelbrot()
}

let new_start_x;
let new_start_y;

function mouseClicked(){
    if(mouseX >= 0 && mouseY >= 0 && mouseX < width && mouseY < height){
        if(new_start_x && new_start_y){
            let new_start_x2 = map(mouseX, 0, width, re_from, re_to);
            let new_start_y2 = map(mouseY, 0, height, im_from, im_to);

            re_from = min(new_start_x, new_start_x2);
            re_to = max(new_start_x, new_start_x2);
            im_from = min(new_start_y, new_start_y2);
            im_to = max(new_start_y, new_start_y2);
            drawMandelbrot();
        } else {
            new_start_x = map(mouseX, 0, width, re_from, re_to);
            new_start_y = map(mouseY, 0, height, im_from, im_to);
            
            circle(mouseX-1, mouseY-1, 3);
        }
    }
}

function drawMandelbrot() {
    let step = min((im_to-im_from)/600, (re_to-re_from)/600);
    stroke(255)
    background(200);
    for (let re = re_from; re < re_to; re += step) {
        for (let im = im_from; im < im_to; im += step) {
            let z_re = 0;
            let z_im = 0;
            let i = 0;
            while (dist(0, 0, z_im, z_re) <= 4 && i < 25) {
                let temp = z_re ** 2 - z_im ** 2 + re;
                z_im = 2 * z_re * z_im + im;
                z_re = temp;
                i++;
            }
            if(i != 25) {
                stroke((i % 25)*4, 100, 100)
                point(map(re, re_from, re_to, 0, 600), map(im, im_from, im_to, 0, 600))
            }
        }
    }
}