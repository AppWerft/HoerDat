module.exports = function(label) {
	const header = Ti.UI.createView({
		height : 25,
		top : 0,
		backgroundColor : '#3F79A9'
	});
	header.add(Ti.UI.createLabel({
		text : label,
		left : 10,
		color:'white',
		font : {
			fontSize : 14,
			fontFamily : 'Rambla-Bold'
		},
		height : Ti.UI.FILL
	}));
	return header;
};