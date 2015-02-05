var Module = function() {
    this._view = Ti.UI.createView({
        bubbleParent : false,
        touchEnabled : false,
    });
    this.segment = 0;
    this.index = 0;
    this.images = [];
    return this;
};

Module.prototype = {
    createView : function(args) {
        var views = [];
        var that = this;
        args.images.forEach(function(image, i) {
            that._view.add(Ti.UI.createImageView({
                image : image,
                touchEnabled : false,
                width : args.width,
                height : args.width,
                transform : Ti.UI.create2DMatrix({
                    rotate : 360 / args.images.length * i,
                    anchorPoint : args.anchorPoint
                })
            }));
        });
        this.images = args.images;
        this.segment = 360 / args.images.length;
        this.anchorpoint = args.anchorPoint;
        return this._view;
    },
    rotateStep : function(direction) {
        this.index = (direction == 'left') ? (this.index - 1) : (this.index + 1);
        var that = this;
        this._view.children.forEach(function(child, i) {
            child.animate({
                duration : Math.random()*100,
                transform : Ti.UI.create2DMatrix({
                    rotate : (that.index + i) * that.segment,
                    anchorPoint : that.anchorpoint
                })
            });
        });
        return (this.images.length - this.index + this.images.length) % this.images.length;
    },
    goToSegment : function(index) {
        this.index = (this.images.length - index + this.images.length) % this.images.length;
        var that = this;
        this._view.children.forEach(function(child, i) {
            child.animate({
                duration :Math.random()*500,
                transform : Ti.UI.create2DMatrix({
                    rotate : (that.index + i) * that.segment+ 360,
                    anchorPoint : that.anchorpoint
                })
            });
        });
    }
};

module.exports = Module;