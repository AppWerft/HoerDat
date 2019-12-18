module.exports = function(item) {

    item.radio = item['frn:radio']//
    .toLowerCase().replace(/\W/g,'');
    console.log(item.radio);
    item.image = '/images/bfr/' + item.radio + '.png';
    item.url = item.enclosure.url;
    item.length = item.enclosure.length;
    const $ = Ti.UI.createTableViewRow({
        height : Ti.UI.SIZE,
        backgroundColor : 'white',
        itemId : JSON.stringify(item)
    });
    $.add(Ti.UI.createImageView({
        top : 10,
        left : 5,
        width : 60,
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
        text : item['title']
    }));
    $.children[1].add(Ti.UI.createLabel({
        top : 0,
        color : '#333',
        touchEnabled : false,
        text : item.description,
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
    $.add(Ti.UI.createLabel({
        bottom : 2,
        left : 15,
        color : '#333',
        width : Ti.UI.FILL,
        text : "Dauer:\n" + item['frn:laenge'],
        textAlign : 'left',
        font : {
            fontSize : 14,
            fontFamily : 'Rambla'
        },
    }));
    return $;
};
