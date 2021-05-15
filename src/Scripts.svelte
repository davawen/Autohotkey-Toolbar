<script>
	import { Script } from './class';
	
	/**@type {Script}*/
	export let script;
	
	import { createEventDispatcher } from "svelte";
	
	const dispatch = createEventDispatcher();
	function dispatchScriptCommand(buttonEvent)
	{
		dispatch("scriptCommand",
			{
				scriptName: script.name,
				buttonEvent: buttonEvent
			}
		);
	}
	
	function askDeleteConfirmation()
	{
		if(window.confirm(`Are you sure you want to delete ${script.name}?`))
		{
			dispatchScriptCommand("delete");
		}
	}
	
</script>

<style>
.wrapper{
	position: relative;
	
	padding: 10px 5px;
	
	border: 1px solid #0001;
}
	
.scriptContainer{
	display: flex;
	flex-direction: row;
	
	align-items: center;
	justify-content: center;
}
	
.buttons{
	width: 100%;
	
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	justify-content: first baseline;
}	

.buttons button{
	display: inline-block;
	
	margin: auto 5px;
}

.script{
	
	width: 100%;
	
	display: inline-block;
}

img{
	position: absolute;
	
	width: 1em;
	height: 1em;
	
	top: 2px;
	right: 2px;
}

</style>

<div class="wrapper">
	<div class="scriptContainer">
		<div class="buttons">
			<button on:click={() => { dispatchScriptCommand("start") }}>Start</button>
			<button on:click={() => { dispatchScriptCommand("stop") }}>Stop</button>
			<button on:click={() => { dispatchScriptCommand("edit") }}>Edit</button>
			<button on:click={askDeleteConfirmation}>Delete</button>
		</div>
	
		<div class="script">
			{script.name}
		</div>
	</div>
	<img src={script.execution === null ? "./icons/redCircle.svg" : "./icons/greenCircle.svg"} alt="" style="fill: green;" />
</div>