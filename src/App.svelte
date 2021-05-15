<script>
	const { ipcRenderer } = require("electron");
	
	import { Script } from "./class";
	
	let settingsInFocus = false;
	
	/** @type {Script[]}*/
	let scripts = [];
	
	// Ping for scripts on startup
	ipcRenderer.send("getScripts");
	
	ipcRenderer.on("setScripts",
		(event, _scripts) =>
		{
			scripts = JSON.parse(_scripts);
		}
	);
	
	function handleScriptCommand(event)
	{
		ipcRenderer.send("scriptCommand", event.detail);
	}
	
	import ComponentScript from "./Scripts.svelte";
	import ComponentSettings from "./Settings.svelte";
</script>

<main>
	<ComponentSettings inFocus={settingsInFocus}/>
	
	<button id="settingsButton" on:click={() => {settingsInFocus = !settingsInFocus;}}><img src="./icons/settings.svg" alt="The settings button."></button>
	
	<h1>Script Hub</h1>
	
	<div class="scripts">
		{#each scripts as script}
			<ComponentScript on:scriptCommand={handleScriptCommand} script={script}/>
		{/each}
	</div>
</main>

<style>
	main {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
	
	.scripts{
		display: flex;
		
		justify-content: center; 
		flex-direction: column;
		
		margin: auto;
		width: 80vw;
		
		border: 1px solid #EEE;
		box-shadow: 0 4px 8px 0 #00000020;
	}
	
	.scripts:empty{
		border: none;
		box-shadow: none;
	}
	
	#settingsButton{
		z-index: 2;
		
		position: absolute;
		top: 10px;
		right: 10px;
		
		width: 50px;
		height: 50px;
		
		padding: 5px;
	}
	
	#settingsButton img{
		width: 40px;
		height: 40px;
	}
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>