function getText(foo) {
    if ( typeof foo == 'string')
        return foo.replace(/\n/gm, '').trim();

    if (foo.content) {
        return foo.content.replace(/[\s]{3,}/gm, '\n').trim();
    } else
        return foo[0].content.replace(/[\s]{3,}/gm, '\n').trim();
}

module.exports = function(url, onload, onerror) {
    Ti.Yahoo.yql('select * from html where url="' + url + '" and xpath="//table"', function(_res) {
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
                        res.push(item);
                    }
                }
            });
            onload(res);
        } else {
            onerror();
        }

    });
};
