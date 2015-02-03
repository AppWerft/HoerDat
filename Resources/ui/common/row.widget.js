module.exports = function(item) {
    var row = Ti.UI.createTableViewRow({
        height : Ti.UI.SIZE,
        hasDetail : true,
        itemId : item
    });
    var container = Ti.UI.createView({
        left : 70,
        top : 20,
        layout : 'vertical'
    });
    row.add(container);
    if (!item.subtitle)
        container.add(Ti.UI.createLabel({
            text : item.title,
            left : 10,
            top : 8,
            bottom : 8,
            right : 10,
            height : Ti.UI.SIZE,
            color : '#444',
            font : {
                fontSize : 24,
                fontFamily : 'Rambla-Bold',
                fontWeight : 'bold'
            }
        }));
    else {
        container.add(Ti.UI.createLabel({
            text : item.title,
            left : 10,
            top : 8,
            bottom : 3,
            right : 10,
            height : Ti.UI.SIZE,
            color : '#444',
            font : {
                fontSize : 14,
                fontFamily : 'Rambla-Bold',
                fontWeight : 'bold'
            }
        }));
        container.add(Ti.UI.createLabel({
            text : item.subtitle,
            left : 10,
            top : 0,
            bottom : 8,
            right : 10,
            height : Ti.UI.SIZE,
            color : '#444',
            font : {
                fontSize : 24,
                fontFamily : 'Rambla-Bold',
                fontWeight : 'bold'
            }
        }));

    }
    if (item.time)
        row.add(Ti.UI.createLabel({
            text : item.time,
            left : 5,
            top : 5,
            bottom : 20,
            right : 10,
            height : Ti.UI.SIZE,
            color : '#427aa7',
            font : {
                fontSize : 12,
                fontFamily : 'DroidSans',

            }
        }));
    else
        row.add(Ti.UI.createLabel({
            text : item.roduktion,
            left : 5,
            top : 5,
            bottom : 20,
            right : 10,
            height : Ti.UI.SIZE,
            color : '#427aa7',
            font : {
                fontSize : 12,
                fontFamily : 'DroidSans',

            }
        }));
    
    row.add(Ti.UI.createImageView({
        image : item.logo,
        defaultImage : '/images/defaultimage.png',
        top : 25,
        left : 5,
        width : 60,
        height : 60
    }));

    return row;
};
