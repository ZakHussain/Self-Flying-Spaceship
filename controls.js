class Controls {
    constructor (type) {
        this.up=false;
        this.down=false;
        this.right=false;
        this.left=false;

        switch(type) {
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.right=true;
                break;
        }
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
                    this.left = true;
                    break; 
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.up = true;
                    break;
                case "ArrowDown":
                    this.down = true;
                    break;
            }
            // console.table(this);
        }
    
        // release the key event
        document.onkeyup = (event) => {
            switch(event.key) {
                case "ArrowLeft":
                    this.left = false;
                    break; 
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.up = false;
                    break;
                case "ArrowDown":
                    this.down = false;
                    break;
            }
            // console.table(this);
        }
    }
}