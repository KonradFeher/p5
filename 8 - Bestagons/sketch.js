const CANVAS_SIZE = 1000;

const A = 3;
const GAP = 0;
const ALT = true;

const H = (A * Math.sqrt(3)) / 2;
const GAP_A = GAP;
const GAP_H = (GAP_A * Math.sqrt(3)) / 2;
const A_D = A + GAP_A;
const H_D = H + GAP_H;
const ROWS = ALT ? CANVAS_SIZE / (2 * H_D) - 2 : CANVAS_SIZE / (2 * A_D) - 2;
// const ROWS = 10;
const ROW_LEN = ROWS;

// diffA=1.0, DB=.5, f=.055, k=.062
const diffA = 1.0;
const diffB = 0.5;
const FEED = 0.055;
const KILL = 0.062;

let cells = [];
let next = [];

let neighborsRel = [
    { i: +1, j: +0 },
    { i: -1, j: +0 },
    { i: +0, j: -1 },
    { i: +0, j: +1 },
    { i: +1, j: +1 },
    { i: -1, j: -1 },
];

let from;
let to;

function setup() {
    from = color("#ffbf00");
    to = color("black");

    createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    rectMode(CENTER);
    // noFill();
    fill("#ffbf00");
    // stroke("black");
    noStroke();
    noSmooth();
    noCursor();
    // strokeWeight(2);
    frameRate(1);

    for (let i = 0; i < ROWS; i++) {
        cells.push([]);
        for (let j = 0; j < ROW_LEN; j++) {
            if (abs(i - j) > ROWS / 2) continue;
            cells[i][j] = {
                a: 1.0,
                b: 0.0,
                i: i,
                j: j,
            };
        }
    }

    let center = int(ROWS / 2);

    // cells[center][center].b = 1;
    // for (let x = 0; x < neighborsRel.length; x++) {
    //     if (!cells[center + neighborsRel[x].i][center + neighborsRel[x].j]) continue;
    //     cells[center + neighborsRel[x].i][center + neighborsRel[x].j].b = 1.0;
    // }

    for (let i = -3; i <= 3; ++i)
        for (let j = -3; j <= 3; ++j) {
            if (abs(i - j) > 3) continue;
            if (!cells[center + i] || !cells[center + i][center + j]) continue;
            else cells[center + i][center + j].b = 1.0;
        }

    next = JSON.parse(JSON.stringify(cells));

    setInterval(doIterate, 1000 / 200);
}

function draw() {
    background("#b28500");

    drawCells(ALT);
}

function drawCells(alt = false, drawFn = drawHexagonWithShape) {
    push();
    let ai, aj;
    if (alt) {
        translate(2 * A_D, height / 2);
        ai = -PI / 3;
        aj = PI / 3;
    } else {
        translate(width / 2, 2 * A_D);
        ai = PI / 6;
        aj = (5 * PI) / 6;
    }
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            if (!cells[i][j]) continue;
            push();
            fill(lerpColor(from, to, cells[i][j].b));
            translate(2 * H_D * (cos(ai) * i + cos(aj) * j), 2 * H_D * (sin(ai) * i + sin(aj) * j));
            drawFn(0, 0, alt);
            pop();
        }
    }
    pop();
}

function doIterate() {
    for (let i = 0; i < ROWS; ++i) {
        for (let j = 0; j < ROWS; ++j) {
            if (!cells[i][j]) continue;
            let a = cells[i][j].a;
            let b = cells[i][j].b;
            next[i][j].a = a + diffA * hexLaplace(i, j, "a") - a * b * b + FEED * (1 - a);
            next[i][j].b = b + diffB * hexLaplace(i, j, "b") + a * b * b - (KILL + FEED) * b;

            next[i][j].a = constrain(next[i][j].a, 0, 1);
            next[i][j].b = constrain(next[i][j].b, 0, 1);
        }
    }
    swap();
}

// we assume a 60 degree - PI/3 difference
function hexLaplace(i, j, prop) {
    let sum = -cells[i][j][prop];
    for (let x = 0; x < neighborsRel.length; x++) {
        if (!cells[i + neighborsRel[x].i] || !cells[i + neighborsRel[x].i][j + neighborsRel[x].j]) continue;
        sum += cells[i + neighborsRel[x].i][j + neighborsRel[x].j][prop] * (1 / 6);
    }
    return sum;
}

function swap() {
    var temp = cells;
    cells = next;
    next = temp;
}

function drawGrid(rows, rowLength, gap = 0, drawFn, alt = false) {
    const GAP_A = gap;
    const GAP_H = (gap * sqrt(3)) / 2;

    const A_D = A + GAP_A;
    const H_D = H + GAP_H;

    console.time("drawGrid");
    if (alt)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < rowLength; j++) {
                if (i % 2) drawFn(j * (2 * H_D), i * 1.5 * A_D, alt);
                else drawFn((j + 0.5) * 2 * H_D, i * 1.5 * A_D, alt);
            }
        }
    else {
        for (let i = 0; i < rows * 2; i++) {
            for (let j = 0; j < rowLength / 2; j++) {
                if (i % 2) drawFn(j * 3 * A_D, i * H_D, alt);
                else drawFn((j + 0.5) * 3 * A_D, i * H_D, alt);
            }
        }
    }
    console.timeEnd("drawGrid");
}

function drawHexagonWithRectangles(x, y, alt = false) {
    push();
    if (dist(mouseX, mouseY, x, y) < A) fill("#cc9f00");
    translate(x, y);
    if (alt) rotate(PI / 6);
    rect(0, 0, A, 2 * H);
    rotate(PI / 3);
    rect(0, 0, A, 2 * H);
    rotate(PI / 3);
    rect(0, 0, A, 2 * H);
    pop();
}

// this one performs better
function drawHexagonWithShape(x, y, alt = false) {
    push();
    if (dist(mouseX, mouseY, x, y) < A) fill("#cc9f00");
    translate(x, y);
    if (alt) rotate(PI / 6);

    beginShape();
    for (let i = 0; i < 6; i++) {
        let angle = (i * PI) / 3;
        let xOffset = cos(angle) * A;
        let yOffset = sin(angle) * A;

        vertex(xOffset, yOffset);
    }
    endShape(CLOSE);
    pop();
}

// reverse map coordinates

// IDEA different seeding types
//      interactive
//      from image
//      from noise

// IDEA parameters change
//      from image map
//      from noise

// move to Processing
