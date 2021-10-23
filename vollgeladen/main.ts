import {
	convertInput,
	convertOutput,
	bestTravelRoute,
	filterHotels
} from "./calculations.ts";

const szenarios = 7;

for (let i = 0; i < szenarios; i++) {
	const [travelTime, hotels] = await convertInput(
		`vollgeladen/beispiele/hotels${i}.txt`
	);

	const filteredHotels = filterHotels(travelTime, hotels);

	const bestRoute = bestTravelRoute(travelTime, filteredHotels);

	const routeDescription = convertOutput(bestRoute);

	console.log(`Hotels ${i}
	`);
	console.log(routeDescription);
	console.log(`
	`);
}
