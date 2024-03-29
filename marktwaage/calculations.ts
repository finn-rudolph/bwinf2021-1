export const createTable = (
	weights: Array<number>,
	maxTarget = 10000
): Array<Set<number>> => {
	const table: Array<Set<number>> = new Array(weights.length + 1)
		.fill(0)
		.map(() => new Set());

	// Seed: target 0 is reachable with 0 weights available
	table[weights.length].add(0);
	const maxWeight = weights[weights.length - 1];

	for (let i = weights.length - 1; i >= 0; i--) {
		const weight = weights[i];
		for (const v of table[i + 1].values()) {
			table[i].add(v);

			if (v + weight > 0 && v + weight < maxTarget + maxWeight)
				table[i].add(v + weight);
		}
	}
	return table;
};

export const findNearest = (
	target: number,
	usableWeights: Array<number>,
	table: Array<Set<number>>
): [number, Array<number>] | undefined => {
	for (let d = 0; d < target; d++) {
		const higher = searchTable(target + d, usableWeights, table);
		const lower = searchTable(target - d, usableWeights, table);

		if (higher !== undefined || lower !== undefined) {
			return [d, higher !== undefined ? higher : lower!];
		}
	}
};

const searchTable = (
	target: number,
	weights: Array<number>,
	table: Array<Set<number>>
): Array<number> | undefined => {
	if (target === 0) return [];

	for (let i = table.length - 1; i >= 0; i--) {
		if (table[i].has(target)) {
			const next = searchTable(target - weights[i], weights, table);
			return next === undefined ? next : [...next, weights[i]];
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
	diff: number,
	usedWeights: Array<number>
): string => {
	const right = usedWeights.filter((weight) => weight > 0);
	const left = usedWeights
		.filter((weight) => weight < 0)
		.map((weight) => -weight);

	if (diff === 0) {
		return `${target}g: Ausgleich möglich!	
	Links: ${left.join(", ")}
	Rechts: ${right.join(", ")}
	`;
	}

	return `${target}g: Ausgleich nicht möglich.
	Differenz: ${diff}
	Links: ${left.join(", ")}
	Rechts: ${right.join(", ")}
	`;
};
