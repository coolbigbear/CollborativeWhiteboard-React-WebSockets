const texts = []

function handleText(textData) {
    textData.id = texts.length();
    const action = textData.action;
    if (action === 'create') {
      texts.push(textData);
    }
    else if (action == 'move') {
      // move text
    } else if (action == 'edit') {
      // edit text
    } else if (action == 'delete') {
      // delete text
    } else {
      // ..
    }
  }

  module.exports({handleText});