const canvas=document.getElementById("myCanvas")
canvas.height= 450;


// get the drawing context from the canvas and keep it 2d
const context = canvas.getContext("2d")

const map = new Map(canvas.height/2, canvas.height*0.9);

// note that the values are in pixels
const length = 30;
const height = 50;
const startx = 50;
// const starty = map.getMapLane(0);

const spaceship = new Spaceship(startx, map.getMapLane(1), length, height, "KEYS", 10);
const obstacles = [
    new Spaceship(startx, map.getMapLane(1), length, height, "DUMMY", 2)
]


animate();

// update the current frame
// I have to keep this as a normal function and not an arrow. Save
// arrow functions of use within classes
function animate () {

    // animate the obstables
    for (let i=0; i<obstacles.length; i++) {
        obstacles[i].update(map.borders, []) // empty array since we do not need the obstacles tracking its own damage
    }

    spaceship.update(map.borders, obstacles);

    // the canvas needs to be refreshed on each animation
    canvas.width=window.outerWidth; // reupdating the canvase prevents the trail left behind
    
    // create illusion that camera (the view) is following the spaceship
    context.save();
    context.translate(-spaceship.x+canvas.width*.25, 0);

    map.draw(context);
    for (let i=0; i<obstacles.length; i++) {
        obstacles[i].draw(context, "red")
    }
    spaceship.draw(context, "black");

    context.restore();
    // this calls the animate() method over and over
    requestAnimationFrame(animate);
}