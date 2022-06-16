// when t is 0, A is returned
// when t is 1, B is returned
// when t is .5, you get A+((B-A)/2)
// i.e., give a value between A and B dependent on t
function lerp(A, B, t) {
    // console.log("hello")
    // console.log(A+(B-A)*t)
    // console.log(A)
    // console.log(B)
    // console.log(t)
    // console.log(A+(B-1)*t)
    return A+(B-A)*t;
}

function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

// Purpose: determening the intersection of polys through
//          observing intersecting line segments
function polysIntersect(p1, p2) {
    for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
            const touch = getIntersection(
               p1[i],
               p1[(i+1)%p1.length], 
               p2[j],
               p2[(j+1)%p2.length]
            )
            if (touch) {
                return true
            }
        }
    }
    return false
}