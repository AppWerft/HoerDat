//const AudioSelector = require("de.appwerft.audioselector");
const A2DP = require("de.appwerft.a2dp");

module.exports = function() {
	function handleBT() {
		if (A2DP.init()) {
			A2DP.startScanPairedDevices({
				repeat : true,
				onchanged : function(res) {
					console.log(res)
				}
			});
			A2DP.startScanNearbyDevices({
				onchanged : function(res) {
					console.log(res)
				}
			});

		}
	}
	switch (A2DP.Bluetooth.getAvailibility()) {
	case A2DP.Bluetooth.BT_NOTAVAILABLE:
		break;
	case A2DP.Bluetooth.BT_DISABLED:
		A2DP.Bluetooth.enableBluetooth({
			onsuccess : handleBT,
			onerror : function() {
			}
		});
		break;
	case A2DP.Bluetooth.BT_ENABLED:
		handleBT()
		break;

	}
	function getRow(device) {
		const $ = Ti.UI.createTableViewRow({
			height : 45,
			borderRadius : 10,
			backgroundColor : "#225588"
		});
		$.add(Ti.UI.createLabel({
			text : device.label,
			left : 100,
			textAlign : 'left',
			width : Ti.UI.FILL,
			color : 'white',
			font : {
				fontFamily : 'Rambla-Bold',
				fontSize : 22
			}
		}));
		return $;
	}
	function getRows() {
		return 

		[ {
			label : 'Lautsprecher'
		}, {
			label : 'Kopfhörer (3.5"-Buchse)'
		}, {
			label : 'Bluetooth'
		} ].map(getRow);

	}
	const $ = Ti.UI.createOptionDialog({
		androidView : Ti.UI.createTableView({
			data : getRows(),
		}),
		selectedIndex : 0,
		destructive : 0,
		title : 'Auswahl der akustischen Abspieleinrichtung	'
	});
	$.show();
};