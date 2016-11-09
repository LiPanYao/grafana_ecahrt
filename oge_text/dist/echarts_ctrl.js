'use strict';

System.register(['app/plugins/sdk', 'moment', 'lodash', 'jquery'], function (_export, _context) {
	"use strict";

	var MetricsPanelCtrl, moment, _, $, _createClass, panelDefaults, TextPanelCtrl;

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

	function _defineProperty(obj, key, value) {
		if (key in obj) {
			Object.defineProperty(obj, key, {
				value: value,
				enumerable: true,
				configurable: true,
				writable: true
			});
		} else {
			obj[key] = value;
		}

		return obj;
	}

	return {
		setters: [function (_appPluginsSdk) {
			MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
		}, function (_moment) {
			moment = _moment.default;
		}, function (_lodash) {
			_ = _lodash.default;
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

			panelDefaults = _defineProperty({
				remarkable: 'any',
				content: 'string',
				mode: "text" }, 'content', "输入描述");

			_export('TextPanelCtrl', TextPanelCtrl = function (_MetricsPanelCtrl) {
				_inherits(TextPanelCtrl, _MetricsPanelCtrl);

				function TextPanelCtrl($scope, $injector, templateSrv, $sce) {
					_classCallCheck(this, TextPanelCtrl);

					var _this = _possibleConstructorReturn(this, (TextPanelCtrl.__proto__ || Object.getPrototypeOf(TextPanelCtrl)).call(this, $scope, $injector));

					_this.templateSrv = templateSrv;
					_this.$sce = $sce;

					_.defaults(_this.panel, panelDefaults); //将panelDefaults属性附加到this.panel上
					_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
					_this.events.on('data-received', _this.onDataReceived.bind(_this));
					return _this;
				}

				_createClass(TextPanelCtrl, [{
					key: 'onInitEditMode',
					value: function onInitEditMode() {
						this.addEditorTab('Options', 'public/app/plugins/panel/oge_text/editor.html', 2);
					}
				}, {
					key: 'onDataReceived',
					value: function onDataReceived(dataList) {
						this.data = dataList;
						this.HandlingText();
						this.render();
					}
				}, {
					key: 'HandlingText',
					value: function HandlingText() {
						if (this.data.content == null && this.data.type == null) {
							return;
						} else {
							var describe = this.data.content;
							this.panel.content = describe;
							if (this.data.type == 1) {
								this.panel.mode = 'html';
							} else if (this.data.type == 2) {
								this.panel.mode = 'markdown';
							} else if (this.data.type == 3) {
								this.panel.mode = 'text';
							}
						}
					}
				}, {
					key: 'renderText',
					value: function renderText(content) {
						content = content.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/\n/g, '<br/>');
						this.updateContent(content);
					}
				}, {
					key: 'renderMarkdown',
					value: function renderMarkdown(content) {
						var _this2 = this;

						if (!this.remarkable) {
							return System.import('remarkable').then(function (Remarkable) {
								_this2.remarkable = new Remarkable();
								_this2.$scope.$apply(function () {
									_this2.updateContent(_this2.remarkable.render(content));
								});
							});
						}

						this.updateContent(this.remarkable.render(content));
					}
				}, {
					key: 'updateContent',
					value: function updateContent(html) {
						try {
							this.content = this.$sce.trustAsHtml(this.templateSrv.replace(html, this.panel.scopedVars));
						} catch (e) {
							console.log('Text panel error: ', e);
							this.content = this.$sce.trustAsHtml(html);
						}
					}
				}, {
					key: 'onRender',
					value: function onRender() {
						if (this.panel.mode === 'markdown') {
							this.renderMarkdown(this.panel.content);
						} else if (this.panel.mode === 'html') {
							this.updateContent(this.panel.content);
						} else if (this.panel.mode === 'text') {
							this.renderText(this.panel.content);
						}
						this.renderingCompleted();
					}
				}]);

				return TextPanelCtrl;
			}(MetricsPanelCtrl));

			_export('TextPanelCtrl', TextPanelCtrl);

			TextPanelCtrl.templateUrl = 'module.html';
		}
	};
});
//# sourceMappingURL=echarts_ctrl.js.map
