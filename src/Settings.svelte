<script>
	const { ipcRenderer } = require("electron");
	
	export let inFocus = false;
	
	/**@type {string}*/
	let directoryPath = "";
	
	let directoryPathInput = "";
	
	$: 
	{
		directoryPath = directoryPathInput;
		
		ipcRenderer.send("setPathDir", [ directoryPathInput ]);
	}
	
	async function getDirectory()
	{
		ipcRenderer.send("getPathDir");
	}
	
	ipcRenderer.on("setPathDir",
		(event, [_path]) =>
		{
			directoryPath = _path;
			
			directoryPathInput = _path;
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
	
	.pathInput{
		width: min(80%, 30em);
	}
</style>

{#if inFocus}
	<div class="settings">
		<button on:click={getDirectory}>Choose a directory</button>
		<input type="text" id="directoryInput" class="pathInput" bind:value={directoryPathInput}>
	</div>
{/if}