let texts = [];

function handleText(textData, action) {
  if (action === 'create') {
    console.log("creating text")
    textData.id = texts.length;
    texts.push(textData);
  } else if (action == 'edit') {
    for (let index = 0; index < texts.length; index++) {
      const element = texts[index];
      if (element.id == textData.id) {
        texts[index] = textData;
        break;
      }
    }
  } else if (action == 'delete') {
    console.log("Deleted text")
    for (let index = 0; index < texts.length; index++) {
      const element = texts[index];
      if (element.id == textData.id) {
        texts[index] = null;
        break;
      }
    }
    texts = texts.filter(n => n) // Remove null values from array
    console.log(texts)
  } else {
    console.log("--- Warning ---")
    console.log("Received unknown action")
  }
}

function clearTexts() {
  texts.length = 0
}

function getTexts() {
  return texts;
}

module.exports = ({ handleText, getTexts, clearTexts });