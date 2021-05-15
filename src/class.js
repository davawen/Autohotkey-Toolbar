exports.Script = class Script
{
	/**
	 * @param {string} name
	 * @param {string} path
	 */
	constructor(name, path)
	{
		this.name = name;
		this.path = path;

		/** @type {import('child_process').ChildProcessWithoutNullStreams[]} */
		this.executions = [];
	}
}