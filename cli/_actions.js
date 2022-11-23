const {exec, spawn} = require('child_process')
const path = require('path');

module.exports.create = async (options) => {
	const { url } = options;

	exec(`git clone ${url} .`);
	exec(`npm i`);
	const shell = spawn(`node ${path.join(__dirname, "..")}`,[], { stdio: 'inherit', shell: true });
}