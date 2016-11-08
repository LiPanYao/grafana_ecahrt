'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', './css/clock-panel.css!', 'jquery'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, moment, _, TimeSeries, $, _createClass, panelDefaults, EchartsCtrl;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	return {
		setters: [function (_appPluginsSdk) {
			MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
		}, function (_moment) {
			moment = _moment.default;
		}, function (_lodash) {
			_ = _lodash.default;
		}, function (_appCoreTime_series) {
			TimeSeries = _appCoreTime_series.default;
		}, function (_cssClockPanelCss) {}, function (_jquery) {
			$ = _jquery.default;
		}],
		execute: function () {
			_createClass = function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(target, descriptor.key, descriptor);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			}();

			panelDefaults = {
				mode: 'alarmInfo',
				dataPrecise: 2,
				DT: 'hidden',
				url: '' };

			_export('EchartsCtrl', EchartsCtrl = function (_MetricsPanelCtrl) {
				_inherits(EchartsCtrl, _MetricsPanelCtrl);

				function EchartsCtrl($scope, $injector, $rootScope) {
					_classCallCheck(this, EchartsCtrl);

					var _this = _possibleConstructorReturn(this, (EchartsCtrl.__proto__ || Object.getPrototypeOf(EchartsCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;

					_.defaults(_this.panel, panelDefaults); //将panelDefaults属性附加到this.panel上
					var DTOption = [{
						name: '显示时间',
						value: "show"
					}, {
						name: '隐藏时间',
						value: "hidden"
					}];
					_this.panel.DTOption = DTOption;
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					return _this;
				}

				_createClass(EchartsCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/app/plugins/panel/grafana-table-graphs/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.data = dataList;
						this.fixed();
						this.render();
					}
				}, {
					key: 'fixed',
					value: function fixed() {
						var _this2 = this;

						if (this.data.length == 0) {
							return;
						} else if (this.data[0].value == null && this.data[0].max == null) {

							for (var i = 0; i < this.data.length; i++) {
								if (this.data[i].datapoints.length == 0) {
									this.data[i].Fdata = "-";
									continue;
								} else {
									var num;
									var fixedData;
									var time;

									(function () {
										var getTimesByLongTime = function getTimesByLongTime(time) {
											var myDate = new Date(time);
											var times = fullTime(myDate.getFullYear());
											times += "-" + fullTime(myDate.getMonth());
											times += "-" + fullTime(myDate.getDate());
											times += " " + fullTime(myDate.getHours());
											times += ":" + fullTime(myDate.getMinutes());
											times += ":" + fullTime(myDate.getSeconds());
											return times;
										};

										var fullTime = function fullTime(number) {
											if (number < 10) {
												return "0" + number;
											} else {
												return number;
											}
										};

										num = _this2.data[i].datapoints[0][0];
										fixedData = num.toFixed(_this2.panel.dataPrecise);

										if (fixedData == -9999) {
											fixedData = "-";
										}
										_this2.data[i].Fdata = fixedData;
										time = _this2.data[i].datapoints[0][1];

										_this2.data[i].times = getTimesByLongTime(time);
									})();
								}
							}
							this.panel.mode = "commonData";
							console.info("fixed over");
						} else if (this.data[0].value != null && this.data[0].max == null) {
							for (var i = 0; i < this.data.length; i++) {
								var num = this.data[i].value;
								var fixedData = num.toFixed(this.data[i].dataPrecise);
								if (fixedData == -9999) {
									fixedData = "-";
								}
								this.data[i].Va = fixedData;
							}

							this.panel.mode = "relativeInfo";
						} else {
							this.panel.mode = "alarmInfo";
						}
					}
				}, {
					key: 'onRender',
					value: function onRender() {
						console.info("action onRender");
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						var pageCount = 0;
						//table高度
						function getTableHeight() {
							var panelHeight = ctrl.height;
							if (pageCount > 1) {
								panelHeight -= 26;
							}
							return panelHeight - 31 + 'px';
						}

						ctrl.events.on('render', function () {
							ctrl.fixed();
							var rootElem = elem.find('.table-panel-scroll'); //表格需要处理高度
							pageCount = ctrl.data.length;
							rootElem.css({
								'max-height': getTableHeight()
							});
						});
					}
				}]);

				return EchartsCtrl;
			}(MetricsPanelCtrl));

			_export('EchartsCtrl', EchartsCtrl);

			EchartsCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=graph_ctrl.js.map
