import { horizontalCar, shiftStep } from "./types.ts";
import { alphabet } from "./alphabet.ts";

export const shiftHorizontal = (
	minShifts: number,
	direction: number, // -1: left, 1: right
	currentCar: horizontalCar,
	horizontalCars: Array<horizontalCar>
): Array<shiftStep> | undefined => {
	if (minShifts <= 0) return [];
	if (currentCar.name === "wall") return undefined;

	const nextCar =
		horizontalCars[horizontalCars.indexOf(currentCar) + direction];

	const distance =
		direction === -1
			? currentCar.position - (nextCar.position + 2)
			: nextCar.position - (currentCar.position + 2);

	const furtherShifts = shiftHorizontal(
		minShifts - distance,
		direction,
		nextCar,
		horizontalCars
	);

	if (furtherShifts === undefined) return undefined;

	const currentShift: shiftStep = {
		carLetter: currentCar.name,
		direction: direction,
		positions: minShifts
	};

	return [...furtherShifts, currentShift];
};

export const convertInput = async (
	path: string
): Promise<[Array<string>, Array<horizontalCar>]> => {
	const textFile = await Deno.readTextFile(path);
	const [verticalDescription, _horizontalAmount, ...horizontalDescriptions] =
		textFile.split(/\r\n|\n/);

	// Make a true copy, not only a reference copy
	const verticalCars = [...alphabet];
	verticalCars.splice(verticalCars.indexOf(verticalDescription[2]) + 1);

	const horizontalCars: Array<horizontalCar> = horizontalDescriptions.map(
		(carDescription) => {
			const [letter, position] = carDescription.split(" ");
			return {
				name: letter,
				position: Number(position)
			};
		}
	);

	return [
		verticalCars,
		[
			{ name: "wall", position: -2 },
			...horizontalCars,
			{ name: "wall", position: verticalCars.length }
		]
	];
};

export const convertOutput = (
	verticalCar: string,
	steps: Array<shiftStep> | undefined
): string => {
	let shiftInstructions = `${verticalCar}:`;

	if (steps === undefined)
		return shiftInstructions + " Ausparken nicht möglich";

	// No Comma for the first shift --> control variable i needed --> classic for-loop
	for (let i = 0; i < steps.length; i++) {
		const direction = steps[i].direction === -1 ? "links" : "rechts";
		i === 0
			? (shiftInstructions += ` ${steps[i].carLetter} ${steps[i].positions} ${direction}`)
			: (shiftInstructions += `, ${steps[i].carLetter} ${steps[i].positions} ${direction}`);
	}

	return shiftInstructions;
};

export const locateObstructing = (
	carIndex: number,
	horizontalCars: Array<horizontalCar>
): horizontalCar | undefined => {
	for (let i = 0; horizontalCars[i].position - 1 < carIndex; i++) {
		if (
			horizontalCars[i].position === carIndex ||
			horizontalCars[i].position + 1 === carIndex
		)
			return horizontalCars[i];
	}
	return undefined;
};

/* Criteria:
	1. existence
	2. fewest cars shifted
	3. fewest positions shifted
*/
export const determineBest = (
	shiftStepsLeft: Array<shiftStep> | undefined,
	shiftStepsRight: Array<shiftStep> | undefined
): Array<shiftStep> | undefined => {
	if (shiftStepsLeft === undefined) return shiftStepsRight;
	if (shiftStepsRight === undefined) return shiftStepsLeft;

	if (
		shiftStepsLeft.length === shiftStepsRight.length &&
		shiftStepsLeft.length !== 0
	)
		return shiftStepsLeft
			.map((step) => step.positions)
			.reduce((acc, current) => acc + current) <
			shiftStepsRight
				.map((step) => step.positions)
				.reduce((acc, current) => acc + current)
			? shiftStepsLeft
			: shiftStepsRight;

	return shiftStepsLeft.length < shiftStepsRight.length
		? shiftStepsLeft
		: shiftStepsRight;
};
