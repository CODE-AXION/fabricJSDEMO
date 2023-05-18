
const removeGuidelines = (e,canvas,centerLine,MiddleLine) => {

    canvas.remove(centerLine);

    canvas.remove(MiddleLine);

    canvas.renderAll();

}

const addGuidelines = (e,canvas,centerLine,MiddleLine) => {

    if (!canvas.contains(centerLine)) {
        canvas.add(centerLine);
    }

    if (!canvas.contains(MiddleLine)) {
        canvas.add(MiddleLine);
    }

    canvas.renderAll();
}



//SETS UP THE GUIDELINES
const setupGuidelines = (e,canvas,centerLine,MiddleLine) => {

    const obj = canvas.getActiveObject();
    var canvasCenterX = canvas.width / 2;
    var canvasCenterY = canvas.height / 2;

    var scaledWidth = obj.getScaledWidth();
    var scaledHeight = obj.getScaledHeight();
    console.log('canvas center x:'+ canvasCenterX);
    console.log('object scaled width:'+ scaledWidth);
    console.log('object left coords' + obj.left)
    // Check if object is close to the horizontal center line
    if (Math.abs(obj.left + scaledWidth / 2 - canvasCenterX) < 5) {
        

        obj.set({
            left: canvasCenterX - scaledWidth / 2
        });


        if (!canvas.contains(centerLine)) {
        canvas.add(centerLine);
        }

        document.addEventListener("mouseup", () => {
        canvas.remove(centerLine);
        });

    }else{

        canvas.remove(centerLine);
    }

    // Check if object is close to the vertical center line
    if (Math.abs(obj.top + scaledHeight / 2 - canvasCenterY) < 5) {

        obj.set({
            top: canvasCenterY - scaledHeight / 2
        });

        if (!canvas.contains(MiddleLine)) {
            canvas.add(MiddleLine);
        }

        document.addEventListener("mouseup", () => {
            canvas.remove(MiddleLine);
        });

    }else{
        canvas.remove(MiddleLine);
    }

    canvas.renderAll(); // render the canvas

}
export { removeGuidelines , addGuidelines, setupGuidelines}
