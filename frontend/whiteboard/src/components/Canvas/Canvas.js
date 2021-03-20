import React, { useState, useEffect, useRef, useCallback } from "react";

import "./Canvas.css";
import { getMemory, clearMemory, removeElementAt, getElementAt } from "./Memory"
import { addText, promptForText } from "../../messages/text"
import { drawLine } from "../../messages/draw";
import { getMouseState, handleMouse, movingObject, setMouseState } from "../../messages/mouse";
import { addNote, promptForNote } from "../../messages/note";

import Buttons from "../Buttons/Buttons";
import EditPanel from "../EditPanel/EditPanel";
import socket from "../socket";
import { convertJSONToBuffer, convertBufferToJSON } from "../../util/bufferUtils";
import { addImage } from "../../messages/image";

socket.on("userApprove", (user) => {
    console.log("user approve called");
    let answer = window.confirm(`Approve user: ${user.name}`);
    let temp = convertJSONToBuffer({ type: "user", user: user })
    console.log(answer)
    if (answer) {
        socket.emit("message", temp, "approved")
    } else {
        socket.emit("message", temp, "denied")
    }
})

const Canvas = () => {
    const canvasRef = useRef(null);
    const mouseDown = useRef(false);
    const [context, setContext] = useState(null);
    const [color, setColor] = useState('#00000');
    const [selectedObject, setSelectedObject] = useState(null)
    const [updatePanel, setUpdatePanel] = useState(false)
    let drawing = false
    
    socket.on("clearCanvas", (clearMemoryToo) => {
        console.log("Received clear canvas, clearing")
        clearCanvas(clearMemoryToo)
    })



    function sendClearCanvas(clearMemoryToo) {
        clearCanvas(clearMemoryToo)
        socket.emit("sendClearCanvas")
    }

    const clearCanvas = useCallback((clearMemoryToo = true) => {
        if (context) {
            // Below is needed
            if (clearMemoryToo) {
                socket.emit("clearMemory")
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
        if (drawing) {
            return;
        }
        drawing = true;
        console.log("re-draw called")
        let temp = convertJSONToBuffer({type: "canvas"})
        socket.emit("message", temp, "canvas", (memory) => {
            let array = convertBufferToJSON(memory)
            clearCanvas(false)
            if (context != null) {
                array.forEach(element => {
                    if (element != null) {
                        if (element.type === "text") {
                            addText(context, element, false)
                        }
                        if (element.type === "line") {
                            drawLine(context, element.coordinates, false)
                        }
                        if (element.type === "note") {
                            addNote(context, element, false)
                        }
                        if (element.type === "image") {
                            addImage(context, element, false)
                        }
                    }
                });
            }
            drawing = false;
        })

    }, [context, clearCanvas])

    function updatePanelDrawEverything() {
        // if (getElementAt(selectedObject.id) === undefined) {
        //     console.log("selectedObject is not in memory")
        //     setSelectedObject(undefined)
        // }
        setUpdatePanel(!updatePanel)
        drawEverything()
    }

    useEffect(() => {
        let start = { x: 0, y: 0 };
        let end = { x: 0, y: 0 };
        let canvasOffsetLeft = 0;
        let canvasOffsetTop = 0;

        // console.log(React.version)

        socket.on("redraw", () => {
            drawEverything()
        })

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
            mouseDown.current = true

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
                mouseDown.current = false;
            }
            else if (getMouseState().match('mouse')) {
                // console.log("mouse down", start)
                socket.emit("message", convertJSONToBuffer({ type: "mouse", coordinates: start }), "checkIfMouseOnObject", (obj) => {
                    // console.log("selected object", obj)
                    setSelectedObject(convertBufferToJSON(obj))
                    // console.log("selected object", selectedObject)
                    mouseDown.current = true;
                })
            }
            else if (getMouseState().match('note')) {
                let element = {
                    text: "",
                    coordinates: start
                }
                addNote(context, element)
                mouseDown.current = false;
            }
            else if (getMouseState().match('image')) {
                let element = {
                    coordinates: start
                }
                addImage(context, element)
            }
        }

    
        function handleMouseUp(evt) {
            mouseDown.current = false;
            socket.emit("message", convertJSONToBuffer({ type: "mouse", coordinates: start }), "checkIfMouseOnObject", (obj) => {
                // console.log("selected object", obj)
                setSelectedObject(convertBufferToJSON(obj))
            })
        }

        function handleMouseMove(evt) {
            if (mouseDown.current === true) {
                // console.log(mouseDown)
            }
            if (mouseDown.current === true && context) {
                start = {
                    x: end.x,
                    y: end.y,
                };

                end = {
                    x: evt.clientX - canvasOffsetLeft,
                    y: evt.clientY - canvasOffsetTop,
                };

                let mouseCoordinates = {
                    start: start,
                    end: end,
                    color: color
                };

                if (getMouseState().match('draw')) {
                    drawLine(context, mouseCoordinates);
                }
                else if (getMouseState().match('mouse')) {
                    let buf = convertJSONToBuffer({ type:"mouse", coordinates: mouseCoordinates })
                    socket.emit("message", buf, "moveObject", () => {
                        drawEverything()
                    })
                }
                
                else if (getMouseState().match('eraser')) {
                    // let objectToErase = null;
                    let buf = convertJSONToBuffer({ type:"mouse", coordinates: mouseCoordinates })
                    socket.emit("message", buf, "delete")
                    // if (objectToErase !== undefined || objectToErase != null) {
                    //     removeElementAt(objectToErase.id);
                    //     drawEverything()
                    // }
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

    }, [context, color, clearCanvas, drawEverything, updatePanel]);

    return (
        <div id="wrapper">
            <div id="left">
                <canvas
                    id="canvas"
                    ref={canvasRef}
                    width="1500"
                    height="800"
                ></canvas>
                <Buttons sendClearCanvas={sendClearCanvas} setMouseState={setMouseState}></Buttons>
            </div>
            <div id="right">
                <EditPanel selectedObject={selectedObject} updatePanel={updatePanel} updatePanelDrawEverything={updatePanelDrawEverything}></EditPanel>
            </div>
        </div>
    );
};

export default Canvas;
