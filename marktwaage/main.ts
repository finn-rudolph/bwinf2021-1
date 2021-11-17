import {
	convertInput,
	convertOutput,
	createTable,
	searchTable
} from "./calculations.ts";

const szenarios = 7;

for (let i = 0; i < 6; i++) {
	const usableWeights = convertInput(
		await Deno.readTextFile(`marktwaage/beispiele/gewichtsstuecke${i}.txt`)
	);

	console.log(`Gewichtssatz ${i}
	`);

	const table = createTable(usableWeights);

	for (let target = 10; target < 10010; target += 10) {
		const usedWeights = searchTable(target, usableWeights, table);

		console.log(
			convertOutput(
				target,
				usedWeights === undefined
					? {
							diff: NaN,
							usedWeights: []
					  }
					: { diff: 0, usedWeights: usedWeights }
			)
		);
	}
}
