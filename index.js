const { app, BrowserWindow, ipcMain, dialog } = require('electron');

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

	mainWindow.loadFile(path.join(__dirname, "public/index.html"));
	
	//#region Setup Types

	const { Script } = require("./src/class");

	/**
	 * @typedef Config
	 * @type {Object}
	 * @property {string} directoryPath Path to the directory containing the scripts
	 * @property {string} autohotkeyPath Path to the autohotkey executable
	 */

	//#endregion

	/**@type { Config }*/
	let config = {};

	/**@type { Script[] } */
	let scripts = [];

	function writeConfig()
	{
		fs.writeFileSync("config.json", JSON.stringify(config, null, 4), { encoding: "ascii" });
	}

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
			autohotkeyPath: "C:/Program Files/AutoHotkey/AutoHotkey.exe"
		};

		writeConfig();
	}
	else
	{
		config = JSON.parse(fs.readFileSync("config.json", { encoding: "ascii" }));

		if(fs.existsSync(config.directoryPath))
		{
			getScripts();

			mainWindow.webContents.send("setScripts", scripts);
		}
	}

	//#endregion



	ipcMain.on("getPathDir",
		async (event) =>
		{
			let pathRequest = await dialog.showOpenDialog(
				{
					properties: ["openDirectory"]
				}
			);

			if(pathRequest.canceled) return;

			config.directoryPath = pathRequest.filePaths[0];

			event.sender.send("setPathDir", [config.directoryPath]);

			writeConfig();

			// Get scripts

			getScripts();

			event.sender.send("setScripts", scripts);
		}
	);
	
	ipcMain.on("setPathDir",
		(event, [ _path ]) =>
		{
			if(!fs.existsSync(_path))
			{
				event.sender.send("pathDirError");
				
				return;
			}
			
			config.directoryPath = _path;
			
			writeConfig();
			
			getScripts();
			
			event.sender.send("setScripts", scripts);
		}
	);
	
}

app.whenReady().then(createWindow);