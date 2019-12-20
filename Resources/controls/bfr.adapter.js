const Soup = require("de.appwerft.soup"),
    EP = 'https://www.freie-radios.net/portal',
    MP3 = 'https://www.freie-radios.net/mp3',

    Podcast = require("de.appwerft.podcast"),
    Moment = require('vendor/moment');

var radioData = null;

const getStation = _shortname => {
    const shortname = _shortname.toLowerCase().replace(/\W/g, '');
    if (radioData != null) {
        const names = radioData.map( radio => radio.name);
        var found = names.filter( longname => {
            const ndx =  longname.toLowerCase().replace(/\W/g, '').indexOf(shortname);
         //   console.log(ndx +'    '+shortname + '   ' + longname.toLowerCase().replace(/\W/g, ''));
            return ndx == -1 ? false : true;
        });
        if (found && Array.isArray(found)&& found.length) {
            return found[0].toLowerCase().replace(/\W/g, '');
        } else 
            return 'bfr';
    } else
        return 'bfr';

};

const getXML = (url,forced,onLoad)  => {
    const KEY = Ti.Utils.md5HexDigest(url);
    if (Ti.App.Properties.hasProperty(KEY)) {
        onLoad(JSON.parse(Ti.App.Properties.getString(KEY)));
    }
    Podcast.loadPodcast({
    url :  url,
    timeout : 10000,
    userAgent : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:46.0) Gecko/20100101 Firefox/46.0"
    }, _e => {
        const channel = _e.channel;
        if (!channel || !channel.item) {
            return;
        }
        const result = channel.item.map( item => {
            const enclosure = item.enclosure;
            const radiocode = item['frn:radio'].replace(/\W/g, '').toLowerCase();
            return {
                title : item['frn:title'],
                art : item['frn:art'],
                author : item.author,
                radio : item['frn:radio'],
                radiocode : radiocode,
                pubdate : item.pubDate,
                image : '/images/bfr/' + radiocode + '.png',
                length : enclosure && enclosure.length,
                url : enclosure && enclosure.url,
                description : item.description,
                duration : item['frn:laenge']
            };
        });
        Ti.App.Properties.setString(KEY, JSON.stringify(result));
        onLoad(result);
    });
};

exports.getFilteredList = (id,onLoad) => {
    getXML(EP + '/podcast.php?radio=' + id + '&rss', false, onLoad);
}

exports.getSearchList = (needle,onLoad) => {
    const URL = EP + '/suche.php?such=true&ul=100&query=' + encodeURI(needle)+ '&_='+(new Date().getTime());
    console.log(URL);
    var Doc = Soup.createDocument({
    url : URL,
    timeout : 20000,
    onerror : () => {},
    onload : () => {
        if (!!Doc) {
            var result = [];
            const hits = Doc.select('.dlb_bl_outer');
            if (!!hits) {
                hits.map(div => {
                    const table = div.getNextElementSibling();
                    const description = table.select('.blist_mitte')[0].getText();
                    const sendername = table.select('.blist_links > i')[0].getText();
                    const parts = table.select('.blist_rechts')[0].getHtml().match(/(.*?)<br>\s(.*?)&/im);
                   
                    var radiocode = getStation(sendername) || 'bfr';
                    var title = div.select('.dlb_bl_text > a')[0];
                    var item = {
                        radiocode : radiocode,
                        art : 'Suchergebnis ' + needle,
                        pubdate : parts[1],
                        duration: parts[2],
                        image : '/images/bfr/' + radiocode + '.png',
                        title : title.getText(),
                        url : MP3 + title.getAttribute('href') + '.mp3',
                        description : description
                    };

                    result.push(item);
                });
                onLoad(result);
            } else
                console.log("no dlb_bl_outer");
        }
    }

});

}

exports.getLatest = (forced,onLoad) => {
    getXML(EP + '/podcast.php?rss', forced, onLoad);
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
    url : EP + '/podcast.php',
    onload :  () => {
        if (!!Doc) {
            const radios = Doc.select('select[name="radio"] > option');
            if (!!radios) {
                radioData= radios.map(radio => {
                    stations = {
                        id : radio.getAttribute('value'),
                        name : radio.getText(),
                        icon : '/images/bfr/' + radio.getText().replace(/\W/g, '').toLowerCase() + '.png'
                    };
                    return stations;
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
