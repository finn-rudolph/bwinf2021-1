import {
	calculateNearest,
	convertInput,
	convertOutput
} from "./calculations.ts";

const szenarios = 6;

for (let i = 0; i < 1; i++) {
	const inputWeights = await convertInput(
		`marktwaage/beispiele/gewichtsstuecke${i}.txt`
	);

	for (let j = 10; j < 10010; j += 10) {
		const bestCombination = calculateNearest(j, inputWeights);
		console.log(convertOutput(j, bestCombination));
	}
}
