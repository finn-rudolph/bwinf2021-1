import {
	shiftHorizontal,
	convertInput,
	convertOutput,
	locateObstructing,
	determineBest
} from "./calculations.ts";

const szenarios = 6;

for (let i = 0; i < szenarios; i++) {
	console.log(`Parkplatz ${i}
	`);
	const [verticalCars, horizontalCars] = await convertInput(
		`schiebeparkplatz/beispiele/parkplatz${i}.txt`
	);

	verticalCars.forEach((verticalCar, carIndex) => {
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
		const shiftInstructions = convertOutput(verticalCar, bestShiftSteps);
		console.log(`	${shiftInstructions}`);
	});

	console.log(`
	`);
}
