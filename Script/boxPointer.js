class BoxPointer {


    /**
     * @param {Element} elementToPointTo The element to point to.
     * @param {Element} elementBorder The element that is the border for the box pointer.
     * @param {string} pointingAt How to point at the box. "right" | "top" | "left" | "bottom".
     * @param {Int} alignOffset The percent of height or width as offset. 0% - 100%
     */
    constructor(elementToPointTo, elementBorder, pointingAt, alignOffset) {
        this.boxElement = document.createElement("div");
        this.arrowElement = document.createElement("div");

        this.elementToPointTo = elementToPointTo;
        this.elementBorder = elementBorder;
        
        this.pointingAt = pointingAt;
        this.alignOffset = alignOffset/100;
        this.currentText = "No Data";
        
        this.createBox();
    }


    /**
     * Creates the box pointer in the dom.
     */
    createBox() {
        this.boxElement.classList.add('box-pointer', 'box-pointer-' + this.pointingAt, '--soft-shadow');
        this.arrowElement.classList.add("box-pointer-arrow");
        var arrowContainer = document.createElement("div");
        arrowContainer.classList.add("arrow-conatiner");
        this.boxElement.innerHTML= "<p></p>";

        this.boxElement.appendChild(this.arrowElement);
        document.body.appendChild(this.boxElement);

        setInterval(function() {
            this.updateBoxPosition();
        }.bind(this), 5);
    }


    /**
     * Updates the box text.
     * @param {String} text 
     */
    updateBoxText(text) {
        this.currentText = text;
        this.boxElement.getElementsByTagName("p")[0].innerHTML = this.currentText;

        this.updateBoxPosition();
    }


    /**
     * Hiding the box
     */
    hideBox() {
        this.boxElement.style.opacity = 0;
    }


    /**
     * Showing the box
     */
    showBox() {
        this.boxElement.style.opacity = 1;
    }


    /**
     * Showing the box when hovering over a element.
     * @param {Element} element Showing the box when hovering over this element.
     */
    showOnHover(element) {
        this.hideBox();
        this.boxElement.style.transition = "opacity 0.5s";
        element.addEventListener('mouseover', function() {
            this.showBox();
        }.bind(this));
        element.addEventListener('mouseleave', function() {
            this.hideBox();
        }.bind(this));
    }


    /**
     * Updates the box position.
     */
    updateBoxPosition() {
        var boxElementData = new getRelativPosition(this.boxElement.getBoundingClientRect());
        var elementToPointToData = new getRelativPosition(this.elementToPointTo.getBoundingClientRect());
        var arrowData = new getRelativPosition(this.arrowElement.getBoundingClientRect());
        var borderData = new getRelativPosition(this.elementBorder.getBoundingClientRect());

        var alignOffsetY = this.alignOffset * elementToPointToData.height;
        var alignOffsetX = this.alignOffset * elementToPointToData.width;

        this.placeBoxAt(this.pointingAt);

        switch (this.pointingAt) {
            case "top": 
                var arrowOffsetX = -arrowData.width/2 + boxElementData.width/2;
                break;
            case "left":
                var arrowOffsetY = Math.round(arrowData.height/2 + (boxElementData.height/2));
                break;
            case "right":
                var arrowOffsetY = Math.round(-arrowData.height/2 + (boxElementData.height/2));
                break;
            case "bottom":
                var arrowOffsetX = arrowData.width/2 + boxElementData.width/2;
                break;
        }

        //Setting the pointer on the left or right side and checking border.
        if(this.pointingAt == "left" || this.pointingAt == "right") {
            var newBoxPosition = Math.floor(elementToPointToData.yPos - boxElementData.height/2 + alignOffsetY);

            if(newBoxPosition < borderData.yPos) {
                //Setting the arrow pos
                var newArrowPos = (newBoxPosition - borderData.yPos) + arrowOffsetY;
                if(newArrowPos < 0) newArrowPos = 0;
                this.arrowElement.style.top = newArrowPos + "px";

                //Gettinhg the new box pos
                newBoxPosition = borderData.yPos;
            }
            else if(newBoxPosition + boxElementData.height > borderData.yPos + borderData.height) {
                //Setting the arrow pos
                var newArrowPos = (newBoxPosition - borderData.yPos - borderData.height) + arrowOffsetY + boxElementData.height;
                if(newArrowPos > boxElementData.height) newArrowPos = boxElementData.height;
                this.arrowElement.style.top = newArrowPos + "px";

                //Getting the newbox pos.
                newBoxPosition = borderData.yPos + borderData.height - boxElementData.height;
            }
            else {
                this.arrowElement.style.top = Math.round(arrowOffsetY) + "px";
            }

            this.boxElement.style.top = newBoxPosition + "px";
        }

        //Setting the pointer on the top or bottom side and checking border.
        else if(this.pointingAt == "top" || this.pointingAt == "bottom") {
            var newBoxPosition = Math.floor(elementToPointToData.xPos - boxElementData.width/2 + alignOffsetX);

            if(newBoxPosition < borderData.xPos) {
                //Setting the arrow pos
                var newArrowPos = (newBoxPosition - borderData.xPos) + arrowOffsetX;
                if(newArrowPos < 0) newArrowPos = 0;
                this.arrowElement.style.left = newArrowPos + "px";

                //Gettinhg the new box pos
                newBoxPosition = borderData.xPos;
            }
            else if(newBoxPosition + boxElementData.width > borderData.xPos + borderData.width) {
                //Setting the arrow pos
                var newArrowPos = (newBoxPosition - borderData.xPos - borderData.width) + arrowOffsetX + boxElementData.width;
                if(newArrowPos > boxElementData.width) newArrowPos = boxElementData.width;
                this.arrowElement.style.left = newArrowPos + "px";

                //Getting the newbox pos.
                newBoxPosition = borderData.xPos + borderData.width - boxElementData.width;
            }
            else {
                this.arrowElement.style.left = Math.round(arrowOffsetX) + "px";
            }
            
            this.boxElement.style.left = (newBoxPosition) +  "px";
        }

    }


    /**
     * This functions puts the box at a choosen position of an element.
     * @param {String} sideToPointAt The position to point at.
     */
    placeBoxAt(sideToPointAt = "left" | "right" | "top" | "bottom") {

        let boxElementData = new getRelativPosition(this.boxElement.getBoundingClientRect());
        let elementToPointToData = new getRelativPosition(this.elementToPointTo.getBoundingClientRect());

        var newElementYPos = "auto";
        var newElementXPos = "auto";

        switch (sideToPointAt) {
            case "top": 
                newElementYPos = Math.floor(elementToPointToData.yPos - (boxElementData.height + 10)) + "px";
                break;
            case "bottom":
                newElementYPos = Math.floor(elementToPointToData.yPos + elementToPointToData.height + 10) + "px";
                break;
            case "left":
                newElementXPos = Math.floor(elementToPointToData.xPos -(boxElementData.width + 10)) + "px";
                break;
            case "right":
                newElementXPos = Math.floor(elementToPointToData.xPos + 10 + elementToPointToData.width) + "px";
                break;
        }

        this.boxElement.style.top = newElementYPos;
        this.boxElement.style.left = newElementXPos;
    }


    /**
     * Checks if the new box position is outside the border.
     * @param {Number} newBoxPosition The new box position. 
     */
    _positionOutsideBorder(sideToPointAt, newBoxPosition) {
        let borderDimensions = new getRelativPosition(this.elementBorder.getBoundingClientRect());
        
        switch (sideToPointAt) {
            case "top": 
                if(newBoxPosition > borderDimensions.yPos) return true;
                break;
            case "bottom":
                if(newBoxPosition < borderDimensions.xPos + borderDimensions.height) return true;
                break;
            case "left":
                newElementXPos = Math.floor(elementToPointToData.xPos -(boxElementData.width + 10)) + "px";
                break;
            case "right":
                newElementXPos = Math.floor(elementToPointToData.xPos + 10 + elementToPointToData.width) + "px";
                break;
        }
    }
}
