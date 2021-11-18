import {
	convertInput,
	convertOutput,
	createTable,
	searchTable
} from "./calculations.ts";

const szenarios = 7;

for (let i = 0; i < szenarios; i++) {
	const usableWeights = convertInput(
		await Deno.readTextFile(`marktwaage/beispiele/gewichtsstuecke${i}.txt`)
	);

	console.log(`Gewichtssatz ${i}
	`);

	const table = createTable(usableWeights);

	for (let target = 10; target < 10010; target += 10) {
		// Search for the closest solution
		for (let d = 0; d < target; d++) {
			const higher = searchTable(target + d, usableWeights, table);
			const lower = searchTable(target - d, usableWeights, table);

			if (higher !== undefined || lower !== undefined) {
				console.log(
					convertOutput(target, {
						diff: d,
						usedWeights: higher !== undefined ? higher : lower!
					})
				);
				break;
			}
		}
	}
}
