const addImage = (canvas, url, type = null) => {

    if(type == 'objectImage'){

        fabric.Image.fromURL(url, (img) => {
            img.scale(0.5); // scale the image down if needed

            canvas.add(img);
            canvas.setActiveObject(img);
        });
        canvas.renderAll();
        return;
    }

    if(type == 'backgroundImage'){

        fabric.Image.fromURL(url, function(img) {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height
            });
        });

        // fabric.Image.fromURL(url, function(img) {
        //     var imgAspectRatio = img.width / img.height;
        //     var canvasAspectRatio = canvas.width / canvas.height;
        //     var scaleX, scaleY;

        //     if (imgAspectRatio > canvasAspectRatio) {
        //         // Image is wider than the canvas
        //         scaleX = canvas.width / img.width;
        //         scaleY = scaleX;
        //     } else {
        //         // Image is taller than or equal to the canvas
        //         scaleY = canvas.height / img.height;
        //         scaleX = scaleY;
        //     }

        //     canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        //         scaleX: scaleX,
        //         scaleY: scaleY
        //     });
        // });
        canvas.renderAll();

        return;
    }

};

const uploadImage = (event,canvas,type) => {

    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    addImage(canvas, url,type);
    canvas.renderAll();
}

export { addImage, uploadImage };
