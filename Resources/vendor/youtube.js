var apikey = Ti.App.Properties.getString('GAPI_' + Ti.App.Properties.getString('deployType'));

exports.getPlaylists = function(args) {
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var result = JSON.parse(this.responseText);
			var items = result.items.map(function(item) {
				return {
					title : item.snippet.title.replace(/eppendorf\s\-\s/gi, ''),
					data : item.id
				};
			});
			args.done && args.done(items);
		},
		onerror : function(e) {
			console.log(this.error);
			console.log(e.error);
		}
	});
	var url = 'https://www.googleapis.com/youtube/v3/playlists?maxResults=50&part=snippet%2CcontentDetails&channelId=UC481ZIMPfX5IAw6gzjOqzcA&key=' + apikey;
	console.log(url);
	xhr.open('GET', url);
	xhr.send();
};

exports.getVideosByplaylistId = function(_id, _done) {
	var id = _id || 'PLVE22aVczVeZfFNAhnL-1yFdTKZqCp9AO';
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			var playlists = JSON.parse(this.responseText);
			var playlist = [];
			playlists.items.map(function(v) {
				if (v.snippet.thumbnails)
				playlist.push({
					image : v.snippet.thumbnails.default.url.replace(/default/, 'hqdefault'),
					title : v.snippet.title.replace(/^[\s]+/g, ''),
					id : v.snippet.resourceId.videoId,
					description : v.snippet.description.split('\n')[0],
				});
			});
			_done(playlist);
		}
	});
	xhr.open('GET', 'https://www.googleapis.com/youtube/v3/playlistItems?&maxResults=50&part=snippet%2CcontentDetails%2Cstatus&playlistId=' + _id + '&key=' + apikey);
	xhr.send();
};

exports.getVideosByIds = function(_ids, _done) {
	var ids = _ids;
	var url = 'https://www.googleapis.com/youtube/v3/videos?&maxResults=50&part=snippet%2CcontentDetails%2Cstatus&id=' + _ids.join(',') + '&key=' + apikey;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			if (this.status == 200) {
				var playlists = JSON.parse(this.responseText);
				_done(playlists.items.map(function(v) {
					return {
						image : v.snippet.thumbnails.default.url.replace(/default/, 'hqdefault'),
						title : v.snippet.title.replace(/^[\s]+/g, ''),
						id : v.id,
						description : v.snippet.description.split('\n')[0],
					};
				}));
			} else
				console.log(this.status);
		}
	});
	xhr.open('GET', url);
	console.log(url);
	xhr.send();
};
exports.searchVideos = function(_done) {
	var url = 'https://www.googleapis.com/youtube/v3/search?&maxResults=50&part=snippet%2CcontentDetails%2Cstatus&id=' + _ids.join(',') + '&key=' + apikey;
	var xhr = Ti.Network.createHTTPClient({
		onload : function() {
			if (this.status == 200) {
				var playlists = JSON.parse(this.responseText);
				_done(playlists.items.map(function(v) {
					return {
						image : v.snippet.thumbnails.default.url.replace(/default/, 'hqdefault'),
						title : v.snippet.title.replace(/^[\s]+/g, ''),
						id : v.id,
						description : v.snippet.description.split('\n')[0],
					};
				}));
			} else
				console.log(this.status);
		}
	});
	xhr.open('GET', url);
	console.log(url);
	xhr.send();
};