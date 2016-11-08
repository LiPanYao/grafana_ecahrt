import {
	MetricsPanelCtrl
} from 'app/plugins/sdk';
import moment from 'moment';
import _ from 'lodash';
import TimeSeries from 'app/core/time_series';
import './css/clock-panel.css!';
import $ from 'jquery';

var panelDefaults = {
	mode: 'alarmInfo',
	dataPrecise: 2,
	DT: 'hidden',
	url: '', //默认显示模式
};

export class EchartsCtrl extends MetricsPanelCtrl {
	constructor($scope, $injector, $rootScope) {
		super($scope, $injector);
		this.$rootScope = $rootScope;

		_.defaults(this.panel, panelDefaults); //将panelDefaults属性附加到this.panel上
		var DTOption = [{
				name: '显示时间',
				value: "show"
			}, {
				name: '隐藏时间',
				value: "hidden"
			},

		];
		this.panel.DTOption = DTOption;
		this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
		this.events.on('data-received', this.onDataReceived.bind(this));
	}

	onInitEditMode() {
		this.addEditorTab('Options', 'public/app/plugins/panel/grafana-table-graphs/editor.html', 2);
	}
	onDataReceived(dataList) {
		this.data = dataList;
		this.fixed();
		this.render();
	}
	fixed() {
		if (this.data.length == 0) {
			return
		} else
		if (this.data[0].value == null && this.data[0].max == null) {

			for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].datapoints.length == 0) {
					this.data[i].Fdata = "-";
					continue
				} else {
					var num = this.data[i].datapoints[0][0];
					var fixedData = num.toFixed(this.panel.dataPrecise);
					if (fixedData == -9999) {
						fixedData = "-";
					}
					this.data[i].Fdata = fixedData;
					var time = this.data[i].datapoints[0][1];

					function getTimesByLongTime(time) {
						var myDate = new Date(time);
						var times = fullTime(myDate.getFullYear());
						times += "-" + fullTime(myDate.getMonth());
						times += "-" + fullTime(myDate.getDate());
						times += " " + fullTime(myDate.getHours());
						times += ":" + fullTime(myDate.getMinutes());
						times += ":" + fullTime(myDate.getSeconds());
						return times;
					}

					function fullTime(number) {
						if (number < 10) {
							return "0" + number;
						} else {
							return number;
						}
					}
					this.data[i].times = getTimesByLongTime(time);
				}
			}
			this.panel.mode = "commonData";
			console.info("fixed over")
		} else
		if (this.data[0].value != null && this.data[0].max == null) {
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
	onRender() {
		console.info("action onRender");
	}

	link(scope, elem, attrs, ctrl) {
		var pageCount = 0;
		//table高度
		function getTableHeight() {
			var panelHeight = ctrl.height;
			if (pageCount > 1) {
				panelHeight -= 26;
			}
			return (panelHeight - 31) + 'px';
		}

		ctrl.events.on('render', function() {
			ctrl.fixed();
			var rootElem = elem.find('.table-panel-scroll'); //表格需要处理高度
			pageCount = ctrl.data.length;
				rootElem.css({
					'max-height': getTableHeight()
				})
		});
	}
}

EchartsCtrl.templateUrl = 'module.html';