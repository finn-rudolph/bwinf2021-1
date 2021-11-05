import { weightCombination, weightMemo } from "./types.ts";

export const nearestCombinations = (weights: Array<number>) => {
	const combinationsTable: Array<Array<Array<number>>> = Array(
		weights[weights.length]
	)
		.fill(undefined)
		.map(() => []);

	combinationsTable[0] = [[]];

	fillTable(combinationsTable, weights);
	console.log(combinationsTable);
};

const fillTable = (
	table: Array<Array<Array<number>>>,
	weights: Array<number>,
	startIndex = 0,
	currentCombination: Array<number> = []
) => {
	for (let delta = 0; delta < weights.length; delta++) {
		const nextCombination = [...currentCombination, weights[delta]];
		const nextWeights = [...weights].splice(delta, 1);

		if (startIndex + delta <= 10000 + weights[weights.length - 1])
			fillTable(table, nextWeights, startIndex + delta, nextCombination);
		if (startIndex - delta >= 0)
			fillTable(table, nextWeights, startIndex - delta, nextCombination);
	}
};

const determineBest = (
	...combinations: Array<weightCombination>
): weightCombination => {
	return combinations.sort((a, b) => {
		// Make negative values positive for comparison
		a.diff = a.diff < 0 ? a.diff * -1 : a.diff;
		b.diff = b.diff < 0 ? b.diff * -1 : b.diff;

		if (a.diff === b.diff)
			return a.usedWeights.length - b.usedWeights.length;
		return a.diff - b.diff;
	})[0];
};

export const convertInput = (textFile: string): Array<number> => {
	const [_weightsAmount, ...weightDescriptions] = textFile.split(/\r\n|\n/);

	// Array.map() is not possible due to different Array lengths
	let weights: Array<number> = [];

	for (const weightDescription of weightDescriptions) {
		const [weight, amount] = weightDescription.split(" ");

		for (let i = 0; i < Number(amount); i++) {
			weights = [...weights, Number(weight)];
		}
	}
	return weights;
};

export const convertOutput = (
	target: number,
	combination: weightCombination
): string => {
	const left = combination.usedWeights.filter((weight) => weight > 0);
	const right = combination.usedWeights
		.filter((weight) => weight < 0)
		.map((weight) => -weight);

	if (combination.diff === 0) {
		return `${target}g: Ausgleich möglich!	
	Links: ${left.join(", ")}
	Rechts: ${right.join(", ")}
	`;
	}

	return `${target}g: Ausgleich nicht möglich.
	Differenz: ${combination.diff}
	Links: ${left.join(", ")}
	Rechts: ${right.join(", ")}
	`;
};
