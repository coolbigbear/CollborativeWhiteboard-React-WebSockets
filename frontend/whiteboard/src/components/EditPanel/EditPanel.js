import React, { useEffect, useState, useRef, componentDidUpdate } from 'react';
import { getElementAt } from '../Canvas/Memory';

import NotePanel from "./NotePanel"
import TextPanel from "./TextPanel"

class EditPanel extends React.Component {
    
    constructor(props) {
        super(props)
    }

    render() {

        let type;
        let panel;

        if (this.props.selectedObject === undefined || this.props.selectedObject == null) {
            type = ""
        } else {
            type = this.props.selectedObject.type

            switch (type) {
                case "line":
                    panel = <div></div>
                    break;
                case "text":
                    panel = <TextPanel object={this.props.selectedObject} updatePanelDrawEverything={this.props.updatePanelDrawEverything}></TextPanel>
                    break;
                case "note":
                    panel = <NotePanel object={this.props.selectedObject} updatePanelDrawEverything={this.props.updatePanelDrawEverything}></NotePanel>
                    break;
                default:
                    <p>No item selected</p>
            }
        }

        return (
            <div>
                <h1>{type}</h1>
                {panel}
            </div>
        )
    }
}

export default EditPanel;