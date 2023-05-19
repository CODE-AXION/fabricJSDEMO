import { initCanvas, setBackgroundImage } from './initCanvas.js';
import { uploadImage } from './fileUpload.js';
import { addText, addNewText, removeText, changeActiveTextColor,  } from './TextModule.js';
import { removeGuidelines , addGuidelines, setupGuidelines} from './GuidelinesModule.js';

let actualCanvasWidth = 559;
let actualCanvasHeight = 794;
//initiate fabric canvas
const newCanvas = initCanvas('canvas',actualCanvasWidth,actualCanvasHeight)

console.log(newCanvas.width)
//set the canvas background
setBackgroundImage('/templates/indian-paisley-&-birds.jpg',newCanvas)

//render the canvas
newCanvas.renderAll();



//---> Adds The Text to canvas
addText(newCanvas,'Groom weds new bride', {
    top: 300,
    color: 'white',
    selected: true

})

addText(newCanvas,'Weds', {
    top: 350,
    color: 'white',
})

addText(newCanvas,'Bride', {
    top: 400,
    color: 'white'
})

//------------//-------------//

// Event listener for font select change
fontSelect.addEventListener('change', function() {
    // Get the selected font value
    var selectedFont = fontSelect.value;

    let activeObject = newCanvas.getActiveObject();
    // Change the textbox font family
    activeObject.set('fontFamily', selectedFont);

    // Refresh the canvas to apply the changes
    newCanvas.renderAll();
});



// ---> Adds Text VIA DOM

const addTextBtn = document.getElementById('add-text-btn');

addTextBtn.addEventListener('click', addNewText(newCanvas,
{
    top:200,
    incrementBy: 30,
    fontSize: 40,

},'Add Your Text'));


// Add event listener to "Download" button
const downloadBtn = document.getElementById('download-btn');
downloadBtn.addEventListener('click', function() {
  // Get data URL of the canvas
  const dataURL = newCanvas.toDataURL({
    format: 'png',
    left: 0,
    top: 0,
    width: newCanvas.width ,
    height: newCanvas.height ,
    multiplier:8,
  });

  //Create a link element with the data URL as href and download attribute
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'canvas.png';

  // Append link to the body and trigger a click event to start the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});



// ==> Deletes the Text/Element/Object
const deleteBtn = document.getElementById('delete-btn');

deleteBtn.addEventListener('click', () => removeText(newCanvas) )
//-----------





// ===> Uploads The Image
document.getElementById('file-upload').addEventListener('change',(e) => uploadImage(e,newCanvas,'objectImage'));
//----------

//document.getElementById('background-file-upload').addEventListener('change',(e) => uploadImage(e,newCanvas,'backgroundImage'));





// ===> Changes The Color Of The Text
document.getElementById('color-picker').addEventListener('input', (event) => {
    const color = event.target.value;
    changeActiveTextColor(newCanvas, color);
});
//----------

const centerLine = new fabric.Line([newCanvas.width / 2, 0, newCanvas.width / 2, newCanvas.height], {
    stroke: 'rgba(255,255,0.5)',
    strokeWidth: 1,
    strokeDashArray: [5, 5],
    selectable: false,
    evented: false
});

const MiddleLine = new fabric.Line(
    [0, newCanvas.height / 2, newCanvas.width, newCanvas.height / 2],
    {
      stroke: 'rgba(255, 255, 0, 0.5)',
      strokeDashArray: [5, 5],
      strokeWidth: 1,
      selectable: false,
      evented: false
    }
  );

// // ===> Removes the guidelines when the mouse leaves
// newCanvas.on('mouse:up', (e) => removeGuidelines(e,newCanvas,centerLine,MiddleLine))

// //===> Adds the guidelines
// newCanvas.on('object:moving',(e) => addGuidelines(e,newCanvas,centerLine,MiddleLine));

// // ===> Setup The GuideLines
// newCanvas.on('object:moving',(e) => setupGuidelines(e,newCanvas,centerLine,MiddleLine));


const updateTextAlignment = (canvas,align) => {

    var activeObjectGroups = canvas.getActiveObjects();

    if (activeObjectGroups.length) {

        activeObjectGroups.forEach(function (object) {

            if (object && object.type === 'textbox') {

                object.set({ textAlign: align});

            }

        });
        canvas.renderAll();

    }
}

// Event listeners for radio button changes
document.getElementById('alignCenter').addEventListener('change', function() {

    updateTextAlignment(newCanvas,'center');
});

document.getElementById('alignLeft').addEventListener('change', function() {
    updateTextAlignment(newCanvas,'left');
});

document.getElementById('alignRight').addEventListener('change', function() {
    updateTextAlignment(newCanvas,'right');
});


newCanvas.on('selection:cleared', function() {
// Clear the radio button selection when no textbox is selected
    var alignRadios = document.querySelectorAll('input[name="alignText"]');
    alignRadios.forEach(function(radio) {
        radio.checked = false;
    });
});



document.querySelectorAll('.add-sticker').forEach(function(element) {

    element.addEventListener('click', function() {
        var stickerUrl = this.getAttribute('data-sticker-url');

        fabric.Image.fromURL(stickerUrl, (img) => {
            img.scale(0.5); // scale the image down if needed

            newCanvas.add(img);
            newCanvas.setActiveObject(img);
        });
        newCanvas.renderAll();
    })

})

document.querySelectorAll('.alignment').forEach(function(element) {
    element.addEventListener('click', function() {
        var cur_value = this.getAttribute('data-action');

        var activeObj = newCanvas.getActiveObject() || (typeof newCanvas.getActiveGroup === 'function' ? newCanvas.getActiveGroup() : null);

        if (cur_value !== '' && activeObj) {

        process_align(cur_value, activeObj);
            activeObj.setCoords();
            newCanvas.renderAll();
        } else {
            alert('Please select an item');
        return false;
        }
    });
});


  /* Align the selected object */
  function process_align(val, activeObj) {
    var canvasWidth = newCanvas.width;
    var canvasHeight = newCanvas.height;
    var bound = activeObj.getBoundingRect();
    var objWidth = bound.width;
    var objHeight = bound.height;
    var objCenterX = bound.left + objWidth / 2;
    var objCenterY = bound.top + objHeight / 2;

    switch (val) {
      case 'left':


        activeObj.set({ left: 0 });
        break;
      case 'right':
        activeObj.set({ left: canvasWidth - objWidth });
        break;
      case 'top':
        activeObj.set({ top: 0 });
        break;
      case 'bottom':
        activeObj.set({ top: canvasHeight - objHeight });
        break;
      case 'center':
        activeObj.set({ left: canvasWidth / 2 - objWidth / 2 });
        break;
      case 'middle':
        activeObj.set({ top: canvasHeight / 2 - objHeight / 2 });
        break;
    }
  }




var lineHeightInput = document.getElementById('lineHeightInput');
var lineHeightValue = document.getElementById('lineHeightValue');

    lineHeightInput.addEventListener('input', function() {
    var activeObj = newCanvas.getActiveObject();

    if (activeObj && activeObj.type === 'textbox') {
        var newLineHeight = parseFloat(lineHeightInput.value) || 1;

        lineHeightValue.textContent = newLineHeight;

        activeObj.set({ lineHeight: newLineHeight });

        newCanvas.renderAll();
    }
});


var lineHeightInput = document.getElementById('lineHeightInput');
var lineHeightValue = document.getElementById('lineHeightValue');

    lineHeightInput.addEventListener('input', function() {
    var activeObj = newCanvas.getActiveObject();

    if (activeObj && activeObj.type === 'textbox') {
        var newLineHeight = parseFloat(lineHeightInput.value) || 1;

        lineHeightValue.textContent = newLineHeight;

        activeObj.set({ lineHeight: newLineHeight });

        newCanvas.renderAll();
    }
});

var letterSpacingInput = document.getElementById('letterSpacingInput');
var letterSpacingValue = document.getElementById('letterSpacingInputValue');

    letterSpacingInput.addEventListener('input', function() {
    var activeObj = newCanvas.getActiveObject();

    if (activeObj && activeObj.type === 'textbox') {
        var newLetterSpacingValue = parseFloat(letterSpacingInput.value) || 1;

        letterSpacingValue.textContent = newLetterSpacingValue;

        activeObj.set({ charSpacing: newLetterSpacingValue });

        newCanvas.renderAll();
    }
});



newCanvas.on('object:moving',function(e){

    var selectedObject = newCanvas.getActiveObject();
    if (selectedObject && selectedObject.type === 'textbox') {
      selectedObject.set({
        backgroundColor: 'rgba(255,255,255,0.2)'
      });
      newCanvas.renderAll();
    }

});



// newCanvas.on('mouse:up', function(){

//     var selectedObject = newCanvas.getActiveObject();
//     if (selectedObject && selectedObject.type === 'textbox') {
//         selectedObject.set({
//             backgroundColor: ''
//         });

//       newCanvas.renderAll();
//     }
// })

// newCanvas.on('mouse:over', function(event) {
//     var selectedObject = newCanvas.getActiveObject();
//     if (selectedObject && selectedObject.type === 'textbox') {
//       selectedObject.set({
//         backgroundColor: 'white'
//       });
//       newCanvas.renderAll();
//     }
// });

// newCanvas.on('mouse:out', function(event) {

//     var selectedObject = newCanvas.getActiveObject();

//     if (selectedObject && selectedObject.type === 'textbox') {
//       selectedObject.set({
//         backgroundColor: ''
//       });
//       newCanvas.renderAll();
//     }
// })




newCanvas.on('mouse:over', function(e) {
    var hoveredObject = e.target;
    if (hoveredObject && hoveredObject.type === 'textbox') {
      hoveredObject.set({
        borderColor: '#2563eb',
        cornerColor: '#2563eb',
        backgroundColor: ''
      });
      newCanvas.renderAll();
    }
  });

newCanvas.on('mouse:out', function(e) {
    var hoveredObject = e.target;
    if (hoveredObject && hoveredObject.type === 'textbox') {
      hoveredObject.set({
        borderColor: 'white',
        cornerColor: 'white',
        backgroundColor: ''
      });
      newCanvas.renderAll();
    }
  });


let changeFontItalic = document.getElementById('italic');


changeFontItalic.addEventListener('input', function() {

    var selectedObject = newCanvas.getActiveObject();

    if (selectedObject && selectedObject.type === 'textbox') {

        if(this.checked){

            selectedObject.set({
                fontStyle: 'italic'
            });

            newCanvas.renderAll();

        }else{

            selectedObject.set({
                fontStyle: ''
            });

            newCanvas.renderAll();
        }
    }
})

newCanvas.on('selection:cleared', function() {
    // Clear the checkbox button selection when no textbox is selected

    document.querySelector('input[name="italic"]').checked = false;

});











let changeFontBold = document.getElementById('bold');


changeFontBold.addEventListener('input', function() {

    var selectedObject = newCanvas.getActiveObject();

    if (selectedObject && selectedObject.type === 'textbox') {

        if(this.checked){

            selectedObject.set({
                fontWeight: 'bold'
            });

            newCanvas.renderAll();

        }else{

            selectedObject.set({
                fontWeight: ''
            });

            newCanvas.renderAll();
        }
    }
})

newCanvas.on('selection:cleared', function() {

    // Clear the checkbox button selection when no textbox is selected
    document.querySelector('input[name="bold"]').checked = false;
});


// function initAligningGuidelines(canvas) {

//     var ctx = canvas.getSelectionContext(),
//         aligningLineOffset = 5,
//         aligningLineMargin = 4,
//         aligningLineWidth = 1,
//         aligningLineColor = 'rgb(0,255,0)',
//         viewportTransform,
//         zoom = 1;

//     function drawVerticalLine(coords) {
//       drawLine(
//         coords.x + 0.5,
//         coords.y1 > coords.y2 ? coords.y2 : coords.y1,
//         coords.x + 0.5,
//         coords.y2 > coords.y1 ? coords.y2 : coords.y1);
//     }

//     function drawHorizontalLine(coords) {
//       drawLine(
//         coords.x1 > coords.x2 ? coords.x2 : coords.x1,
//         coords.y + 0.5,
//         coords.x2 > coords.x1 ? coords.x2 : coords.x1,
//         coords.y + 0.5);
//     }

//     function drawLine(x1, y1, x2, y2) {
//       ctx.save();
//       ctx.lineWidth = aligningLineWidth;
//       ctx.strokeStyle = aligningLineColor;
//       ctx.beginPath();
//       ctx.moveTo(((x1+viewportTransform[4])*zoom), ((y1+viewportTransform[5])*zoom));
//       ctx.lineTo(((x2+viewportTransform[4])*zoom), ((y2+viewportTransform[5])*zoom));
//       ctx.stroke();
//       ctx.restore();
//     }

//     function isInRange(value1, value2) {
//       value1 = Math.round(value1);
//       value2 = Math.round(value2);
//       for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
//         if (i === value2) {
//           return true;
//         }
//       }
//       return false;
//     }

//     var verticalLines = [],
//         horizontalLines = [];

//     canvas.on('mouse:down', function () {
//       viewportTransform = canvas.viewportTransform;
//       zoom = canvas.getZoom();
//     });

//     canvas.on('object:moving', function(e) {

//       var activeObject = e.target,
//           canvasObjects = canvas.getObjects(),
//           activeObjectCenter = activeObject.getCenterPoint(),
//           activeObjectLeft = activeObjectCenter.x,
//           activeObjectTop = activeObjectCenter.y,
//           activeObjectBoundingRect = activeObject.getBoundingRect(),
//           activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3],
//           activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
//           horizontalInTheRange = false,
//           verticalInTheRange = false,
//           transform = canvas._currentTransform;

//       if (!transform) return;

//       // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
//       // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

//       for (var i = canvasObjects.length; i--; ) {

//         if (canvasObjects[i] === activeObject) continue;

//         var objectCenter = canvasObjects[i].getCenterPoint(),
//             objectLeft = objectCenter.x,
//             objectTop = objectCenter.y,
//             objectBoundingRect = canvasObjects[i].getBoundingRect(),
//             objectHeight = objectBoundingRect.height / viewportTransform[3],
//             objectWidth = objectBoundingRect.width / viewportTransform[0];

//         // snap by the horizontal center line
//         if (isInRange(objectLeft, activeObjectLeft)) {
//           verticalInTheRange = true;
//           verticalLines.push({
//             x: objectLeft,
//             y1: (objectTop < activeObjectTop)
//               ? (objectTop - objectHeight / 2 - aligningLineOffset)
//               : (objectTop + objectHeight / 2 + aligningLineOffset),
//             y2: (activeObjectTop > objectTop)
//               ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
//               : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
//           });
//           activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
//         }

//         // snap by the left edge
//         if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
//           verticalInTheRange = true;
//           verticalLines.push({
//             x: objectLeft - objectWidth / 2,
//             y1: (objectTop < activeObjectTop)
//               ? (objectTop - objectHeight / 2 - aligningLineOffset)
//               : (objectTop + objectHeight / 2 + aligningLineOffset),
//             y2: (activeObjectTop > objectTop)
//               ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
//               : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
//           });
//           activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
//         }

//         // snap by the right edge
//         if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
//           verticalInTheRange = true;
//           verticalLines.push({
//             x: objectLeft + objectWidth / 2,
//             y1: (objectTop < activeObjectTop)
//               ? (objectTop - objectHeight / 2 - aligningLineOffset)
//               : (objectTop + objectHeight / 2 + aligningLineOffset),
//             y2: (activeObjectTop > objectTop)
//               ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
//               : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
//           });
//           activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
//         }

//         // snap by the vertical center line
//         if (isInRange(objectTop, activeObjectTop)) {
//           horizontalInTheRange = true;
//           horizontalLines.push({
//             y: objectTop,
//             x1: (objectLeft < activeObjectLeft)
//               ? (objectLeft - objectWidth / 2 - aligningLineOffset)
//               : (objectLeft + objectWidth / 2 + aligningLineOffset),
//             x2: (activeObjectLeft > objectLeft)
//               ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
//               : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
//           });
//           activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
//         }

//         // snap by the top edge
//         if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
//           horizontalInTheRange = true;
//           horizontalLines.push({
//             y: objectTop - objectHeight / 2,
//             x1: (objectLeft < activeObjectLeft)
//               ? (objectLeft - objectWidth / 2 - aligningLineOffset)
//               : (objectLeft + objectWidth / 2 + aligningLineOffset),
//             x2: (activeObjectLeft > objectLeft)
//               ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
//               : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
//           });
//           activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
//         }

//         // snap by the bottom edge
//         if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
//           horizontalInTheRange = true;
//           horizontalLines.push({
//             y: objectTop + objectHeight / 2,
//             x1: (objectLeft < activeObjectLeft)
//               ? (objectLeft - objectWidth / 2 - aligningLineOffset)
//               : (objectLeft + objectWidth / 2 + aligningLineOffset),
//             x2: (activeObjectLeft > objectLeft)
//               ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
//               : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
//           });
//           activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
//         }
//       }

//       if (!horizontalInTheRange) {
//         horizontalLines.length = 0;
//       }

//       if (!verticalInTheRange) {
//         verticalLines.length = 0;
//       }
//     });

//     canvas.on('before:render', function() {
//       canvas.clearContext(canvas.contextTop);
//     });

//     canvas.on('after:render', function() {
//       for (var i = verticalLines.length; i--; ) {
//         drawVerticalLine(verticalLines[i]);
//       }
//       for (var i = horizontalLines.length; i--; ) {
//         drawHorizontalLine(horizontalLines[i]);
//       }

//       verticalLines.length = horizontalLines.length = 0;
//     });

//     canvas.on('mouse:up', function() {
//       verticalLines.length = horizontalLines.length = 0;
//       canvas.renderAll();
//     });
//   }

//   function initCenteringGuidelines(canvas) {

//     var canvasWidth = canvas.getWidth(),
//         canvasHeight = canvas.getHeight(),
//         canvasWidthCenter = canvasWidth / 2,
//         canvasHeightCenter = canvasHeight / 2,
//         canvasWidthCenterMap = { },
//         canvasHeightCenterMap = { },
//         centerLineMargin = 4,
//         centerLineColor = 'rgba(255,0,241,0.5)',
//         centerLineWidth = 1,
//         ctx = canvas.getSelectionContext(),
//         viewportTransform;

//     for (var i = canvasWidthCenter - centerLineMargin, len = canvasWidthCenter + centerLineMargin; i <= len; i++) {
//       canvasWidthCenterMap[Math.round(i)] = true;
//     }
//     for (var i = canvasHeightCenter - centerLineMargin, len = canvasHeightCenter + centerLineMargin; i <= len; i++) {
//       canvasHeightCenterMap[Math.round(i)] = true;
//     }

//     function showVerticalCenterLine() {
//       showCenterLine(canvasWidthCenter + 0.5, 0, canvasWidthCenter + 0.5, canvasHeight);
//     }

//     function showHorizontalCenterLine() {
//       showCenterLine(0, canvasHeightCenter + 0.5, canvasWidth, canvasHeightCenter + 0.5);
//     }

//     function showCenterLine(x1, y1, x2, y2) {
//       ctx.save();
//       ctx.strokeStyle = centerLineColor;
//       ctx.lineWidth = centerLineWidth;
//       ctx.beginPath();
//       ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3]);
//       ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3]);
//       ctx.stroke();
//       ctx.restore();
//     }

//     var afterRenderActions = [],
//         isInVerticalCenter,
//         isInHorizontalCenter;

//     canvas.on('mouse:down', function () {
//       viewportTransform = canvas.viewportTransform;
//     });

//     canvas.on('object:moving', function(e) {
//       var object = e.target,
//           objectCenter = object.getCenterPoint(),
//           transform = canvas._currentTransform;

//       if (!transform) return;

//       isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap,
//       isInHorizontalCenter = Math.round(objectCenter.y) in canvasHeightCenterMap;

//       if (isInHorizontalCenter || isInVerticalCenter) {
//         object.setPositionByOrigin(new fabric.Point((isInVerticalCenter ? canvasWidthCenter : objectCenter.x), (isInHorizontalCenter ? canvasHeightCenter : objectCenter.y)), 'center', 'center');
//       }
//     });

//     canvas.on('before:render', function() {
//       canvas.clearContext(canvas.contextTop);
//     });

//     canvas.on('after:render', function() {
//       if (isInVerticalCenter) {
//         showVerticalCenterLine();
//       }
//       if (isInHorizontalCenter) {
//         showHorizontalCenterLine();
//       }
//     });

//     canvas.on('mouse:up', function() {
//       // clear these values, to stop drawing guidelines once mouse is up
//       isInVerticalCenter = isInHorizontalCenter = null;
//       canvas.renderAll();
//     });
//   }

// initAligningGuidelines(newCanvas)
// initCenteringGuidelines(newCanvas)

// newCanvas.on('mouse:wheel', function(opt) {
//     var delta = opt.e.deltaY;
//     var zoom = newCanvas.getZoom();
//     zoom *= 0.999 ** delta;
//     if (zoom > 20) zoom = 20;
//     if (zoom < 0.01) zoom = 0.01;
//     newCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
//     opt.e.preventDefault();
//     opt.e.stopPropagation();
//   });



let reset_zoom = document.getElementById('reset_zoom');


reset_zoom.addEventListener('click', function() {

    let zoomValue = 1;

    newCanvas.setWidth(actualCanvasWidth);
    newCanvas.setHeight(actualCanvasHeight);

    // Center the canvas
    newCanvas.setViewportTransform([zoomValue, 0, 0, zoomValue, 0, 0]);

    newCanvas.renderAll();
    newCanvas.calcOffset();
})


newCanvas.setZoom(1)
// initAligningGuidelines(newCanvas);

newCanvas.zoomToPoint(new fabric.Point(newCanvas.width / 2, newCanvas.height / 2), 1)

function initAligningGuidelines(canvas) {

    var ctx = canvas.getSelectionContext(),
        aligningLineOffset = 5,
        aligningLineMargin = 4,
        aligningLineWidth = 1,
        aligningLineColor = 'rgb(0,255,0)',
        viewportTransform,
        zoom = 1;

    function drawVerticalLine(coords) {
      drawLine(
        coords.x + 0.5,
        coords.y1 > coords.y2 ? coords.y2 : coords.y1,
        coords.x + 0.5,
        coords.y2 > coords.y1 ? coords.y2 : coords.y1);
    }

    function drawHorizontalLine(coords) {
      drawLine(
        coords.x1 > coords.x2 ? coords.x2 : coords.x1,
        coords.y + 0.5,
        coords.x2 > coords.x1 ? coords.x2 : coords.x1,
        coords.y + 0.5);
    }

    function drawLine(x1, y1, x2, y2) {
      ctx.save();
      ctx.lineWidth = aligningLineWidth;
      ctx.strokeStyle = aligningLineColor;
      ctx.beginPath();
      ctx.moveTo(((x1+viewportTransform[4])*zoom), ((y1+viewportTransform[5])*zoom));
      ctx.lineTo(((x2+viewportTransform[4])*zoom), ((y2+viewportTransform[5])*zoom));
      ctx.stroke();
      ctx.restore();
    }

    function isInRange(value1, value2) {
      value1 = Math.round(value1);
      value2 = Math.round(value2);
      for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
        if (i === value2) {
          return true;
        }
      }
      return false;
    }

    var verticalLines = [],
        horizontalLines = [];

    canvas.on('mouse:down', function () {
      viewportTransform = canvas.viewportTransform;
      zoom = canvas.getZoom();
    });

    canvas.on('object:moving', function(e) {

      var activeObject = e.target,
          canvasObjects = canvas.getObjects(),
          activeObjectCenter = activeObject.getCenterPoint(),
          activeObjectLeft = activeObjectCenter.x,
          activeObjectTop = activeObjectCenter.y,
          activeObjectBoundingRect = activeObject.getBoundingRect(),
          activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3],
          activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
          horizontalInTheRange = false,
          verticalInTheRange = false,
          transform = canvas._currentTransform;

      if (!transform) return;

      // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
      // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

      for (var i = canvasObjects.length; i--; ) {

        if (canvasObjects[i] === activeObject) continue;

        var objectCenter = canvasObjects[i].getCenterPoint(),
            objectLeft = objectCenter.x,
            objectTop = objectCenter.y,
            objectBoundingRect = canvasObjects[i].getBoundingRect(),
            objectHeight = objectBoundingRect.height / viewportTransform[3],
            objectWidth = objectBoundingRect.width / viewportTransform[0];

        // snap by the horizontal center line
        if (isInRange(objectLeft, activeObjectLeft)) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft,
            y1: (objectTop < activeObjectTop)
              ? (objectTop - objectHeight / 2 - aligningLineOffset)
              : (objectTop + objectHeight / 2 + aligningLineOffset),
            y2: (activeObjectTop > objectTop)
              ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
              : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
          });
          activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
        }

        // snap by the left edge
        if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft - objectWidth / 2,
            y1: (objectTop < activeObjectTop)
              ? (objectTop - objectHeight / 2 - aligningLineOffset)
              : (objectTop + objectHeight / 2 + aligningLineOffset),
            y2: (activeObjectTop > objectTop)
              ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
              : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
          });
          activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
        }

        // snap by the right edge
        if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
          verticalInTheRange = true;
          verticalLines.push({
            x: objectLeft + objectWidth / 2,
            y1: (objectTop < activeObjectTop)
              ? (objectTop - objectHeight / 2 - aligningLineOffset)
              : (objectTop + objectHeight / 2 + aligningLineOffset),
            y2: (activeObjectTop > objectTop)
              ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
              : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
          });
          activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
        }

        // snap by the vertical center line
        if (isInRange(objectTop, activeObjectTop)) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop,
            x1: (objectLeft < activeObjectLeft)
              ? (objectLeft - objectWidth / 2 - aligningLineOffset)
              : (objectLeft + objectWidth / 2 + aligningLineOffset),
            x2: (activeObjectLeft > objectLeft)
              ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
              : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
          });
          activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
        }

        // snap by the top edge
        if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop - objectHeight / 2,
            x1: (objectLeft < activeObjectLeft)
              ? (objectLeft - objectWidth / 2 - aligningLineOffset)
              : (objectLeft + objectWidth / 2 + aligningLineOffset),
            x2: (activeObjectLeft > objectLeft)
              ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
              : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
          });
          activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
        }

        // snap by the bottom edge
        if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
          horizontalInTheRange = true;
          horizontalLines.push({
            y: objectTop + objectHeight / 2,
            x1: (objectLeft < activeObjectLeft)
              ? (objectLeft - objectWidth / 2 - aligningLineOffset)
              : (objectLeft + objectWidth / 2 + aligningLineOffset),
            x2: (activeObjectLeft > objectLeft)
              ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
              : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
          });
          activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
        }
      }

      if (!horizontalInTheRange) {
        horizontalLines.length = 0;
      }

      if (!verticalInTheRange) {
        verticalLines.length = 0;
      }
    });

    canvas.on('before:render', function() {
        if (canvas.contextTop) {
            canvas.clearContext(canvas.contextTop);
        }
    });

    canvas.on('after:render', function() {
      for (var i = verticalLines.length; i--; ) {
        drawVerticalLine(verticalLines[i]);
      }
      for (var i = horizontalLines.length; i--; ) {
        drawHorizontalLine(horizontalLines[i]);
      }

      verticalLines.length = horizontalLines.length = 0;
    });

    canvas.on('mouse:up', function() {
      verticalLines.length = horizontalLines.length = 0;
      canvas.renderAll();
    });
  }

function initCenteringGuidelines(canvas) {

    var canvasWidth = canvas.getWidth(),
        canvasHeight = canvas.getHeight(),
        canvasWidthCenter = canvasWidth / 2,
        canvasHeightCenter = canvasHeight / 2,
        canvasWidthCenterMap = { },
        canvasHeightCenterMap = { },
        centerLineMargin = 4,
        centerLineColor = 'rgba(255,0,241,0.5)',
        centerLineWidth = 1,
        ctx = canvas.getSelectionContext(),
        viewportTransform;

    for (var i = canvasWidthCenter - centerLineMargin, len = canvasWidthCenter + centerLineMargin; i <= len; i++) {
      canvasWidthCenterMap[Math.round(i)] = true;
    }
    for (var i = canvasHeightCenter - centerLineMargin, len = canvasHeightCenter + centerLineMargin; i <= len; i++) {
      canvasHeightCenterMap[Math.round(i)] = true;
    }

    function showVerticalCenterLine() {
      showCenterLine(canvasWidthCenter + 0.5, 0, canvasWidthCenter + 0.5, canvasHeight);
    }

    function showHorizontalCenterLine() {
      showCenterLine(0, canvasHeightCenter + 0.5, canvasWidth, canvasHeightCenter + 0.5);
    }

    function showCenterLine(x1, y1, x2, y2) {
      ctx.save();
      ctx.strokeStyle = centerLineColor;
      ctx.lineWidth = centerLineWidth;
      ctx.beginPath();
      ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3]);
      ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3]);
      ctx.stroke();
      ctx.restore();
    }

    var afterRenderActions = [],
        isInVerticalCenter,
        isInHorizontalCenter;

    canvas.on('mouse:down', function () {
      viewportTransform = canvas.viewportTransform;
    });

    canvas.on('object:moving', function(e) {
      var object = e.target,
          objectCenter = object.getCenterPoint(),
          transform = canvas._currentTransform;

      if (!transform) return;

      isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap,
      isInHorizontalCenter = Math.round(objectCenter.y) in canvasHeightCenterMap;

      if (isInHorizontalCenter || isInVerticalCenter) {
        object.setPositionByOrigin(new fabric.Point((isInVerticalCenter ? canvasWidthCenter : objectCenter.x), (isInHorizontalCenter ? canvasHeightCenter : objectCenter.y)), 'center', 'center');
      }
    });

    canvas.on('before:render', function() {
        if (canvas.contextTop) {
          canvas.clearContext(canvas.contextTop);
        }
      });

    canvas.on('after:render', function() {
      if (isInVerticalCenter) {
        showVerticalCenterLine();
      }
      if (isInHorizontalCenter) {
        showHorizontalCenterLine();
      }
    });

    canvas.on('mouse:up', function() {
      // clear these values, to stop drawing guidelines once mouse is up
      isInVerticalCenter = isInHorizontalCenter = null;
      canvas.renderAll();
    });
  }

initCenteringGuidelines(newCanvas)
initAligningGuidelines(newCanvas)

// // ===> Removes the guidelines when the mouse leaves


// function initAligningGuidelines(canvas) {

//     var ctx = canvas.getSelectionContext(),
//         aligningLineOffset = 5,
//         aligningLineMargin = 4,
//         aligningLineWidth = 1,
//         aligningLineColor = 'rgb(173, 216, 230)',
//         viewportTransform,
//         zoom = 1;

//     function drawVerticalLine(coords) {
//         drawLine(
//         coords.x + 0.5,
//         coords.y1 > coords.y2 ? coords.y2 : coords.y1,
//         coords.x + 0.5,
//         coords.y2 > coords.y1 ? coords.y2 : coords.y1);
//     }

//     function drawHorizontalLine(coords) {
//         drawLine(
//         coords.x1 > coords.x2 ? coords.x2 : coords.x1,
//         coords.y + 0.5,
//         coords.x2 > coords.x1 ? coords.x2 : coords.x1,
//         coords.y + 0.5);
//     }

//     function drawLine(x1, y1, x2, y2) {
//         ctx.save();
//         ctx.lineWidth = aligningLineWidth;
//         ctx.strokeStyle = aligningLineColor;
//         ctx.beginPath();
//         ctx.moveTo(((x1*zoom+viewportTransform[4])), ((y1*zoom+viewportTransform[5])));
//         ctx.lineTo(((x2*zoom+viewportTransform[4])), ((y2*zoom+viewportTransform[5])));
//         ctx.stroke();
//         ctx.restore();
//     }

//     function isInRange(value1, value2) {
//         value1 = Math.round(value1);
//         value2 = Math.round(value2);
//         for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
//         if (i === value2) {
//             return true;
//         }
//         }
//         return false;
//     }

//     var verticalLines = [],
//         horizontalLines = [];

//     canvas.on('mouse:down', function () {
//         viewportTransform = canvas.viewportTransform;
//         zoom = canvas.getZoom();
//     });

//     canvas.on('object:moving', function(e) {

//         var activeObject = e.target,
//             canvasObjects = canvas.getObjects(),
//             activeObjectCenter = activeObject.getCenterPoint(),
//             activeObjectLeft = activeObjectCenter.x,
//             activeObjectTop = activeObjectCenter.y,
//             activeObjectBoundingRect = activeObject.getBoundingRect(),
//             activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3],
//             activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0],
//             horizontalInTheRange = false,
//             verticalInTheRange = false,
//             transform = canvas._currentTransform;

//         if (!transform) return;

//         // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
//         // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

//         for (var i = canvasObjects.length; i--; ) {

//         if (canvasObjects[i] === activeObject) continue;

//         var objectCenter = canvasObjects[i].getCenterPoint(),
//             objectLeft = objectCenter.x,
//             objectTop = objectCenter.y,
//             objectBoundingRect = canvasObjects[i].getBoundingRect(),
//             objectHeight = objectBoundingRect.height / viewportTransform[3],
//             objectWidth = objectBoundingRect.width / viewportTransform[0];

//         // snap by the horizontal center line
//         if (isInRange(objectLeft, activeObjectLeft)) {
//             verticalInTheRange = true;
//             verticalLines.push({
//             x: objectLeft,
//             y1: (objectTop < activeObjectTop)
//                 ? (objectTop - objectHeight / 2 - aligningLineOffset)
//                 : (objectTop + objectHeight / 2 + aligningLineOffset),
//             y2: (activeObjectTop > objectTop)
//                 ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
//                 : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
//             });
//             activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
//         }

//         // snap by the left edge
//         if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
//             verticalInTheRange = true;
//             verticalLines.push({
//             x: objectLeft - objectWidth / 2,
//             y1: (objectTop < activeObjectTop)
//                 ? (objectTop - objectHeight / 2 - aligningLineOffset)
//                 : (objectTop + objectHeight / 2 + aligningLineOffset),
//             y2: (activeObjectTop > objectTop)
//                 ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
//                 : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
//             });
//             activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
//         }

//         // snap by the right edge
//         if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
//             verticalInTheRange = true;
//             verticalLines.push({
//             x: objectLeft + objectWidth / 2,
//             y1: (objectTop < activeObjectTop)
//                 ? (objectTop - objectHeight / 2 - aligningLineOffset)
//                 : (objectTop + objectHeight / 2 + aligningLineOffset),
//             y2: (activeObjectTop > objectTop)
//                 ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
//                 : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
//             });
//             activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
//         }

//         // snap by the vertical center line
//         if (isInRange(objectTop, activeObjectTop)) {
//             horizontalInTheRange = true;
//             horizontalLines.push({
//             y: objectTop,
//             x1: (objectLeft < activeObjectLeft)
//                 ? (objectLeft - objectWidth / 2 - aligningLineOffset)
//                 : (objectLeft + objectWidth / 2 + aligningLineOffset),
//             x2: (activeObjectLeft > objectLeft)
//                 ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
//                 : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
//             });
//             activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
//         }

//         // snap by the top edge
//         if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
//             horizontalInTheRange = true;
//             horizontalLines.push({
//             y: objectTop - objectHeight / 2,
//             x1: (objectLeft < activeObjectLeft)
//                 ? (objectLeft - objectWidth / 2 - aligningLineOffset)
//                 : (objectLeft + objectWidth / 2 + aligningLineOffset),
//             x2: (activeObjectLeft > objectLeft)
//                 ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
//                 : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
//             });
//             activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
//         }

//         // snap by the bottom edge
//         if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
//             horizontalInTheRange = true;
//             horizontalLines.push({
//             y: objectTop + objectHeight / 2,
//             x1: (objectLeft < activeObjectLeft)
//                 ? (objectLeft - objectWidth / 2 - aligningLineOffset)
//                 : (objectLeft + objectWidth / 2 + aligningLineOffset),
//             x2: (activeObjectLeft > objectLeft)
//                 ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
//                 : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
//             });
//             activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
//         }
//         }

//         if (!horizontalInTheRange) {
//         horizontalLines.length = 0;
//         }

//         if (!verticalInTheRange) {
//         verticalLines.length = 0;
//         }
//     });

//     canvas.on('before:render', function() {
//         canvas.clearContext(canvas.contextTop);
//     });

//     canvas.on('after:render', function() {
//         for (var i = verticalLines.length; i--; ) {
//         drawVerticalLine(verticalLines[i]);
//         }
//         for (var i = horizontalLines.length; i--; ) {
//         drawHorizontalLine(horizontalLines[i]);
//         }

//         verticalLines.length = horizontalLines.length = 0;
//     });

//     canvas.on('mouse:up', function() {
//         verticalLines.length = horizontalLines.length = 0;
//         canvas.renderAll();
//     });
//     }

// // MOUSEWHEEL ZOOM
// newCanvas.on('mouse:wheel', (opt) => {
// let delta = 0

// // -------------------------------
// // WHEEL RESOLUTION
// let wheelDelta = opt.e.wheelDelta
// let deltaY = opt.e.deltaY

// // CHROME WIN/MAC | SAFARI 7 MAC | OPERA WIN/MAC | EDGE
// if (wheelDelta) {
//     delta = -wheelDelta / 120
// }
// // FIREFOX WIN / MAC | IE
// if(deltaY) {
//     deltaY > 0 ? delta = 1 : delta = -1
// }
// // -------------------------------

// let pointer = newCanvas.getPointer(opt.e)
// let zoom = newCanvas.getZoom()
// zoom = zoom - delta / 10

// // limit zoom in
// if (zoom > 4) zoom = 4

// // limit zoom out
// if (zoom < 0.2) {
//     zoom = 0.2
// }

// //canvas.zoomToPoint({
// //  x: opt.e.offsetX,
// //  y: opt.e.offsetY
// //}, zoom)

// newCanvas.zoomToPoint(
//     new fabric.Point(newCanvas.width / 2, newCanvas.height / 2),
//     zoom);

// opt.e.preventDefault()
// opt.e.stopPropagation()

// newCanvas.renderAll()
// newCanvas.calcOffset()


// })



//MOUSEWHEEL ZOOM VIA ANY POINT ON THE CANVAS
// newCanvas.on('mouse:wheel', (opt) => {
//     let delta = 0;

//     // -------------------------------
//     // WHEEL RESOLUTION
//     let wheelDelta = opt.e.wheelDelta;
//     let deltaY = opt.e.deltaY;

//     // CHROME WIN/MAC | SAFARI 7 MAC | OPERA WIN/MAC | EDGE
//     if (wheelDelta) {
//       delta = -wheelDelta / 120;
//     }
//     // FIREFOX WIN / MAC | IE
//     if (deltaY) {
//       deltaY > 0 ? (delta = 1) : (delta = -1);
//     }
//     // -------------------------------

//     let pointer = newCanvas.getPointer(opt.e);
//     let zoom = newCanvas.getZoom();
//     zoom = zoom - delta / 20;

//     // limit zoom in
//     if (zoom > 2) zoom = 2;

//     // limit zoom out
//     if (zoom < 1) {

//         zoom = 1;

//         newCanvas.setZoom(1);
//         newCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

//         return;
//     }

//     // Calculate the zoom point based on the mouse pointer coordinates
//     let zoomPoint = new fabric.Point(pointer.x, pointer.y);

//     newCanvas.zoomToPoint(zoomPoint, zoom);

//     opt.e.preventDefault();
//     opt.e.stopPropagation();

//     newCanvas.renderAll();
//     newCanvas.calcOffset();
//   });





const zoomRangeInput = document.getElementById('zoomRange');
const originalCanvasWidth = newCanvas.width;
const originalCanvasHeight = newCanvas.height;

zoomRangeInput.addEventListener('input', function() {
  let zoomValue = parseFloat(this.value);

  // Limit zoom in
  if (zoomValue > 4) {
    zoomValue = 4;
    this.value = zoomValue;
  }

  // Limit zoom out
  if (zoomValue < 0.2) {
    zoomValue = 0.2;
    this.value = zoomValue;
  }

  // Calculate scaled canvas dimensions
  const scaledCanvasWidth = originalCanvasWidth * zoomValue;
  const scaledCanvasHeight = originalCanvasHeight * zoomValue;

  // Set new canvas dimensions
  newCanvas.setWidth(scaledCanvasWidth);
  newCanvas.setHeight(scaledCanvasHeight);

  // Center the canvas
  newCanvas.setViewportTransform([zoomValue, 0, 0, zoomValue, 0, 0]);

  newCanvas.renderAll();
  newCanvas.calcOffset();
});

newCanvas.on("after:render", function(){newCanvas.calcOffset();});

// var gridsize = 30;
// var canvasWidth = newCanvas.width;
// var canvasHeight = newCanvas.height;
// var cellWidth = canvasHeight / gridsize;

// for (var x = 1; x < canvasWidth / cellWidth; x++) {
//   newCanvas.add(new fabric.Line([cellWidth * x, 0, cellWidth * x, canvasHeight], { stroke: "#000000", strokeWidth: 1, selectable: false }));
// }

// for (var y = 1; y < canvasHeight / cellWidth; y++) {
//   newCanvas.add(new fabric.Line([0, cellWidth * y, canvasWidth, cellWidth * y], { stroke: "#000000", strokeWidth: 1, selectable: false }));
// }


var gridSizeSelect = document.getElementById('gridSizeSelect');

function createGrid() {
  var gridsize = parseInt(gridSizeSelect.value);
  var canvasWidth = newCanvas.width;
  var canvasHeight = newCanvas.height;
  var cellWidth = canvasHeight / gridsize;

  // Clear existing grid
  newCanvas.forEachObject(function (obj) {
    if (obj.isGridLine) {
        newCanvas.remove(obj);
    }
  });

  // Create new grid lines
  for (var x = 1; x < canvasWidth / cellWidth; x++) {
    newCanvas.add(new fabric.Line([cellWidth * x, 0, cellWidth * x, canvasHeight], { stroke: "#000000", strokeWidth: 1, selectable: false, isGridLine: true }));
  }

  for (var y = 1; y < canvasHeight / cellWidth; y++) {
    newCanvas.add(new fabric.Line([0, cellWidth * y, canvasWidth, cellWidth * y], { stroke: "#000000", strokeWidth: 1, selectable: false, isGridLine: true }));
  }
}

// Call createGrid function initially
createGrid();

// Add event listener to update the grid on select change
gridSizeSelect.addEventListener('change', createGrid);



// Assuming you have a `canvas` variable referencing your Fabric.js canvas

// newCanvas.on('mouse:wheel', function(options) {
//     const delta = options.e.deltaY;
//     const scrollDistance = 10; // Adjust this value to control the scroll distance

//     if (delta > 0) {
//       // Scroll down
//       newCanvas.viewportTransform[5] -= scrollDistance;
//     } else {
//       // Scroll up
//       newCanvas.viewportTransform[5] += scrollDistance;
//     }

//     newCanvas.renderAll();
//   });

var canvasDataHistory = [];
var canvasDataIndex = -1;

newCanvas.on('mouse:up', function() {
    saveCanvasData();
});



// Save the canvas data to localStorage
function saveCanvasData() {
    newCanvas.getObjects().forEach(function (obj) {
        if (obj.isGridLine) {
            obj.excludeFromExport = true;
        }
    });

    var canvasData = JSON.stringify(newCanvas.toJSON());

    // Clear the history after the current index
    canvasDataHistory = canvasDataHistory.slice(0, canvasDataIndex + 1);
    canvasDataHistory.push(canvasData);
    canvasDataIndex++;

    localStorage.setItem('canvasData', canvasData);
}

// Load the canvas data from localStorage
function loadCanvasData() {
    var savedCanvasData = localStorage.getItem('canvasData');

    if (savedCanvasData) {
        newCanvas.loadFromJSON(savedCanvasData, function() {
            console.log(newCanvas.width)
            newCanvas.renderAll();
        });
    }
}

// Undo the last action
function undo() {
    if (canvasDataIndex > 0) {
        canvasDataIndex--;
        var canvasData = canvasDataHistory[canvasDataIndex];
        newCanvas.loadFromJSON(canvasData, function() {
            newCanvas.renderAll();
        });
    }
}

// Redo the last undone action
function redo() {
    if (canvasDataIndex < canvasDataHistory.length - 1) {
        canvasDataIndex++;
        var canvasData = canvasDataHistory[canvasDataIndex];
        newCanvas.loadFromJSON(canvasData, function() {
            newCanvas.renderAll();
        });
    }
}

window.addEventListener('load', function() {
    loadCanvasData();
});

document.addEventListener('keydown', function(event) {
    // Check for specific key combinations
    if (event.ctrlKey && event.key === 'z') {
        // Ctrl + Z: Undo
        event.preventDefault(); // Prevent browser's default behavior (e.g., going back)
        undo();
    } else if (event.ctrlKey && event.key === 'r') {
        // Ctrl + Y: Redo
        event.preventDefault(); // Prevent browser's default behavior (e.g., redoing a text input)
        redo();
        console.log(event.key)
    }
});


//prevent object from going outside the canvas

newCanvas.on('object:moving', function (e) {
    var obj = e.target;

    obj.setCoords();
    var curZoom = newCanvas.getZoom();


    // if the object is too big, ignore
    if (obj.getScaledHeight() > newCanvas.height || obj.getScaledWidth() > newCanvas.width) {
      return;
    }

    // top-left corner
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
      obj.top = Math.max(obj.top * curZoom, obj.top * curZoom - obj.getBoundingRect().top) / curZoom;
      obj.left = Math.max(obj.left * curZoom, obj.left * curZoom - obj.getBoundingRect().left) / curZoom;
    }
    // bot-right corner
    if (obj.getBoundingRect().top + obj.getBoundingRect().height > newCanvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > newCanvas.width) {
      obj.top = Math.min(obj.top * curZoom, newCanvas.height - obj.getBoundingRect().height + obj.top * curZoom - obj.getBoundingRect().top) / curZoom;
      obj.left = Math.min(obj.left * curZoom, newCanvas.width - obj.getBoundingRect().width + obj.left * curZoom - obj.getBoundingRect().left) / curZoom;
    }
  });




function createLayer(){
    const layerDiv = document.createElement('div');
    layerDiv.classList.add(['layer flex items-center gap-3']);
    layerDiv.innerHTML = `
        <h1>Layer 1</h1>
        <button class="eye-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
            </svg>
        </button>

        <button class="lock-icon">

        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-unlock" viewBox="0 0 16 16">
            <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z"/>
        </svg>

        </button>
    `;

    // Append layer to the DOM
    const layersContainer = document.getElementById('layers-container');
    layersContainer.appendChild(layerDiv);
}

createLayer();



newCanvas.renderAll();

