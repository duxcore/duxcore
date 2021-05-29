import Duxcore from './Duxcore';

const app = new Duxcore();

app.start().then(async() => {
	console.log("Duxcore Backend Started.");
})