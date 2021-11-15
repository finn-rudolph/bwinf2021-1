import {
	convertInput,
	convertOutput,
	greedySearch,
	unevenSearch,
	isUneven
} from "./calculations.ts";

const szenarios = 7;

for (let i = 6; i < 7; i++) {
	const usableWeights = convertInput(
		await Deno.readTextFile(`marktwaage/beispiele/gewichtsstuecke${i}.txt`)
	);

	console.log(`Gewichtssatz ${i}
	`);
	if (isUneven(usableWeights)) {
		const combinations = unevenSearch(usableWeights);
		combinations.forEach((combination, i) =>
			console.log(convertOutput(i * 10, combination))
		);
	} else
		for (let target = 10; target < 10010; target += 10) {
			const bestCombination = greedySearch(target, usableWeights);
			console.log(convertOutput(target, bestCombination));
		}
}
