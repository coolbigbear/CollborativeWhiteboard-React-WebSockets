let images = [];

function handleImage(imageData, action) {
  if (action === 'create') {
    console.log("creating image")
    imageData.id = images.length;
    images.push(imageData);
    // console.log(images)
  } else if (action == 'edit') {
    for (let index = 0; index < images.length; index++) {
      const element = images[index];
      if (element.id == imageData.id) {
        // console.log("before", notes)
        images[index] = imageData;
        // console.log("after", notes)
        break;
      }
    }
  } else if (action == 'delete') {
    console.log("Deleted image")
    for (let index = 0; index < images.length; index++) {
      const element = images[index];
      if (element.id == imageData.id) {
        images[index] = null;
        break;
      }
    }
    images = images.filter(n => n) // Remove null values from array
    // console.log(images)
  } else {
    console.log("--- Warning ---")
    console.log("Received unknown action")
  }
}

function clearImages() {
  images.length = 0
}

function getImages() {
  return images;
}

module.exports = ({ handleImage, getImages, clearImages });