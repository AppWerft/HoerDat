module.exports=function(t){var e={},r=!1,n=0,a="http://s507870211.online.de/index.php?col1=ti&a="+encodeURI(t.payload.a)+"&so=autor&soo=asc";[0,6e3,12e3].forEach(function(i){setTimeout(function(){require("controls/getyahoo")(a,function(n){0==r&&(t.onload(n),clearInterval(e.cron),r=!0)},function(){n++,3==n&&(clearInterval(e.cron),t.onerror())})},i)}),e.tick=0,e.cron=setInterval(function(){e.tick++,t.onprogress(e.tick/100)},200)};