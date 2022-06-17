const aiCanvas=document.getElementById("aiCanvas")
aiCanvas.height= 450;

const nnCanvas = document.getElementById("networkCanvas")
nnCanvas.height=300;

// get the drawing ai context from the canvas and keep it 2d
const aiCtx= aiCanvas.getContext("2d")
// get the neural network drawing aiCtxfrom the canvas
const nnctx =  nnCanvas.getContext("2d")


const map = new Map(aiCanvas.height/2, aiCanvas.height*0.95);
// note that the values are in pixels
const length = 30;
const height = 50;
const startx = 50;
const starty = map.getMapLane(1);
const spaceship = new Spaceship(startx-150, starty, length, height, "KEYS", 3);
const obstacles = [
    new Spaceship(startx,starty, length, height, "DUMMY", 2)
]


animate();

// update the current frame
// I have to keep this as a normal function and not an arrow. Save
// arrow functions of use within classes
function animate (time) {

    // animate the obstables
    for (let i=0; i<obstacles.length; i++) {
        obstacles[i].update(map.borders, []) // empty array since we do not need the obstacles tracking its own damage
    }

    spaceship.update(map.borders, obstacles);

    // the canvas needs to be refreshed on each animation
    aiCanvas.width=window.innerHeight; // reupdating the canvase prevents the trail left behind
    nnCanvas.width=window.innerHeight;

    // create illusion that camera (the view) is following the spaceship
    aiCtx.save();
    aiCtx.translate(-spaceship.x+aiCanvas.width*.25, 0);

    map.draw(aiCtx);
    for (let i=0; i<obstacles.length; i++) {
        obstacles[i].draw(aiCtx, "red")
    }
    spaceship.draw(aiCtx, "black");

    aiCtx.restore();
    // this calls the animate() method over and over
    nnctx.lineDashOffset=-time/50
    Visualizer.drawNetwork(nnctx, spaceship.NN)
    requestAnimationFrame(animate);
}