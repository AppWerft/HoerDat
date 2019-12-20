const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
const Moment = require('vendor/moment');

var $ = function(duration) {
    this.durationmilli = (parseFloat(duration.split(':')[0])*60+parseFloat(duration.split(':')[1]))*1000;
    this.view = Ti.UI.createView({
        height : 20,
        top : 0,//SCREENWIDTH,
        backgroundColor : 'black'
    });

    this.view.add(Ti.UI.createView({
        left : 70,
        right : 70
    }));
    this.view.children[0].add(Ti.UI.createView({
        height : 2,
        left : 5,
        right : 5,
        backgroundColor : 'red'
    }));
    this.Handler = Ti.UI.createView({
        width : 8,
        height : 8,
        borderRadius : 4,
        backgroundColor : 'red',
        center : {
            x : '0%',
            y : '50%'
        }
    });
    this.view.children[0].add(this.Handler);
    this.leftLabel = Ti.UI.createLabel({
        text : '0:00',
        left : 5,
        color : 'white'
    });
    this.rightLabel = Ti.UI.createLabel({
        text : duration,
        right : 5,
        color : 'white'
    });
    this.view.add(this.leftLabel);
    this.view.add(this.rightLabel);
    return this;
};

$.prototype.setProgress = function(p) {
    var x= (100.0*parseFloat(p)/this.durationmilli) + '%';
    this.Handler.left=x;
    var format = (this.durationmilli<60*60*1000) ? "mm:ss": "HH:mm:ss";
    this.leftLabel.text = Moment(p).utc().format(format);
    
};

exports.create = function(a) {
    return new $(a);
}
