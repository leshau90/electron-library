import App from './App.svelte';
import svelte from 'svelte/compiler';


const app = new App({
	target: document.body	
});

console.log(`SVELTE version  ${svelte.VERSION}`)

export default app;
