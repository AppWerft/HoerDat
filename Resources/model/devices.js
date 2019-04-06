exports.get = function(AS) {
	var $ = {};
	$[AS.TYPE_BUILTIN_SPEAKER] = {
		label : 'Gerätelautsprecher ⇊',
		icon : '/images/loudspeaker.png'
	};	
	/*$[AS.TYPE_BUILTIN_EARPIECE] = {
			label : 'Geräteohrhörer ⇈',
			icon : '/images/earpieces.png'
		};*/
	$[AS.TYPE_WIRED_HEADSET] = {
		label : 'Schnursprechgarnitur',
		icon : '/images/headphones.png'
	};
	$[AS.TYPE_WIRED_HEADPHONES] = {
		label : 'Schnurkopfhörer',
		icon : '/images/headphones.png'
	};
	$[AS.TYPE_BLUETOOTH_A2DP] = {
		label : 'Bluetooth',
		icon : '/images/bt.png'
	};
	return $;
};