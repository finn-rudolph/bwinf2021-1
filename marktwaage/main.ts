import {
	convertInput,
	convertOutput,
	findCombination
} from "./calculations.ts";

const szenarios = 7;

for (let i = 0; i < szenarios; i++) {
	const usableWeights = convertInput(
		await Deno.readTextFile(`marktwaage/beispiele/gewichtsstuecke${i}.txt`)
	);

	console.log(`Gewichtssatz ${i}
	`);
	for (let target = 10; target < 10010; target += 10) {
		const bestCombination = findCombination(
			[...usableWeights.map((n) => -n), ...usableWeights],
			target
		);
		console.log(convertOutput(target, bestCombination));
	}
}
