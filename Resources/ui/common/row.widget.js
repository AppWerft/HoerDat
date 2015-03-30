var Moment = require('vendor/moment');
Moment.locale('de');

module.exports = function(item) {
    var row = Ti.UI.createTableViewRow({
        height : Ti.UI.SIZE,
        hasDetail : true,
        itemId : item
    });
    row.add(Ti.UI.createImageView({
        image : item.logo,
        defaultImage : '/images/defaultimage.png',
        top : 5,
        left : 5,
        width : 60,
        height : 60
    }));
    var container = Ti.UI.createView({
        left : 80,
        top : 10,
        layout : 'vertical'
    });
    row.add(container);
    if (!item.subtitle)
        container.add(Ti.UI.createLabel({
            text : item.title.trim(),
            left : 0,
            top : 0,
          
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
            text : item.title.trim(),
            left : 0,
            top : 8,
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
            left : 0,
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
    item.time && container.add(Ti.UI.createLabel({
        text : Moment(item.time).format('dddd  HH:mm') + ' Uhr',
        left : 0,
        top : 0,
        right : 10,
        height : Ti.UI.SIZE,
        color : '#427aa7',
        font : {
            fontSize : 16,
            fontFamily : 'Rambla-Bold',
            fontWeight : 'bold'

        }
    }));
    item.produktion && container.add(Ti.UI.createLabel({
        text :  item.produktion,
        left : 0,
        top : 0,
        right : 10,
        height : Ti.UI.SIZE,
        color : '#444',
        font : {
            fontSize : 14,
            fontFamily : 'DroidSans',
            

        }
    }));
    return row;
};
