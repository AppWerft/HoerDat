const Moment = require('vendor/moment');
Moment.locale('de');
const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth
		/ Ti.Platform.displayCaps.logicalDensityFactor;
const Pool = require("controls/pool");
const ID3 = require("de.appwerft.mp3agic");
const Visualizer = require('ti.audiovisualizerview');
const audioPlayer = Ti.Media.createAudioPlayer({
	allowBackground : true,
	audioFocus : true
});

const visualizerView = Visualizer.createView({
	bottom : 0,
	audioSessionId : audioPlayer.getAudioSessionId(),
	touchEnabled : false,
	bargraphRenderer : {
		barWidth : SCREENWIDTH / 7
				* Ti.Platform.displayCaps.logicalDensityFactor,
		color : '#225588',
		divisions : 7
	}
});

module.exports = function(opts,renderParentSections) {
	var HEIGHT;
	const start = new Date().getTime();
	const duration = opts.duration, position = Pool.getPosition(opts.url), url = opts.url, cover = opts.cover, mp3file = Pool
			.getCachedFile(url);
	console.log('DURATION='+opts.duration + '   POSITION=' + position);
	var $ = Ti.UI.createWindow({
		fullscreen : false,
		backgroundColor : 'white',
		itemId : opts.id,
		meta : {
			title : opts.author,
			subtitle : opts.title
		}
	});
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
	function onPostlayout(e) {
		$.topView.removeEventListener("postlayout", onPostlayout);
		HEIGHT = e.source.size.height;
		console.log("height=" + HEIGHT);
		$.topContainer.height = HEIGHT;
		$.bottomContainer.top = HEIGHT;
		$.thumbView = Ti.UI.createView({
			right : 0,
			bottom : 0,
			width : 100,
			height : 100
		});
		$.topContainer.add($.thumbView);
		$.topView.add($.thumbView);
		

		$.playcontrolButton = require('ui/common/playbutton.widget')(
				function() {
					if (audioPlayer.playing) {
						$.remove(visualizerView);
						audioPlayer.pause();
						$.playcontrolButton.setPause();
					} else {
						Ti.App.fireEvent('stopRadio');
						audioPlayer.url = mp3file.nativePath;
						audioPlayer.time = position;
						audioPlayer.start();
						audioPlayer.time = position;
						$.playcontrolButton.setPlay();
						$.add(visualizerView);
					}
				});
		$.topContainer.add($.playcontrolButton);
		console.log(mp3file);
		if (mp3file && ID3.getId3v2Tag(mp3file)) {
			const albumimage = ID3.createAlbumImage({
				image : mp3file,
			});
			albumimage && $.thumbView.add(albumimage);
		} else console.log("mp3 has no id3v2");
	}

	$.topView.addEventListener("postlayout", onPostlayout);

	function onProgress(e) {
		$.progressView.width = e.progress / duration * 100 + '%';
		Pool.setPosition(url, e.progress);
	}

	audioPlayer.removeEventListener('progress', onProgress);
	audioPlayer.addEventListener('progress', onProgress);
	$.add($.topContainer);

	$.progressView = Ti.UI.createView({
		top : 0,
		left : 0,
		height:5,
		width : (position/duration*100) + '%',
		backgroundColor : '#225588'
	});

	$.topContainer.add($.progressView);

	$.bottomContainer = Ti.UI.createScrollView({
		scrollType : 'vertical',
		layout : 'vertical',
		top : SCREENWIDTH

	});
	$.bottomContainer.add(Ti.UI.createLabel({
		text : opts.title,
		left : 10,
		right : 10,
		top : 10,
		color : '#225588',
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		font : {
			fontSize : 24,
			fontWeight : 'bold',
			fontFamily : 'Rambla-Bold'
		}

	}));
	if (opts.author && opts.author.length) {
		$.bottomContainer.add(Ti.UI.createLabel({
			text : opts.author,
			left : 10,
			right : 10,
			top : 5,
			color : '#444',
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 18,
				fontWeight : 'bold',
				fontFamily : 'Rambla-Bold'
			}

		}));
	}
	$.bottomContainer.add(Ti.UI.createLabel({
		text : opts.description + "\n\n\n	",
		left : 10,
		right : 10,
		font : {
			fontSize : 18,
			fontFamily : 'Rambla'
		},
		top : 5,
		color : 'black',
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE
	}));
	$.add($.bottomContainer);
	$.addEventListener('open', require('ui/common/podcast.menu'));
	$.addEventListener('close', function() {
		audioPlayer.removeEventListener('progress', onProgress);
		$.remove(visualizerView);
		renderParentSections();
		audioPlayer.stop();
		audioPlayer.release();
	});
	
	audioPlayer.addEventListener('complete', function() {
		const dialog = Ti.UI.createAlertDialog({
			cancel : 0,
			buttonNames : [ 'Nein, weiter …', 'Ja, Platz schaffen' ],
			message : 'Was soll jetzt geschehen - lokal löschen oder zurück zum Start?',
			title : 'Geschafft.'
		});
		dialog.addEventListener('click', function(dialogevent) {
			Pool.setPosition(url, 0);
			if (dialogevent.index != dialogevent.source.cancel) {
				console.log("removeDownload " +$.itemId);
				Pool.removeDownload($.itemId);
			}
			$.close();
		});
		dialog.show();
		//Pool.setPosition(url, 0);
		//$ && $.close();
	});
	return $;
};
