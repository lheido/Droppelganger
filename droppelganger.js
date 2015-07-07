var Droppelganger = function(options) {
    if (Hammer == undefined) {
        throw "Hammer is undefined";
    }
    this.setOptions(options);
    this.init();
};

(function() {
    this.init = function() {
        this.containers = document.getElementsByClassName(this.selectors.container);
        this.items = document.getElementsByClassName(this.selectors.item);
        var self = this;
        Hammer.each(this.items, function(item, index, src){
            var handles = item.getElementsByClassName(self.selectors.handle);
            var mc = new Hammer((handles.length > 0) ? handles[0]: item);
            if (handles.length > 0) {
                item.style.cursor = 'default';
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
            item.mc = mc;
        });
    };
    this.reset = function() {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].mc.destroy();
        }
        this.init();
    }
    
    this.setOptions = function(options) {
        var opt = (typeof options == 'undefined') ? {} : options;
        this.customStyle = {
            moving: false,
            containerHovered: false
        };
        if (typeof opt.style != 'undefined') {
            for (var id in opt.style) {
                switch (id) {
                    case 'moving':
                        this.customStyle.moving = opt.style[id];
                        break;
                    case 'container-overflown':
                        this.customStyle.containerHovered = opt.style[id];
                        break;
                    default:
                        break;
                }
            }
        }
        
        this.sortable = true;
        if (typeof opt.sortable != 'undefined') {
            this.sortable = opt.sortable;
        }
        
        if (typeof opt.panStartCallback != 'undefined') {
            this.panStartCallback = opt.panStartCallback;
        }
        
        if (typeof opt.panMoveCallback != 'undefined') {
            this.panMoveCallback = opt.panMoveCallback;
        }
        
        if (typeof opt.afterPanEnd != 'undefined') {
            this.afterPanEnd = opt.afterPanEnd;
        }
        
        if (typeof opt.beforePanEnd != 'undefined') {
            this.beforePanEnd = opt.beforePanEnd;
        }
        
        this.selectors = {
            container: 'droppelganger-container',
            item     : 'droppelganger-item',
            handle   : 'droppelganger-item-handle'
        }
        if (typeof opt.selectors != 'undefined') {
            for (var prop in this.selectors) {
                if (typeof opt.selectors[prop] != 'undefined') {
                    this.selectors[prop] = opt.selectors[prop];
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
        
        if (typeof this.panStartCallback != 'undefined') {
            this.panStartCallback(event, item);    
        }
    };
    
    this.onPanMove = function(event, item){
        var newTop  = event.center.y - item.orignalPostion.y + item.orignalPostion.top,
            newLeft = event.center.x - item.orignalPostion.x + item.orignalPostion.left;
        item.style.top  = newTop + 'px';
        item.style.left = newLeft + 'px';
        
        var container = this.isInContainer(item);
        if (this.sortable) {
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
        }
        
        //reset container style
        this.resetContainersStyle();
        if (container && !container.isEqualNode(item.parentNode)) {
            this.applyContainerStyle(container);
        }
        
        if (typeof this.panMoveCallback != 'undefined') {
            this.panMoveCallback(event, item, container);    
        }
    };
    
    this.onPanEnd = function(event, item){
        var container = this.isInContainer(item);
        if (typeof this.beforePanEnd != 'undefined') {
            this.beforePanEnd(event, item, container);
        }
        if (container) {
            if (!this.sortable) {
                container.appendChild(this.phantom);
            }
            container.replaceChild(item, this.phantom);
        } else {
            if (this.phantom != null && this.phantom.contains(item.parentNode)) {
                item.parentNode.removeChild(this.phantom);
            }
        }
        this.phantom = null;
        //reset style
        this.resetItemStyle(item);
        this.resetContainersStyle();
        if (typeof this.afterPanEnd != 'undefined') {
            this.afterPanEnd(event, item, container);    
        }
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
            this.containers[i].classList.remove('container-overflown');
            if (this.customStyle.containerHovered) {
                this.containers[i].classList.remove(this.customStyle.containerHovered);
            }
        }
    };
    
    this.applyContainerStyle = function(container){
        container.classList.add('container-overflown');
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