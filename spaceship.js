class Spaceship {
    constructor(x, y, length, height, controlType, maxSpeed=3) {
        this.x = x;
        this.y = y;
        this.length = length; // objects y
        this.height = height; // objects x (its horribly contradictory I used bad var names)
        
        this.speed = 0;
        this.acceleration = .2;

        // stop the Spaceship from going to fast and implement friction
        this.maxSpeed = maxSpeed
        this.friction = 0.05;

        this.angle = 0;

        this.isDamaged = false;
        if (controlType != "DUMMY") {
            //pass the ship to the sensor componenet
            this.sensor = new Sensor(this);
        }
        this.controls = new Controls(controlType);
    }

    // with the controls made, now we have to update the Spaceship
    //based on the controls
    update = (mapBorders, obstacles) => {
        if (!this.isDamaged) {
            this.#move(); 
            this.polygon = this.#createPolygon()
            this.isDamaged = this.#assessDamage(mapBorders)
        }

        // obstacles of the spaceship class will not have sensors
        if (this.sensor) {
            this.sensor.update(mapBorders, obstacles)
        }
    }

    #assessDamage(mapBorders) {
        for (let i = 0; i < mapBorders.length; i++) {
            if (polysIntersect(this.polygon, mapBorders[i])){
                console.log("true")
                return true
            }
        }
        // console.log("false")
        return false;
    }

    // TODO: FIX THE points properly to align my polygon with 
    // the correct orientation as the sensor points
    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.height,this.length)/2;
        const alpha=Math.atan2(this.height,this.length);
        // sin(45), -cos(45) (top right)
        points.push({
            x:this.x+Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });

        // sin(45), cos(45) (bottom left)
        points.push({
            x:this.x + Math.sin(-this.angle-alpha) * rad, 
            y:this.y+ Math.cos(-this.angle-alpha)*rad
        })

        // sin(pi + 45), cos(45), (top left)
        points.push({
            x:this.x + Math.sin(Math.PI - this.angle+alpha) * rad, 
            y:this.y + Math.cos(Math.PI - this.angle+alpha)*rad
        })

        // sin(pi + 45), -cos(45) (bottom right)
        points.push({
            x:this.x + Math.sin(Math.PI + this.angle-alpha) * rad, 
            y:this.y - Math.cos(Math.PI + this.angle-alpha)*rad
        })
        return points;
    }   

    #move = () => {
        if (this.controls.left) {
            this.speed -= this.acceleration;
        }

        if (this.controls.right) {
            this.speed += this.acceleration;
        }

        // set a cap on the top speed when going right
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        // set a cap on the top speed going reverse when going left
        if (this.speed < -this.maxSpeed/2) {
            this.speed = -this.maxSpeed/2;
        }
       
        // apply friction in right and left directions so the program always 
        // tries to pull the object to a 0 velocity
        if (this.speed > 0) {
            this.speed -= this.friction
        }

        if (this.speed < 0) {
            this.speed += this.friction
        }

        // prevent sliding when stopped.
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        
        if (this.controls.up) {
            this.angle -= 0.01
        }

        if (this.controls.down) {
            this.angle += 0.01
        }
        
        // console.log({'x':this.x, 'speed':this.speed}) 
        // this.x+=this.speed;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

    }
    draw(context, color) {
        // context.save(); // save the previous state of the context (this is somehow ensuring the sensor raycasts  remain with the same (x,y) coordinates as the rectangle i'm drawing)
        if (this.isDamaged) {
            context.fillStyle = "gray"
        }  else {
            context.fillStyle = color
        }

        context.beginPath();

        context.moveTo(this.polygon[0].x, this.polygon[0].y)       // this angle increase
        context.lineTo(this.polygon[2].x, this.polygon[2].y)
        context.lineTo(this.polygon[1].x, this.polygon[1].y)     // this anlge decreases
        context.lineTo(this.polygon[3].x, this.polygon[3].y)

        context.fill();
        // context.restore(); // prevent infinite translation??

        // spaceship is responsable for drawing its own sensors
        if (this.sensor) {
            this.sensor.draw(context);
        }
        
    }
}

