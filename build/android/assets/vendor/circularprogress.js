module.exports=function(e){var t=e;(null==t.percent||t.percent>1||t.percent<0)&&(t.percent=1),null==t.size&&(t.size=46),null==t.margin&&(t.margin=4),null==t.backgroundColor&&(t.backgroundColor="#fff"),null==t.progressColor&&(t.progressColor="#4ba818"),null==t.topper&&(t.topper={}),null==t.topper.color&&(t.topper.color="#fff"),null==t.topper.size&&(t.topper.size=36),null==t.font&&(t.font={}),null==t.font.visible&&(t.font.visible=!0),null==t.font.size&&(t.font.size=12),null==t.font.color&&(t.font.color="#900"),null==t.font.shadowColor&&(t.font.shadowColor="#aaa"),null==t.font.shadowRadius&&(t.font.shadowRadius=1),null==t.font.shadowOffset&&(t.font.shadowOffset={}),null==t.font.shadowOffset.x&&(t.font.shadowOffset.x=0),null==t.font.shadowOffset.y&&(t.font.shadowOffset.y=1);var o=Ti.UI.createView({visible:!1,opacity:.7,left:e.left,right:e.right,top:e.top,bottom:e.bottom,width:t.size+t.margin,height:t.size+t.margin,borderRadius:(t.size+t.margin)/2*(Titanium.Platform.displayCaps.logicalDensityFactor||1),backgroundColor:t.backgroundColor}),a=Ti.UI.createView({width:t.size,height:t.size,borderRadius:t.size/2*(Titanium.Platform.displayCaps.logicalDensityFactor||1)}),i=Ti.UI.createView({width:t.size,height:t.size,borderRadius:t.size/2*(Titanium.Platform.displayCaps.logicalDensityFactor||1),backgroundColor:t.progressColor}),r=Ti.UI.createView({left:0,width:t.size/2,height:t.size,backgroundColor:t.backgroundColor}),n=Ti.UI.createView({left:0,width:t.size,height:t.size}),s=Ti.UI.createView({right:0,width:t.size/2,height:t.size,backgroundColor:t.backgroundColor});n.add(s);var l=Ti.UI.createView({right:0,width:t.size/2,height:t.size,backgroundColor:t.progressColor}),d=Ti.UI.createView({width:t.topper.size,height:t.topper.size,borderRadius:t.topper.size/2*(Titanium.Platform.displayCaps.logicalDensityFactor||1),backgroundColor:t.topper.color}),c=Ti.UI.createLabel({visible:t.font.visible,width:Ti.UI.SIZE,height:Ti.UI.SIZE,color:t.font.color,font:{fontSize:t.font.size},shadowColor:t.font.shadowColor,shadowRadius:t.font.shadowRadius,shadowOffset:{x:t.font.shadowOffset.x,y:t.font.shadowOffset.y},textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,text:100*t.percent+"%"});o.add(a),d.add(c),a.add(i),a.add(r),a.add(n),a.add(l),a.add(d);var u=t.percent,p=360*u;return r.visible=p>180?!1:!0,l.visible=p>180?!0:!1,n.transform=Ti.UI.create2DMatrix().rotate(p),o.setValue=function(e){p=360*e,r.visible=p>180?!1:!0,l.visible=p>180?!0:!1,n.transform=Ti.UI.create2DMatrix().rotate(p),c.text=Math.round(100*e)+"%"},o};