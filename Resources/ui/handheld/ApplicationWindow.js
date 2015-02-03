module.exports = function(title) {
    var self = Ti.UI.createWindow({
        title : title,
        width:Ti.UI.FILL,
        height:Ti.UI.FILL,
        backgroundColor : 'white'
    });
    return self;
};
