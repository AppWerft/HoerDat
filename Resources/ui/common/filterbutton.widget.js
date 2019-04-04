
module.exports = (cb) => {
	const $ = Ti.UI.createView({
		width : 56,
		bottom : 100,
		right : 26,
		touchFeedback : true,
		touchFeedbackColor : "#808080",
		elevation : 10,
		height : 56,
		borderRadius : 28,
		backgroundColor : "#225588"
	});
	$.onChange = (e) => {
		if (e.source.value == "") {
			cb.onHide();
			$.animate({
				transform : Ti.UI.create2DMatrix({
					scale : 1
				}),
				duration : 200,
				autoreverse : false
			});
		}
	};
	$.add(Ti.UI.createView({
		width : 20,
		height : 20,
		backgroundImage : '/images/filter.png'
	}));
	$.addEventListener('click', () => {
		$.animate({
			transform : Ti.UI.create2DMatrix({
				scale : 0.02
			}),
			duration : 200,
			autoreverse : false,
			repeat : 0
		});
		cb.onShow();
	});
	return $;
};