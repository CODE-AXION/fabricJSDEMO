// ===> Initialize Default Text
const addText = (canvas,text,options) => {

    //initialize the textbox with dynamic text and color
    var textbox = new fabric.Textbox(text, {
        left: 150,
        top: 200,
        width: 200,
        textAlign: 'center',
        fontSize: options.fontSize ?? 20,
        fill: options.color,
        fontFamily: 'Arial'
    });

    // Set the width of the textbox to match the measured text width
    var actualTextWidth = textbox.getBoundingRect().width;

    textbox.set({ width: actualTextWidth });


    //get the canvas width by center
    const canvasCenter = canvas.getWidth() / 2;

    //get the textbox scaling width
    const textWidth = textbox.getScaledWidth();

    //---> Textbox Coords
    //set the textbox to center according to the canvas width
    textbox.set({
        left: canvasCenter - (textWidth / 2),
        top: options.top,
    });


    //---> controls
    //set the bottom and top button disabled
    textbox.setControlsVisibility({
        bl: true,
        br: true,
        tl: true,
        tr: true,
        mt: false,
        mb: false,
    });

    //add the textbox to canvas and make it selected object
    if(options.selected){

        canvas.add(textbox).setActiveObject(textbox);
    }else{
        canvas.add(textbox)
    }

    canvas.renderAll();
}

// ===> Adds Text VIA DOM
function addNewText(canvas,options,text){


    let topCoords = options.top;

    const handleAddText = () => {


      addText(canvas, text, {
        top: topCoords ?? 200,
        color: 'white',
        fontSize: options.fontSize ?? 20,
        selected: true
      });

      topCoords += options.incrementBy ?? 20;
    }

    return handleAddText;
}



// ===> Remove Text

const removeText = (canvas) => {



    let activeObject = canvas.getActiveObject();
    var activeObjectGroups = canvas.getActiveObjects();

    if (activeObject) {

      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    }

    //delete the objects in the selected group
    if (activeObjectGroups.length) {

        activeObjectGroups.forEach(function (object) {
            canvas.remove(object);
        });

    }
    // if (activeGroup) {

    //     var objectsInGroup = activeGroup.getObjects();

    //     canvas.discardActiveGroup();
    //     objectsInGroup.forEach(function(object) {
    //         canvas.remove(object);
    //     });
    // }

}

const changeActiveTextColor = (canvas, color) => {

    // const activeObject = canvas.getActiveObject();
    // if (activeObject && activeObject.type === 'textbox') {
    //   activeObject.set({ fill: color });
    //   canvas.renderAll();
    // }

    var activeObjectGroups = canvas.getActiveObjects();

    if (activeObjectGroups.length) {

        activeObjectGroups.forEach(function (object) {

            if (object && object.type === 'textbox') {
                object.set({ fill: color });
                canvas.renderAll();
              }
        });

    }

};

export { addText, addNewText , removeText , changeActiveTextColor};
