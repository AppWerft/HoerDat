const Soup = require("de.appwerft.soup"),
    EP = 'https://www.freie-radios.net',
    LATEST_URL = EP + '/portal/podcast.php?rss',
    Podcast = require("de.appwerft.podcast"),
    Moment = require('vendor/moment');

exports.getFilteredList = (id,onLoad) => {
    Podcast.loadPodcast({
    url : EP+ '/portal/podcast.php?radio='+id+'&rss',
    timeout : 10000,
    userAgent : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:46.0) Gecko/20100101 Firefox/46.0"
    }, _e => {
        const channel = _e.channel;
        if (!channel || !channel.item) {
            console.log("server not responding " + LATEST_URL);
            return;
        }
        onLoad(channel.item);
    });

}

exports.getSearchList = (needle,onLoad) => {
    console.log(needle);

}

exports.getLatest = (forced,onLoad) => {
    if (Ti.App.Properties.hasProperty("FRN")) {
        onLoad(JSON.parse(Ti.App.Properties.getString("FRN")));
    }
    Podcast.loadPodcast({
    url : LATEST_URL,
    timeout : 10000,
    userAgent : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:46.0) Gecko/20100101 Firefox/46.0"
    }, _e => {
        const channel = _e.channel;
        if (!channel || !channel.item) {
            console.log("server not responding " + LATEST_URL);
            return;
        }
        Ti.App.Properties.setString("FRN", JSON.stringify(channel.item));
        onLoad(channel.item);
    });
};

exports.getAllRadios = onLoad => {
    if (Ti.Network.online == false) {
        if (Ti.App.Properties.hasProperty("ALLRADIOS")) {
            onLoad(JSON.parse(Ti.App.Properties.getString("ALLRADIOS")))
        }
        return;
    };
    var sendungen = [];

    var Doc = Soup.createDocument({
    url : EP + '/portal/podcast.php',
    onload :  () => {
        if (!!Doc) {
            const radios = Doc.select('select[name="radio"] > option');
            if (!!radios) {
                const radioData= radios.map(radio => {
                    return {
                        id : radio.getAttribute('value'),
                        name : radio.getText(),
                        icon : '/images/bfr/' + radio.getText().replace(/\W/g, '').toLowerCase() + '.png'
                    };
                });
                const allradios = radioData.filter( r => r.name == "" ? false : true);
                Ti.App.Properties.setString("ALLRADIOS", JSON.stringify(allradios));
                onLoad(allradios);
            } else
                console.log("no radiolist!!");
        }
    }
});
return;
};
