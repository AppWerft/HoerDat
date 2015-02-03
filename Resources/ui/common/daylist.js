module.exports = function(i) {
    var data = [];
    var self = Ti.UI.createView({

        backgroundColor : '#427aa7'
    });
    self.list = Ti.UI.createTableView({
        data : data,
        bottom : 40,
        backgroundColor : 'white'
    });

    self.add(self.list);
    setTimeout(function() {
        require('controls/html.adapter')({
            date : (require('vendor/moment'))().add(i, 'd').format('YYYY-MM-DD'),
            onload : function(list) {
                list.forEach(function(item) {
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
                    row.add(Ti.UI.createImageView({
                        image : item.logo,
                        top : 25,
                        left : 5,
                        width : 60,
                        height : 60
                    }));

                    data.push(row);
                });
                self.list.setData(data);
            }
        });
    }, Math.abs(i) * Math.random() * 1111);

    self.list.addEventListener('click', function(_e) {
        var item = _e.rowData.itemId;
        require('ui/common/sendung.window')(item).open();
    });

    var tag = '';
    switch (i) {
    case -1 :
        tag = 'Gestern';
        break;
    case 0 :
        tag = 'Heute';
        break;
    case 1 :
        tag = 'Morgen';
        break;
    case 2:
        tag = 'Übermorgen';
        break;
    default:
        tag = (require('vendor/moment'))().add(i, 'd').format('YYYY-MM-DD');
    }
    self.add(Ti.UI.createLabel({
        height : 40,
        bottom : 0,
        color : 'white',
        font : {
            fontSize : 20,
            fontFamily : 'Rambla-Bold'

        },
        textAlign : 'center',
        text : tag
    }));
    return self;
};
