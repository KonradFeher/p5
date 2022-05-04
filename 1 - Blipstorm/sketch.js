function setup() {
    createCanvas(displayWidth, displayHeight);
    background(200, 0, 0);
    blips = [];
}

class Blip{
    constructor(){
        this.x = random(0, width);
        this.y = random(0, height);
        this.xVel = randomGaussian(0, 0.1);
        this.yVel = randomGaussian(0, 0.1);
        this.xAcc = randomGaussian(0, 0.1);
        this.yAcc = randomGaussian(0, 0.1);
        this.size = randomGaussian(5, 3);
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

        if(this.x >= width || this.y >= height || this.x < 0 || this.y < 0 || this.brightness <= 0) this.dead = true;

        fill(255,255,255,this.brightness);
        noStroke();
        circle(this.x, this.y, this.size);
    }

    isDead(){
        return this.dead;
    }
}

function draw() {

    background(128, 128, 255);
    if(frameCount % 20 == 0)
        for (var i = 0; i < frameCount / 60; i++)
            blips.push(new Blip());

    if(frameCount % 2 == 0) {
        for (var i = 0; i < blips.length; i++) {
            blips[i].update();
            if(blips[i].isDead()) blips.splice(i--, 1);
        }
    }

}