import React from 'react'
import { changeObjectPosition, changeObjectValues, deleteObj } from '../../messages/generic';
class NotePanel extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        if (this.props.object === null || this.props.object === undefined) {
            return <div></div>
        }

        if (!this.props.object.hasOwnProperty("fontColor")) {
            this.props.object.fontColor = "#000000"
        }

        return (
            <div>
                <h3>Author</h3>
                <p>{this.props.object.author}</p>
                <h3>Text</h3>
                <textarea
                    id="textTextArea"
                    type="text"
                    value={this.props.object.text}
                    onChange={(event) => {
                        changeObjectValues(this.props.object, "text", event.target.value)
                        this.props.updatePanelDrawEverything()
                        // console.log(getElementAt(this.props.object.id))
                    }}
                />
                <h3>Font size</h3>
                <input
                    type="number"
                    value={this.props.object.fontSize}
                    onChange={(event) => {
                        changeObjectValues(this.props.object, "fontSize", parseInt(event.target.value))
                        this.props.updatePanelDrawEverything()
                        // console.log(getElementAt(this.props.object.id))
                    }}
                />
                <h3>Font colour</h3>
                <input
                    type="color"
                    value={this.props.object.fontColor}
                    onChange={(event) => {
                        changeObjectValues(this.props.object, "fontColor", event.target.value)
                        this.props.updatePanelDrawEverything()
                        // console.log(getElementAt(this.props.object.id))
                    }}
                />
                <h3>Position</h3>
                <p>X</p>
                <input
                    type="number"
                    value={this.props.object.coordinates.x}
                    onChange={(event) => {
                        changeObjectPosition(this.props.object, "x", parseInt(event.target.value))
                        this.props.updatePanelDrawEverything()
                        // console.log(getElementAt(this.props.object.id))
                    }}
                />
                <p>Y</p>
                <input
                    type="number"
                    value={this.props.object.coordinates.y}
                    onChange={(event) => {
                        changeObjectPosition(this.props.object, "y", parseInt(event.target.value))
                        this.props.updatePanelDrawEverything()
                        // console.log(getElementAt(this.props.object.id))
                    }}
                />
                <button
                    onClick={() => {
                        deleteObj(this.props.object)
                        this.props.updatePanelDrawEverything()
                    }}
                >
                    Delete
                </button>
            </div>
        )
    }
}

export default NotePanel;