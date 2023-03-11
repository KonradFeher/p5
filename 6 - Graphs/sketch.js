const CANVAS_SIZE = Math.min(window.innerWidth, window.innerHeight);

// number of nodes in the graph
let NODE_AMOUNT = 24;
// maximum distance from the origin point
let MAX_RADIUS = 2 / 5 * CANVAS_SIZE;

// number of different distances from the origin
let LEVELS = 6;
// allows each node to be spread out, over multiple levels
let MULTI_LEVEL = false;                   
// mirrors the shuriken pattern of levels into a flower pattern
let MIRROR_LEVELS = false;
// minimal distance of the lowest level from the origin point 
let MIN_RADIUS = MAX_RADIUS * .7;

// rotations per minute
let RPM = 1;

// sliders
let node_slider;
let min_radius_slider;
let levels_slider;

let adjacency_matrix = [];

function setup() {

    createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    background("#EEE");
    fill("#111");
    stroke("#111");
    frameRate(60);

    // SLIDER SETUP

    node_slider = createSlider(1, 50, NODE_AMOUNT, 1);
    node_slider.position(10, 10);
    node_slider.style('width', '200px');

    min_radius_slider = createSlider(-1, 1, .7, 0);
    min_radius_slider.position(CANVAS_SIZE - 210, 10);
    min_radius_slider.style('width', '200px');

    levels_slider = createSlider(1, 50, LEVELS, 1);
    levels_slider.position(10, CANVAS_SIZE - 10 - levels_slider.size().height);
    levels_slider.style('width', '200px');

    // CHECKBOX SETUP

    mirror_cb = createCheckbox('', false);
    mirror_cb.changed(() => { MIRROR_LEVELS = !MIRROR_LEVELS });
    mirror_cb.style('width', '10px');
    mirror_cb.style('height', '10px');
    mirror_cb.position(CANVAS_SIZE - 20, CANVAS_SIZE - 20);

}

function draw() {

    // update values from sliders
    NODE_AMOUNT = node_slider.value();
    MIN_RADIUS = min_radius_slider.value() * MAX_RADIUS;
    LEVELS = int(map(levels_slider.value(), 1, 50, 1, NODE_AMOUNT, true));

    adjacency_matrix = const_matrix(NODE_AMOUNT, 1);
    // adjacency_matrix = dist_matrix(NODE_AMOUNT, 5, 10);

    // for (let i = 0; i < NODE_AMOUNT; i++) {
    //     adjacency_matrix.push([]);
    //     for (let j = 0; j < NODE_AMOUNT; j++) {
    //         adjacency_matrix[i].push(node_dist(i, j) % 5 == 1 ? 1:0);
    //     }
    // }

    translate(width / 2, height / 2);

    rotate(RPM * (TWO_PI * frameCount / 3600))

    background("#EEE8");

    draw_round_graph(adjacency_matrix);

}

// returns "distance" of 2 given nodes, wrapping around the circle
function node_dist(node1, node2 = 0) {
    return Math.min(abs(node1 - node2), abs(NODE_AMOUNT + node1 - node2), abs(NODE_AMOUNT + node2 - node1));
}

// returns a regular matrix of given size with all elements equal to value 
function const_matrix(size, value = 0) {
    let ret = [];
    for (let i = 0; i < size; i++) {
        ret.push([]);
        for (let j = 0; j < size; j++) {
            ret[i].push(value);
        }
    }
    return ret;
}

// TODO: change min and max-dist into a string parser 
// returns a regular matrix of given size, connecting nodes based on min_dist and max_dist given
function dist_matrix(size = NODE_AMOUNT, min_dist = 0, max_dist = min_dist, value = 1) {
    if (max_dist === 0) max_dist = size;
    let ret = [];
    for (let i = 0; i < size; i++) {
        ret.push([]);
        for (let j = 0; j < size; j++) {
            let d = node_dist(i, j);
            ret[i].push((d >= min_dist && d <= max_dist) ? value : 0);
        }
    }
    return ret;
}

// maps number of node to angle
function map_n_to_angle(n, nodes = NODE_AMOUNT) {
    return map(n, 1, nodes + 1, 0, TWO_PI);
}

// TODO: add thickness
// draws a line between two points at given angles, at distances defined by radius1 and radius2 
function connect_angles(angle1, angle2, radius1 = MAX_RADIUS, radius2 = radius1) {
    line(cos(angle1) * radius1, - sin(angle1) * radius1, cos(angle2) * radius2, - sin(angle2) * radius2);
}

// draws the graph defined by adjacency_matrix on given amount of levels
function draw_round_graph(adjacency_matrix = [], levels = LEVELS) {

    for (let i = 1; i <= adjacency_matrix.length; i++) {
        for (let j = 1; j <= adjacency_matrix[i - 1].length; j++) {

            if (adjacency_matrix[i - 1][j - 1] !== 0) {
                let ai = map_n_to_angle(i, adjacency_matrix.length);
                let aj = map_n_to_angle(j, adjacency_matrix.length);
                if (LEVELS === 1) connect_angles(ai, aj);
                if (MULTI_LEVEL) connect_angles(ai, aj, map((i * NODE_AMOUNT + j) % LEVELS, 0, LEVELS - 1, MIN_RADIUS, MAX_RADIUS));
                else if (MIRROR_LEVELS) connect_angles(ai, aj,
                    map(abs((i % LEVELS) - (LEVELS - 1) / 2), 0, (LEVELS - 1) / 2, MIN_RADIUS, MAX_RADIUS),
                    map(abs((j % LEVELS) - (LEVELS - 1) / 2), 0, (LEVELS - 1) / 2, MIN_RADIUS, MAX_RADIUS));
                else connect_angles(ai, aj,
                    map(i % LEVELS, 0, LEVELS - 1, MIN_RADIUS, MAX_RADIUS),
                    map(j % LEVELS, 0, LEVELS - 1, MIN_RADIUS, MAX_RADIUS));
            }

        }
    }

}

//TODO: stroke color/width change with element value
//      different matrix patterns . . .
//      interactivity?
//      sine and cosine leveling 