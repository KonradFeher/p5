const GRAVITATIONAL_CONSTANT = 6.674e-11;       //6.674×10−11 m3⋅kg−1⋅s−2

const LAUNCH_SPEED = 0.05;
const GROWTH_SPEED = 0.1;
const VELOCITY_FRAMES = 10;
const MASS_MULTIPLIER = 300;
const BRIGHTNESS_DECAY = 0;                     
const ACCELERAION_DECAY = 0.9;                  //1 - no decay, 0 - no acceleration

const STAR_SIZE = 100;
const STAR_DENSITY = 2;

const MAX_BLIPS = 50
const MAX_ORBITS = 50                    
const ORBIT_LENGTH = 50                    
const ORBIT_FRAMES = 60 

function setup() {
    createCanvas(displayWidth, displayHeight);
    background(0);
    frameRate(60);
    blipSystem = new BlipSystem();

    blipSystem.addCentral(width / 2, height / 2, STAR_SIZE);

    // blipSystem.addCentral(width * (2/7), height * (2/7), STAR_SIZE);
    // blipSystem.addCentral(width * (5/7), height * (5/7), STAR_SIZE);
    
    // blipSystem.addCentral(width * (1/3), height * (1/3), STAR_SIZE);
    // blipSystem.addCentral(width * (2/3), height * (2/3), STAR_SIZE);

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
        this.framesAlive = 0;
        this.inOrbit = false;
        this.orbit = [];

        if (this.central) {
            this.color = color("#F7FF93");
        } else { 
            this.color = color("#072227");
        }
    }

    update(){
        if (this.dead) return;

        this.xAcc *= ACCELERAION_DECAY;
        this.yAcc *= ACCELERAION_DECAY;
        this.xVel += this.xAcc;
        this.yVel += this.yAcc;
        this.x += this.xVel;
        this.y += this.yVel;

        if(!this.central) {
            this.brightness -= BRIGHTNESS_DECAY;
            this.framesAlive++;
 
            if(!this.inOrbit){
                if(this.framesAlive < 100)
                    this.color = lerpColor(color("#000"), color('#072227'), this.framesAlive / 100);
                else 
                    this.color = lerpColor(color("#072227"), color('white'), (this.framesAlive - 100) / 9900.0);
            }
        }

        // if(this.brightness <= 0 || this.x <= 0 || this.y <= 0 || this.x >= width || this.y >= height)
        if(this.brightness <= 0 || this.x <= -width || this.y <= -height || this.x >= 2 * width || this.y >= 2 * height)
            this.dead = true;
        else this.draw();


        if(this.inOrbit && frameCount % ORBIT_FRAMES == 0){
            this.orbit.push(new Point(this.x, this.y));
            if(this.orbit.length > ORBIT_LENGTH) this.orbit.shift();
        }

    }

    draw(){
        if(this.inOrbit){
            push();
                noStroke();
                for (var i = 0; i < this.orbit.length; i++) {
                    colorMode(RGB);
                    fill(red(this.color), green(this.color), blue(this.color), map(i, 0, this.orbit.length, 0, 255));
                    circle(this.orbit[i].x, this.orbit[i].y, 3);
                }
            fill(this.color);
            circle(this.x, this.y, this.size);
            pop();
        } else{
            fill(this.color, this.brightness);
            noStroke();
            circle(this.x, this.y, this.size);
        }
    }

    mass(){
        //mass = brightness * area
        return (this.central ? STAR_DENSITY : 1) * MASS_MULTIPLIER * map(this.brightness, 0, 255, 0, 1.0) * ((this.size/2) ** 2) * PI;                  
    
        //mass = brightness * volume
        //return (this.central ? STAR_DENSITY : 1) * MASS_MULTIPLIER * map(this.brightness, 0, 255, 0, 1.0) * ((4.0/3.0) * ((this.size/2) ** 3) * PI);    
    }

    applyForce(angle, intensity){
        // this.xAcc += cos(angle) * intensity;
        // this.yAcc += sin(angle) * intensity;
        this.xVel += cos(angle) * intensity;
        this.yVel += sin(angle) * intensity;
    }

}

class BlipSystem{

    constructor(){
        this.centrals = [];
        this.blips = [];
        this.blipsInOrbit = 0;
    }

    update(){
        for (var i = 0; i < this.blips.length; i++) {
            for (var j = 0; j < this.centrals.length; j++) {
                this.blips[i].applyForce(atan2(this.centrals[j].y - this.blips[i].y, this.centrals[j].x - this.blips[i].x),
                    GRAVITATIONAL_CONSTANT * this.blips[i].mass() * this.centrals[j].mass() 
                    / (dist(this.blips[i].x, this.blips[i].y, this.centrals[j].x, this.centrals[j].y) ** 2));
                if(dist(this.blips[i].x, this.blips[i].y, this.centrals[j].x, this.centrals[j].y) < this.centrals[j].size / 2 - this. blips[i].size / 2) 
                    this.blips[i].dead = true;
            }
        }

        for (var i = 0; i < this.blips.length; i++) {
            this.blips[i].update();
            if(this.blips[i].framesAlive == 10000 && this.blipsInOrbit < MAX_ORBITS){
                this.blips[i].inOrbit = true;
                push();
                    colorMode(HSB);
                    this.blips[i].color = color(random(0,255), 100, 100);
                    colorMode(RGB);
                pop();
                this.blipsInOrbit++;
            }
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
    if(blipSystem.blips.length < MAX_BLIPS)
        blipSystem.addBlip(
            random(0, width),
            random(0, height),
            randomGaussian(20, 10),
            randomGaussian(0, 1),
            randomGaussian(0, 1),
            );

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


//IDEA: this but with real data? :eyes: