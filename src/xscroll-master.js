define(function(require, exports, module) {
	var Util = require('./util'),
		Base = require('./base'),
		XScroll = require('./xscroll');

	var XScrollMaster = function(cfg) {
		XScrollMaster.superclass.constructor.call(this, cfg);
		this.init(cfg);
	}

	Util.extend(XScrollMaster, Base, {
		init: function(cfg) {
			var self = this;
			self.userConfig = Util.mix({
				selector: ".xscroll"
			}, cfg)
		},
		//find xscroll instance
		get: function(id) {
			var self = this;
			if (!id) return;
			for (var i = 0, l = self.__xscrolls.length; i < l; i++) {
				if (self.__xscrolls[i].renderTo.id === id) {
					return self.__xscrolls[i];
				}
			}
			return;
		},
		getAll: function() {
			return this.__xscrolls;
		},
		getElPos: function() {
			var self = this;
			var elpos = [];
			var els = document.querySelectorAll(self.userConfig.selector);
			for (var i = 0; i < els.length; i++) {
				var content = els[i].querySelector('.xs-content');
				elpos.push({
					el: els[i],
					containerWidth: content.offsetWidth,
					containerHeight: content.offsetHeight,
					width: els[i].offsetWidth,
					height: els[i].offsetHeight
				})
			}
			return elpos;
		},
		render: function() {
			var self = this;
			var findByEl = function(el, xscrolls) {
				if (!el || !xscrolls) return;
				for (var i = 0, l = xscrolls.length; i < l; i++) {
					if (xscrolls[i].renderTo === el) {
						return xscrolls[i];
					}
				}
			}
			var els = document.querySelectorAll(self.userConfig.selector);
			var elpos = self.getElPos();
			self.__xscrolls = [];
			for (var i = 0; i < els.length; i++) {
				self.__xscrolls.push(new XScroll({
					renderTo: els[i],
					containerWidth: elpos[i].containerWidth,
					containerHeight: elpos[i].containerHeight,
					width: elpos[i].width,
					height: elpos[i].height
				}).render());
			}
			for (var i = 0, l = self.__xscrolls.length; i < l; i++) {
				var innerEls = self.__xscrolls[i].renderTo.querySelectorAll(self.userConfig.selector);
				for (var j = 0; j < innerEls.length; j++) {
					var xscroll = findByEl(innerEls[j], self.__xscrolls);
					if (xscroll) {
						self.__xscrolls[i].controller.add(xscroll);
					}
				}
				console.log(self.__xscrolls[i].userConfig)
			}
			self._bindEvt();
		},
		_bindEvt: function() {
			var self = this;
			//window resize
			window.addEventListener("resize", function(e) {
				setTimeout(function() {
					var elpos = self.getElPos();
					for (var i = 0, l = self.__xscrolls.length; i < l; i++) {
						var xscroll = self.__xscrolls[i];
						xscroll.userConfig.containerWidth = elpos.containerWidth;
						xscroll.userConfig.containerHeight = elpos.containerHeight;
						xscroll.userConfig.width = elpos.width;
						xscroll.userConfig.height = elpos.height;
						xscroll.boundryCheck(0);
						xscroll.render();
					}
				}, 100);
			}, self);
		}
	});

	if (typeof module == 'object' && module.exports) {
		module.exports = XScrollMaster;
	} else {
		return XScrollMaster;
	}
});