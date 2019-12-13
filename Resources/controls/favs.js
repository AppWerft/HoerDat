const RADIOSTATIONS = require('model/radiostations');
const DB = 'RadioRecentLog';
var link = Ti.Database.open(DB);
link.execute('CREATE TABLE IF NOT EXISTS "fav" ("station" VARCHAR, "total" INTEGER, "enabled" INTEGER, "runtime" INTEGER);');
const p = link.execute("SELECT * FROM 'fav' LIMIT 0,1 ; ");
if (p.fieldCount == 2) {
    link.execute("ALTER TABLE fav ADD COLUMN enabled INTEGER;");
    link.execute("UPDATE fav SET enabled=1");
}
p.close();
link.close();

addField('fav', 'runtime', 'NUMBER');

function invertHex(hexnum) {
    hexnum = hexnum.replace('#', '');
    if (hexnum.length != 6) {
        alert("Hex color must be six hex numbers in length.");
        return false;
    }

    hexnum = hexnum.toUpperCase();
    var splitnum = hexnum.split("");
    var resultnum = "";
    var simplenum = "FEDCBA9876".split("");
    var complexnum = new Array();
    complexnum.A = "5";
    complexnum.B = "4";
    complexnum.C = "3";
    complexnum.D = "2";
    complexnum.E = "1";
    complexnum.F = "0";

    for ( i = 0; i < 6; i++) {
        if (!isNaN(splitnum[i])) {
            resultnum += simplenum[splitnum[i]];
        } else if (complexnum[splitnum[i]]) {
            resultnum += complexnum[splitnum[i]];
        } else {
            alert("Hex colors must only include hex numbers 0-9, and A-F");
            return false;
        }
    }

    return '#' + resultnum;
}

function addField(table, name, type) {
    var link = Ti.Database.open(DB);
    const p = link.execute("SELECT * FROM '" + table + "' LIMIT 0,1 ; ");
    const sql = "ALTER TABLE '" + table + "' ADD COLUMN `" + name + "` " + type + ";";
    var fields = [];
    for (var i = 0; i < p.fieldCount; i++) {
        fields.push(p.getFieldName(i));
    }
    if (fields.indexOf(name) == -1) {
        link.execute(sql);
    }
    p.close();
    link.close();
}

const getByName = function(station) {
    var bar= getAll().filter(function(s) {
        return s.station == station ? true : false;
    });
    return bar ? bar[0] : null;
};

const getAll = function() {
    var radiostations = JSON.parse(JSON.stringify(RADIOSTATIONS));
    radiostations.forEach(function(s) {
        s.total = 0;
    });
    const link = Ti.Database.open(DB);
    link.execute('update fav set total=total*0.99');
    const favs = link.execute('select * from fav');
    /* enrichment with data from DB */
    while (favs.isValidRow()) {
        radiostations.forEach(function(s) {
            if (s.station == favs.fieldByName('station')) {
                s.total = parseInt(favs.fieldByName('total'));
                s.enabled = favs.fieldByName('enabled');
                s.runtime = favs.fieldByName('runtime');
                s.runtimeS = new Date(s.runtime).getUTCDate();
                if (!s.textcolor)
                    s.textcolor = invertHex(s.color);
            }
        });
        favs.next();
    }
    favs.close();
    link.close();
    radiostations.sort(function(a, b) {
        return (b.total - a.total);
    });
    return radiostations;
};

const increment = function(station) {
    //console.log(station);
    if (!station)
        return;
    const link = Ti.Database.open(DB);
    if (link) {
        const found = link.execute('select * from fav  where station="' + station + '"');
        if (found.isValidRow()) {
            link.execute('update fav set total=total+1,runtime=runtime+1 where station="' + station + '"');
            found.close();
        } else {
            link.execute('insert into fav (station,total) values ("' + station + '",1)');
        }
        link.close();
    }
};
const getAllEnabled = function() {
    return getAll().filter(function(s) {
        return s.enabled!=undefined ? true : false;
    });
};

const getTotal = function(id) {
    var total = 0;
    const link = Ti.Database.open(DB);
    if (link) {
        const favs = link.execute((id == undefined) ? 'select SUM(total) as sum from fav' : 'select SUM(total) as sum from fav where station="' + id + '"');
        if (favs.isValidRow()) {
            total = parseFloat(favs.fieldByName('sum'));
        }
        favs.close();
        link.close();
    }
    return total;
};

const disable = function(station) {
    console.log("disable " + station);
    const link = Ti.Database.open(DB);
    link.execute('UPDATE fav SET enabled=0 WHERE station=?', station);
    link.close();

};
const enable = function(station) {
    const link = Ti.Database.open(DB);
    console.log("enable " + station);
    const res = link.execute('SELECT station FROM fav WHERE station=?;', station);
    if (!res.rowCount)
        link.execute('INSERT INTO fav (station,runtime,total) VALUES (?,0,0);', station);
    res.close();
    link.execute('UPDATE fav SET enabled=1 WHERE station=?;', station);
    link.close();
};

exports.getByName = getByName;
exports.getAll = getAll;
exports.getAllEnabled = getAllEnabled;
exports.getTotal = getTotal;
exports.increment = increment;
exports.disable = disable;
exports.enable = enable;
