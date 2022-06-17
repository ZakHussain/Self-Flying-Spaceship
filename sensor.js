class Sensor {
    constructor(spaceship) {
        this.spaceship = spaceship;
        this.rayCount = 4;
        this.rayLength = 100; // 100 unit pixels
        this.raySpread = Math.PI/2;

        this.rays = []; // stores each created ray
        this.measurements = [];
    }

    update(mapBorders, obstacles) {
        this.#castRays();
        this.measurements=[];
        for (let i=0; i<this.rays.length; i++) {
            this.measurements.push(
                this.#getMeasurements(this.rays[i], mapBorders, obstacles)
            );
        }
    }

    #getMeasurements(ray, mapBorders, obstacles) {
        let touches = [];
        for (let i=0; i <mapBorders.length; i++) {
            // a touch is a {x:int, y:int, offset:float} object 
            // not the offset is just how far the current point is
            // from ray[0], where ray[0] is the point at center of ship.
            const touch = getIntersection(
                ray[0], ray[1], 
                mapBorders[i][0], mapBorders[i][1]
            );
            
            // if something is sensed in the environment, save that intersection point
            if (touch) {
                touches.push(touch)
            }
        }

        // test for obstacles
        for (let i=0; i < obstacles.length; i++) {
            const poly = obstacles[i].polygon
            for (let j = 0; j < poly.length; j++) {
                const value = getIntersection(
                    ray[0], ray[1],
                    poly[j], poly[(j+1)%poly.length]
                )
                if (value) {
                    touches.push(value)
                }
            }
        }

        // if nothing was intersection
        if (touches.length == 0) {
            return null;
        } else {
            // getIntersetction() provides an offset field to the touch objects
            // add all the offsets in the touches array to its own collection
            const offsets = touches.map( e => e.offset);
            const minOffset = Math.min(...offsets); // get the smallest offset
            return touches.find(e => e.offset == minOffset) // return the touch for which this is true
        }
    }
    
    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            // ToFix: rayAngle is sometimes undefined. Need to find out why....  
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount==1?0.5:i/(this.rayCount-1)
            ) + this.spaceship.angle;
            // console.log(rayAngle)
            // define the start and end for this current ray
            const start = {x: this.spaceship.x, y:this.spaceship.y}
            const end = {
                x:this.spaceship.x + Math.cos(rayAngle) * this.rayLength,
                y:this.spaceship.y + Math.sin(rayAngle) * this.rayLength
            };
            
            // define the ray segments and add them to the array
            this.rays.push([start, end]);
        }
    }

    draw(ctx) {
        for (let i=0; i < this.rays.length; i++) {
            // draw in readings
            let end = this.rays[i][1];
            if (this.measurements[i]) { // the the ith item is not null
                end = this.measurements[i];
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle="blue";

            ctx.moveTo(
                // move to the starting point (center)
                this.rays[i][0].x,
                this.rays[i][0].y
            )
            ctx.lineTo(
                // this.rays[i][1].x,
                // this.rays[i][1].y
                // only show the ray that has an intersection
                end.x, end.y
            )
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle="yellow";

            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            )
            ctx.lineTo(
                // only show the ray that has an intersection
                end.x, end.y
            )
            ctx.stroke();
        }
    }
}