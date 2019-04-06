//const AudioSelector = require("de.appwerft.audioselector");
const A2DP = require("de.appwerft.a2dp");
const BT = A2DP.Bluetooth;
const Permissions = require('vendor/permissions');
const AS = require("de.appwerft.audioselector");
const DeviceRow = require('ui/common/audiodevice.row');

const DEVICES = require('model/devices').get(AS);

module.exports = function() {
	// console.log(AS.getActivePlaybackConfigurations());
	console.log("///////////////\nRingerMode=" + AS.getRingerMode());

	function handleBT() {
		Permissions.requestPermissions([ 'ACCESS_COARSE_LOCATION' ], function(
				success) {
			if (success) {
				console.log("startScanPairedDevices 💎");
				return;
				A2DP.startMonitorPairedDevices({
					repeat : true,
					onchanged : function(res) {
						console.log(res.devices);
					}
				});
			} else
				console.log("requestPermission COARSE_LOCATION failed 💎");
		});
	}
	// Test if BT available:
	const btavail = BT.getAvailibility();
	switch (btavail) {
	case BT.NOTAVAILABLE:
		console.log("BT_NOTAVAILABLE");
		break;
	case BT.DISABLED:
		console.log("BT_DISABLED");
		BT.enableBluetooth({
			onsuccess : handleBT,
			onerror : function() {
			}
		});
		break;
	case BT.ENABLED:
		console.log("ENABLED");
		handleBT();
		break;
	default:
		console.log("BT: " + btavail + ' ' + BT.ENABLED);
	}

	// / Rendering:
	function getAndroidView() {
		function onClick(e) {
			$.removeEventListener("click", onClick);
			AS.setTypeOn(parseInt(e.source.itemId));
		}
		const $ = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : 160,
			layout : 'vertical'
		});
		function renderList() {
			$.removeAllChildren();
			AS.getDevices().forEach(function(device) {
				if (DEVICES[device.type]) {
					$.add(DeviceRow.create(DEVICES[device.type], device.type,device.active));
				} 
			});
		}
		renderList();
		AS.addEventListener("audiochanged", renderList);
		$.addEventListener("click", onClick);
		return $;
	}
	const $ = Ti.UI.createOptionDialog({
		androidView : getAndroidView(),
		backgroundColor : 'transparent',

	// title : 'Auswahl des Audioabspielers'
	});
	
	$.show();
};