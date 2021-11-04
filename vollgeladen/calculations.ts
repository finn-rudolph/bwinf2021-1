import { hotelInformation, route } from "./types.ts";

export const bestRoute = (
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
			let delta = 1;
			hotels[i + delta] !== undefined &&
			hotels[i + delta].timestamp <= hotels[i].timestamp + 360;
			delta++
		) {
			for (let routeI = 0; routeI < hotelsTable[i].length; routeI++) {
				const newRoute: route = {
					lowestRating:
						hotels[i].rating < hotelsTable[i][routeI].lowestRating
							? hotels[i].rating
							: hotelsTable[i][routeI].lowestRating,
					intermediateStops: [
						...hotelsTable[i][routeI].intermediateStops,
						hotels[i]
					]
				};

				if (
					(travelTime - hotels[i + delta].timestamp) /
						(4 - hotelsTable[i][routeI].intermediateStops.length) <=
					360
				)
					hotelsTable[i + delta] = substituteRoutes(
						newRoute,
						hotelsTable[i + delta]
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

export const convertInput = (
	textFile: string
): [travelTime: number, hotels: Array<hotelInformation>] => {
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
	travelRoute === undefined
		? "	Erreichen des Ziels unmöglich"
		: travelRoute.intermediateStops
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

		for (
			let delta = 0;
			hotels[index + delta] !== undefined &&
			hotels[index + delta].timestamp === hotel.timestamp;
			delta++
		) {
			if (hotel.rating < hotels[index + delta].rating) return false;
		}
		for (
			let delta = 0;
			hotels[index - delta] !== undefined &&
			hotels[index - delta].timestamp === hotel.timestamp;
			delta++
		) {
			if (hotel.rating < hotels[index - delta].rating) return false;
		}
		return true;
	});
