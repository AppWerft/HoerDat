"use strict";

console.log("====================================================");
var data = Ti.Android.currentActivity.getIntent().getData();

console.log(data);

var Window = require('ui/handheld/ApplicationWindow');
var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
new ApplicationTabGroup(Window).open();


