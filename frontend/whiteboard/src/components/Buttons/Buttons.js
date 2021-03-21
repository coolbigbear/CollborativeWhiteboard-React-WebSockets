import React, { Component } from 'react';
import { setImage } from '../../messages/image';

import "./Buttons.css"

export default class Buttons extends Component {

    componentDidMount() {
        document.getElementById("mouseButton").className = "pressedButton"
    }

    render() {

        function undoButtonPress() {
            
        }

        function pressButton(buttonID) {
            var buttons = document.getElementById("buttonGroup").childNodes
            buttons.forEach(button => {
                button.className = "unpressedButton"
            });
            document.getElementById(buttonID).className = "pressedButton"
        }

        function saveCanvasAsImage(type) {
            var link = document.getElementById('link');
            var canvas = document.getElementById('canvas');
            link.setAttribute('download', 'Canvas.png');
            link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
            link.click();
        }

        return (
            <div id="buttonGroup">
                <button
                    id="clearButton"
                    onClick={() => {
                        this.props.sendClearCanvas(true)
                        console.log("Clear button clicked")
                    }}
                >
                    Clear
                </button>
                <button
                    id="textButton"
                    onClick={() => {
                        console.log("Text button clicked")
                        this.props.setMouseState('text')
                        pressButton("textButton")
                    }}
                >
                    Text
                </button>
                <button
                    id="drawButton"
                    onClick={() => {
                        console.log("Draw button clicked")
                        this.props.setMouseState('draw')
                        pressButton("drawButton")
                    }}
                >
                    Draw
                </button>
                <button
                    id="noteButton"
                    onClick={() => {
                        console.log("Note button clicked")
                        this.props.setMouseState('note')
                        pressButton("noteButton")
                    }}
                >
                    Note
                </button>
                <input type="file" name="imageButton" size="40" id="imageButton" accept="image/jpeg"
                    onClick={() => {
                        console.log("Image button clicked")
                        this.props.setMouseState('image')
                        pressButton("imageButton")
                    }}
                    onChange={(event) => {
                        setImage(URL.createObjectURL(event.target.files[0]))
                    }}
                >
                </input>
                <button
                    id="mouseButton"
                    onClick={() => {
                        console.log("Mouse button clicked")
                        this.props.setMouseState('mouse')
                        pressButton("mouseButton")
                    }}
                >
                    Mouse
                </button>
                <button
                    id="eraserButton"
                    onClick={() => {
                        console.log("Eraser button clicked")
                        this.props.setMouseState('eraser')
                        pressButton("eraserButton")
                    }}
                >
                    Eraser
                </button>
                <button
                    id="undoButton"
                    onClick={() => {
                        console.log("Undo button clicked")
                        this.props.setMouseState('mouse')
                        pressButton("mouseButton")
                        undoButtonPress()
                    }}
                >
                    Undo
                </button>
                <button
                    id="saveAsImageButton"
                    onClick={() => {
                        console.log("Save canvas as image button clicked")
                        this.props.setMouseState('mouse')
                        pressButton("mouseButton")
                        saveCanvasAsImage()
                    }}
                >
                    Save canvas as image
                </button>
                <a id="link"></a>
            </div>
        )
    }
}