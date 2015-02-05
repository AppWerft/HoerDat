var Module = function() {
    this._view = Ti.UI.createView();
    return this;
};

Module.prototype = {
    createView : function(args) {
        this.images = args.images;
        var views = [];
        var that = this;
        args.images.forEach(function(image, i) {
            that._view.add(Ti.UI.createImageView({
                image : image,
                width : 200,
                height : 200,
                transform : Ti.UI.create2DMatrix({
                    rotate : 360 / args.imges.length * i,
                    anchorPoint : args.anchorPoint
                })
            }));
        });
        return this._view;
    },
    rotateRight : function() {
        this._view.animate({
            duration : 70,
            transform : Ti.UI.create2DMatrix({
                rotate : 360 / this.images.length
            })
        });
    },
    rotateLeft : function() {
        this._view.animate({
            duration : 70,
            transform : Ti.UI.create2DMatrix({
                rotate : -360 / this.images.length
            })
        });
    }
};

module.exports = Module;
