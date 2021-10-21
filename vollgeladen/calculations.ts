import { hotelInformation } from "./types.ts";

export const bestTravelRoute = (
	travelTime: number,
	hotels: Array<hotelInformation>
): Array<Array<hotelInformation>> => {
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
	return hotelsTable[hotelsTable.length - 1];
};
