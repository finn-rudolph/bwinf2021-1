import { weightCombination } from "./types.ts";

const calculateNearest = (
	target: number,
	weights: Array<number>
): weightCombination => {
	if (target === 0)
		return {
			diff: 0,
			usedWeights: []
		};

	if (weights.length === 0)
		return {
			diff: target,
			usedWeights: []
		};

	let bestCombination: weightCombination = {
		diff: target,
		usedWeights: []
	};

	for (const weight of weights) {
		// Make a true copy, not only a reference copy
		const shortenedWeights = [...weights];
		shortenedWeights.splice(weights.indexOf(weight), 1);

		const added = calculateNearest(target + weight, shortenedWeights);
		const subtracted = calculateNearest(target - weight, shortenedWeights);

		added.usedWeights = [...added.usedWeights, weight];
		subtracted.usedWeights = [...subtracted.usedWeights, -weight];

		// Determines the possibility with least difference to 0
		bestCombination = [bestCombination, added, subtracted].sort((a, b) => {
			// Make values positive for comparison
			a.diff = a.diff < 0 ? a.diff * -1 : a.diff;
			b.diff = b.diff < 0 ? b.diff * -1 : b.diff;

			return a.diff - b.diff;
		})[0];
	}

	return bestCombination;
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

console.log(calculateNearest(40, [10, 10, 10, 10, 10, 10, 10]));
