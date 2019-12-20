function shorten(str, maxLen, separator = ' ') {
  if (str.length <= maxLen) return str;
  var res = str.substr(0, str.lastIndexOf(separator, maxLen));
  if (res.length < str.length) res += ' …';
  return res;
}

module.exports = function(item) {
    const $ = Ti.UI.createTableViewRow({
        height : Ti.UI.SIZE,
        backgroundColor : 'white',
        itemId : JSON.stringify(item)
    });
    $.add(Ti.UI.createImageView({
        top : 10,
        left : 5,
        width : 60,
        defaultImage : '/images/bfr/bfr.png',
        height : 'auto',
        image : item.image
    }));
    $.add(Ti.UI.createView({
        left : 80,
        right : 10,
        touchEnabled : false,
        layout : 'vertical',
        height : Ti.UI.SIZE,
        bottom : 5
    }));
    $.children[1].add(Ti.UI.createLabel({
        top : 5,
        width : Ti.UI.FILL,
        textAlign : 'left',
        color : '#3F79A9',
        touchEnabled : false,
        font : {
            fontSize : 22,
            fontFamily : 'Rambla',
            fontWeight : 'bold'
        },
        text : item.title
    }));
    $.children[1].add(Ti.UI.createLabel({
        top : 0,
        color : '#333',
        touchEnabled : false,
        textAlign : 'left',
         width : Ti.UI.FILL,
        text : shorten(item.description,360,' '),
        font : {
            fontSize : 16,
            fontFamily : 'Rambla'
        },
    }));
    $.children[1].add(Ti.UI.createLabel({
        top : 5,
        color : '#333',
        text : item.author,
        width : Ti.UI.FILL,

        textAlign : 'left',
        font : {
            fontSize : 14,
            fontFamily : 'Rambla'
        },
    }));
    item.duration && $.add(Ti.UI.createLabel({
        bottom : 5,
        left : 10,
        color : '#225588',
        width : Ti.UI.FILL,
        text : "Dauer:\n" + item.duration,
        textAlign : 'left',
        font : {
            fontSize : 12,
            fontFamily : 'Rambla'
        },
    }));
    return $;
};
