function getText(foo) {
    if ( typeof foo == 'string')
        return foo.replace(/\n/gm, '').trim();

    if (foo.content) {
        return foo.content.replace(/[\s]{3,}/gm, '\n').trim();
    } else
        return foo[0].content.replace(/[\s]{3,}/gm, '\n').trim();
}

module.exports = function(args) {
    var self = {};
    var url = 'http://s507870211.online.de/index.php?col1=ti&a=' + encodeURI(args.payload.a) + '&so=autor&soo=asc';
    Ti.Yahoo.yql('select * from html where url="' + url + '" and xpath="//table"', function(_res) {
        clearInterval(self.cron);
        if (_res.success && _res.data && _res.data.table && _res.data.table.length > 2) {
            var tables = _res.data.table;
            var res = [];
            tables.forEach(function(table) {
                if (table.class != 'form') {
                    var item = {};
                    table.tr.forEach(function(tr) {
                        if (tr.th) {
                            item.title = tr.th.h1;
                            item.subtitle = tr.th.h2;
                        }
                        if (tr.td && tr.td.class != 'navi') {
                            for (var i = 0; i < tr.td.length; i++) {
                                if (tr.td[i].class == 'right') {
                                    switch (tr.td[i].p) {
                                    case 'Autor(en):':
                                        item.autor = getText(tr.td[i + 1].p);
                                        break;
                                    case 'Inhaltsangabe:':
                                        item.inhalt = getText(tr.td[i + 1].p);
                                        break;
                                    case 'Produktion:':
                                        item.produktion = getText(tr.td[i + 1].p);
                                        if (item.produktion) {
                                            var res = /^(.*?)\s/.exec(item.produktion.replace('/', ' '));
                                            if (res) {
                                                item.logo = '/images/' + res[1].toLowerCase() + '.png';
                                            }//    console.log(getText(tr.td[i + 1].p));
                                        }
                                        break;
                                    case 'Komponist(en):':
                                        item.komponisten = getText(tr.td[i + 1].p);
                                        break;
                                    case 'Regisseur(e):':
                                        console.log(tr.td[i + 1].p);
                                        item.regisseure = getText(tr.td[i + 1].p);
                                        break;
                                    case 'Übersetzer:':
                                        item.uebersetzer = getText(tr.td[i + 1].p);
                                        break;
                                    }

                                }
                            };
                        }
                    });
                    // if (table.tr[2].td) {
                    //  item.meta = table.tr[2].td[1].p.content;
                    //}

                    if (item.title) {
                        console.log(item);
                        res.push(item);
                    }
                }
            });
            args.onload(res);
        } else {
            args.onerror();
        }

    });
    self.tick = 0;
    self.cron = setInterval(function() {
        self.tick++;
        args.onprogress(self.tick / 100);
    }, 100);
    return;
    var self = Ti.Network.createHTTPClient({
        ondatastream : function(_e) {
            //console.log(_e.progress);
        },
        onload : function() {
            clearInterval(self.cron);
            var html = this.responseText.replace(/>\s+</gm, '><');
            /*  var htmlparser = require("vendor/htmlparser");
             var handler = new htmlparser.DefaultHandler(function(error, dom) {
             if (error) {}

             else {
             console.log(dom);
             }

             });
             var parser = new htmlparser.Parser(handler);
             parser.parseComplete(html);
             */
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
        args.onprogress(self.tick / 100);
    }, 100);
};
