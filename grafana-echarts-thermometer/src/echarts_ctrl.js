import {
	MetricsPanelCtrl
} from 'app/plugins/sdk';
import moment from 'moment';
import _ from 'lodash';
import TimeSeries from 'app/core/time_series';
import './css/clock-panel.css!';
import echarts from 'vendor/echarts/echarts.min.js';
import $ from 'jquery';

var panelDefaults = {
	//默认显示模式
	mode: 'vertical',
	min: 0,
	max: 100,
	Precise: 0,
	Interval: 20,
	Name: "温度",
	Unit: "℃",
	Tvalue: 50,
};
export class EchartsCtrl extends MetricsPanelCtrl {
	constructor($scope, $injector, $rootScope) {
		super($scope, $injector);
		this.$rootScope = $rootScope;
		_.defaults(this.panel, panelDefaults); //将panelDefaults属性附加到this.panel上
		var modeOption = [{
			name: '纵向温度计',
			value: "vertical"
		}, {
			name: '横向温度计',
			value: "horizontal"
		}, ];
		this.panel.modeOption = modeOption;

		this.panel.dataTime = "2016-01-01 00:00:00"
		this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
		this.events.on('data-received', this.onDataReceived.bind(this));
	}
	onInitEditMode() {
		this.addEditorTab('Options', 'public/app/plugins/panel/grafana-echarts-thermometer/editor.html', 2);
	}
	onDataReceived(dataList) {
		this.data = dataList;
		this.fixed();
		this.render();
	}
	fixed() {
		if (Object.prototype.toString.call(this.data) === '[object Array]') {
			if (this.data.datapoints == null) {
				this.panel.data = Math.random() * (this.panel.max - this.panel.min) + this.panel.min

			} else {
				var num = this.data[0].datapoints[0][0];
				var fixedData = num.toFixed(this.panel.Precise);
				this.panel.data = fixedData;
				console.info("fixed over")
			}
		} else {
			function fixed(value, precise) {
				if (value && precise && typeof value != "string") {
					value = value.toFixed(precise);
				}
				return value;
			}
		}
	}
	onRender() {
		//nothing
		console.info("action onRender");
	}
	link(scope, elem, attrs, ctrl) {
		var obj = elem.find('.echarts-panel');
		ctrl.events.on('render', function() {
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
					VsiualMapHeight = (Kuan - 78),
					//温度计长条长度
					ParallelHeight = '25',
					//温度计标尺宽度
					ParallelWidth = (Kuan - 78),
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
					TitleTop = (Gao - 40),
					VsiualMapLeft = 'center', //温度计与左边距离
					VsiualMapTop = '20', //温度计与顶部距离
					VsiualMapAlign = 'right', //温度计时事数显示方向
					VsiualMapOrient = 'vertical', //温度计方向,(温度计纵向时的值:vertical)
					VsiualMapWidth = '25', //温度计长条宽度
					VsiualMapHeight = (Gao - 72), //温度计长条长度
					ParallelHeight = (Gao - 72), //温度计标尺长度
					ParallelWidth = '25', //温度计标尺的宽度
					ParallelLeft = 'center', //温度计标尺与左边距离
					ParallelLayout = 'horizontal', //温度计标尺方向,(温度计纵向时的值:horizontal)
					ParallelTop = '25', //温度计标尺与顶部距离
					ParallelCenter = ['50%', (Gao - 25)]; //圆与[左边,顶部]距离

			};
			var myChart = echarts.init(obj[0]);
			// 指定图表的配置项和数据
			var Interval = scope.ctrl.panel.Interval; //刻度数量
			var TextName = scope.ctrl.panel.Name; //显示数值名称
			if (Object.prototype.toString.call(ctrl.data) === '[object Array]') {
				var Tvalue = ctrl.panel.data
			} else {
				var Tvalue = ctrl.data.value;
			} //数值
			var unit = scope.ctrl.panel.Unit;
			var Co = '#f5deb3'; //颜色 
			var Precise = scope.ctrl.panel.Precise; //数据精度

			var Min = scope.ctrl.panel.min; //最大值
			var Max = scope.ctrl.panel.max; //最小值
			if (Min == null || Max == null || Precise == null || Precise < 0) {
				return
			};
			var schema = [{
				name: '',
				index: 0,
				text: unit,
			}, {
				name: '温度',
				index: 1,
				text: '',
			}, ];
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
					top: TitleTop,
				},
				// 温度计显示条---------------------------------------------------------
				visualMap: {
					min: Min, //温度计最小值
					max: Max, //温度计最大值
					left: VsiualMapLeft,
					target: {
						inRange: {
							color: '#ff7f50', //温度计下部圆球颜色

						},
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
						fontSize: 15,
					}
				},
				//刻度坐标轴----------------------------------------------------------------
				parallelAxis: [
					{
						dim: 0,
						name: schema[0].text,
						axisLabel: {
							margin: -30,
							show: false,
						},
						areaSelectStyle: {
							width: 0,
						}, //关闭框选
						axisLine: {
							lineStyle: {
								color: Co,
							}
						},
						axisTick: {
							length: 0,
							lineStyle: {
								color: Co,
							},
							alignWithLabel: true,
						},
					}, {
						dim: 1,
						name: schema[1].text,
						min: Min,
						max: Max,
						interval: Interval, //刻度数量
						areaSelectStyle: {
							width: 0,
						}, //关闭框选
						axisLabel: {
							margin: 8,
							show: true,
							lineStyle: {
								color: Co,
							}
						},
						axisLine: {
							lineStyle: {
								color: Co,
							}
						},
						axisTick: {
							length: -5,
							lineStyle: {
								color: Co,
							}
						},
						nameGap: 3,
					},

				],

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
							align: 'left',
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
							}, //温度计的值
						],
						label: {
							position: 'outside'
						},
						labelLine: {
							normal: {
								show: false, //去掉饼图的小尾巴
							},
						},
						itemStyle: {
							normal: {
								color: '#0fffff',
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
						data: [],
					},
				],

			};

			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(option);
		});

		console.info("doChart over");
	}
}

EchartsCtrl.templateUrl = 'module.html';