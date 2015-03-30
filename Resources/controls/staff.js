module.exports = function(_foo) {
    if (_foo.table && _foo.table.tbody) {
        var bar = [];
        var items = (_foo.table.tbody.tr instanceof Array) ? _foo.table.tbody.tr : [_foo.table.tbody.tr];
        items.forEach(function(item) {
            if (item.td[1]) {
                bar.push({
                    role : (item.td[0].content) ? item.td[0].content.trim() :'',
                    person : (item.td[1].content) ? item.td[1].content.trim() :'',
                });
            }

        });
        return bar;
    } else
        return null;
};
