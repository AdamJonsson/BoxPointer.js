//@ts-check

class BoxPointer {

    
    /**
     * @param {Element} elementToPointTo The element to point to.
     * @param {Element} elementBorder The element that is the border for the box pointer. If border is not needed, null works
     * @param {string} pointingAt How to point at the box. "right" | "top" | "left" | "bottom".
     * @param {Number} alignOffset The percent of height or width as offset. 0% - 100%
     * @param {Boolean} movingElement If the element to point is moving or chaning size.
     */
    constructor(elementToPointTo, elementBorder, pointingAt, alignOffset, movingElement = false) {
        this.boxElement = document.createElement("div");
        this.arrowElement = document.createElement("div");

        this.elementToPointTo = elementToPointTo;
        this.elementBorder = elementBorder;
        
        this.pointingAt = pointingAt;
        this.alignOffset = alignOffset/100;
        this.currentText = "No Data";
        this.movingElement = movingElement;
        
        this.createBox();
    }


    /**
     * Creates the box pointer in the dom.
     */
    createBox() {
        this.boxElement.classList.add('box-pointer', 'box-pointer-' + this.pointingAt, '--soft-shadow');

        let overflowControll = document.createElement("div");
        overflowControll.classList.add("overflow-controll");

        this.arrowElement.classList.add("box-pointer-arrow");
        var arrowContainer = document.createElement("div");
        arrowContainer.classList.add("arrow-conatiner");

        this.boxElement.innerHTML= "<p></p>";

        overflowControll.appendChild(this.arrowElement);
        this.boxElement.appendChild(overflowControll);
        document.body.appendChild(this.boxElement);

        if(this.movingElement) {
            setInterval(function() {
                this.updateBoxPosition();
            }.bind(this), 5);
        }
        else {
            window.addEventListener("resize", this.updateBoxPosition.bind(this));
        }
    }


    /**
     * Sets a new text in the box.
     * @param {String} newText The new text in the box.
     */
    updateBoxText(newText) {
        this.currentText = newText;
        this.boxElement.getElementsByTagName("p")[0].innerHTML = this.currentText;

        this.updateBoxPosition();
    }


    /**
     * Hiding the box
     */
    hideBox() {
        this.boxElement.style.opacity = "0";
    }


    /**
     * Showing the box
     */
    showBox() {
        this.boxElement.style.opacity = "1";
    }


    /**
     * Showing the box when hovering over a element.
     * @param {Element} element Showing the box when hovering over this element.
     */
    showOnHover(element = this.elementToPointTo) {
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

        let boxElementDimensions = new getRelativPosition(this.boxElement.getBoundingClientRect());
        let elementToPointToDimensions = new getRelativPosition(this.elementToPointTo.getBoundingClientRect());
        let arrowDimensions = new getRelativPosition(this.arrowElement.getBoundingClientRect());

        // Setting the main position for the box.
        var rawBoxYPos = this.getRawBoxYPosition(boxElementDimensions, elementToPointToDimensions);
        var rawBoxXPos = this.getRawBoxXPosition(boxElementDimensions, elementToPointToDimensions);

        if(this.elementBorder) {
            let borderDimensions = new getRelativPosition(this.elementBorder.getBoundingClientRect());
            var boxYPos = this.getBoxYPositionAfterCheckingBorder(rawBoxYPos, boxElementDimensions, borderDimensions);
            var boxXPos = this.getBoxXPositionAfterCheckingBorder(rawBoxXPos, boxElementDimensions, borderDimensions); 
        }
        else {
            var boxYPos = rawBoxYPos;
            var boxXPos = rawBoxXPos;
        }

        // Setting the offset depeding how the box should be pointed.
        switch (this.pointingAt) {
            case "top": 
                boxYPos = Math.floor(elementToPointToDimensions.yPos - (boxElementDimensions.height + 10));
                var arrowOffsetX = Math.floor(-arrowDimensions.width/2 + boxElementDimensions.width/2 + (rawBoxXPos - boxXPos));
                break;
            case "bottom":
                boxYPos = Math.floor(elementToPointToDimensions.yPos + elementToPointToDimensions.height + 10);
                var arrowOffsetX = Math.floor(arrowDimensions.width/2 + boxElementDimensions.width/2 + (rawBoxXPos - boxXPos));
                break;
            case "left":
                boxXPos = Math.floor(elementToPointToDimensions.xPos -(boxElementDimensions.width + 10));
                var arrowOffsetY = Math.round(arrowDimensions.height/2 + (boxElementDimensions.height/2) + (rawBoxYPos - boxYPos));
                break;
            case "right":
                boxXPos = Math.floor(elementToPointToDimensions.xPos + 10 + elementToPointToDimensions.width);
                var arrowOffsetY = Math.round(-arrowDimensions.height/2 + (boxElementDimensions.height/2) + (rawBoxYPos - boxYPos));
                break;
        }

        //Setting the new positions to the box element.
        this.boxElement.style.top = boxYPos + "px";
        this.boxElement.style.left = boxXPos + "px";

        //Setting the positions for the arrow.
        this.arrowElement.style.top = arrowOffsetY + "px";
        this.arrowElement.style.left = arrowOffsetX + "px";

    }


    /**
     * Getting the raw y-posiiont for the box without checking if the position is outside the border element.
     * @param {getRelativPosition} boxElementDimensions The box dimensions
     * @param {getRelativPosition} elementToPointToDimensions The dimensions of the element that the box is going to point at
     */
    getRawBoxYPosition(boxElementDimensions, elementToPointToDimensions) {
        let yPos = elementToPointToDimensions.yPos + this.alignOffset * elementToPointToDimensions.height - boxElementDimensions.height/2;
        return Math.floor(yPos);
    }


    /**
     * Getting the main y-position for the box after chekcing the border.
     * @param {Number} rawYPos The raw y-position for the box.
     * @param {getRelativPosition} boxElementDimensions The box dimensions
     * @param {getRelativPosition} borderDimensions The dimensions of the border element.
     * @return {Number} The y-position for the box.
     */
    getBoxYPositionAfterCheckingBorder(rawYPos, boxElementDimensions, borderDimensions) {

        if(rawYPos < borderDimensions.yPos) {
            return borderDimensions.yPos;
        }
        else if(rawYPos + boxElementDimensions.height > borderDimensions.yPos + borderDimensions.height) {
            return borderDimensions.yPos + borderDimensions.height - boxElementDimensions.height;
        }

        return rawYPos;
    }


    /**
     * Getting the raw x-posiiont for the box without checking if the position is outside the border element.
     * @param {getRelativPosition} boxElementDimensions The box dimensions
     * @param {getRelativPosition} elementToPointToDimensions The dimensions of the element that the box is going to point at
     */
    getRawBoxXPosition(boxElementDimensions, elementToPointToDimensions) {
        let xPos = elementToPointToDimensions.xPos + this.alignOffset * elementToPointToDimensions.width - boxElementDimensions.width/2
        return Math.floor(xPos);
    }


    /**
     * Getting the main x-position for the box after chekcing the border.
     * @param {Number} rawXPos The raw x-position for the box.
     * @param {getRelativPosition} boxElementDimensions The box dimensions
     * @param {getRelativPosition} borderDimensions The dimensions of the border element.
     * @return {Number} The x-position for the box.
     */
    getBoxXPositionAfterCheckingBorder(rawXPos, boxElementDimensions, borderDimensions) {

        if(rawXPos < borderDimensions.xPos) {
            return borderDimensions.xPos;
        }
        else if(rawXPos + boxElementDimensions.width > borderDimensions.xPos + borderDimensions.width) {
            return borderDimensions.xPos + borderDimensions.width - boxElementDimensions.width;
        }

        return rawXPos;
    }
}


/**
 * This returns the relativ position for an element. 
 * @param {Object} elementData 
 */
function getRelativPosition(elementData) {
    var bodyData = document.body.getBoundingClientRect();

    this.xPos = elementData.left - bodyData.left;
    this.yPos = elementData.top - bodyData.top;
    this.width = elementData.width;
    this.height = elementData.height;
}

