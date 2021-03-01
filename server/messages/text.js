const texts = []

function handleText(textData) {
    const action = textData.action;
    if (action === 'create') {
      textData.id = texts.length();
      texts.push(textData);
    }
    else if (action == 'move') {
      texts[textData.id].xPos = textData.xPos;
      texts[textData.id].yPos = textData.yPos;
    } else if (action == 'edit') {
      // edit text
    } else if (action == 'delete') {
      texts[textData.id].active = false;
    } else {
      // ..
    }
  }

  module.exports = ({handleText});