//inquierer data
module.exports = [
	{
		type: 'input',
		name: 'will_be_change',
		message: 'Input data:',
		default: "default data"
	}
]

module.exports.value = {
	
}

// You should keep the ci folders in src, whichever the user chooses, the other will be deleted.
module.exports.ci = ['Github Actions' , "CircleCI"]