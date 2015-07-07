# Droppelganger
Javascrip drag and drop using hammerjs and polymer (coming soon)

Make sure bower is installed before run this at root directory:
``` bower install ```

## Options
Droppelganger accept some options:
```javascript
var options = {};

//allows you to specify multiple independent instance droppelganger.
options.selectors = {
  container: 'your-container-class', //default: droppelganger-container
  item     : 'your-item-class',      //default: droppelganger-item
  handle   : 'your-item-handle-class'//default: droppelganger-item-handle
};

options.style =  {
  'moving': 'custom-style-when-item-moving',
  'container-hovered': 'custom-style-when-container-is-hovered'
};

options.sortable = false; //or true by default

options.panStartCallback = function(event, item) {
  /*
   * event: event object from hammerjs.
   * item : current item dragged by user.
   * item.parentNode to get the container.
   */
  //do something at the end of panstart event
};

options.panMoveCallback = function(event, item, container) {
  /*
   * event: event object from hammerjs.
   * item : current item dragged by user.
   * container: container if item is over a container else false.
   */
  //do something at the end of panmove event
};

options.afterPanEnd = function(event, item, container) {
  /*
   * event    : event object from hammerjs.
   * item     : current item dragged by user.
   * container: container if item is over a container else false.
   */
  //do something at the end of panend event
};

//call Droppelganger constructor
var droppelganger = new Droppelganger(options);
```


## API

 - ```droppelgangerInstance.reset() ``` Use .reset() to rebind hammerjs events. Use case: you want to add containers dynamically.