export type weightCombination = {
	diff: number;
	usedWeights: Array<number>;
};

export type weightMemo = {
	[key: string]: weightCombination;
};

export type moduloSum = {
	sum: number;
	numbers: Array<number>;
};
