import React from 'react'
import { changeImagePosition, changeImageValues, deleteImage } from '../../messages/image';
import { changeNoteValues, changeNotePosition, deleteNote } from '../../messages/note'
import { getElementAt, removeElementAt } from '../Canvas/Memory'
import socket from '../socket';



class NotePanel extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        if (this.props.object === null || this.props.object === undefined) {
            return <div></div>
        }

        return (
            <div>
                <h3>Width</h3>
                <input
                    type="number"
                    value={this.props.object.width}
                    onChange={(event) => {
                        changeImageValues(this.props.object, "width", parseInt(event.target.value))
                        this.props.updatePanelDrawEverything()
                        // console.log(getElementAt(this.props.object.id))
                    }}
                />
                <h3>Height</h3>
                <input
                    type="number"
                    value={this.props.object.height}
                    onChange={(event) => {
                        changeImageValues(this.props.object, "height", parseInt(event.target.value))
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
                        changeImagePosition(this.props.object, "x", parseInt(event.target.value))
                        this.props.updatePanelDrawEverything()
                        // console.log(getElementAt(this.props.object.id))
                    }}
                />
                <p>Y</p>
                <input
                    type="number"
                    value={this.props.object.coordinates.y}
                    onChange={(event) => {
                        changeImagePosition(this.props.object, "y", parseInt(event.target.value))
                        this.props.updatePanelDrawEverything()
                        // console.log(getElementAt(this.props.object.id))
                    }}
                />
                <button
                    onClick={() => {
                        deleteImage(this.props.object)
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