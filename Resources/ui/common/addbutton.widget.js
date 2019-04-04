
module.exports = (cb) => {
	const $ = Ti.UI.createView({
		width : 56,
		bottom : 26,
		right : 26,
		touchFeedback : true,
		touchFeedbackColor : "#808080",
		elevation : 10,
		height : 56,
		borderRadius : 28,
		backgroundColor : "#225588"
	});
	
	$.add(Ti.UI.createView({
		width : 20,
		height : 20,
		backgroundImage : '/images/add.png'
	}));
	$.addEventListener('click', () => {
		$.animate({
			transform : Ti.UI.create2DMatrix({
				scale : 0.2
			}),
			duration : 100,
			autoreverse : true,
			repeat : 0
		});
		cb.onClick();
	});
	return $;
};