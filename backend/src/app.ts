import Duxcore from './Duxcore';
import jwt from "jsonwebtoken";

const app = new Duxcore();

app.start().then(async() => {
	console.log("Duxcore Backend Started.");
})