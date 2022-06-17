class Spaceship {
    constructor(x, y, length, height, controlType="AI", maxSpeed=3) {
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

        this.isAI = controlType=="AI"

        if (controlType != "DUMMY") {
            //pass the ship to the sensor componenet
            this.sensor = new Sensor(this);
            // define the neural network
            // this.inputLayerSize = this.sensor.rayCount
            // this.hiddenLayerSize = 6
            // this.outputLayer = 4 // the number of directions the AI can move
            this.NN = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]
            )
        }
        this.controls = new Controls(controlType);
    }

    // with the controls made, now we have to update the Spaceship
    //based on the controls
    update = (mapBorders, obstacles) => {
        if (!this.isDamaged) {
            this.#move(); 
            this.polygon = this.#createPolygon()
            this.isDamaged = this.#assessDamage(mapBorders, obstacles)
        }

        // obstacles of the spaceship class will not have sensors
        if (this.sensor) {
            this.sensor.update(mapBorders, obstacles)
            const offsets=this.sensor.measurements.map( s => s==null?0:1-s.offset)
            const outputs = NeuralNetwork.feedForward(offsets, this.NN)
            if (this.isAI) {
                this.controls.up=outputs[0]
                this.controls.up = outputs[0]
                this.controls.down=outputs[1]
                this.controls.right=outputs[2]
                this.controls.left=outputs[3]
            }

        }
        
    }

    #assessDamage(mapBorders, obstacles) {
        for (let i = 0; i < mapBorders.length; i++) {
            if (polysIntersect(this.polygon, mapBorders[i])){
                return true
            }
        }

        for (let i = 0; i < obstacles.length; i++){
            if (polysIntersect(this.polygon, obstacles[i].polygon))  {
                return true
            }
        }
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

