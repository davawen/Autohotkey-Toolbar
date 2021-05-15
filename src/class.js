/**
 * @typedef ChildProcessWithoutNullStreams
 * @type import('child_process').ChildProcessWithoutNullStreams
 */

const uuid = require("uuid").v4;

class Execution
{
	/**
	 * @param {ChildProcessWithoutNullStreams} process
	 */
	constructor(process)
	{
		/** @type {ChildProcessWithoutNullStreams} */
		this.process = process;
		
		this.id = uuid();
	}
}

class Script
{
	/**
	 * @param {string} name
	 * @param {string} path
	 */
	constructor(name, path)
	{
		this.name = name;
		this.path = path;

		/** @type {string | null} */
		this.execution = null;
	}
	
	
	/**
	 * @param {Execution[]} executions
	 * @returns {ChildProcessWithoutNullStreams}
	 */
	getProcess(executions)
	{
		return executions.find((exec) => exec.id === this.execution).process;
	}
	
	/**
	 * @param {Execution[]} executions
	 * @param {ChildProcessWithoutNullStreams} process
	 * @returns {void}
	 */
	setProcess(executions, process)
	{
		let exec = new Execution(process);
		
		executions.push(exec);
		
		this.execution = exec.id;
	}
	
	/**
	 * Note this doesn't kill the process, it simply removes it from memory
	 * @param {Execution[]} executions
	 * @returns {void}
	 */
	freeProcess(executions)
	{
		executions.splice(executions.findIndex((exec) => exec.id === this.execution), 1);
		
		this.execution = null;
	}
}

exports.Execution = Execution;
exports.Script = Script;