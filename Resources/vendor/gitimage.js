const PATH = 'https://raw.githubusercontent.com/AppWerft/Lumidium/master/assets/';

module.exports = function(options) {
    if (!options.folder)
        options.folder = 'ZWISCHENSPEICHER';
    if (!options.repo || !options.file || !options.view) {
        return;
    }
    options.url = 'https://raw.githubusercontent.com/' + options.repo + '/master/assets/' + options.file;
    if (Ti.Filesystem.isExternalStoragePresent())
        var basepath = Ti.Filesystem.externalStorageDirectory;
    else
        var basepath = Ti.Filesystem.applicationCacheDirectory;
    var folder = Ti.Filesystem.getFile(basepath, options.folder);
    if (!folder.exists())
        folder.createDirectory();
    var file = Ti.Filesystem.getFile(basepath, options.folder, Ti.Utils.md5HexDigest(options.url).substr(0, 5) + '.png');
    if (file.exists() && options.view) {
        // options.onload && options.onload();
        if (options.view.apiName == 'Ti.UI.ImageView') {
            options.view.setImage(file.read());
        } else {
            options.view.backgroundImage = file.nativePath;
        }
        return;
    }
    /* now we get file and will cache */
    var xhr = Ti.Network.createHTTPClient({
        timeout : 60000,
        ondatastream : function(_e) {
            if (options.onprogress && typeof options.onprogress == 'function') {
                options.onprogress(_e.progress);
            }
        },
        onload : function(_e) {
            if (xhr.status == 200) {
                file.write(this.responseData);
                console.log('Info: image cached');
                options.onload && options.onload();
                if (options.view) {
                    if (options.view.apiName == 'Ti.UI.ImageView') {
                        options.view.image = this.responseData;
                    } else {
                        options.view.backgroundImage = file.getNativePath();
                    }
                };
            } else {
                console.log('Warning: image caching unsuccessful ' + _e.status);
            }
        },
        onerror : function(_e) {
            console.log('Warning: image caching unsuccessful' + options.url);
            if (options.view.apiName == 'Ti.UI.ImageView') {
                //options.view.image = '/images/off.png';
            } else {
                //options.view.backgroundImage = '/images/off.png';
            }
        }
    });
    //var basic = 'Basic ' + Ti.Utils.base64encode('Appwerft:shoo6Too');
    //xhr.setRequestHeader('Authorization',basic);
    console.log(options.url);
    //console.log(basic);
    xhr.open('GET', options.url, true);
    xhr.send(null);
};
