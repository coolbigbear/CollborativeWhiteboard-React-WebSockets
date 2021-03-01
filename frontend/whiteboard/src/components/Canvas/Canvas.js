import React, { useState, useEffect, useRef } from "react";

import "./Canvas.css";
import Buttons from "../Buttons/Buttons";
import { getMemory, clearMemory, removeElementAt } from "./Memory"
import { addText, promptForText } from "../../messages/text"
import { drawLine } from "../../messages/draw";
import { getMouseState, handleMouse, movingObject, setMouseState } from "../../messages/mouse";


const Canvas = () => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [color, setColor] = useState('#00000');
    
    useEffect(() => {
        let selectedObject = null
        let mouseDown = false;
        let start = { x: 0, y: 0 };
        let end = { x: 0, y: 0 };
        let canvasOffsetLeft = 0;
        let canvasOffsetTop = 0;

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
                selectedObject = handleMouse(context, start)
            }
        }

        function handleMouseUp(evt) {
            mouseDown = false;
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
                console.log(getMouseState())
                if (getMouseState().match('draw')) {
                    drawLine(context, canvas_mouse_coordinates);
                }
                else if (getMouseState().match('mouse')) {
                    movingObject(selectedObject, canvas_mouse_coordinates)
                    drawEverything()
                }
                else if (getMouseState().match('eraser')) {
                    selectedObject = handleMouse(context, start)
                    removeElementAt(selectedObject);
                    drawEverything()
                }
            }
        }

        function drawEverything() {
            let array = getMemory()
            clearCanvas(false)
            array.forEach(element => {
                if (element.type === "text") {
                    addText(element.text, context, element.coordinates, false)
                }
                if (element.type === "line") {
                    drawLine(context, element.coordinates, false)
                }
                // if (element.type === "note") {
                //     drawLine(context, element.coordinates, false)
                // }
                // if (element.type === "image") {
                //     drawLine(context, element.coordinates, false)
                // }
            });
        } 

        return function cleanup() {
            if (canvasRef.current) {
                canvasRef.current.removeEventListener("mousedown", handleMouseDown);
                canvasRef.current.removeEventListener("mouseup", handleMouseUp);
                canvasRef.current.removeEventListener("mousemove", handleMouseMove);
            }
        };

    }, [context, color, clearCanvas]);


    function clearCanvas(clearMemoryToo = true) {
        if (context) {
            // Below is needed
            if (clearMemoryToo) clearMemory()
            context.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
            );

        }
    }

    return (
        <div>
            <canvas
                id="canvas"
                ref={canvasRef}
                width="1500"
                height="800"
            ></canvas>
            <Buttons clearCanvas={clearCanvas} setMouseState={setMouseState}></Buttons>
        </div>
    );
};

export default Canvas;
