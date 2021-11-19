import {
	convertInput,
	convertOutput,
	createTable,
	findNearest
} from "./calculations.ts";

const szenarios = 7;

for (let i = 0; i < szenarios; i++) {
	const usableWeights = convertInput(
		await Deno.readTextFile(`marktwaage/beispiele/gewichtsstuecke${i}.txt`)
	);

	console.log(`Gewichtssatz ${i}
	`);

	const table = createTable(usableWeights);

	for (let target = 10; target < 10010; target += 10) {
		console.log(
			convertOutput(target, ...findNearest(target, usableWeights, table)!)
		);
	}
}
