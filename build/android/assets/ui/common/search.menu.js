var abx=require("com.alcoapps.actionbarextras");module.exports=function(e){var t=e.source;t.data;abx.title="HörDat-Suche",abx.subtitle=t.searchItem.a,abx.titleFont="Rambla-Bold",abx.subtitleColor="#ccc";var i=e.source.getActivity();i&&(i.onCreateOptionsMenu=function(e){i.actionBar.displayHomeAsUp=!0,e.menu.clear()},i.actionBar.homeButtonEnabled=!0,i.actionBar.onHomeIconItemSelected=function(){t.close()})};