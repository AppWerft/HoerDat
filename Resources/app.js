"use strict";

console.log("====================================================");

var XMLClient = require("de.appwerft.remotexml");
XMLClient.createClient({
	url : "http://www.deutschlandfunk.de/podcast-studiozeit-aus-kultur-und-sozialwissenschaften.1149.de.podcast.xml",
	onload : function(e) {
		if ( typeof e.data == "String")
			console.log(JSON.parse(e.data));
		else if ( typeof e.data == "Object")
			console.log(e.data);
		else
			console.log(e);

	}
});

var Window = require('ui/handheld/ApplicationWindow');
var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
new ApplicationTabGroup(Window).open();

