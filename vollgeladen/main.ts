import {
	convertInput,
	convertOutput,
	bestTravelRoute,
	filterHotels
} from "./calculations.ts";

const szenarios = 5;

for (let i = 0; i < szenarios; i++) {
	const [travelTime, hotels] = await convertInput(
		`vollgeladen/beispiele/hotels${i + 1}.txt`
	);

	const filteredHotels = filterHotels(travelTime, hotels);

	const bestRoute = bestTravelRoute(travelTime, filteredHotels);

	const routeDescription = convertOutput(bestRoute);

	console.log(`Hotels ${i + 1}
	`);
	console.log(routeDescription);
	console.log(`
	`);
}
