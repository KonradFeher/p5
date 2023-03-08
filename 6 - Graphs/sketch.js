const NODE_AMOUNT = 24;
const CANVAS_SIZE = window.innerWidth;
const RADIUS = 2/5 * CANVAS_SIZE;

const RPM = 1;


let adjacency_matrix = [];

function setup() {
    createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    background("#EEE");
    fill("#111");
    stroke("#111");
    frameRate(60);


    adjacency_matrix = const_matrix(NODE_AMOUNT, 1);

    
}

function draw() {
    translate(width / 2, height / 2);
    
    rotate(RPM * (TWO_PI*frameCount/3600))

    background("#EEE8");
    
    draw_round_graph(adjacency_matrix);
    
}

function const_matrix(size, value = 0) {
    let ret = [];
    for (let i = 0; i < size; i++) {
        console.log(`i = ${i}`);
        ret.push([])
        for (let j = 0; j < size; j++) {
            ret[i].push(value);
        }
    }
    return ret;
}

function map_n_to_angle(n, nodes=NODE_AMOUNT){
    return map(n, 1, nodes + 1, 0, TWO_PI)
}

function connect_angles(angle1, angle2, radius=RADIUS){
    line(cos(angle1) * radius, - sin(angle1) * radius, cos(angle2) * radius, - sin(angle2) * radius);
}

function draw_round_graph(adjacency_matrix=[], radius=RADIUS){

    for (let i = 1; i <= adjacency_matrix.length; i++) {
        
        let a = map_n_to_angle(i); 
        connect_angles(a, a);

        for (let j = 1; j <= adjacency_matrix[i-1].length; j++) {

            if (adjacency_matrix[i - 1][j - 1] !== 0) {
                let ai = map_n_to_angle(i); 
                let aj = map_n_to_angle(j);
                connect_angles(ai, aj);
            }
        }
    }

}

//TODO: stroke color/width change with element value
//      different matrix patterns
//      interactivity?