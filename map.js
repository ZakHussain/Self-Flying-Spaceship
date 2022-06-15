class Map {
    constructor(y, height, laneCount=4){
        this.y = y;
        this.height = height;
        this.laneCount = laneCount;

        this.top = y - height/2;
        this.bottom = y + height/2; 

        const infinity = 1000000;
        this.left = -infinity;
        this.right = infinity;


        const topLeft = {x:this.left, y:this.top}; 
        const topRight = {x:this.right, y:this.top};
        const bottomLeft = {x:this.left, y:this.bottom};
        const bottomRight = {x:this.right, y:this.bottom}; 
        this.borders = [
            [topLeft, topRight],
            [bottomLeft, bottomRight]
        ];
    }

    getMapLane(laneIndex) {
        const laneheight = this.height/this.laneCount;
        return this.top+laneheight / 2 + Math.min(laneIndex, this.laneCount-1)*laneheight;
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for (let i = 1; i < this.laneCount; i++) {
                const y = lerp(
                    this.top,
                    this.bottom,
                    i/this.laneCount
                );
                ctx.setLineDash([20,20]);
                ctx.beginPath();
                ctx.moveTo(this.left, y);
                ctx.lineTo(this.right, y);
                ctx.stroke();
        }

        ctx.setLineDash([])
        this.borders.forEach(border => {
            // console.log(border)
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        })

    }




}