class Spaceship {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.speed = 0;
        this.acceleration = 0.2;

        // stop the Spaceship from going to fast and implement friction
        this.maxSpeed = 3
        this.friction=0.05;

        this.angle=0;

        this.controls = new Controls();
    }

    // with the controls made, now we have to update the Spaceship
    //based on the controls
    update = () => {
        if (this.controls.west) {
            this.speed -= this.acceleration;
        }

        if (this.controls.east) {
            this.speed += this.acceleration;
        }

        // set a cap on the top speed when going east
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        // set a cap on the top speed going reverse when going west
        if (this.speed < -this.maxSpeed/2) {
            this.speed = -this.maxSpeed/2;
        }
       
        // apply friction in east and west directions so the program always 
        // tries to pull the object to a 0 velocity
        if (this.speed > 0) {
            this.speed -= this.friction
        }
        if (this.speed < 0) {
            this.speed += this.friction
        }

        this.x+=this.speed;

        
        // if (this.controls.north) {
            // this.speed -= 2;
        // }
// 
        // if (this.controls.south) {
            // this.speed += 2;
        // }
        
    }

    draw(context) {
        
        context.beginPath();
        // note that the (0,0) point is in the top left of the canvas
        context.rect(
            this.x-this.width/2,
            this.y-this.height/2,
            this.width,
            this.height
        );
        context.fill();
        //     context.save();
    //     context.translate(this.x, this.y);
    //     context.rotate(-this.angle);

    //     context.beginPath();
    //     context.rect(
    //         -this.width/2,
    //         -this.height/2,
    //         this.width,
    //         this.height
    //     );
    //     context.fill();
    //     context.restore();
    }
}

