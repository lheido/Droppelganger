# Droppelganger
Javascrip drag and drop using hammerjs and polymer (coming soon)

Make sure bower is installed before run this at root directory:
``` bower install ```

## Options
Droppelganger accept some options:
```javascript
var options = {};

options.style =  {
  'moving': 'custom-style-when-item-moving',
  'container-hovered': 'custom-style-when-container-is-hovered'
};

options.sortable = false; //or true by default

options.panStartCallback = function(event, item, container) {
  //do something at the end of panstart event
};

options.panMoveCallback = function(event, item, container) {
  //do something at the end of panmove event
};

options.panEndCallback = function(event, item, container) {
  //do something at the end of panend event
};

//call Droppelganger constructor
var droppelganger = new Droppelganger(options);
```
