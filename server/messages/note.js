let notes = [];

function handleNote(noteData, action) {
	if (action === 'create') {
		console.log("creating note")
		noteData.id = notes.length;
		notes.push(noteData);
		// console.log("Notes after new note", notes)
	// } else if (action == 'move') {
	// 	notes[noteData.id].xPos = noteData.xPos;
	// 	notes[noteData.id].yPos = noteData.yPos;
	} else if (action == 'edit') {
		for (let index = 0; index < notes.length; index++) {
			const element = notes[index];
			if (element.id == noteData.id) {
				// console.log("before", notes)
				notes[index] = noteData;
				// console.log("after", notes)
				break;
			}
		}
	} else if (action == 'delete') {
		console.log("Deleted note")
		for (let index = 0; index < notes.length; index++) {
			const element = notes[index];
			if (element.id == noteData.id) {
				notes[index] = null;
				break;
			}
		}
		notes = notes.filter(n => n) // Remove null values from array
		console.log(notes)
	} else {
		console.log("--- Warning ---")
		console.log("Received unknown action")
	}
}

function clearNotes() {
	notes.length = 0
}

function getNotes() {
	return notes;
}

module.exports = ({ handleNote, getNotes, clearNotes });