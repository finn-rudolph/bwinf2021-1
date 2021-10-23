export type hotelInformation = {
	timestamp: number;
	rating: number;
};

export type route = {
	lowestRating: number;
	intermediateStops: Array<hotelInformation>;
};
