const initCanvas = (elementId,width,height) => {
    return new fabric.Canvas(elementId,{
        width: width,
        height: height,
    });
}

const setBackgroundImage = (url,canvas) => {

    fabric.Image.fromURL(url, function(img) {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height
        });
    });

    canvas.renderAll();
}

export { initCanvas, setBackgroundImage };
