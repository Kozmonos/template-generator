const { spawnSync } = require('child_process')
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const Mustache = require('mustache');

const bash = (command) => spawnSync(command, {
	shell: true,
	stdio: 'inherit'
})


const logLevelInfo = (log) => console.log(`| ${log}...`)
const logLevelError = (log) => console.error(log)


const checkDependencies = (currentUserPath) => {

	const languages = {
		"javascript":{
			"build": "npm install",
			"dependency_file": "package.json"
		},
		"python":{
			"build": "pip install -r requirements.txt",
			"dependency_file": "requirements.txt"
		},
		"ruby":{
			"build": "bundle install",
			"dependency_file": "Gemfile"
		},
		"php":{
			"build": "composer install",
			"dependency_file": "composer.json"
		}
	}

	Object.keys(languages).forEach(languageName => {
		if (fs.existsSync(`${currentUserPath}/${languages[languageName].dependency_file}`)) {
			logLevelInfo(`Installing ${languageName} dependencies`)
			bash(languages[languageName].build)
		}

	});
}


module.exports.create = async (options) => {
	//create basic structure
	const currentUserPath = process.cwd()
	const appPath = path.join(__dirname, "..")

	fs.writeFileSync(`${currentUserPath}/index.js`, fs.readFileSync(`${appPath}/template/index.js`))
	fs.mkdirSync(`${currentUserPath}/src`)

	const projectFolderName = appPath.split('/').pop()

	const githubConfig = await inquirer
	.prompt([
		{
			type: 'input',
			name: 'github_username',
			message: 'Github username:'
		},
		{
			type: 'input',
			name: 'github_repo',
			message: 'Github repo name:'
		}
	])

	const TARGET_README_PATH = `${currentUserPath}/README.md`

	const TEMPLATE_README_CONTENT = fs.readFileSync(`${appPath}/template/README.md`).toString()

	const TEMPLATE_README_NEW_CONTENT = Mustache.render(TEMPLATE_README_CONTENT,githubConfig)

	//create README.md
	fs.writeFileSync(TARGET_README_PATH, TEMPLATE_README_NEW_CONTENT)
}

module.exports.pull = async (options) => {
	const { url } = options;

	const appPath = path.join(__dirname, "..")
	const currentUserPath = process.cwd()

	if (fs.readdirSync(currentUserPath).length) {
		logLevelError("Directory is not empty")
		process.exit(1)
	}

	logLevelInfo("Cloning template from Github")
	bash(`git clone ${url} .`)

	

	logLevelInfo("Configuration")
	await bash(`node --no-warnings ${appPath}`);

	await checkDependencies(currentUserPath)


}