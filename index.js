const { app, globalShortcut, BrowserWindow, ipcMain, dialog } = require('electron');

const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process")

function createWindow()
{
	const mainWindow = new BrowserWindow(
		{
			width: 900,
			height: 700,
			webPreferences:
			{
				nodeIntegration: true,
				contextIsolation: false
			}
		}
	);

	mainWindow.setMenu(null);
	
	mainWindow.loadFile(path.join(__dirname, "public/index.html"));
	mainWindow.setIcon("./public/favicon.png")
	
	globalShortcut.register("Alt+CommandOrControl+A",
		() =>
		{
			if(mainWindow.isFocused() && mainWindow.isVisible())
			{
				mainWindow.hide();
			}
			else
			{
				mainWindow.show();
				mainWindow.focus();
			}
		}
	);

	mainWindow.focus();
	
	//#region Setup Types

	const { Script, Execution } = require("./src/class");

	/**
	 * @typedef Config
	 * @type {Object}
	 * @property {string} directoryPath Path to the directory containing the scripts
	 * @property {string} autohotkeyPath Path to the autohotkey executable
	 * @property {string} editorPath Path to the editor executable
	 */

	//#endregion

	/**@type { Config }*/
	let config = {};

	/**@type { Script[] } */
	let scripts = [];

	/**@type { Execution[] } The autohotkey processes */
	let executions = [];
	
	/**
	 * @returns {void}
	 */
	function writeConfig()
	{
		fs.writeFileSync("config.json", JSON.stringify(config, null, 4), { encoding: "ascii" });
	}
	
	/**
	 * @returns {void}
	 */
	function getScripts()
	{
		scripts = [];

		// Filter out non ahk files
		let names = fs.readdirSync(config.directoryPath).filter(name => /.*\.ahk/.test(name));

		names.forEach(
			(name) =>
			{
				scripts.push(new Script(name, path.join(config.directoryPath, name)));
			}
		);
	}
	
	if(!fs.existsSync("config.json"))
	{
		config =
		{
			directoryPath: "",
			autohotkeyPath: fs.existsSync("C:\\Program Files\\AutoHotkey\\AutoHotkey.exe") ? "C:\\Program Files\\AutoHotkey\\AutoHotkey.exe" : "",
			editorPath: fs.existsSync(`${process.env.LOCALAPPDATA}\\Programs\\Microsoft VS Code\\code.exe`) ? `${process.env.LOCALAPPDATA}\\Programs\\Microsoft VS Code\\code.exe` : "" //Use VSCode as default
		};
		
		writeConfig();
	}
	else
	{
		config = JSON.parse(fs.readFileSync("config.json", { encoding: "ascii" }));

		if(fs.existsSync(config.directoryPath))
		{
			getScripts();
		}
	}

	//#endregion



	ipcMain.on("updatePathDir",
		async (event) =>
		{
			let pathRequest = await dialog.showOpenDialog(
				{
					properties: ["openDirectory"],
					defaultPath: config.directoryPath
				}
			);

			if(pathRequest.canceled) return;

			config.directoryPath = pathRequest.filePaths[0];

			event.sender.send("setPathDir", [config.directoryPath]);

			writeConfig();

			// Get scripts

			getScripts();

			event.sender.send("setScripts", JSON.stringify(scripts));
		}
	);

	ipcMain.on("getPathDir",
		(event) =>
		{
			event.sender.send("setPathDir", [config.directoryPath]);
		}
	);
	
	ipcMain.on("updateAutohotkeyPath",
		async (event) =>
		{
			let pathRequest = await dialog.showOpenDialog(
				{
					properties: ["openFile"],
					filters: [{ name: "", extensions: ['exe'] }],
					defaultPath: config.autohotkeyPath
				}
			);
			
			if(pathRequest.canceled) return;
			
			config.autohotkeyPath = pathRequest.filePaths[0];
			
			event.sender.send("setAutohotkeyPath", [ config.autohotkeyPath ]);
			
			writeConfig();
		}
	);

	ipcMain.on("getAutohotkeyPath",
		(event) =>
		{
			event.sender.send("setAutohotkeyPath", [config.autohotkeyPath]);
		}
	);
	
	ipcMain.on("updateEditorPath",
		async (event) =>
		{
			let pathRequest = await dialog.showOpenDialog(
				{
					properties: ["openFile"],
					filters: [{ name: "", extensions: ['exe'] }],
					defaultPath: config.editorPath
				}
			);

			if(pathRequest.canceled) return;

			config.editorPath = pathRequest.filePaths[0];

			event.sender.send("setEditorPath", [config.editorPath]);

			writeConfig();
		}
	);

	ipcMain.on("getEditorPath",
		(event) =>
		{
			event.sender.send("setEditorPath", [config.editorPath]);
		}
	);
	
	ipcMain.on("getScripts",
		(event) =>
		{
			event.sender.send("setScripts", JSON.stringify(scripts));
		}
	);
	
	ipcMain.on("scriptCommand",
		(event, detail) =>
		{
			let script = scripts.find(s => s.name === detail.scriptName);
			
			if(script === undefined) return;
			
			switch(detail.buttonEvent)
			{
				case "start":
					if(script.execution !== null) script.getProcess(executions).kill();
					
					let scriptProcess = spawn(config.autohotkeyPath, [ script.path ]);
					
					script.setProcess(executions, scriptProcess);
					
					scriptProcess.on('close',
						(code) =>
						{
							script.freeProcess(executions);
							
							event.sender.send("setScripts", JSON.stringify(scripts));
						}
					);
					break;
				case "stop":
					if(script.execution === null) return;
				
					script.getProcess(executions).kill();
					break;
				case "edit":
					if(config.editorPath === "") return;
				
					spawn(config.editorPath, [ script.path ]);
						
					return;
					break;
				case "delete":
					fs.rmSync(script.path);
					
					getScripts();
					break;
			}
			
			event.sender.send("setScripts", JSON.stringify(scripts));
		}
	);
	
}

app.whenReady().then(createWindow);