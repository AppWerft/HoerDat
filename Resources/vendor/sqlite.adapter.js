/*
 * This module shows how you can cache remote SQLite databases
 * Parameters:
 * url<String> == url of database
 * numberoftables<Number> = aspected count of tables in database (optional)
 * aspecttables<Array>      = aspected table names (optional)
 * Methods:
 * loadDB        == start mirroring
 * isDBvalide    == tests Module on tablecount
 * Events:
 * load      == if database is ready to use and can be opened
 *         payload:
 * 				success : true or false
 * 				dbname  : (String) database name
 * 				mtime   : (optional) the age of database
 * progress  == during mirroring you get progress (0...1)
 * 		   payload:
 * 				ratio : (0..1)
 *
 * error      == if database is dead and cannot mirror
 *
 * Usage:
 *
 * var Db = new (require('sqlite.adapter'))({
 * 				uri'http://MYURL',
 * 				tables : 2,
 * 				tablenames : ['main','labels']
 * 			});
 * Db.mirror();
 * Db.addEventListener('load',function(_e) {
 * 		if (_e.success==true) Ti.Database.open(_e.dbname);
 * });
 * Db.addEventListener('progress',function(_e) {
 * 		// do something like progress bar rendering
 * });
 *
 */

function Module(options) {
	this.url = options.url || '';
	this.user = options.user || '';
	this.forcedtransfer = options.forced;
	this.password = options.password || '';
	this.eventhandlers = {};
	this.dbname = options.dbname || Ti.Utils.md5HexDigest(this.url);
	if (Ti.Android) {
		this.dbfilename = 'file:///data/data/' + Ti.App.getID() + '/databases/' + this.dbname;
		console.log(this.dbfilename);
	} else {
		var testdb = Ti.Database.open('MAGICSTRING');
		this.dbfilename = testdb.file.nativePath.replace('MAGICSTRING', this.dbname);
		//this.dbname.file.setRemoteBackup(false);
		testdb.close();
		if (testdb.file.exists())
			testdb.file.deleteFile();

	}
	return this;
};

Module.prototype = {
	// private functions
	onofflineFunc : function() {
		var that = this;
		setTimeout(function() {
			console.log('Info: no net or timeout ==> try to open cached db');
			if (that.isDBvalide())
				that.fireEvent('load', {
					success : true,
					cached : true
				});
			else
				that.fireEvent('error', {});
		}, 100);
	},

	/* public functions  */
	getDBname : function() {
		return this.dbname;
	},
	isDBvalide : function() {
		if (!this.dbname)
			return null;
		var testlink = Ti.Database.open(this.dbname);
		var tables = [];
		var res = testlink.execute('SELECT tbl_name AS name FROM sqlite_master WHERE type="table" AND name <> "android_metadata" ORDER BY name');
		while (res.isValidRow()) {
			tables.push(res.fieldByName('name'));
			res.next();
		}
		res.close();
		console.log(tables.join(','));
		if (tables.length == 0) {
			Ti.App.Properties.setString('ETag', '');
			if (Ti.Android) {
				testlink.remove();
			} else {
				var file = Ti.Filesystem.getFile(this.dbfilename);
				file.exists() && file.deleteFile();
			}
		}
		if (Ti.Android && tables.length > 0 || !Ti.Android)
			testlink.close();
		return tables.length;
	},
	loadDB : function() {
		var that = this;
		this.fireEvent('mirrorstart');
		this.fireEvent('status', {
			message : 'Try to connect to server'
		});
		this.starttime = parseInt(new Date().getTime());
		var xhr = Ti.Network.createHTTPClient({
			onerror : function(_e) {
				console.log();
				console.log('Warning: xhr client runs in error node ' + _e.error);
				that.onofflineFunc();
			},
			ondatastream : function(_p) {
				that.fireEvent('progress', {
					progress : _p.progress
				});
			},
			onload : function() {
				var cookie = xhr.getResponseHeader("Set-Cookie");
				var gottime = parseInt(new Date().getTime());
				console.log('+++++++++++++++++++++\nInfo: Serverresponse=' + this.status);
				that.fireEvent('status', {
					status : this.status
				});
				console.log('Info: time to ask/transfer: ' + (gottime - that.starttime));
				Ti.App.Properties.setString('runtime', ((gottime - that.starttime) / 1000).toFixed(3));
				Ti.App.Properties.setString('DB' + this.status, new Date().getTime() / 1000);
				if (this.status == '200') {
					if (xhr.getResponseHeader('ETag'))
						Ti.App.Properties.setString('ETag', xhr.getResponseHeader('ETag'));
					if (this.responseText.substr(0, 13) == 'SQLite format') {
						Ti.App.Properties.setString('dbsize', this.responseText.length);
						var res = Ti.Filesystem.getFile(that.dbfilename).write(this.responseData);
						var savedtime = parseInt(new Date().getTime());
						console.log('Info: time to save: ' + (savedtime - gottime));
						console.log('Info: speed: ' + (this.responseText.length / (gottime - that.starttime) / 10 + ' kB/s'));
						if (!Ti.Android) {
							var db = Ti.Database.open(that.dbname);
							db.file.setRemoteBackup(false);
							db.close();
						}

					}
				} 
				// 200 or 304:
				if (that.isDBvalide()) {
					console.log('Info: DB valide, we can fireEvent "load"');
					that.fireEvent('load', {
						success : true
					});
				} else {
					console.log('Warning: DB is invalide');
					that.fireEvent('error', {});
				}
			},
			username : that.user,
			password : that.password
		});
		xhr.open('GET', this.url, true);
		console.log('Info: obtaining DB-URL=' + this.url);
		if (!this.forcedtransfer)
			xhr.setRequestHeader('If-None-Match', Ti.App.Properties.getString('ETag', ''));
		xhr.send();
	}, // standard methods for event/observer pattern
	fireEvent : function(_event, _payload) {
		if (this.eventhandlers[_event]) {
			for (var i = 0; i < this.eventhandlers[_event].length; i++) {
				this.eventhandlers[_event][i].call(this, _payload);
			}
		}
	},
	addEventListener : function(_event, _callback) {
		if (!this.eventhandlers[_event])
			this.eventhandlers[_event] = [];
		this.eventhandlers[_event].push(_callback);
	},
	removeEventListener : function(_event, _callback) {
		if (!this.eventhandlers[_event])
			return;
		var newArray = this.eventhandlers[_event].filter(function(element) {
			return element != _callback;
		});
		this.eventhandlers[_event] = newArray;
	}
};
module.exports = Module;
