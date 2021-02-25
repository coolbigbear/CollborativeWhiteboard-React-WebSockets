const images = [];

function handleImage(imageData) {
    imageData.id = images.length();
    const action = imageData.action;
    if (action === 'create') {
      images.push(imageData);
    }
    else if (action == 'move') {
      // move image
    } else if (action == 'delete') {
      delete images[imageData.id];
    } else {
      // ..
    }
  }

module.exports({handleImage});