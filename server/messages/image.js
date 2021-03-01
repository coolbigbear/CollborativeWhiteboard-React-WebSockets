const images = [];

function handleImage(imageData) {
    const action = imageData.action;
    if (action === 'create') {
      imageData.id = images.length();
      images.push(imageData);
    }
    else if (action == 'move') {
      images[imageData.id].xPos = imageData.xPos;
      images[imageData.id].yPos = imageData.yPos;
    } else if (action == 'delete') {
      images[imageData.id].active = false;
    } else {
      // ..
    }
  }

module.exports = ({handleImage, images});