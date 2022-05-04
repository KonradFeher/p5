const LAUNCH_SPEED = 0.05;
const GROWTH_SPEED = 0.1;
const VELOCITY_FRAMES = 10;
const GRAVITATIONAL_CONSTANT = 6.674e-11;  //6.674×10−11 m3⋅kg−1⋅s−2
const MASS_MULTIPLIER = 300;
const BRIGHTNESS_DECAY = 0;
const ACCELERAION_DECAY = 0.9;               //1 - no decay, 0 - no acceleration
const STAR_SIZE = 100;

function setup() {
    createCanvas(1000, 1000);
    background(0);
    frameRate(60);
    blipSystem = new BlipSystem();
    blipSystem.addCentral(width / 3, height / 3, STAR_SIZE);
    blipSystem.addCentral(width / (3/2), height / (3/2), STAR_SIZE);
    mousePositions = [];
}

class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class Blip{
    constructor(x, y, size, xVel, yVel, central = false){
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.xAcc = 0;
        this.yAcc = 0;
        this.size = size;
        this.brightness = 255;
        this.dead = false;
        this.central = central;
        this.timesUpdated = 0;
        const R = 20;
        if (this.central) this.color = color("#7fb3d5");
        else this.color = color(22 + random(-R, R), 160 + random(-R, R), 133 + random(-R, R));
    }

    update(){
        this.timesUpdated++;
        if(this.timesUpdated % 10000 == 0){
            this.color = color('red');
            console.log(color + " blip lives for " + this.timesUpdated + " updates.")
        }
        if (this.dead) return;

        this.xAcc *= ACCELERAION_DECAY;
        this.yAcc *= ACCELERAION_DECAY;
        this.xVel += this.xAcc;
        this.yVel += this.yAcc;
        this.x += this.xVel;
        this.y += this.yVel;

        if(!this.central) this.brightness -= BRIGHTNESS_DECAY;

        if(this.brightness <= 0 || 
            this.x <= -width || this.y <= -height || 
            this.x >= 2 * width || this.y >= 2 * height)
            this.dead = true;
        else this.draw();
    }

    draw(){
        fill(this.color, this.brightness);
        noStroke();
        circle(this.x, this.y, this.size);
    }

    mass(){
        //mass = brightness * area
        return MASS_MULTIPLIER * map(this.brightness, 0, 255, 0, 1.0) * ((this.size/2) ** 2) * PI;                  
    
        //mass = brightness * volume
        //return map(this.brightness, 0, 255, 0, 1.0) * ((4.0/3.0) * ((this.size/2) ** 3) * PI);    
    }

    applyForce(angle, intensity){
        this.xAcc += cos(angle) * intensity;
        this.yAcc += sin(angle) * intensity;
    }
}

class BlipSystem{

    constructor(){
        this.centrals = [];
        this.blips = [];
    }

    update(){
        for (var i = 0; i < this.blips.length; i++) {
            for (var j = 0; j < this.centrals.length; j++) {
                this.blips[i].applyForce(atan2(this.centrals[j].y - this.blips[i].y, this.centrals[j].x - this.blips[i].x),
                    GRAVITATIONAL_CONSTANT * this.blips[i].mass() * this.centrals[j].mass() 
                    / (dist(this.blips[i].x, this.blips[i].y, this.centrals[j].x, this.centrals[j].y) ** 2));
            }
        }

        for (var i = 0; i < this.blips.length; i++) {
            this.blips[i].update();
            if(this.blips[i].dead) this.blips.splice(i--, 1);
        }
        for (var i = 0; i < this.centrals.length; i++) {
            this.centrals[i].draw();
        }
    }

    addCentral(x, y, size){
        this.centrals.push(new Blip(x, y, size, 0, 0, true));
    }

    addBlip(x, y, size, xVel, yVel){
        this.blips.push(new Blip(x, y, size, xVel, yVel));
    }
}

function draw() {

    background(0);

    blipSystem.update();
    blipSystem.addBlip(
        random(0, width),
        random(0, height),
        randomGaussian(20, 10),
        randomGaussian(0, 1),
        randomGaussian(0, 1),
        )

    if(mouseIsPressed){
        noStroke();
        fill(255,255,255,100);
        heldDuration = millis() - holdStart;
        circle(mouseX, mouseY, heldDuration * GROWTH_SPEED);
    
        if(mousePositions.length > VELOCITY_FRAMES){
            mousePositions.shift();
        }
        mousePositions.push(new Point(mouseX, mouseY));
    }
}

function mousePressed() {
    holdStart = millis();
    mousePositions = [];
}

function mouseClicked() {
    console.log(heldDuration + " ms");
    blipSystem.addBlip(mouseX, mouseY, heldDuration * GROWTH_SPEED,
        (mousePositions[mousePositions.length - 1].x - mousePositions[0].x) * LAUNCH_SPEED,
        (mousePositions[mousePositions.length - 1].y - mousePositions[0].y) * LAUNCH_SPEED);
}
