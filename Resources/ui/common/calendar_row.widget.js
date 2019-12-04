var Moment = require('vendor/moment');
Moment.locale('de');

module.exports = function(item) {
    var row = Ti.UI.createTableViewRow({
        height : Ti.UI.SIZE,
        hasDetail : true,
        itemId : item
    });
    //console.log(item.stationlogo);
    row.add(Ti.UI.createImageView({
        image : item.stationlogo,
        defaultImage : '/images/defaultimage.png',
        top : 5,
        left : 5,
        width : 60,
        height : 60
    }));
    var container = Ti.UI.createView({
        left : 80,
        top : 0,
        bottom:5,
         height : Ti.UI.SIZE,
        layout : 'vertical'
    });
    row.add(container);
    if (!item.subtitle)
        container.add(Ti.UI.createLabel({
            text : item.title,
            left : 0,
            top : 0,
            right : 10,
            height : Ti.UI.SIZE,
            color : '#111',
            font : {
                fontSize : 24,
                fontFamily : 'Rambla-Bold',
                fontWeight : 'bold'
            }
        }));
    else {
        container.add(Ti.UI.createLabel({
            text : item.title,
            left : 0,
            top : 8,
            right : 10,
            height : Ti.UI.SIZE,
            color : '#111',
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
    
    item.start && container.add(Ti.UI.createLabel({
        text : Moment(item.start).format('dddd  HH:mm') + ' Uhr\n'+ item.meta	 ,
        left : 0,
        top : 0,
        right : 10,
        height : Ti.UI.SIZE,
        color : '#427aa7',
        font : {
            fontSize : 20,
            fontFamily : 'Rambla-Bold'
        }
    }));
    item.produktion && container.add(Ti.UI.createLabel({
        text :  item.produktion+ "\n",
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
