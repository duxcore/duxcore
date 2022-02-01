export default function randStr(length: number): string {
	let result: string[] = [];
	let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let charsLength = chars.length;

	for (let i = 0; i < length; i++) {
		result.push(chars.charAt(Math.floor(Math.random() * charsLength)));
	}

	return result.join('');
}