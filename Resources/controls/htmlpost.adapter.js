module.exports = function(args) {
    var self = {};
    var ready = false;
    var count = 0;
    var url = 'http://s507870211.online.de/index.php?col1=ti&a=' + encodeURI(args.payload.a) + '&so=autor&soo=asc';
    [0, 6000, 12000].forEach(function(delay) {
        setTimeout(function() {
            require('controls/getyahoo')(url, function(_res) {
                if (ready == false) {
                    args.onload(_res);
                    clearInterval(self.cron);
                    ready = true;
                }
            }, function() {
                count++;
                if (count == 3) {
                    clearInterval(self.cron);
                    args.onerror();
                }
            });
        }, delay);
    });
    self.tick = 0;
    self.cron = setInterval(function() {
        self.tick++;
        args.onprogress(self.tick / 100);
    }, 200);
    return;

};
