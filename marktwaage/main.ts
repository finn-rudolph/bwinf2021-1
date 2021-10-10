import { weightCombination, weightMemo } from "./types.ts";

const calculateNearest = (
	target: number,
	weights: Array<number>,
	memo: weightMemo = {},
	usedWeights: Array<number> = []
): weightCombination => {
	if (target === 0)
		return {
			diff: 0,
			usedWeights: usedWeights
		};
	if (weights.length === 0)
		return {
			diff: target,
			usedWeights: usedWeights
		};
	const memoKey = `${target}:${weights.toString()}`;
	if (memoKey in memo) return memo[`${target}:${weights.toString()}`];

	let bestCombination: weightCombination = {
		diff: target,
		usedWeights: []
	};

	for (const weight of weights) {
		// Make a true copy, not only a reference copy
		const shortenedWeights = [...weights];
		shortenedWeights.splice(weights.indexOf(weight), 1);

		let added: weightCombination = {
			diff: target,
			usedWeights: []
		};
		let subtracted: weightCombination = {
			diff: target,
			usedWeights: []
		};

		// Ensure weights of equal size only to be on one side
		if (!usedWeights.includes(-weight)) {
			added = calculateNearest(target + weight, shortenedWeights, memo, [
				...usedWeights,
				weight
			]);
		}
		if (!usedWeights.includes(weight)) {
			subtracted = calculateNearest(
				target - weight,
				shortenedWeights,
				memo,
				[...usedWeights, -weight]
			);
		}

		bestCombination = determineBest([bestCombination, added, subtracted]);

		// Early return if a matching combination is found
		if (bestCombination.diff === 0) {
			memo[memoKey] = bestCombination;
			return bestCombination;
		}
	}
	memo[memoKey] = bestCombination;
	return bestCombination;
};

const determineBest = (
	combinations: Array<weightCombination>
): weightCombination => {
	return combinations.sort((a, b) => {
		// Make values positive for comparison
		a.diff = a.diff < 0 ? a.diff * -1 : a.diff;
		b.diff = b.diff < 0 ? b.diff * -1 : b.diff;

		if (a.diff === b.diff)
			return a.usedWeights.length - b.usedWeights.length;
		return a.diff - b.diff;
	})[0];
};

console.log(
	calculateNearest(
		50,
		[
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
		]
	)
);

console.log(
	calculateNearest(
		450,
		[
			10, 10, 10, 50, 50, 100, 100, 100, 500, 500, 500, 1000, 1000, 1000,
			5000
		]
	)
);

console.log(calculateNearest(40, [50, 10]));
