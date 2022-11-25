### Setup
```bash
npm i -g @kozmonos/template-generator 
```
if you are using Linux or Mac, you may need to run the command with sudo.
```bash
sudo npm i -g @kozmonos/template-generator 
```

### Usage

Create basic template with default folder structure

```bash
template create
```

Pull template from github

```bash
template pull --url <github-url>
```

## Create your template

### Folder structure

```
📦project-folder
 ┣ 📂src
 ┃ ┗ 📜...files
 ┗ 📜index.js
```

**index.js:** It's a config file. You can visit for more config options [here](https://www.npmjs.com/package/inquirer/v/8.2.5).

Example:
```js
//inquierer data
module.exports = [
	{
		type: 'input',
		name: 'will_be_change',
		message: 'Input data:',
		default: "default data"
	}
]

// You should keep the ci folders in src, whichever the user chooses, the other will be deleted.
module.exports.ci = ['Github Actions' , "CircleCI"]
```

**files:** Main project folder files. We are using mustacheJS for render template. You can click [here](https://www.npmjs.com/package/mustache) for more information.


## Feature

| Name | Description | Content | Status |
| ---- | ------- | ------ | ------ |
| NuxtJS template | Best Nuxt development environment to focus only on new website | <ul><li>i18n</li><li>Google Tag Manager</li><li>Google Analytics</li><li>router</li><li>Yandex Metrica</li><li>colors.scss file</li><li>sitemap</li><li>robots.txt</li><li>dotenv</li><li>svg</li><li>pwa</li><li>axios</li></ul>| Processing |
| Vue component | The best Vue component development environment to set up the best module structure | <ul><li> CI for NPM</li><li>Vue</li><li>basic folder structure</li><li>Eslint</li><li>Sonar</li></ul> | Processing |
| JS Package | Best development environment for building a JS package with module structure | <ul><li> CI for NPM</li><li>basic folder structure</li></ul> | Processing
| Laravel + Mongo = API | Development environment where necessary settings are made to develop your backend quickly | <ul><li>MongoDB</li><li>Force all response JSON</li><li>delete /api path</li><li>delete frontend viewer</li></ul> | Processing