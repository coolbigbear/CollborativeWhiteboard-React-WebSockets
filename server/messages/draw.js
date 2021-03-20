let lines = [];

function handleDraw(drawData, action) {
  if (action === 'create') {
    console.log("creating line")
    drawData.id = lines.length;
    lines.push(drawData);
    // console.log(lines)
  } else if (action == 'edit') {
    for (let index = 0; index < lines.length; index++) {
      const element = lines[index];
      if (element.id == drawData.id) {
        // console.log("before", notes)
        lines[index] = drawData;
        // console.log("after", notes)
        break;
      }
    }
  } else if (action == 'delete') {
    console.log("Deleted line")
    for (let index = 0; index < lines.length; index++) {
      const element = lines[index];
      if (element.id == drawData.id) {
        lines[index] = null;
        break;
      }
    }
    lines = lines.filter(n => n) // Remove null values from array
    console.log(lines)
  } else {
    console.log("--- Warning ---")
    console.log("Received unknown action")
  }
}

function clearLines() {
  lines.length = 0
}

function getLines() {
  return lines;
}

module.exports = ({ handleDraw, getLines, clearLines });