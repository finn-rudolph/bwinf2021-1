import {
	convertInput,
	convertOutput,
	bestTravelRoute
} from "./calculations.ts";

const szenarios = 5;

for (let i = 0; i < szenarios; i++) {
	const [travelTime, hotels] = await convertInput(
		`vollgeladen/beispiele/hotels${i + 1}.txt`
	);

	const bestRoute = bestTravelRoute(travelTime, hotels);

	const routeDescription = convertOutput(bestRoute);

	console.log(routeDescription);
}
