const glob = require('glob');
const inquirer = require('inquirer');
const fs = require('fs');
const mustache = require('mustache');
var path = require('path');
//------------------------//


const ROOT_PATH = process.cwd();

MAIN_PATH = `${ROOT_PATH}/src`

const config = require(`${ROOT_PATH}/index.js`)


DEFAULT_PROJECT_NAME = __dirname.split('/').pop()

CI_PATH_NAME = {
	"Github Actions": ".github",
	"CircleCI": ".circleci"
}

//------------------------//


const ifExistsDelete = (path) => {
	if (fs.existsSync(path)) {
		fs.rmSync(path, { recursive: true });
	}
}

const deleteConfigFile = () => {

	const targetDeleteList = [
		"index.js",
		".gitignore",
		"node_modules",
		"package.json",
		"package-lock.json"
	]

	targetDeleteList.forEach(targetDelete => {
		ifExistsDelete(`${ROOT_PATH}/${targetDelete}`)
	});
}
const deleteSrcFolder = () => {
	fs.rmSync(`${ROOT_PATH}/src`, { recursive: true })
}

const globFiles = () => { return glob.sync('**/*.*', { cwd: MAIN_PATH }) }

const globBeDeleteCIFolder = (selectedCIFolderName) => {
	return glob.sync('.*', { cwd: MAIN_PATH }).filter(file => Object.values(CI_PATH_NAME).includes(file) && file !== selectedCIFolderName)
}

const isGitUrl = (str) => {
	var regex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
	return regex.test(str);
};

const run = async (inq) => {

	deleteConfigFile()

	const { ci, value, ...config } = inq;

	const defaultQuestions = {
		name: {
			type: 'input',
			message: 'Project name:',
			default: DEFAULT_PROJECT_NAME.replaceAll("-", " ").replaceAll("_", " ")
		},
		description: {
			type: 'input',
			message: 'Project description:',
			default: DEFAULT_PROJECT_NAME
		},
		github_username: {
			type: 'input',
			message: 'Github username:'
		},
		github_repo: {
			type: 'input',
			message: 'Github repo:'
		}
	}


	const inqConfig = [
		...Object.keys(defaultQuestions).map(defaultQuestionName => {
			return (!value || !(value?.hasOwnProperty(defaultQuestionName)))
				? {
					...defaultQuestions[defaultQuestionName],
					name: defaultQuestionName
				}
				: null
		}).filter(Boolean),
		...Object.values(config)
	]

	if (ci)
		inqConfig.push({
			type: 'list',
			name: 'ci',
			message: 'Choose CI:',
			choices: [...Object.keys(CI_PATH_NAME), 'None']
		})


	const choices = { ...await inquirer.prompt(inqConfig), ...value }

	console.log({ choices })


	if (ci) {
		const CI_FOLDER_NAME = CI_PATH_NAME[choices.ci]

		globBeDeleteCIFolder(CI_FOLDER_NAME).forEach(CIFolder => {
			if (fs.existsSync(`${MAIN_PATH}/${CIFolder}`))
				fs.rmSync(`${MAIN_PATH}/${CIFolder}`, { recursive: true })
		})

		if (choices.ci != 'None' && fs.existsSync(`${MAIN_PATH}/${CI_FOLDER_NAME}`))
			fs.renameSync(`${MAIN_PATH}/${CI_FOLDER_NAME}`, `${ROOT_PATH}/${CI_FOLDER_NAME}`)

	}
	globFiles().forEach(file => {
		const currentTarget = MAIN_PATH + '/' + file
		const newTarget = ROOT_PATH + '/' + file
		if (!fs.existsSync(path.dirname(newTarget)))
			fs.mkdirSync(path.dirname(newTarget))

		const contentFile = fs.readFileSync(currentTarget).toString()
		const newContent = mustache.render(contentFile, choices)
		fs.writeFileSync(newTarget, newContent)
	});

	deleteSrcFolder()

}

run(config)