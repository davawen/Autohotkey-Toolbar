<script>
	const { ipcRenderer } = require("electron");
	
	import { Script } from "./class";
	
	let settingsInFocus = false;
	
	function toogleSettings()
	{
		settingsInFocus = !settingsInFocus;
	}
	
	/** @type {Script[]}*/
	let scripts = [];
	
	
	ipcRenderer.on("setScripts",
		(event, _scripts) =>
		{
			scripts = _scripts;
		}
	);
	
	import ComponentScript from "./Scripts.svelte";
	import ComponentSettings from "./Settings.svelte";
</script>

<main>
	<ComponentSettings inFocus={settingsInFocus}/>
	
	<button id="settingsButton" on:click={toogleSettings}><img src="./settings.svg" alt="The settings button."></button>
	
	
	<h1>Script Hub</h1>
	
	<div class="scripts">
		{#each scripts as script}
			<ComponentScript script={script}/>
		{/each}
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
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
		
		margin-left: 50%;
		margin-right: 5px;
		
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