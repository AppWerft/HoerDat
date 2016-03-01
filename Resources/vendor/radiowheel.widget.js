var Module = function() {
    this.eventhandlers = {};
    this._view = Ti.UI.createView({
        bubbleParent : false,
        touchEnabled : false,
        borderWidth:1,
    }), this.segmentlänge = 0, this.index = 0, this.images = [];
    return this;
};

Module.prototype = {
    /* parameters is array of images and the anchorPoint*/
    createView : function(args) {
        var views = [],
            that = this;
        args.images && args.images.forEach(function(image, i) {
            that._view.add(Ti.UI.createImageView({
                image : image,
                touchEnabled : false,
                width : args.width || 200,
                height : args.width || 200,
                transform : Ti.UI.create2DMatrix({
                    rotate : 360 / args.images.length * i,
                    anchorPoint : args.anchorPoint
                })
            }));
        });
        if (args.images) {
            this.images = args.images;
            this.segmentlänge = 360 / args.images.length;
        }
        this.anchorpoint = args.anchorPoint;
        
		
		var blob = this._view.toImage();
		var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'wheel.png');
		file.write(blob);
		console.log(blob); 


        return this._view;
    },
    /* rotate one step to left or right */
    rotateStep : function(direction) {
        this.index = (direction == 'left') ? (this.index - 1) : (this.index + 1);
        var that = this;
        // rotate all children: */
        this._view.children.forEach(function(child, i) {
            child.animate({
                duration : 100 + Math.random() * 70, // alive!
                transform : Ti.UI.create2DMatrix({
                    rotate : (that.index + i) * that.segmentlänge,
                    anchorPoint : that.anchorpoint
                })
            }, function() {

            });
        });
        setTimeout(function() {
            that.fireEvent('ready');
        }, 500);
        var index = (this.images.length - this.index) % this.images.length;
        return (index >= 0) ? index : index + this.images.length;
    },
    /* jump to one segmentlänge*/
    go2Segment : function(index) {
        this.index = (this.images.length - index + this.images.length) % this.images.length;
        var that = this;
        this._view.children.forEach(function(child, i) {
            child.animate({
                duration : 100 + Math.random() * 500,
                transform : Ti.UI.create2DMatrix({
                    rotate : (that.index + i) * that.segmentlänge + 360,
                    anchorPoint : that.anchorpoint
                })
            });
        });
    },

    fireEvent : function(_event, _payload) {
        if (this.eventhandlers[_event]) {
            for (var i = 0; i < this.eventhandlers[_event].length; i++) {
                this.eventhandlers[_event][i].call(this, _payload);
            }
        }
    },
    addEventListener : function(_event, _callback) {
        if (!this.eventhandlers[_event])
            this.eventhandlers[_event] = [];
        this.eventhandlers[_event].push(_callback);
    },
    removeEventListener : function(_event, _callback) {
        if (!this.eventhandlers[_event])
            return;
        var newArray = this.eventhandlers[_event].filter(function(element) {
            return element != _callback;
        });
        this.eventhandlers[_event] = newArray;
    }
};

module.exports = Module;
