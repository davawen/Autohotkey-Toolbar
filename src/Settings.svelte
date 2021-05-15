<script>
	const { ipcRenderer } = require("electron");
	
	export let inFocus = false;
	
	let directoryPath = "";
	let autohotkeyPath = "";
	let editorPath = "";
	
	// Ping value on startup
	ipcRenderer.send("getPathDir");
	ipcRenderer.send("getAutohotkeyPath")
	ipcRenderer.send("getEditorPath");
	
	ipcRenderer.on("setPathDir",
		(event, [_path]) =>
		{
			directoryPath = _path;
		}
	);
	
	ipcRenderer.on("setAutohotkeyPath",
		(event, [ _path ]) =>
		{
			autohotkeyPath = _path;
		}
	);
	
	ipcRenderer.on("setEditorPath",
		(event, [ _path ]) =>
		{
			editorPath = _path;
		}
	);
</script>

<style>
	.settings{
		display: block;
		
		z-index: 1;
		
		background-color: #EEE;
		border: 1px solid #DDD;
		box-shadow: 0 4px 8px 0 #00000020;
		
		position: fixed;
		
		width: 80%;
		height: 80%;
		
		left: 50%;
		transform: translateX(-50%);
		
		margin: 0;
		
		
		text-align: left;
		
		padding: 1em;
	}
	
	.settings div{
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
	
	.settings div *{
		display: inline-block;
	}
	
	.path{
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
</style>

{#if inFocus}
	<div class="settings">
		
		<div>
			<button on:click={() => { ipcRenderer.send("updatePathDir"); }}>Choose scripts directory</button>
			<p class="path">{directoryPath}</p>
		</div>
		
		<div>
			<button on:click={() => { ipcRenderer.send("updateEditorPath"); }}>Choose editor executable</button>
			<p class="path">{editorPath}</p>
		</div>
		
		<div>
			<button on:click={() => { ipcRenderer.send("updateAutohotkeyPath"); }}>Link autohotkey executable</button>
			<p class="path">{autohotkeyPath}</p>
		</div>
	</div>
{/if}