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
var droppelganger = new Droppelganger(options);
```
