module.exports = function() {
    var ui = Ti.UI.createWindow({
        backgroundColor : '#444',
        layout : 'vertical',
        fullscreen : true,
        title : 'Die Macher hinter HörDat'
        //theme : 'Theme.NoActionBar'
    });
    ui.container = Ti.UI.createScrollView({
        scrollType : 'vertical',
        layout : 'vertical'
    });
    ui.add(ui.container);
    ui.container.add(Ti.UI.createImageView({
        top : 10,
        image : '/images/1.jpg',
        width : Ti.UI.FILL,

    }));
    ui.container.add(Ti.UI.createImageView({
        top : 10,
        image : '/images/2.jpg',
        width : Ti.UI.FILL,

    }));
    ui.container.add(Ti.UI.createImageView({
        top : 10,
        image : '/images/3.jpg',
        width : Ti.UI.FILL,

    }));
    ui.container.add(Ti.UI.createImageView({
        image : '/images/4.jpg',
        width : Ti.UI.FILL,

    }));
    return ui;
};
