module.exports=function(t){if(console.log(t),t.stream)t.onload(t.stream);else{var e=/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi,a=Ti.Network.createHTTPClient({timeout:6e3,onload:function(){if(200==this.status)if(/url/.test(this.getResponseHeader("Content-Type"))){for(var o=this.responseText.split("\n"),r=[],n=0;n<o.length;n++)if("#"!=o[n][0]){var i=o[n].match(e);i&&r.push(i)}t.onload(r[0][0])}else a.abort(),console.log("no header"),t.onload(t.playlist);else t.onerror()},onerror:function(){t.onerror()}});a.open("GET",t.playlist),a.send(),console.log(t.playlist)}};