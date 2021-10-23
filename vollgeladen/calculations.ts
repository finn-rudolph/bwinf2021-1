import { hotelInformation, route } from "./types.ts";

export const bestTravelRoute = (
	travelTime: number,
	hotels: Array<hotelInformation>
): route => {
	hotels = [...hotels, { timestamp: travelTime, rating: 5 }];

	const hotelsTable: Array<Array<route>> = Array(hotels.length)
		// map() as independent Array instances are needed
		.fill(undefined)
		.map(() => []);

	// Seed all from start reachable hotels
	for (let i = 0; hotels[i].timestamp <= 360; i++) {
		const seedRoute: route = { lowestRating: 5, intermediateStops: [] };
		hotelsTable[i] = [seedRoute];
	}

	for (let i = 0; i < hotels.length; i++) {
		for (
			let j = 1;
			hotels[i + j] !== undefined &&
			hotels[i + j].timestamp <= hotels[i].timestamp + 360;
			j++
		) {
			for (let k = 0; k < hotelsTable[i].length; k++) {
				const newRoute: route = {
					lowestRating:
						hotels[i].rating < hotelsTable[i][k].lowestRating
							? hotels[i].rating
							: hotelsTable[i][k].lowestRating,
					intermediateStops: [
						...hotelsTable[i][k].intermediateStops,
						hotels[i]
					]
				};

				if (
					(travelTime - hotels[i + j].timestamp) /
						(4 - hotelsTable[i][k].intermediateStops.length) <=
					360
				)
					hotelsTable[i + j] = substituteRoutes(
						newRoute,
						hotelsTable[i + j]
					);
			}
		}
	}
	return determineBest(hotelsTable[hotelsTable.length - 1]);
};

const determineBest = (routes: Array<route>): route =>
	routes.sort((a, b) => b.lowestRating - a.lowestRating)[0];

const substituteRoutes = (
	route: route,
	hotelRoutes: Array<route>
): Array<route> => {
	for (let i = 0; i < hotelRoutes.length; i++) {
		if (
			route.lowestRating < hotelRoutes[i].lowestRating &&
			route.intermediateStops.length <=
				hotelRoutes[i].intermediateStops.length
		)
			return hotelRoutes;
	}
	const filteredRoutes = hotelRoutes.filter(
		(targetRoute) =>
			targetRoute.intermediateStops.length <
				route.intermediateStops.length ||
			targetRoute.lowestRating > route.lowestRating
	);

	return [...filteredRoutes, route];
};

export const convertInput = async (
	path: string
): Promise<[travelTime: number, hotels: Array<hotelInformation>]> => {
	const textFile = await Deno.readTextFile(path);

	const [_hotelsAmount, travelTime, ...hotelDescriptions] =
		textFile.split(/\r\n|\n/);

	const hotels: Array<hotelInformation> = hotelDescriptions.map(
		(hotelDescription) => {
			const [timestamp, rating] = hotelDescription.split(" ");
			return {
				timestamp: Number(timestamp),
				rating: Number(rating)
			};
		}
	);
	return [Number(travelTime), hotels];
};

export const convertOutput = (travelRoute: route): string =>
	travelRoute.intermediateStops
		.map((hotel) => `${hotel.timestamp}	|  ${hotel.rating}`)
		.reduce(
			(acc, hotel) =>
				(acc = `${acc}
	${hotel}`),
			`	Minute 	|  Bewertung
		|`
		);

export const filterHotels = (
	travelTime: number,
	hotels: Array<hotelInformation>
): Array<hotelInformation> =>
	hotels.filter((hotel, index) => {
		if (hotel.timestamp > travelTime) return false;
		if (
			(hotels[index + 1] !== undefined
				? hotel.timestamp !== hotels[index + 1].timestamp
				: true) &&
			(hotels[index - 1] !== undefined
				? hotel.timestamp !== hotels[index - 1].timestamp
				: true)
		)
			return true;

		for (
			let d = 0; // d: delta
			hotels[index + d] &&
			hotels[index + d].timestamp === hotel.timestamp;
			d++
		) {
			if (hotel.rating < hotels[index + d].rating) return false;
		}
		for (
			let d = 0;
			hotels[index - d] !== undefined &&
			hotels[index - d].timestamp === hotel.timestamp;
			d++
		) {
			if (hotel.rating < hotels[index - d].rating) return false;
		}
		return true;
	});
