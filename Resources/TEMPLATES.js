exports.pool = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : 'white',
		itemId : ''
	},
	childTemplates : [ {
		type : 'Ti.UI.ImageView',
		bindId : 'logo',
		properties : {
			left : 5,
			touchEnabled : false,
			top : 5,
			width : 100,
			height : 70
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'duration',
		properties : {
			left : 10,
			top : 70,
			height : Ti.UI.SIZE,
			touchEnabled : false,
			font : {
				fontSize : 14,
				fontFamily : 'Rambla'
			},
			color : '#888'
		}
	}, {
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
			layout : 'vertical',
			left : 120,
			top : 0,
			height : Ti.UI.SIZE,
			right : 15
		},
		childTemplates : [ {
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				text : 'Hörspieltitel',
				top : 5,
				color : '#3F79A9',
				touchEnabled : false,
				font : {
					fontSize : 20,
					fontFamily : 'Rambla-Bold'
				},
				left : 0,
				height : Ti.UI.SIZE,
				textAlign : 'left',
				width : Ti.UI.FILL,
			}

		}, {
			type : 'Ti.UI.Label',
			bindId : 'author',
			properties : {
				left : 0,
				top : 0,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 16,
					fontFamily : 'Rambla'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'description',
			properties : {
				left : 0,
				top : 0,
				bottom : 5,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 16,
					fontFamily : 'Rambla'
				},
				color : '#888'
			}
		} ]
	} ]
};