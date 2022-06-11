const canvas=document.getElementById("myCanvas")
canvas.height= 450;


// get the drawing context from the canvas and keep it 2d
const context = canvas.getContext("2d")
// note that the values are in pixels
const spaceship = new Spaceship(100, 100, 30, 50)
spaceship.draw(context);

animate();

// update the current frame
// I have to keep this as a normal function and not an arrow. Save
// arrow functions of use within classes
function animate () {
    spaceship.update();

    // the canvas needs to be refreshed on each animation
    canvas.width=window.outerWidth; // reupdating the canvase prevents the trail left behind
    spaceship.draw(context);
    // this calls the animate() method over and over
    requestAnimationFrame(animate);
}