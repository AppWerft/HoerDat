const Moment = require('vendor/moment');
Moment.locale('de');
const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
const Pool = require("controls/pool");
const ID3 = require("de.appwerft.mp3agic");
var start = new Date().getTime();
function Log(foo) {
	//console.log((new Date().getTime() - start) + ' ' + foo);
	start = new Date().getTime();
}

module.exports = function(opts, renderParentSections) {
	
	function startAudioPlayer() {
		Ti.App.fireEvent('stopRadio');
		$.audioPlayer.url = mp3file.nativePath;
		$.audioPlayer.time = Pool.getPosition(opts.id);
		$.audioPlayer.start();
		$.audioPlayer.itemId = $.itemId;
		$.playcontrolButton && $.playcontrolButton.setPlay();
		$ && $.add($.visualizerView);
	}

	function onProgress(e) {
		const progress = e.progress / duration;
		progressViews.setProgress(progress);
		Pool.setPosition(opts.id, progress * duration);
	}

	var HEIGHT;
	const duration = opts.duration,
	    progress = Pool.getPosition(opts.id),
	    url = opts.url,
	    cover = opts.cover,
	    mp3file = Pool.getCachedFile(url);
	Log("get data from pool");
	var $ = Ti.UI.createWindow({
		fullscreen : false,
		backgroundColor : '#225588',
		itemId : opts.id,
		meta : {
			title : opts.author,
			subtitle : opts.title
		}
	});
	Log("createWindow");
	$.visualizerView = require('ui/common/visualizer.widget')();
	Log("visualizerView created");
	$.audioPlayer = Ti.Media.createAudioPlayer({
		allowBackground : true,
		audioFocus : true
	});
	Log("createAudioPlayer");
	const progressViews = require('ui/common/progressviews.widget').createProgressViews(duration);
	Log("createProgressView");
	setTimeout(function() {
		Log("Start timeout");
		$.topContainer = Ti.UI.createView({
			top : 0,
			height : SCREENWIDTH
		});
		$.add($.topContainer);
		$.topView = Ti.UI.createImageView({
			top : 0,
			width : SCREENWIDTH,
			height : 'auto',
			image : cover
		});
		$.topContainer.add($.topView);
		Log("topContainer added");
		$.topContainer.add(progressViews.getLabelView());
		$.topContainer.add(progressViews.getBarView());
		Log("Progress added");
		function onPostlayout(e) {
			Log("onPostlayout");
			$.topView.removeEventListener("postlayout", onPostlayout);
			HEIGHT = e.source.size.height;
			$.topContainer.height = HEIGHT;
			$.bottomContainer.top = HEIGHT;
			$.thumbView = Ti.UI.createView({
				right : 0,
				bottom : 0,
				width : 100,
				height : 100
			});
			$.topContainer.add($.thumbView);
			Log("thunbView added");
			$.playcontrolButton = require('ui/common/playbutton.widget')(function() {
				if ($.audioPlayer.playing) {
					$.remove($.visualizerView);
					$.audioPlayer.pause();
					$.playcontrolButton.setPause();
				} else {
					startAudioPlayer();
				}
			});
			Log("PlaycontrolButton created");
			$.topContainer.add($.playcontrolButton);
			Log("PlaycontrolButton added");
			progressViews.setProgress(progress / duration);
			startAudioPlayer();
			Log("Player startet");
			setTimeout(function() {
				if (mp3file && ID3.getId3v2Tag(mp3file)) {
					const albumimage = ID3.createAlbumImage({
						image : mp3file,
					});
					albumimage && $.thumbView.add(albumimage);
				} else
					console.log("mp3 has no id3v2");
			}, 500);
		}
		$.topView.addEventListener("postlayout", onPostlayout);
		$.audioPlayer.removeEventListener('progress', onProgress);
		$.audioPlayer.addEventListener('progress', onProgress);
		$.add($.topContainer);
		$.topContainer.addEventListener('singletap', function(e) {
			Ti.Media.vibrate([10]);
			if (e.y < 50) {
				const progress = e.x / SCREENWIDTH;
				progressViews.setProgress(progress);
				$.audioPlayer.time = progress * duration;
				Pool.setPosition($.itemId, progress * duration);
			}
		});
		$.bottomContainer = require('ui/common/hoerspiel.bottomcontainer.widget')(opts);
		$.add($.bottomContainer);
		Log("bottomContainer added");
		$.addEventListener('close', function() {
			Log("Start closing");
			$.visualizerView = null;
			$.audioPlayer.removeEventListener('progress', onProgress);
			$.audioPlayer.removeEventListener('complete', onComplete);
			Log("listener removed");
			$.removeAllChildren();
			Log("removeAllChildren");
			$.audioPlayer.stop();
			$.audioPlayer.release();
			$.audioPlayer = null;
			Log("audio killed");
			renderParentSections();
			Log("parent refreshed");
			$=null;
		});
		const onComplete = function() {
			require('ui/common/audiodialog.widget')($);
		};
		$.audioPlayer.addEventListener('complete', onComplete);
	}, 300);
	$.addEventListener('open', require('ui/common/podcast.menu'));
	return $;
};
