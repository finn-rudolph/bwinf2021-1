import { horizontalCar, shiftStep } from "./types.ts";
import { alphabet } from "./alphabet.ts";

export const shiftHorizontal = (
	neededShifts: number,
	direction: number, // -1: left, 1: right
	currentCar: horizontalCar,
	horizontalCars: Array<horizontalCar>
): Array<shiftStep> | undefined => {
	if (neededShifts <= 0) return [];
	if (currentCar.name === "wall") return undefined;

	const nextCar =
		horizontalCars[horizontalCars.indexOf(currentCar) + direction];

	const distance =
		direction === -1
			? currentCar.position - (nextCar.position + 2)
			: nextCar.position - (currentCar.position + 2);

	const furtherShifts = shiftHorizontal(
		neededShifts - distance,
		direction,
		nextCar,
		horizontalCars
	);

	if (furtherShifts === undefined) return undefined;

	const currentShift: shiftStep = {
		carLetter: currentCar.name,
		direction: direction,
		positions: neededShifts
	};

	return [...furtherShifts, currentShift];
};

export const convertInput = (
	textFile: string
): [Array<string>, Array<horizontalCar>] => {
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
	if (steps === undefined) return verticalCar + ": Ausparken nicht möglich";

	const shiftInstructions: string = steps
		.map((step, index) => {
			const direction = step.direction === -1 ? "links" : "rechts";
			return index === 0
				? `${step.carLetter} ${step.positions} ${direction}`
				: `, ${step.carLetter} ${step.positions} ${direction}`;
		})
		.join("");

	return `${verticalCar}: ${shiftInstructions}`;
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
