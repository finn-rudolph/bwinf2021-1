import {
	shiftHorizontal,
	convertInput,
	convertOutput,
	locateObstructing,
	determineBest
} from "./calculations.ts";

const szenarios = 9;

for (let i = 0; i < szenarios; i++) {
	console.log(`Parkplatz ${i}
	`);

	const [verticalCars, horizontalCars] = convertInput(
		await Deno.readTextFile(`schiebeparkplatz/beispiele/parkplatz${i}.txt`)
	);

	for (let carIndex = 0; carIndex < verticalCars.length; carIndex++) {
		const obstructingCar = locateObstructing(carIndex, horizontalCars);
		const shiftStepsLeft =
			obstructingCar === undefined
				? []
				: shiftHorizontal(
						obstructingCar.position - carIndex + 2,
						-1,
						obstructingCar,
						horizontalCars
				  );
		const shiftStepsRight =
			obstructingCar === undefined
				? []
				: shiftHorizontal(
						carIndex - obstructingCar.position + 1,
						1,
						obstructingCar,
						horizontalCars
				  );

		const bestShiftSteps = determineBest(shiftStepsLeft, shiftStepsRight);
		const shiftInstructions = convertOutput(
			verticalCars[carIndex],
			bestShiftSteps
		);
		console.log(`	${shiftInstructions}`);
	}

	console.log(`
	`);
}
