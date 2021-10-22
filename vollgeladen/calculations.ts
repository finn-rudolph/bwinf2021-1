import { hotelInformation } from "./types.ts";

export const bestTravelRoute = (
	travelTime: number,
	hotels: Array<hotelInformation>
): Array<hotelInformation> => {
	hotels = [...hotels, { timestamp: travelTime, rating: 5 }];
	const hotelsTable: Array<Array<Array<hotelInformation>>> = [
		// map() as independent Array instances are needed
		...Array(hotels.length)
			.fill(undefined)
			.map(() => [])
	];

	// Seed all from start reachable hotels
	for (let i = 0; hotels[i].timestamp <= 360; i++) {
		hotelsTable[i] = [[]];
	}

	for (let i = 0; i < hotels.length + 1; i++) {
		for (
			let j = 1;
			hotels[i + j] !== undefined &&
			hotels[i + j].timestamp <= hotels[i].timestamp + 360;
			j++
		) {
			for (let k = 0; k < hotelsTable[i].length; k++) {
				hotelsTable[i + j] = [
					...hotelsTable[i + j],
					[...hotelsTable[i][k], hotels[i]]
				];
			}
		}
	}
	return determineBest(hotelsTable[hotelsTable.length - 1]);
};

export const determineBest = (
	possibleRoutes: Array<Array<hotelInformation>>
): Array<hotelInformation> => {
	const worstRatings = possibleRoutes.map((route) => {
		return route
			.map((hotel) => hotel.rating)
			.reduce((worstRating, currentRating) =>
				currentRating < worstRating ? currentRating : worstRating
			);
	});

	const bestIndex = worstRatings.reduce(
		(bestIndex, currentRating, currentIndex) =>
			currentRating > worstRatings[bestIndex] ? currentIndex : bestIndex,
		0
	);

	return possibleRoutes[bestIndex];
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

export const convertOutput = (travelRoute: Array<hotelInformation>): string =>
	travelRoute
		.map((hotel) => `${hotel.timestamp}	|	${hotel.rating}`)
		.reduce(
			(acc, hotel) =>
				(acc = `${acc}
	${hotel}`),
			`	Minute 	|	Bewertung
	-------------------------`
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
