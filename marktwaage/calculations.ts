import { weightCombination, weightMemo } from "./types.ts";

export const greedySearch = (
	target: number,
	usableWeights: Array<number>,
	memo: weightMemo = {}
): weightCombination => {
	if (target === 0 || usableWeights.length === 0)
		return {
			diff: target,
			usedWeights: []
		};

	const memoKey = `${target}:${usableWeights.toString()}`;
	if (memoKey in memo) return memo[memoKey];

	const subtracting = target >= 0;

	const diffs = usableWeights
		.map((weight) => (subtracting ? target - weight : target + weight))
		.sort((a, b) =>
			a < 0 ? (b < 0 ? -a - -b : -a - b) : b < 0 ? a - -b : a - b
		);
	let best: weightCombination = {
		diff: target,
		usedWeights: []
	};

	for (let i = 0; i < diffs.length; i++) {
		const weight = subtracting ? target - diffs[i] : diffs[i] - target;
		const shortenedWeights = [...usableWeights];
		shortenedWeights.splice(usableWeights.indexOf(weight), 1);

		const next = greedySearch(diffs[i], shortenedWeights, memo);
		next.usedWeights.push(subtracting ? -weight : weight);

		best = determineBest(best, next);
		if (best.diff === 0) return (memo[memoKey] = best);
	}

	return (memo[memoKey] = best);
};

const determineBest = (
	...combinations: Array<weightCombination>
): weightCombination => {
	return combinations.sort((a, b) => {
		// Make negative values positive for comparison
		a.diff = a.diff < 0 ? -a.diff : a.diff;
		b.diff = b.diff < 0 ? -b.diff : b.diff;

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
