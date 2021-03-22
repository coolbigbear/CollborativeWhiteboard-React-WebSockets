import React, { useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from 'react-router-dom'

import "./Canvas.css";
import { addText, promptForText } from "../../messages/text"
import { drawLine } from "../../messages/draw";
import { getMouseState, handleMouse, setMouseState } from "../../messages/mouse";
import { addNote } from "../../messages/note";

import Buttons from "../Buttons/Buttons";
import EditPanel from "../EditPanel/EditPanel";
import socket from "../socket";
import { convertBufferToJSON, convertJSONToBuffer } from "../../util/bufferUtils";
import { addImage } from "../../messages/image";
import { clearMemory, getMemory, checkIfMouseOnObject, getElementAt } from "./Memory";

socket.on("userApprove", (user) => {
    console.log("user approve called");
    user = convertBufferToJSON(user)
    let answer = window.confirm(`Approve user: ${user.name}`);
    let temp = convertJSONToBuffer({ type: "user", user: user })
    console.log(answer)
    if (answer) {
        socket.emit("message", temp, "approved")
    } else {
        socket.emit("message", temp, "denied")
    }
})

const Canvas = (props) => {
    const canvasRef = useRef(null);
    const mouseDown = useRef(false);
    const [context, setContext] = useState(null);
    const [color, setColor] = useState('#00000');
    const [selectedObject, setSelectedObject] = useState(null)
    const [updatePanel, setUpdatePanel] = useState(false)
    const history = useHistory();

    socket.on("clearCanvas", () => {
        console.log("Received clear canvas, clearing")
        clearCanvas()
    })

    socket.on("kickUser", () => {
        console.log("Going ")
        history.push("/")
    })

    function sendClearCanvas(clearMemoryToo) {
        clearCanvas(clearMemoryToo)
        socket.emit("sendClearCanvas")
    }

    const clearCanvas = useCallback((clearMemoryToo = true) => {
        if (context) {
            // Below is needed
            // console.log("ClearMEMTOO", clearMemoryToo)
            if (clearMemoryToo) {
                clearMemory()
                // socket.emit("clearMemory")
                setSelectedObject(undefined)
            }
            if (canvasRef.current != null) {
                context.clearRect(
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                );
            }

        }
    }, [context])

    function drawEverything() {
        // console.log("re-draw called")
        let map = getMemory()
        // console.log(map)
        clearCanvas(false)
        if (context != null) {
            map.forEach(element => {
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
        window.requestAnimationFrame(drawEverything)
    }
    window.requestAnimationFrame(drawEverything)

    function updatePanelDrawEverything() {
        if (getElementAt(selectedObject.id) === undefined) {
            console.log("selectedObject is not in memory")
            setSelectedObject(undefined)
        }
        setSelectedObject(getElementAt(selectedObject.id))
    }

    useEffect(() => {
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
                setSelectedObject(checkIfMouseOnObject(start))
                // console.log(checkIfMouseOnObject(start))
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
                mouseDown.current = false;
            }
        }


        function handleMouseUp(evt) {
            mouseDown.current = false;
            setSelectedObject(checkIfMouseOnObject(start))
            // socket.emit("message", convertJSONToBuffer({ type: "mouse", coordinates: start }), "checkIfMouseOnObject", (obj) => {
            //     // console.log("selected object", obj)
            //     setSelectedObject(convertBufferToJSON(obj))
            // })
            // drawEverything()
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
                    handleMouse({ coordinates: mouseCoordinates }, "moveObject")
                }
                
                else if (getMouseState().match('eraser')) {
                    handleMouse({ coordinates: mouseCoordinates }, "delete") 
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

    }, [context, color, clearCanvas, updatePanel]);

    return (
        <div id="wrapper">
            <div id="left">
                <canvas
                    id="canvas"
                    ref={canvasRef}
                    width="1500"
                    height="800"
                ></canvas>
                <Buttons sendClearCanvas={sendClearCanvas} setMouseState={setMouseState} room={props.room}></Buttons>
            </div>
            <div id="right">
                <EditPanel selectedObject={selectedObject} updatePanel={updatePanel} updatePanelDrawEverything={updatePanelDrawEverything}></EditPanel>
            </div>
        </div>
    );
};

export default Canvas;
