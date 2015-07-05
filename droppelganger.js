var Droppelganger = function() {
    if (Hammer == undefined) {
        throw "Droppelganger depend on hammerjs lib. please install it before use it.";
    }
    this.containers = document.getElementsByClassName('droppelganger-container');
    this.items = document.getElementsByClassName('droppelganger-item');
    var self = this;
    Hammer.each(this.items, function(item, index, src){
        var mc = new Hammer(item);
        mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        mc.on('panstart', function(e){
            self.onPanStart(e, item);
        });
        mc.on('panmove', function(e){
            self.onPanMove(e, item);
        });
        mc.on('panend', function(e){
            self.onPanEnd(e, item);
        });
    });
};

(function() {
    this.onPanStart = function(event, item){
        var phantom = item.cloneNode(true);
        phantom.style.opacity = '0.5';
        var children = item.parentNode.children;
        var index = Array.prototype.indexOf.call(children, item);
        item.index = index;
        if (index == children.length) {
            item.parentNode.appendChild(phantom);
        } else {
            item.parentNode.insertBefore(phantom, children[index]);
        }
        var bodyRect = document.body.getBoundingClientRect(),
            elemRect = phantom.getBoundingClientRect(),
            offsetTop   = elemRect.top - bodyRect.top,
            offsetLeft   = elemRect.left - bodyRect.left;
        
        item.orignalPostion = {
            y: event.center.y,
            x: event.center.x,
            top: offsetTop,
            left: offsetLeft
        };
        
        item.classList.add('moving');
        item.style.top = (offsetTop)+'px';
        item.style.left = (offsetLeft)+'px';
        item.style.width = window.getComputedStyle(phantom, '').getPropertyValue('width');
    };
    
    this.onPanMove = function(event, item){
        item.style.left = (event.center.x - item.orignalPostion.x + item.orignalPostion.left) + 'px';
        item.style.top = (event.center.y - item.orignalPostion.y + item.orignalPostion.top) + 'px';
    };
    
    this.onPanEnd = function(event, item){
        var container = this.isInContainer(item);
        if (container) {
            
            if (container.isEqualNode(item.parentNode)) {
                //replace phantom
                item.parentNode.replaceChild(item, item.parentNode.children[item.index]);
            } else {
                //remove phantom
                item.parentNode.removeChild(item.parentNode.children[item.index]);
                //append to container
                container.appendChild(item);
            }
            
        } else {
            item.parentNode.removeChild(item.parentNode.children[item.index]);
        }
        //reset item css position, left, top
        item.classList.remove('moving');
    };
    
    this.isInContainer = function(item) {
        var left = item.offsetLeft,
            top  = item.offsetTop;
        for (var i in this.containers) {
            var cTop   = this.containers[i].offsetTop,
                cLeft  = this.containers[i].offsetLeft,
                height = this.containers[i].offsetHeight,
                width  = this.containers[i].offsetWidth;
            if ((left <= cLeft + width && left >= cLeft) && (top <= cTop + height && top >= cTop)) {
                return this.containers[i];
            }
        }
        return false;
    }
}).call(Droppelganger.prototype);

// exports.Droppelganger = Droppelganger;