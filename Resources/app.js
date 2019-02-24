"use strict";

console.log("====================================================");

var XMLClient = require("de.appwerft.remotexml");
XMLClient.createClient({
	url : "http://www.deutschlandfunk.de/podcast-studiozeit-aus-kultur-und-sozialwissenschaften.1149.de.podcast.xml",
	onload : function(e) {
		console.log(e.data);
		console.log(e.statistics);

	},
	onerror : function(e) {
		alert(e);		

	}
});

var Window = require('ui/handheld/ApplicationWindow');
var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
new ApplicationTabGroup(Window).open();

