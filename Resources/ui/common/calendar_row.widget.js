var Moment = require('vendor/moment');
Moment.locale('de');
const WeckerView = require('ui/common/wecker.widget');

module.exports = function(item) {
    if (item.meta.indexOf('(Ursendung)') > -1) {
        item.ursendung = true;
        item.meta = item.meta.replace('(Ursendung),', '').replace('(Ursendung)', '');
    }
    item.meta = item.meta.replace('\r','').replace('\n','').replace(',','');
    const $ = Ti.UI.createTableViewRow({
        height : Ti.UI.SIZE,
        hasDetail : true,
        itemId : item
    });
    var leftContainer = Ti.UI.createView({
        left : 0,
        top : 0,
        bottom : 5,
        height : Ti.UI.SIZE,
        layout : 'vertical'
    });
    var rightContainer = Ti.UI.createView({
        left : 80,
       
        touchEnabled : false,
        height : Ti.UI.SIZE,
        layout : 'vertical'
    });
    //  console.log(item.stationlogo + ' ' + item.title);
    leftContainer.add(Ti.UI.createImageView({
        image : item.stationlogo,
        defaultImage : '/images/defaultimage.png',
        top : 10,

        touchEnabled : false,
        left : 5,
        width : 60,
        height : 60
    }));
    leftContainer.add(WeckerView(item));

    $.add(leftContainer);
    $.add(rightContainer);
    if (!item.subtitle)
        rightContainer.add(Ti.UI.createLabel({
            text : item.title,
            left : 0,
            top : 5,
            right : 0,
            touchEnabled : false,
            height : Ti.UI.SIZE,
            color : '#3F79A9',
            font : {
                fontSize : 20,
                fontFamily : 'Rambla-Bold',
                fontWeight : 'bold'
            }
        }));
    else {
        rightContainer.add(Ti.UI.createLabel({
            text : item.title,
            left : 0,
            top : 8,
            right : 0,
            touchEnabled : false,
            height : Ti.UI.SIZE,
            color : '#111',
            font : {
                fontSize : 14,
                fontFamily : 'Rambla-Bold',
                fontWeight : 'bold'
            }
        }));
        rightContainer.add(Ti.UI.createLabel({
            text : item.subtitle,
            left : 0,
            top : 0,
            bottom : 8,
            touchEnabled : false,
            right : 10,
            height : Ti.UI.SIZE,
            color : '#333',
            font : {
                fontSize : 16,
                fontFamily : 'Rambla-Bold',
                fontWeight : 'bold'
            }
        }));

    }

    item.start && rightContainer.add(Ti.UI.createLabel({
        text : Moment(item.start).format('dddd  HH:mm') + ' Uhr  | ' + item.meta,
        left : 0,
        top : 0,
        bottom:5,
        right : 10,
        height : Ti.UI.SIZE,
        color : '#333',
        font : {
            fontSize : 16,
            fontFamily : 'Rambla-Bold'
        }
    }));
    /*item.produktion && $.add(Ti.UI.createLabel({
     text : item.produktion,
     left : container.left,
     bottom : 0,
     right : 10,
     height : Ti.UI.SIZE,
     touchEnabled : false,
     color : '#444',
     font : {
     fontSize : 14,
     fontFamily : 'DroidSans',

     }
     }));*/

    if (item.ursendung) {

        $.add(Ti.UI.createView({
            right : 2,
            bottom : 0,
            backgroundImage : '/images/premiere.png',
            width : 25,
            height : 20
        }));
    }
    return $;
};
