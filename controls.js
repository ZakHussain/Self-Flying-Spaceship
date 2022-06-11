class Controls {
    constructor () {
        this.north=false;
        this.south=false;
        this.east=false;
        this.west=false;

        this.#addKeyboardListeners();
    }

    // method for listening for keyboard events
    // In this case though, I think it is because the # means this a
    // private method that cannot be accessed outside of this class.
    // https://www.quora.com/Is-the-hash-pound-symbol-used-anywhere-in-JavaScript-syntax
    #addKeyboardListeners() {
        // depending on the key that is press, set the direction is true
        // push the key down event 
        document.onkeydown = (event) => {
            switch(event.key) {
                case "ArrowLeft":
                    this.west = true;
                    break; 
                case "ArrowRight":
                    this.east = true;
                    break;
                case "ArrowUp":
                    this.north = true;
                    break;
                case "ArrowDown":
                    this.south = true;
                    break;
            }
            // console.table(this);
        }
    
        // release the key event
        document.onkeyup = (event) => {
            switch(event.key) {
                case "ArrowLeft":
                    this.west = false;
                    break; 
                case "ArrowRight":
                    this.east = false;
                    break;
                case "ArrowUp":
                    this.north = false;
                    break;
                case "ArrowDown":
                    this.south = false;
                    break;
            }
            // console.table(this);
        }
    }
}