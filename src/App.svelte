<script>
	const { ipcRenderer } = require("electron");
	
	let directoryPath = "";
	
	async function handleClick()
	{
		ipcRenderer.send("getPathDir");
	}
	
	ipcRenderer.on("setPathDir",
		(event, [_path]) =>
		{
			directoryPath = _path;
		}
	);
</script>

<main>
	<h1>Hello World!</h1>
	
	{#if directoryPath==""}
		<button on:click={handleClick}>Choose path!</button>
	{:else}
		<button on:click={handleClick}>Choosend path is: {directoryPath}</button>
	{/if}
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

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>