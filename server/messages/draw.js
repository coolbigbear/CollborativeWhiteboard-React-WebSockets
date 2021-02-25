    const drawings = [];
    
    function draw(drawData) {
        drawData.id = drawings.length();
        const action = drawData.action;
        if (action === 'create') {
          drawings.push(drawData);
        } else if (action == 'delete') {
          delete drawings[drawData.id];
        } else {
          // ..
        }
      }

      module.exports({draw});