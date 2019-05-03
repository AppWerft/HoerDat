const MINILOGO = 24;
const HEIGHT = 150;
const SCREENWIDTH = Ti.Platform.displayCaps.platformWidth
		/ Ti.Platform.displayCaps.logicalDensityFactor;

exports.pool_progress = {
	properties : {
		height : MINILOGO,
		backgroundColor : 'white',
	},
	childTemplates : [ {
		type : 'Ti.UI.ImageView',
		bindId : 'logo',
		properties : {
			left : 5,
			touchEnabled : false,
			width : MINILOGO,
			height : 'auto'
		}
	},/*
		 * { type : 'TiAnimation.AnimationView', bindId : 'ani', properties : {
		 * contentMode : 0, touchEnabled : false, loop : true, autoStart : true,
		 * width : MINILOGO, height : MINILOGO } },
		 */{
		type : 'Ti.UI.Label',
		bindId : 'title',
		properties : {
			left : MINILOGO + 10,
			right : 10,
			touchEnabled : false,
			text : 'Titel',
			textAlign : 'left',
			height : 25,
			color : '#444',
			width : Ti.UI.FILL,
			font : {
				fontFamily : 'Rambla'
			}
		}
	} ]
};
exports.pool_online = {
	properties : {
		height : HEIGHT,
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
			height : 'auto'
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'duration',
		properties : {
			left : 5,
			top : 120,
			height : Ti.UI.SIZE,
			touchEnabled : false,
			font : {
				fontSize : 12,
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
			height : HEIGHT,
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
exports.pool_saved = {
	properties : {
		height : Ti.UI.SIZE,
		accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
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
			height : 'auto'
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
				textAlign : 'left',
				font : {
					fontSize : 16,
					fontFamily : 'Rambla'
				},
				color : '#333'
			}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'duration',
			properties : {
				left : 0,
				top : 0,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 12,
					fontFamily : 'Rambla'
				},
				color : '#888'
			}
		}, ]
	} ]
};
exports.pool_used = {
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
			height : 'auto'
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
			bindId : 'duration',
			properties : {
				left : 0,
				top : 0,
				height : Ti.UI.SIZE,
				touchEnabled : false,
				font : {
					fontSize : 12,
					fontFamily : 'Rambla'
				},
				color : '#888'
			}
		}, ]
	} ]
};

exports.podcastslist = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : 'white',
		itemId : ''
	},
	childTemplates : [ {
		type : 'Ti.UI.ImageView',
		bindId : 'logo',
		properties : {
			left : 0,
			touchEnabled : false,
			top:0,
			width : 96,
			height : 96
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'title',
		properties : {
			text : '',
			color : '#3F79A9',
			touchEnabled : false,
			font : {
				fontSize : 22,
				fontFamily : 'Rambla-Bold'
			},
			left : 110,
			height : Ti.UI.SIZE,
			textAlign : 'left',
			width : Ti.UI.FILL,
		}

	} ]
};
exports.podcastslist_slim = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : 'white',
		itemId : ''
	},
	childTemplates : [ {
		type : 'Ti.UI.ImageView',
		bindId : 'logo',
		properties : {
			touchEnabled : false,
			left:0,
			width : 150,
			height : 'auto'
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'title',
		properties : {
			color : '#3F79A9',
			touchEnabled : false,
			font : {
				fontSize : 22,
				fontFamily : 'Rambla-Bold'
			},
			left : 160,right:20,
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
		}

	} ]
};
exports.podcastslist_pictonly = {
	properties : {
		height : Ti.UI.SIZE
	},
	childTemplates : [ {
		type : 'Ti.UI.ImageView',
		bindId : 'logo',
		properties : {
			touchEnabled : false,
			top : 0,
			width : SCREENWIDTH,
			height : Ti.UI.SIZE
		}
	} ]
};