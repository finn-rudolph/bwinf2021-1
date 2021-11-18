import { weightCombination } from "./types.ts";

export const createTable = (
	weights: Array<number>,
	maxTarget = 10000
): Array<Map<number, Array<number>>> => {
	const table: Array<Map<number, Array<number>>> = new Array(
		weights.length + 1
	)
		.fill(0)
		.map(() => new Map());

	// Seed: target 0 is reachable with 0 weights taken and 0 weights available
	table[weights.length].set(0, [0]);
	const maxWeight = Math.max(weights[weights.length - 1]);

	for (let i = weights.length - 1; i >= 0; i--) {
		const weight = weights[i];
		for (const key of table[i + 1].keys()) {
			table[i].set(key, [...table[i + 1].get(key)!]);

			if (key + weight > 0 && key + weight < maxTarget + maxWeight) {
				if (table[i].get(key + weight) !== undefined)
					table[i]
						.get(key + weight)!
						.push(...table[i].get(key)!.map((k) => k + 1));
				else
					table[i].set(
						key + weight,
						table[i].get(key)!.map((k) => k + 1)
					);
			}
		}
	}
	return table;
};

export const searchTable = (
	target: number,
	weights: Array<number>,
	table: Array<Map<number, Array<number>>>
): Array<number> | undefined => {
	if (target === 0) return [];

	for (let i = table.length - 1; i >= 0; i--) {
		if (table[i].get(target) !== undefined) {
			const next = searchTable(target - weights[i], weights, table);
			return next === undefined ? next : [...next, -weights[i]];
		}
	}
	return undefined;
};

export const convertInput = (textFile: string): Array<number> => {
	const [_weightsAmount, ...weightDescriptions] = textFile.split(/\r\n|\n/);

	let weights: Array<number> = [];

	for (const weightDescription of weightDescriptions) {
		const [weight, amount] = weightDescription.split(" ");

		for (let i = 0; i < Number(amount); i++) {
			weights = [...weights, Number(weight)];
		}
	}
	return [...weights.map((w) => -w), ...weights];
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
