import {
	weightCombination,
	weightMemo,
	moduloSum,
	weightsMap
} from "./types.ts";

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

		best = determineBest(best, next);

		if (best.diff === 0) {
			best.usedWeights.push(subtracting ? -weight : weight);
			return (memo[memoKey] = best);
		}
	}
	return (memo[memoKey] = best);
};

const determineBest = (
	a: weightCombination,
	b: weightCombination
): weightCombination => {
	// Make negative values positive for comparison
	const aD = a.diff < 0 ? -a.diff : a.diff;
	const bD = b.diff < 0 ? -b.diff : b.diff;

	if (aD === bD) return a.usedWeights.length < b.usedWeights.length ? a : b;
	return aD < bD ? a : b;
};

export const unevenSearch = (
	weights: Array<number>
): Array<weightCombination> => {
	const evenCombinations = sumsModulo10(weights.map((weight) => weight % 10));
	console.log(evenCombinations);

	const map: weightsMap = {};

	for (let i = 0; i < evenCombinations.length; i++) {
		const usedWeights = evenCombinations[i].map((i) =>
			i < 0 ? -weights[-i] : weights[i]
		);

		const sum = usedWeights.reduce((sum, weight) => sum + weight);

		console.log(sum, usedWeights);

		if (sum > 0 && (!(sum in map) || map[sum].length > usedWeights.length))
			map[sum] = usedWeights;
	}

	const combinations: Array<weightCombination> = [];

	for (let i = 10; i < 10010; i += 10) {
		if (i in map) combinations[i / 10] = { diff: 0, usedWeights: map[i] };
		else {
			const closestCombination = Number(
				Object.keys(map).reduce((closest, current) =>
					Math.abs(Number(current) - i) <
					Math.abs(Number(closest) - i)
						? current
						: closest
				)
			);
			2;
			combinations[i / 10] = {
				diff: Math.abs(i - closestCombination),
				usedWeights: map[closestCombination]
			};
		}
	}
	return combinations;
};

const sumsModulo10 = (array: Array<number>): Array<Array<number>> => {
	const counts: { [key: number]: number } = {};

	for (let i = 0; i < array.length; i++) {
		if (!(array[i] in counts)) counts[array[i]] = 1;
		else counts[array[i]] += 1;
	}

	const sums: Array<Array<moduloSum>> = new Array(10)
		.fill(undefined)
		.map(() => []);

	for (let i = 0; i < array.length; i++) {
		const remainder = array[i] % 10;

		for (let d = 0; d < 10; d++)
			if (sums[d].length !== 0) {
				const positiveD = (remainder + d) % 10;
				const negativeD = (10 - remainder + d) % 10;

				for (let k = 0; k < sums[d].length; k++) {
					sums[d][k].numbers = sums[d][k].numbers.sort();
					if (
						sums[d][k].numbers.indexOf(array[i]) === -1 ||
						sums[d][k].numbers.lastIndexOf(array[i]) -
							sums[d][k].numbers.indexOf(array[i]) +
							1 <
							counts[array[i]]
					) {
						if (sums[d][k].indices.indexOf(-i) === -1)
							sums[positiveD].push({
								sum: sums[d][k].sum + array[i],
								numbers: [...sums[d][k].numbers, array[i]],
								indices: [...sums[d][k].indices, i]
							});
						if (sums[d][k].indices.indexOf(i) === -1)
							sums[negativeD].push({
								sum: sums[d][k].sum - array[i],
								numbers: [...sums[d][k].numbers, array[i]],
								indices: [...sums[d][k].indices, -i]
							});
					}
				}
			}

		if (sums[remainder].length === 0)
			sums[remainder].push({
				sum: array[i],
				numbers: [array[i]],
				indices: [i]
			});
	}
	return sums[0].map((sum) => sum.indices);
};

export const isUneven = (weights: Array<number>): boolean => {
	let unevenCount = 0;
	for (let i = 0; i < weights.length; i++) {
		if (weights[i] % 10 !== 0) unevenCount++;
	}
	return unevenCount > weights.length / 2;
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
