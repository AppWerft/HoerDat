module.exports = function(args) {
    var uri_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
    var xhr = Ti.Network.createHTTPClient({
        onload : function() {
            var foo = this.responseText.split('\n');
            var bar = [];
            for (var i = 0; i < foo.length; i++) {
                if (foo[i][0] == '#')
                    continue;
                var uri = foo[i].match(uri_pattern);
                if (uri)
                    bar.push(uri);
            }
            _args.onload(bar[0][0]);
        }
    });
    xhr.open('GET', _args.playlist);
    xhr.send();
    Ti.App.addEventListener('app:exit', xhr.abort);
};

