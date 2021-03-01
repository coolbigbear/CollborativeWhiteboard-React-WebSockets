const notes = [];

function handleNote(noteData) {
    const action = noteData.action;
    if (action === 'create') {
      noteData.id = notes.length();
      notes.push(noteData);
    }
    else if (action == 'move') {
        notes[noteData.id].xPos = noteData.xPos;
        notes[noteData.id].yPos = noteData.yPos;
    } else if (action == 'edit') {
      // edit note
    } else if (action == 'delete') {
        delete notes[noteData.id];
    } else {
      // ..
    }

  }

  module.exports = ({handleNote, notes});