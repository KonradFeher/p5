const NODE_AMOUNT = 30;
const CANVAS_SIZE = window.innerWidth;
const MAX_RADIUS = 2 / 5 * CANVAS_SIZE;

const LEVELS = 10;
const MULTI_LEVEL = false;                   //false by default
const MIRROR_LEVELS = false;
const MIN_RADIUS = MAX_RADIUS / 20;

const RPM = 1;


let adjacency_matrix = [];

function node_dist(node1, node2 = 0) {
    return Math.min(abs(node1 - node2), abs(NODE_AMOUNT + node1 - node2), abs(NODE_AMOUNT + node2 - node1));
}

function setup() {

    createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    background("#EEE");
    fill("#111");
    stroke("#111");
    frameRate(60);

    // adjacency_matrix = const_matrix(NODE_AMOUNT, 1);

    // TODO: extract this as fucntion dist_matrix(min_dist = 0, max_dist = 0)
    for (let i = 0; i < NODE_AMOUNT; i++) {
        adjacency_matrix.push([]);
        for (let j = 0; j < NODE_AMOUNT; j++) {
            // let min_dist = 13
            // adjacency_matrix[i].push(node_dist(i, j) >= min_dist ? 1 : 0);
            let max_dist = 6
            adjacency_matrix[i].push(node_dist(i, j) <= max_dist ? 1 : 0);
        }   
    }

    // for (let i = 0; i < NODE_AMOUNT; i++) {
    //     adjacency_matrix.push([]);
    //     for (let j = 0; j < NODE_AMOUNT; j++) {
    //         adjacency_matrix[i].push(node_dist(i, j) % 5 == 1 ? 1:0);
    //     }
    // }

    console.log(adjacency_matrix);


}

function draw() {

    translate(width / 2, height / 2);

    rotate(RPM * (TWO_PI * frameCount / 3600))

    background("#EEE8");

    draw_round_graph(adjacency_matrix);

}

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

function map_n_to_angle(n, nodes = NODE_AMOUNT) {
    return map(n, 1, nodes + 1, 0, TWO_PI)
}

function connect_angles(angle1, angle2, radius1 = MAX_RADIUS, radius2 = radius1) {
    line(cos(angle1) * radius1, - sin(angle1) * radius1, cos(angle2) * radius2, - sin(angle2) * radius2);
}

function draw_round_graph(adjacency_matrix = [], levels = LEVELS) {

    for (let i = 1; i <= adjacency_matrix.length; i++) {

        // let a = map_n_to_angle(i, adjacency_matrix.length); 
        // connect_angles(a, a);

        for (let j = 1; j <= adjacency_matrix[i - 1].length; j++) {

            if (adjacency_matrix[i - 1][j - 1] !== 0) {
                let ai = map_n_to_angle(i, adjacency_matrix.length);
                let aj = map_n_to_angle(j, adjacency_matrix.length);
                if (LEVELS === 1) connect_angles(ai, aj);
                if (MULTI_LEVEL) connect_angles(ai, aj, map((i * NODE_COUNT + j) % LEVELS, 0, LEVELS - 1, MIN_RADIUS, MAX_RADIUS));
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

// HYUGE TODO: SLIDERS!!!