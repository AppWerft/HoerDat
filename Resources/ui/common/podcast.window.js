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


module.exports = opts => {
	let start = new Date().getTime();
	const duration = opts.duration, position = Pool.getPosition(opts.url), url = opts.url, cover = opts.cover, mp3file = Pool
			.getCachedFile(url);
	const id3v2tag = ID3.getId3v2Tag(mp3file);
	console.log("Duration for ID3: " + (new Date().getTime()-start));
	var $ = Ti.UI.createWindow({
		fullscreen : false,
		backgroundColor : 'white',
		meta : id3v2tag ? {
			title : id3v2tag.albumartist,
			subtitle : id3v2tag.title
		} : {
			title : opts.author,
			subtitle : opts.title
		}
	});
	$.topView = Ti.UI.createView({
		top : 0,
		width : SCREENWIDTH,
		height : SCREENWIDTH*.88,
		backgroundImage : cover
	});
	$.playcontrolButton = require('ui/common/playbutton.widget')( () => {
		if (audioPlayer.playing) {
			audioPlayer.pause();
			$.playcontrolButton.setPause();
		} else {
			audioPlayer.url = mp3file.nativePath;
			audioPlayer.time = position;
			audioPlayer.start();
			audioPlayer.time = position;
			$.playcontrolButton.setPlay();
		}
	});
	$.topView.add($.playcontrolButton);
	function onProgress(e) {
		$.progressView.width = e.progress / duration * 100 + '%';
		Pool.setPosition(url, e.progress);
	}
	
	audioPlayer.removeEventListener('progress', onProgress);
	audioPlayer.addEventListener('progress', onProgress);
	$.add($.topView);
	setTimeout(() => {
		$.thumbView = Ti.UI.createView({
			right : 0,
			top : SCREENWIDTH - 100,
			width : 100,
			height : 100
		});
		$.topView.add($.thumbView);
		if (id3v2tag)
			$.thumbView.add(ID3.createAlbumImage({
				image : mp3file,
			}));
	},200);
	$.progressView = Ti.UI.createView({
		top : SCREENWIDTH - 100,
		left : 0,
		width : 1,
		right : 100,
		backgroundColor : '#88ffffff'
	});

	$.topView.add($.progressView);

	$.container = Ti.UI.createScrollView({
		scrollType : 'vertical',
		layout : 'vertical',
		top : SCREENWIDTH

	});
	$.container.add(Ti.UI.createLabel({
		text : id3v2tag ? id3v2tag.title : opts.title,
		left : 10,
		right : 10,
		top : 5,
		color : '#225588',
		width : Ti.UI.FILL,
		height : Ti.UI.SIZE,
		font : {
			fontSize : 24,
			fontWeight : 'bold',
			fontFamily : 'Rambla-Bold'
		}

	}));

	$.container.add(Ti.UI.createLabel({
		text : id3v2tag ? id3v2tag.comment.replace(/\/\/[\s]*/mg, '\n\n')
				.replace(/\/\s/mg, '\n∙') : opts.description,
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

	$.add($.container);
	$.addEventListener('open', require('ui/common/podcast.menu'));
	$.addEventListener('close', function() {
		audioPlayer.stop();
		audioPlayer.release();
		audioPlayer.removeEventListener('progress', onProgress);
		$.remove(visualizerView);
	});
	$.add(visualizerView);
	audioPlayer.addEventListener('complete', function() {
		Pool.setPosition(url, 0);
		$ && $.close();
	});
	console.log("Duration for building player: " + (new Date().getTime()-start));
	return $;
};
