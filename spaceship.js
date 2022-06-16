class Spaceship {
    constructor(x, y, length, height) {
        this.x = x;
        this.y = y;
        console.log("starting:" + " " + this.x + " " + this.y)
        this.length = length; // objects y
        this.height = height; // objects x (its horribly contradictory I used bad var names)
        
        this.speed = 0;
        this.acceleration = .2;

        // stop the Spaceship from going to fast and implement friction
        this.maxSpeed = 5
        this.friction=0.05;

        this.angle=0;

        // pass the ship to the sensor
        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    // with the controls made, now we have to update the Spaceship
    //based on the controls
    update = (mapBorders) => {
       this.#move(); 
       this.polygon = this.#createPolygon()
       this.sensor.update(mapBorders);
    }

    // TODO: FIX THE points properly to align my polygon with 
    // the correct orientation as the sensor points
    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.height,this.length)/2;
        const alpha=Math.atan2(this.height,this.length);
        // sin(45), -cos(45)
        points.push({
            x:this.x+Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });

        // sin(45), cos(45)
        points.push({
            x:this.x + Math.sin(this.angle+alpha) * rad, 
            y:this.y+ Math.cos(this.angle+alpha)*rad
        })

        // sin(pi + 45), cos(45)
        points.push({
            x:this.x + Math.sin(Math.PI +this.angle+alpha) * rad, 
            y:this.y+ Math.cos(this.angle+alpha)*rad
        })

        // sin(pi + 45), -cos(45)
        points.push({
            x:this.x + Math.sin(Math.PI +this.angle+alpha) * rad, 
            y:this.y - Math.cos(this.angle+alpha)*rad
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
    draw(context) {
        
        context.save(); // save the previous state of the context (this is somehow ensuring the sensor raycasts  remain with the same (x,y) coordinates as the rectangle i'm drawing)
        context.beginPath();
        context.stroke()
        //==================================
        // context.beginPath();

        // context.arc(this.x, this.y, 15, 0, 2*Math.PI)
        // context.moveTo(this.polygon[0].x,this.polygon[0].y);
        // for(let i=1;i<this.polygon.length;i++){
        //     // context.lineTo(this.polygon[i].x,this.polygon[i].y);
        //     context.arc(this.polygon[i].x, this.polygon[i].y, 5, 0, 2*Math.PI)
        // }

        // context.arc(this.x, this.y, 15, 0, 2*Math.PI)
        // console.log(this.x + " " + this.y)
        // context.fill();
        // context.fill();
  
        // console.log(this.polygon)   
        context.moveTo(this.x, this.y)   
        context.arc(this.x, this.y, 15, 0, 2*Math.PI)   
        context.arc(this.polygon[0].x, this.polygon[0].y, 15, 0, 2*Math.PI) 
        context.arc(this.polygon[1].x, this.polygon[1].y, 15, 0, 2*Math.PI) 
        context.arc(this.polygon[2].x, this.polygon[2].y, 15, 0, 2*Math.PI)
        context.arc(this.polygon[3].x, this.polygon[3].y, 15, 0, 2*Math.PI)

        context.stroke();
        context.restore(); // prevent infinite translation??
        // context.moveTo(this.x, this.y); // move pen to x,y and set as start
        // context.lineTo(100, 75) // draw line to this x,y point
        // context.lineTo(100, 25) // draw a line to this x,y point
        // context.fill()

        // spaceship is responsable for drawing its own sensors
        this.sensor.draw(context);
        
    }
}

