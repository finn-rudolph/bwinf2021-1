import {
	convertInput,
	convertOutput,
	bestRoute,
	filterHotels
} from "./calculations.ts";

const szenarios = 8;

for (let i = 0; i < szenarios; i++) {
	const [travelTime, hotels] = convertInput(
		await Deno.readTextFile(`vollgeladen/beispiele/hotels${i}.txt`)
	);

	const filteredHotels = filterHotels(travelTime, hotels);

	const route = bestRoute(travelTime, filteredHotels);

	const routeDescription = convertOutput(route);

	console.log(`Hotels ${i}
	`);
	console.log(routeDescription);
	console.log(`
	`);
}
