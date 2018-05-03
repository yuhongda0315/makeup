'use strict';

const fs = require('fs');
let path = require('path');

let utils = {
	render: (data, template) => {
		template = template || "";
		data = data || [""];
		var re = /{{((?:(?!}}).)+)}}/g,
			reExp = /(^( )?(var|if|for|else|switch|case|break|{|}))(.*)?/g,
			code = 'var r=[];',
			cursor = 0;
		var add = function(line, js) {
			js ? (code += line.match(reExp) ? line : 'r.push(' + line + ');') :
				(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");' : '');
			return add;
		}
		var match;
		while (match = re.exec(template)) {
			add(template.slice(cursor, match.index))(match[1], true);
			cursor = match.index + match[0].length;
		}
		add(template.substr(cursor, template.length - cursor));
		code += 'return r.join("");';

		data = isNaN(data.length) ? [data] : data;
		var html = "";
		for (var i = 0, length = data.length; i < length; i++) {
			html += new Function(code.replace(/[\r\n]/g, '	')).apply(data[i]).replace(/	/g, '\n');
		}
		return html;
	},
	forEach: (obj, callback) => {
		for (let key in obj) {
			callback(obj[key], key);
		}
	},
	each: (arrs, callback) => {
		for (let i = 0, len = arrs.length; i < len; i++) {
			callback(arrs[i], i);
		}
	},
	getProtoCount: (obj) => {
		let count = 0;
		for (var key in obj) {
			count++;
		}
		return count;
	},
	extend: (target, source) => {
		utils.forEach(source, (value, key) => {
			target[key] = value;
		});
	}
};

let Ipt = {
	tplPath: path.join(path.dirname(fs.realpathSync(__filename)), '.', 'template', 'java')
};
let Opt = {
	jsons: [],
	output: './'
};

let config = {
	input: (url) => {
		let stat = fs.statSync(url);
		if (stat.isDirectory()) {
			let files = fs.readdirSync(url).filter((file) => {
				return file.lastIndexOf('.json') > -1;
			});

			utils.forEach(files, (file) => {
				let tpl = '{{this.dir}}/{{this.file}}';
				let url = utils.render({
					dir: url,
					file: file
				}, tpl);
				Opt.jsons.push(require(url));
			});
		}

		if (stat.isFile()) {
			let json, _url = url;
			_url = path.resolve(process.cwd(), _url);
			try {
				json = require(url);
			} catch (e) {
				let tpl = '{{this.url}}';
				let url = utils.render({
					url: _url
				}, tpl);
				json = require(url);
			}
			Opt.jsons.push(json);
		}
	},
	output: (output) => {
		Opt.output = output;
	},
	template: (url) => {
		Ipt.tplPath = path.resolve(process.cwd(), url);
	},
	docs: () => {

	}
};

let getOutPath = (file) => {
	let tpl = '{{this.path}}/{{this.prefix}}{{this.name}}.{{this.ext}}';
	return utils.render(file, tpl);
};


let writeFile = (file) => {
	let content = file.content;
	let path = file.path;
	fs.writeFileSync(path, content)
};

let renderTpl = (template, content) => {
	let path = getOutPath(template);
	let tpl = template.tpl;
	content = utils.render(content, tpl);
	return {
		path: path,
		content: content
	};
};

let makeup = (_config) => {
	utils.forEach(_config, (val, key) => {
		_config[key] && config[key](val);
	});

	const template = require(Ipt.tplPath);
	let tpl = template.tpl;
	let ext = template.ext;
	let prefix = template.prefix || '';
	let Types = template.Types || {};
	let name = template.name || '';

	let isBuildDocs = _config.docs;
	if (isBuildDocs) {
		let parts = name.split('.');
		name = parts[0] || Date.now();
		ext = parts[1] || 'md';
		let file = renderTpl({
			tpl: tpl,
			path: Opt.output,
			prefix: prefix,
			name: name,
			ext: ext
		}, Opt.jsons);
		return writeFile(file);
	}

	utils.each(Opt.jsons, (messages) => {
		utils.forEach(messages, (message, type) => {
			message.messageType = type;
			message.count = utils.getProtoCount(message.proto);
			message.upperLetter = (content) => {
				let letters = content.split('');
				let letter = letters[0];
				letters[0] = letter.toUpperCase();
				return letters.join('')
			};
			let verify = message.verify || {};
			utils.forEach(verify, (proto) => {
				let type = proto.type;
				proto.type = Types[type] || { val: type };
			});
		});
	});

	utils.each(Opt.jsons, (messages) => {
		utils.forEach(messages, (message, name) => {
			let file = renderTpl({
				tpl: tpl,
				path: Opt.output,
				prefix: prefix,
				name: name,
				ext: ext
			}, message);
			writeFile(file);
		});
	});
};

module.exports = makeup;