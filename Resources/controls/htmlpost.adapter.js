module.exports = function(args) {
    var self = Ti.Network.createHTTPClient({
        ondatastream : function(_e) {
            //console.log(_e.progress);
        },
        onload : function() {
            clearInterval(self.cron);
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
    self.open('POST', 'http://s507870211.online.de/index.php');
    self.setRequestHeader('Accept', 'application/json');
    self.send(args.payload);
    self.tick = 0;
    self.cron = setInterval(function() {
        self.tick++;
        args.onprogress(self.tick/100);
    }, 100);
};
