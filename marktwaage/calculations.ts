import { weightCombination, weightMemo } from "./types.ts";

export const nearestCombination = (
	target: number,
	usableWeights: Array<number>,
	memo: weightMemo = {},
	usedWeights: Array<number> = []
): weightCombination => {
	if (target === 0 || usableWeights.length === 0)
		return {
			diff: target,
			usedWeights: usedWeights
		};

	const memoKey = `${target}:${usableWeights.toString()}`;
	if (memoKey in memo) return memo[memoKey];

	let bestCombination: weightCombination = {
		diff: target,
		usedWeights: []
	};

	for (const weight of usableWeights) {
		// Make a true copy, not only a reference copy
		const shortenedWeights = [...usableWeights];
		shortenedWeights.splice(usableWeights.indexOf(weight), 1);

		let added: weightCombination = {
			diff: target,
			usedWeights: []
		};
		let subtracted: weightCombination = {
			diff: target,
			usedWeights: []
		};

		// Ensure weights of equal size only to be on one side
		// 0 <= new target <= 10000 + biggest weight

		if (!usedWeights.includes(weight) && target - weight >= 0) {
			subtracted = nearestCombination(
				target - weight,
				shortenedWeights,
				memo,
				[...usedWeights, -weight]
			);
		}

		if (
			!usedWeights.includes(-weight) &&
			target + weight <= 10000 + usableWeights[usableWeights.length - 1]
		) {
			added = nearestCombination(
				target + weight,
				shortenedWeights,
				memo,
				[...usedWeights, weight]
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

export const convertInput = async (path: string): Promise<Array<number>> => {
	const textFile = await Deno.readTextFile(path);
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
