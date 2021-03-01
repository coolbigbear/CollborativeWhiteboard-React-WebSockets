import React, { useState, useEffect, useRef } from "react";

import Buttons from "../Buttons/Buttons";
import { getElementAt, replaceElementAt, addToMemory, getMemory, checkIfMouseOnObject, clearMemory } from "./Memory"
import "./Canvas.css";


const Canvas = () => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [color, setColor] = useState('#00000');
    let mouseState = 'mouse'
    let selectedObject = null

    useEffect(() => {
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

            if (mouseState.match('text')) {
                addText(context, start)
                mouseDown = false;
            }
            else if (mouseState.match('mouse')) {
                handleMouse(context, start)
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
                console.log(mouseState)
                if (mouseState.match('draw')) {
                    drawLine(context, canvas_mouse_coordinates);
                }
                else if (mouseState.match('mouse')) {
                    if (selectedObject == null) {
                        console.log("No object under mouse")
                        return
                    } else {

                        var obj = getElementAt(selectedObject);
                        obj.x += end.x - start.x;
                        obj.y += end.y - start.y;
                        replaceElementAt(selectedObject, obj)
                        console.log(getMemory())
                        drawEverything(context)
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

    }, [context, color, mouseState]);

    function drawEverything() {
        let array = getMemory()
        clearCanvas(false)
        array.forEach(element => {
            if (element.type === "text") {
                context.fillText(element.text, element.x, element.y);
            }
            if (element.type === "line") {
                drawLine(context, element.coordinates, false)
            }
        });
    } 

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

    function setMouseState(state) {
        mouseState = state;
    }

    function drawLine(context, coordinates, addToMemoryToo = true) {
        context.beginPath();
        context.moveTo(coordinates.start.x, coordinates.start.y);
        context.lineTo(coordinates.end.x, coordinates.end.y);
        context.strokeStyle = coordinates.color.hex;
        context.lineWidth = 3;
        context.stroke();
        context.closePath();

        if (addToMemoryToo) {
            let obj = {
                type: "line",
                lineWidth: 3,
                selected: false,
                coordinates: coordinates
            }
            addToMemory(obj)
        }
    }

    function addText(context, coordinates) {
        let text = prompt("Please type in your text:")
        if (text === null) return;
        console.log(text)
        context.font = "100px Arial";
        context.fillStyle = "red";
        context.fillText(text, coordinates.x, coordinates.y);
        let obj = {
            type: "text",
            text: text,
            font: 100,
            x: coordinates.x,
            y: coordinates.y,
            selected: false
        }
        obj = calculateTextWidth(context, obj)
        addToMemory(obj)
    }

    function calculateTextWidth(context, obj) {
        obj.width = context.measureText(obj.text).width;
        obj.height = obj.font;
        return obj
    }

    function handleMouse(context, coordinates) {
        selectedObject = checkIfMouseOnObject(coordinates)
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
