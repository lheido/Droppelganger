var Droppelganger = function(options) {
    if (Hammer == undefined) {
        throw "Droppelganger depend on hammerjs lib. please install/load it before use it.";
    }
    this.setOptions(options);
    this.containers = document.getElementsByClassName('droppelganger-container');
    this.items = document.getElementsByClassName('droppelganger-item');
    var self = this;
    Hammer.each(this.items, function(item, index, src){
        var mc;
        var handles = item.getElementsByClassName('droppelganger-item-handle');
        if (handles.length > 0) {
            mc = new Hammer(handles[0]);
            item.style.cursor = 'default';
        } else {
            mc = new Hammer(item);
        }
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
    this.setOptions = function(options) {
        this.customStyle = {
            moving: false,
            containerHovered: false
        };
        if (typeof options != 'undefined' && typeof options.style != 'undefined') {
            for (var id in options.style) {
                switch (id) {
                    case 'moving':
                        this.customStyle.moving = options.style[id];
                        break;
                    case 'container-hovered':
                        this.customStyle.containerHovered = options.style[id];
                        break;
                    default:
                        break;
                }
            }
        }
    };
    
    this.onPanStart = function(event, item){
        this.phantom = item.cloneNode(true);
        this.phantom.style.opacity = '0.5';
        var children = item.parentNode.children;
        var index = Array.prototype.indexOf.call(children, item);
        item.index = index;
        if (index == children.length) {
            item.parentNode.appendChild(this.phantom);
        } else {
            item.parentNode.insertBefore(this.phantom, children[index]);
        }
        var bodyRect = document.body.getBoundingClientRect(),
            elemRect = this.phantom.getBoundingClientRect(),
            offsetTop   = elemRect.top - bodyRect.top,
            offsetLeft   = elemRect.left - bodyRect.left;
        
        item.orignalPostion = {
            y: event.center.y,
            x: event.center.x,
            top: offsetTop,
            left: offsetLeft
        };
        
        this.applyItemStyle(item);
    };
    
    this.onPanMove = function(event, item){
        var newTop  = event.center.y - item.orignalPostion.y + item.orignalPostion.top,
            newLeft = event.center.x - item.orignalPostion.x + item.orignalPostion.left;
        item.style.top  = newTop + 'px';
        item.style.left = newLeft + 'px';
        
        var container = this.isInContainer(item);
        
        if (container) {
            var hovered_i = -1;
            for (var i = 0; i < container.children.length; i++) {
                var child = container.children[i];
                if (!child.isEqualNode(item) && !child.isEqualNode(this.phantom)) {
                    if (newTop > child.offsetTop) {
                        hovered_i = i;
                    }
                }
            }
            if (hovered_i > -1) {
                container.insertBefore(this.phantom, container.children[hovered_i].nextSibling);    
            } else {
                container.insertBefore(this.phantom, container.children[0]);
            }
        } else {
            item.parentNode.insertBefore(this.phantom, item.parentNode.children[item.index]);
        }
        
        //reset container style
        this.resetContainersStyle();
        if (container && !container.isEqualNode(item.parentNode)) {
            this.applyContainerStyle(container);
        }
    };
    
    this.onPanEnd = function(event, item){
        var container = this.isInContainer(item);
        if (container) {
            container.replaceChild(item, this.phantom);
        } else {
            item.parentNode.removeChild(this.phantom);
        }
        //reset style
        this.resetItemStyle(item);
        this.resetContainersStyle();
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
    };
    
    this.resetContainersStyle = function() {
        for (var i = 0; i < this.containers.length; i++) {
            this.containers[i].classList.remove('container-hovered');
            if (this.customStyle.containerHovered) {
                this.containers[i].classList.remove(this.customStyle.containerHovered);
            }
        }
    };
    
    this.applyContainerStyle = function(container){
        container.classList.add('container-hovered');
        if (this.customStyle.containerHovered) {
            container.classList.add(this.customStyle.containerHovered);
        }
    };
    
    this.applyItemStyle = function(item) {
        item.classList.add('moving');
        if (this.customStyle.moving) {
            item.classList.add(this.customStyle.moving);
        }
        item.style.top = (item.orignalPostion.top)+'px';
        item.style.left = (item.orignalPostion.left)+'px';
        item.style.width = window.getComputedStyle(this.phantom, '').getPropertyValue('width');
    };
    
    this.resetItemStyle = function(item) {
        item.classList.remove('moving');
        if (this.customStyle.moving) {
            item.classList.remove(this.customStyle.moving);
        }
    };
}).call(Droppelganger.prototype);

// exports.Droppelganger = Droppelganger;