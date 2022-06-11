// when t is 0, A is returned
// when t is 1, B is returned
// when t is .5, you get A+((B-A)/2)
function lerp(A, B, t) {
    // console.log("hello")
    // console.log(A+(B-A)*t)
    return A+(B-A)*t;
}