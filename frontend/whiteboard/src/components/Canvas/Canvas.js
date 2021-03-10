import React, { useState, useEffect, useRef, useCallback } from "react";

import "./Canvas.css";
import { getMemory, clearMemory, removeElementAt, getElementAt } from "./Memory"
import { addText, promptForText } from "../../messages/text"
import { drawLine } from "../../messages/draw";
import { getMouseState, handleMouse, movingObject, setMouseState } from "../../messages/mouse";
import { addNote, promptForNote } from "../../messages/note";

import Buttons from "../Buttons/Buttons";
import EditPanel from "../EditPanel/EditPanel";


const Canvas = () => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [color, setColor] = useState('#00000');
    const [selectedObject, setSelectedObject] = useState(null)
    const [updatePanel, setUpdatePanel] = useState(false)
    
    const clearCanvas = useCallback((clearMemoryToo = true) => {
        if (context) {
            // Below is needed
            if (clearMemoryToo) {
                clearMemory()
                setSelectedObject(undefined)
            }
            context.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );

        }
    }, [context])

    const drawEverything = useCallback(() => {
        console.log("re-draw called")
        let array = getMemory()
        clearCanvas(false)
        array.forEach(element => {
            if (element.type === "text") {
                addText(context, element, false)
            }
            if (element.type === "line") {
                drawLine(context, element.coordinates, false)
            }
            if (element.type === "note") {
                addNote(context, element, false)
            }
            // if (element.type === "image") {
            //     drawLine(context, element.coordinates, false)
            // }
        });
    }, [context, clearCanvas])

    function updatePanelDrawEverything() {
        if (getElementAt(selectedObject.id) === undefined) {
            console.log("selectedObject is not in memory")
            setSelectedObject(undefined)
        }
        setUpdatePanel(!updatePanel)
        drawEverything()
    }
    
    useEffect(() => {
        let mouseDown = false;
        let start = { x: 0, y: 0 };
        let end = { x: 0, y: 0 };
        let canvasOffsetLeft = 0;
        let canvasOffsetTop = 0;

        // console.log(React.version)

        if (canvasRef.current) {
            const renderCtx = canvasRef.current.getContext("2d");

            if (renderCtx) {
                canvasRef.current.addEventListener("mousedown", handleMouseDown);
                canvasRef.current.addEventListener("mouseup", handleMouseUp);
                canvasRef.current.addEventListener("mousemove", handleMouseMove);

                canvasOffsetLeft = canvasRef.current.offsetLeft;
                canvasOffsetTop = canvasRef.current.offsetTop;

                renderCtx.fillStyle = "white";
                renderCtx.fillRect(0, 0, canvasRef.width, canvasRef.height);

                setContext(renderCtx);
            }
        }

        function handleMouseDown(evt) {
            mouseDown = true

            start = {
                x: evt.clientX - canvasOffsetLeft,
                y: evt.clientY - canvasOffsetTop,
            };

            end = {
                x: evt.clientX - canvasOffsetLeft,
                y: evt.clientY - canvasOffsetTop,
            };

            if (getMouseState().match('text')) {
                promptForText(context, start)
                mouseDown = false;
            }
            else if (getMouseState().match('mouse')) {
                console.log("mouse down",start)
                setSelectedObject(handleMouse(context, start))
            }
            else if (getMouseState().match('note')) {
                let element = {
                    text: "",
                    coordinates: start
                }
                addNote(context, element)
                mouseDown = false;
            }
        }

        function switchUpdatePanel() {
            if (updatePanel === true) {
                setUpdatePanel(false)
            } else {
                setUpdatePanel(true)
            }
        }

        function handleMouseUp(evt) {
            mouseDown = false;
            switchUpdatePanel()
            // console.log(updatePanel)
        }

        function handleMouseMove(evt) {
            if (mouseDown && context) {
                start = {
                    x: end.x,
                    y: end.y,
                };

                end = {
                    x: evt.clientX - canvasOffsetLeft,
                    y: evt.clientY - canvasOffsetTop,
                };

                let canvas_mouse_coordinates = {
                    start: start,
                    end: end,
                    color: color
                };

                // Draw our path
                // console.log(getMouseState())
                // console.log(selectedObject)
                if (getMouseState().match('draw')) {
                    drawLine(context, canvas_mouse_coordinates);
                }
                else if (getMouseState().match('mouse')) {
                    if (selectedObject !== undefined || selectedObject != null) {
                        let update = movingObject(selectedObject.id, canvas_mouse_coordinates)
                        if (update) {
                            drawEverything()
                        }
                    }
                }
                else if (getMouseState().match('eraser')) {
                    let objectToErase = handleMouse(context, start)
                    if (objectToErase !== undefined || objectToErase != null) {
                        removeElementAt(objectToErase.id);
                        drawEverything()
                    }
                }
            }
        }



        return function cleanup() {
            if (canvasRef.current) {
                canvasRef.current.removeEventListener("mousedown", handleMouseDown);
                canvasRef.current.removeEventListener("mouseup", handleMouseUp);
                canvasRef.current.removeEventListener("mousemove", handleMouseMove);
            }
        };

    }, [context, color, clearCanvas, selectedObject, updatePanel, drawEverything]);

    return (
        <div id="wrapper">
            <div id="left">
            <canvas
                id="canvas"
                ref={canvasRef}
                width="1500"
                height="800"
                ></canvas>
                <Buttons clearCanvas={clearCanvas} setMouseState={setMouseState}></Buttons>
            </div>
            <div id="right">
                <EditPanel selectedObject={selectedObject} updatePanel={updatePanel} updatePanelDrawEverything={updatePanelDrawEverything}></EditPanel>
            </div>
        </div>
    );
};

export default Canvas;
