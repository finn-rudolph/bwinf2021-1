import {
	nearestCombination,
	convertInput,
	convertOutput
} from "./calculations.ts";

const szenarios = 7;

for (let i = 0; i < szenarios; i++) {
	const usableWeights = await convertInput(
		`marktwaage/beispiele/gewichtsstuecke${i}.txt`
	);

	console.log(`Gewichtssatz ${i}
	`);
	for (let target = 10; target < 10010; target += 10) {
		const bestCombination = nearestCombination(target, usableWeights);
		console.log(convertOutput(target, bestCombination));
	}
}
