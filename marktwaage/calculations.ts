import { weightCombination } from "./types.ts";

export const findCombination = (
	weights: Array<number>,
	target: number
): weightCombination => {
	const table: Array<Array<Array<number>>> = new Array(weights.length + 1)
		.fill(0)
		.map(() =>
			new Array(target + weights[weights.length - 1] + 1)
				.fill(0)
				.map(() => new Array(weights.length + 1).fill(0))
		);

	// Seed: target 0 is reachable with 0 weights taken
	table[weights.length][0][0] = 1;

	for (let i = weights.length - 1; i >= 0; i--) {
		const weight = weights[i];
		for (let j = 0; j <= target + weights[weights.length - 1]; j++) {
			for (let k = 0; k <= weights.length; k++) {
				const max =
					j >= weight &&
					k > 0 &&
					j - weight < target + weights[weights.length - 1] + 1
						? Math.max(
								table[i + 1][j - weight][k - 1],
								table[i + 1][j][k]
						  )
						: table[i + 1][j][k];
				table[i][j][k] += max;
			}
		}
	}

	const usedWeights = searchTable(target, weights, table);
	return usedWeights === undefined
		? {
				diff: NaN,
				usedWeights: []
		  }
		: { diff: 0, usedWeights: usedWeights };
};

const searchTable = (
	target: number,
	weights: Array<number>,
	table: Array<Array<Array<number>>>
): Array<number> | undefined => {
	if (target === 0) return [];

	for (let i = table.length - 1; i >= 0; i--) {
		for (let k = 0; k < table[i][target].length; k++) {
			if (table[i][target][k] === 1) {
				const next = searchTable(target - weights[i], weights, table);
				return next === undefined ? next : [...next, weights[i]];
			}
		}
	}
	return undefined;
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
