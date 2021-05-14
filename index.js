const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const path = require("path");
const fs = require("fs");

if(!fs.existsSync("config.json"))
{
	const config = 
	{
		directoryPath: ""
	}
}

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
}

app.whenReady().then(createWindow);

try
{
	require("electron-reloader")(module);
}
catch(_){}

let directoryPath = "";

ipcMain.on("getPathDir",
	async (event) =>
	{
		let pathRequest = await dialog.showOpenDialog(
			{
				properties: ["openDirectory"]
			}
		);
		
		if(pathRequest.canceled) return;
		
		directoryPath = pathRequest.filePaths[0];
		
		event.sender.send("setPathDir", [directoryPath]);
	}
);