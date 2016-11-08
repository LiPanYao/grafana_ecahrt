import {
	MetricsPanelCtrl
} from 'app/plugins/sdk';
import moment from 'moment';
import _ from 'lodash';
import $ from 'jquery';

var panelDefaults = {
	remarkable: 'any',
	content: 'string',
	mode: "text", // 'html', 'markdown', 'text'
	content: "输入描述"
};
export class TextPanelCtrl extends MetricsPanelCtrl {
	constructor($scope, $injector, templateSrv, $sce) {
		super($scope, $injector);
		this.templateSrv = templateSrv;
		this.$sce = $sce;

		_.defaults(this.panel, panelDefaults); //将panelDefaults属性附加到this.panel上
		this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
		this.events.on('data-received', this.onDataReceived.bind(this));
	}

	onInitEditMode() {
		this.addEditorTab('Options', 'public/app/plugins/panel/oge_text/editor.html', 2);
	}

	onDataReceived(dataList) {
		this.data = dataList;
		this.HandlingText();
		this.render();
	}
	HandlingText() {
		if (this.data.content == null && this.data.type == null) {
			return
		} else {
			var describe = this.data.content;
			this.panel.content = describe;
			if (this.data.type == 1) {
				this.panel.mode = 'html'
			} else if (this.data.type == 2) {
				this.panel.mode = 'markdown'
			} else if (this.data.type == 3) {
				this.panel.mode = 'text'
			}
		}
	}

	renderText(content) {
		content = content
			.replace(/&/g, '&amp;')
			.replace(/>/g, '&gt;')
			.replace(/</g, '&lt;')
			.replace(/\n/g, '<br/>');
		this.updateContent(content);
	}

	renderMarkdown(content) {
		if (!this.remarkable) {
			return System.import('remarkable').then(Remarkable => {
				this.remarkable = new Remarkable();
				this.$scope.$apply(() => {
					this.updateContent(this.remarkable.render(content));
				});
			});
		}

		this.updateContent(this.remarkable.render(content));
	}

	updateContent(html) {
		try {
			this.content = this.$sce.trustAsHtml(this.templateSrv.replace(html, this.panel.scopedVars));
		} catch (e) {
			console.log('Text panel error: ', e);
			this.content = this.$sce.trustAsHtml(html);
		}
	}

	onRender() {
		if (this.panel.mode === 'markdown') {
			this.renderMarkdown(this.panel.content);
		} else if (this.panel.mode === 'html') {
			this.updateContent(this.panel.content);
		} else if (this.panel.mode === 'text') {
			this.renderText(this.panel.content);
		}
		this.renderingCompleted();
	}
}

TextPanelCtrl.templateUrl = 'module.html';