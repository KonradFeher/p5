function setup() {
    createCanvas(500, 500);
    background(0);
    frameRate(60);
    blips = [];
    mousePositions = [];
}

class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class Blip{
    constructor(x, y, xVel, yVel, size, central = false){
        this.central = central;
       
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.xAcc = 0;
        this.yAcc = 0;
        this.size = size;
        this.brightness = 255;
        this.dead = false;
        
    }

    update(){
        if (this.dead) return;

        this.xVel += this.xAcc;
        this.yVel += this.yAcc;
        this.x += this.xVel;
        this.y += this.yVel;
        this.brightness -= 1;

        if(this.brightness <= 0) this.dead = true;

        fill(255,255,255,this.brightness);
        noStroke();
        circle(this.x, this.y, this.size);
    }

    isDead(){
        return this.dead;
    }
}

function draw() {

    background(0);

    for (var i = 0; i < blips.length; i++) {
        blips[i].update();
        if(blips[i].isDead()) blips.splice(i--, 1);
    }

    if(mouseIsPressed){
        noStroke();
        fill(255,255,255,100);
        heldDuration = millis() - holdStart;
        circle(mouseX, mouseY, heldDuration / 10);
    }

    if(mousePositions.length > 10){
        mousePositions.shift();
    }
    mousePositions.push(new Point(mouseX, mouseY));

}

function mousePressed() {
    holdStart = millis();
    mousePositions = [];
}

function mouseClicked() {
    console.log(heldDuration + " ms");
    blips.push(new Blip(mouseX, mouseY,
        -(mousePositions[0].x - mousePositions[mousePositions.length - 1].x)/10,
        -(mousePositions[0].y - mousePositions[mousePositions.length - 1].y)/10,
        heldDuration/10));
}