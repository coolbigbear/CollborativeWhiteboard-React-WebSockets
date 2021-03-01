    const drawings = [];
    
    function draw(drawData) {
        const action = drawData.action;
        if (action === 'create') {
          drawData.id = drawings.length();
          drawings.push(drawData);
        } else if (action == 'delete') {
          drawings[drawData.id].active = false;
        } else {
          // ..
        }
      }

      module.exports = ({draw});