import { weightCombination, weightMemo, moduloSum } from "./types.ts";

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

const div10 = (array: Array<number>) => {
	const combinations: Array<Array<number>> = [];

	for (let i = 0; i < array.length; i++) {
		let remainder = array[i] % 10;
	}
};

const sumMod10 = (array: Array<number>): number => {
	let sums: Array<moduloSum> = new Array(10).fill(undefined).map(() => {
		return {
			sum: -0,
			numbers: []
		};
	});

	for (let i = 0; i < array.length; i++) {
		const remainder = array[i] % 10;
		const c = [...sums];

		for (let j = 0; j < 10; j++)
			if (sums[j].numbers.length !== 0) {
				const v = (remainder + j) % 10;
				if (sums[j].sum + array[i] > sums[v].sum) {
					c[v] = {
						sum: sums[j].sum + array[i],
						numbers: [...sums[j].numbers, array[i]]
					};
				}
			}

		if (c[remainder].numbers.length === 0)
			c[remainder] = { sum: array[i], numbers: [array[i]] };

		sums = c;
		console.log("b", sums);
	}
	console.log(sums);
	return sums[0].sum;
};

console.log(sumMod10([2, 5, 2, 1, 7, 4, 2]));

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
