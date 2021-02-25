const notes = [];

function handleNote(noteData) {
    noteData.id = notes.length();
    const action = noteData.action;
    if (action === 'create') {
      notes.push(noteData);
    }
    else if (action == 'move') {
        // move note
    } else if (action == 'edit') {
      // edit note
    } else if (action == 'delete') {
      // delete note
    } else {
      // ..
    }

  }

  module.exports({handleNote});