import React, { Component } from 'react';

import "./Buttons.css"

export default class Buttons extends Component {
    
    componentDidMount() {
        document.getElementById("mouseButton").className = "pressedButton"
    }

    render() {

        function pressButton(buttonID) {
            var buttons = document.getElementById("buttonGroup").childNodes
            buttons.forEach(button => {
                button.className = "unpressedButton"
            });
            document.getElementById(buttonID).className = "pressedButton"
        }
        
        return (
            <div id="buttonGroup">
                <button
                    id="clearButton"
                    onClick={() => this.props.clearCanvas()}
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
                <button
                    id="imageButton"
                    onClick={() => {
                        console.log("Image button clicked")
                        this.props.setMouseState('image')
                        pressButton("imageButton")
                    }}
                    >
                    Upload Image
                </button>
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
                    }}
                >
                    Undo
                </button>
            </div>
        )
    }
}