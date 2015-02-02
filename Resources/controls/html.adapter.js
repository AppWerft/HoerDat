module.exports = function(args) {
    var self = Ti.Network.createHTTPClient({
        onload : function() {
            var html = this.responseText.replace(/>\s+</gm, '><');
            var regex = /<th colspan='2'>(.*?)<\/th>/gim;
            var list = [];
            while ( res = regex.exec(html)) {
                var h = /<h1>(.*?)<\/h1><h2>(.*?)<\/h2>/gm;
                var title = h.exec(res[1]);
                if (title)
                    list.push({
                        title : title[1].trim(),
                        subtitle : title[2].trim()
                    });
                else {
                    h = /<h1>(.*?)<\/h1>/gm;
                    title = h.exec(res[1]);
                    list.push({
                        title : title[1].trim()
                    });
                }
            }
            args.onload(list);
        }
    });
    self.open('GET', 'http://s507870211.online.de/index.php?aktion=suche&dat=' + args.date);
    self.setRequestHeader('Accept', 'application/json');
    self.send();

};
