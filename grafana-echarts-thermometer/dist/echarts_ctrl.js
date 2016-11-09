'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'app/core/time_series', './css/clock-panel.css!', 'vendor/echarts/echarts.min.js', 'jquery'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, moment, _, TimeSeries, echarts, $, _createClass, panelDefaults, EchartsCtrl;

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
		}, function (_cssClockPanelCss) {}, function (_vendorEchartsEchartsMinJs) {
			echarts = _vendorEchartsEchartsMinJs.default;
		}, function (_jquery) {
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
				//默认显示模式
				mode: 'vertical',
				min: 0,
				max: 100,
				Precise: 0,
				Interval: 20,
				Name: "温度",
				Unit: "℃",
				Tvalue: 50
			};

			_export('EchartsCtrl', EchartsCtrl = function (_MetricsPanelCtrl) {
				_inherits(EchartsCtrl, _MetricsPanelCtrl);

				function EchartsCtrl($scope, $injector, $rootScope) {
					_classCallCheck(this, EchartsCtrl);

					var _this = _possibleConstructorReturn(this, (EchartsCtrl.__proto__ || Object.getPrototypeOf(EchartsCtrl)).call(this, $scope, $injector));

					_this.$rootScope = $rootScope;
					_.defaults(_this.panel, panelDefaults); //将panelDefaults属性附加到this.panel上
					var modeOption = [{
						name: '纵向温度计',
						value: "vertical"
					}, {
						name: '横向温度计',
						value: "horizontal"
					}];
					_this.panel.modeOption = modeOption;

					_this.panel.dataTime = "2016-01-01 00:00:00";
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					return _this;
				}

				_createClass(EchartsCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/app/plugins/panel/grafana-echarts-thermometer/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.data = dataList;

						this.render();
					}
				}, {
					key: 'fixed',
					value: function fixed() {
						if (Object.prototype.toString.call(this.data) === '[object Array]') {
							if (this.data.datapoints == null) {
								this.panel.data = Math.random() * (this.panel.max - this.panel.min) + this.panel.min;
							} else {
								var num = this.data[0].datapoints[0][0];
								var fixedData = num.toFixed(this.panel.Precise);
								this.panel.data = fixedData;
								console.info("fixed over");
							}
						} else {
							var fixed = function fixed(value, precise) {
								if (value && precise && typeof value != "string") {
									value = value.toFixed(precise);
								}
								return value;
							};
						}
					}
				}, {
					key: 'onRender',
					value: function onRender() {
						//nothing
						console.info("action onRender");
					}
				}, {
					key: 'link',
					value: function link(scope, elem, attrs, ctrl) {
						var obj = elem.find('.echarts-panel');
						ctrl.events.on('render', function () {
							ctrl.fixed();
							var height = ctrl.height || ctrl.row.height;
							ctrl.row.width = obj[0].offsetWidth;
							var Width = ctrl.row.width;
							if (_.isString(height)) {
								height = parseInt(height.replace('px', ''), 10);
							}
							if (_.isString(Width)) {
								Width = parseInt(Width.replace('px', ''), 10);
							}
							obj.css('height', height + 'px');
							var Gao = height;
							var Kuan = Width;
							var HV = scope.ctrl.panel.mode;
							if (HV == "horizontal") {
								var TitleLeft = '10',
								    TitleTop = 'center',
								    VsiualMapLeft = '50',

								//温度计与左边距离
								VsiualMapTop = 'center',

								//温度计与顶部距离
								VsiualMapAlign = 'bottom',

								//温度计时事数显示方向
								VsiualMapOrient = 'horizontal',

								//温度计方向,(温度计纵向时的值:vertical)
								VsiualMapWidth = '25',

								//温度计长条宽度
								VsiualMapHeight = Kuan - 78,

								//温度计长条长度
								ParallelHeight = '25',

								//温度计标尺宽度
								ParallelWidth = Kuan - 78,

								//温度计标尺的宽度
								ParallelLeft = '55',

								//温度计标尺与左边距离
								ParallelLayout = 'vertical',

								//温度计标尺方向,(温度计纵向时的值:horizontal)
								ParallelTop = 'center',

								//温度计标尺与顶部距离
								ParallelCenter = ['33', '50%']; //圆与[左边,顶部]距离
							} else {
								var TitleLeft = 'center',
								    TitleTop = Gao - 40,
								    VsiualMapLeft = 'center',
								    //温度计与左边距离
								VsiualMapTop = '20',
								    //温度计与顶部距离
								VsiualMapAlign = 'right',
								    //温度计时事数显示方向
								VsiualMapOrient = 'vertical',
								    //温度计方向,(温度计纵向时的值:vertical)
								VsiualMapWidth = '25',
								    //温度计长条宽度
								VsiualMapHeight = Gao - 72,
								    //温度计长条长度
								ParallelHeight = Gao - 72,
								    //温度计标尺长度
								ParallelWidth = '25',
								    //温度计标尺的宽度
								ParallelLeft = 'center',
								    //温度计标尺与左边距离
								ParallelLayout = 'horizontal',
								    //温度计标尺方向,(温度计纵向时的值:horizontal)
								ParallelTop = '25',
								    //温度计标尺与顶部距离
								ParallelCenter = ['50%', Gao - 25]; //圆与[左边,顶部]距离
							};
							var myChart = echarts.init(obj[0]);
							// 指定图表的配置项和数据
							var Interval = scope.ctrl.panel.Interval; //刻度数量
							var TextName = scope.ctrl.panel.Name; //显示数值名称
							if (Object.prototype.toString.call(ctrl.data) === '[object Array]') {
								var Tvalue = ctrl.panel.data;
							} else {
								var Tvalue = ctrl.data.value;
							} //数值
							var unit = scope.ctrl.panel.Unit;
							var Co = '#f5deb3'; //颜色 
							var Precise = scope.ctrl.panel.Precise; //数据精度

							var Min = scope.ctrl.panel.min; //最大值
							var Max = scope.ctrl.panel.max; //最小值
							if (Min == null || Max == null || Precise == null || Precise < 0) {
								return;
							};
							var schema = [{
								name: '',
								index: 0,
								text: unit
							}, {
								name: '温度',
								index: 1,
								text: ''
							}];
							var lineStyle = {
								normal: {
									width: 1,
									opacity: 0.5
								}
							};
							var option = {

								title: {
									text: TextName,
									left: TitleLeft,
									top: TitleTop
								},
								// 温度计显示条---------------------------------------------------------
								visualMap: {
									min: Min, //温度计最小值
									max: Max, //温度计最大值
									left: VsiualMapLeft,
									target: {
										inRange: {
											color: '#ff7f50' }
									},
									top: VsiualMapTop,
									align: VsiualMapAlign, //温度计数值显示方向 默认为右
									//inverse: false,       温度计图形显示方向 默认为false
									orient: VsiualMapOrient, //温度计横向     
									//bottom:'10%',
									precision: Precise, //数据精度
									zlevel: 0, //图层
									itemWidth: VsiualMapWidth,
									itemHeight: VsiualMapHeight,
									range: [Min, Tvalue], // 温度计显示得值 [min,value]
									//text: ['', TextName],
									textStyle: {
										color: Co,
										fontSize: 15
									}
								},
								//刻度坐标轴----------------------------------------------------------------
								parallelAxis: [{
									dim: 0,
									name: schema[0].text,
									axisLabel: {
										margin: -30,
										show: false
									},
									areaSelectStyle: {
										width: 0
									}, //关闭框选
									axisLine: {
										lineStyle: {
											color: Co
										}
									},
									axisTick: {
										length: 0,
										lineStyle: {
											color: Co
										},
										alignWithLabel: true
									}
								}, {
									dim: 1,
									name: schema[1].text,
									min: Min,
									max: Max,
									interval: Interval, //刻度数量
									areaSelectStyle: {
										width: 0
									}, //关闭框选
									axisLabel: {
										margin: 8,
										show: true,
										lineStyle: {
											color: Co
										}
									},
									axisLine: {
										lineStyle: {
											color: Co
										}
									},
									axisTick: {
										length: -5,
										lineStyle: {
											color: Co
										}
									},
									nameGap: 3
								}],

								parallel: {
									zlevel: 1,
									height: ParallelHeight, //横向时温度计标尺的宽度
									width: ParallelWidth, //横向时温度计标尺的长度
									left: ParallelLeft,
									layout: ParallelLayout, //标尺的横向
									top: ParallelTop,
									parallelAxisDefault: {
										type: 'value',
										nameGap: 6, //坐标轴名称到坐标轴的距离
										nameTextStyle: {
											fontWeight: 'bold',
											color: Co,
											fontSize: '14',
											align: 'left'
										}
									}
								},
								series: [
								//温度计series-----------------------------------
								{
									animation: false,
									zlevel: 0,
									name: '',
									type: 'pie',
									radius: '25',
									center: ParallelCenter,
									data: [{
										value: Tvalue
									}],
									label: {
										position: 'outside'
									},
									labelLine: {
										normal: {
											show: false }
									},
									itemStyle: {
										normal: {
											color: '#0fffff'
										},
										emphasis: {
											//color:'#0fffff',
											shadowBlur: 10,
											shadowOffsetX: 0,
											shadowColor: 'rgba(0, 0, 0, 0.5)'

										}
									}
								},
								//坐标轴series-------------------------
								{
									type: 'parallel',
									data: []
								}]

							};

							// 使用刚指定的配置项和数据显示图表。
							myChart.setOption(option);
						});

						console.info("doChart over");
					}
				}]);

				return EchartsCtrl;
			}(MetricsPanelCtrl));

			_export('EchartsCtrl', EchartsCtrl);

			EchartsCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=echarts_ctrl.js.map
