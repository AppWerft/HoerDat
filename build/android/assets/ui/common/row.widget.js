module.exports=function(t){var e=Ti.UI.createTableViewRow({height:Ti.UI.SIZE,hasDetail:!0,itemId:t}),a=Ti.UI.createView({left:70,top:20,layout:"vertical"});return e.add(a),t.subtitle?(a.add(Ti.UI.createLabel({text:t.title,left:10,top:8,bottom:3,right:10,height:Ti.UI.SIZE,color:"#444",font:{fontSize:14,fontFamily:"Rambla-Bold",fontWeight:"bold"}})),a.add(Ti.UI.createLabel({text:t.subtitle,left:10,top:0,bottom:8,right:10,height:Ti.UI.SIZE,color:"#444",font:{fontSize:24,fontFamily:"Rambla-Bold",fontWeight:"bold"}}))):a.add(Ti.UI.createLabel({text:t.title,left:10,top:8,bottom:8,right:10,height:Ti.UI.SIZE,color:"#444",font:{fontSize:24,fontFamily:"Rambla-Bold",fontWeight:"bold"}})),e.add(t.time?Ti.UI.createLabel({text:t.time,left:5,top:5,bottom:20,right:10,height:Ti.UI.SIZE,color:"#427aa7",font:{fontSize:12,fontFamily:"DroidSans"}}):Ti.UI.createLabel({text:t.roduktion,left:5,top:5,bottom:20,right:10,height:Ti.UI.SIZE,color:"#427aa7",font:{fontSize:12,fontFamily:"DroidSans"}})),e.add(Ti.UI.createImageView({image:t.logo,defaultImage:"/images/defaultimage.png",top:25,left:5,width:60,height:60})),e};