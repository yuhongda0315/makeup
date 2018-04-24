'use strict';

const fs = require('fs');
const java = require('./template/java');
const program = require('commander');

const tplFactory = {
	java: java
};
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
			html += new Function(code.replace(/[\r\n]/g, '	')).apply(data[i]);
		}
		return html.replace(/	/g, '\n');
	},
	forEach: (obj, callback) => {
		for(let key in obj){
			callback(obj[key], key);
		}
	},
	each: (arrs, callback) => {
		for(let i = 0, len = arrs.length; i < len; i++){
			callback(arrs[i], i);
		}
	},
	getProtoCount: (obj) => {
		let count = 0;
		for(var key in obj){
			count ++;
		}
		return count;
	},
	extend: (target, source) => {
		utils.forEach(source, (value, key) => {
			target[key] = value;
		});
	}
};

program
  .version('1.0.0')
  .option('-i, --input [dir]', 'message input dir or file path')
  .option('-o, --output [dir]', 'message output dir, default ./')
  .option('-l, --language [type]', 'template language default java')
  .parse(process.argv);


let Opt = {
	jsons: [],
	output: './',
	lanType: 'java'
};

let input = program.input;
if (input) {
	let stat = fs.statSync(input);
	if (stat.isDirectory()) {
		let files = fs.readdirSync(input).filter((file) => {
			return file.lastIndexOf('.json') > -1;
		});

		utils.forEach(files, (file) => {
			let tpl = '{{this.dir}}/{{this.file}}';
			let url = utils.render({
				dir: input,
				file: file
			}, tpl);
			Opt.jsons.push(require(url));
		});
	}

	if (stat.isFile()) {
		let json;
		try{
			json = require(input);
		}catch(e){
			let tpl = '{{this.path}}{{this.input}}';
			let url = utils.render({
				path: './',
				input: input
			}, tpl);
			json = require(url);
		}
		Opt.jsons.push(json);
	}
}

let output = program.output;
if (output) {
	Opt.output = output;
}

let lanType = program.language;
if (lanType) {
	Opt.lanType = lanType;
}

let language = tplFactory[Opt.lanType];
if (!language) {
	console.log('%s language is not support, has supported java', Opt.lanType);
	return;
}
let tpl = language.tpl;
let ext = language.ext;
let Types = language.Types;

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
		utils.forEach(message.verify, (proto) => {
			let type = proto.type;
			proto.type = Types[type];
		});
	});
});

let getOutput = (file) => {
	let tpl = '{{this.path}}/{{this.name}}.{{this.ext}}';
	return utils.render(file, tpl);
};

utils.each(Opt.jsons, (messages) => {
	utils.forEach(messages, (message, name) => {
		let output = getOutput({
			path: Opt.output,
			name: name,
			ext: ext
		});
		message = utils.render(message, tpl);
		fs.writeFileSync(output, message)
	});
});


