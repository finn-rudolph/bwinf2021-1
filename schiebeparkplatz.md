# Schiebeparkplatz

## Lösungsidee

Ich bezeichne die auszuparkenden Autos als *vertikal* und die blockierenden Autos als *horizontal*.

Für das Ausparken eines vertikal stehenden Autos ist zunächst nur das direkt davorstehende horizontale Auto relevant. Nur wenn Ausparken durch dessen Verschiebung nicht möglich ist, werden die zwei benachbarten relevant.

Da die Verschiebung von horizontalen Autos für eine Lösung nur in eine Richtung geschieht, lässt sich das Problem des Verschiebens in zwei einfache Probleme aufteilen:

- Wie viele Autos müssen nach links verschoben werden?
- Wie viele Autos müssen nach rechts verschoben werden?

Die nötigen Positionsverschiebungen eines störenden horizontalen Autos zum Ausparken des vertikalen Autos lassen sich folgenderweise beschreiben:
$$
nach \space Links: Position_{Horizontal} - Position_{Vertikal} + 2 \\ 
nach \space Rechts: Position_{Vertikal} - Position_{Horizontal} + 1
$$
Diese Zahl ist entweder 1 oder 2. Der Abstand zum nächsten Auto einer Richtung (links / rechts), subtrahiert von der Zahl an nötigen Verschiebungen dieser Richtung, ist die Anzahl an Positionen, um die das nächste Auto verschoben werden muss. Das wird so lange wiederholt, bis die Mindestzahl an Positionsverschiebungen <= 0 ist, denn dann kann ausgeparkt werden.

Beispiel (Situation auf dem Aufgabenblatt):

```mermaid
flowchart TB

11((A))
12((B))
13((C)) -->|H links| 23((2))
13 		-->|H rechts| 24((1))	
14((D)) -->|H links| 25((1))
14 		-->|H rechts| 26((2))
15((E))
16((F)) -->|I links| 28((2))
16		-->|I rechts| 29((1))	
17((G)) -->|I links| 210((1))
17		-->|I rechts| 211((2))	

23 		-->|"&Delta;" zu Wand: 2| 31[0]
24 		-->|"&Delta;" zu I: 1| 32[0]
25		-->|"&Delta;" zu Wand: 2| 33[-1]
26		-->|"&Delta;" zu I: 1| 34((1))
28		-->|"&Delta;" zu H: 1| 35((1))
29		-->|"&Delta;" zu Wand: 0| 36((1))
210		-->|"&Delta;" zu H: 1| 37[0]
211		-->|"&Delta;" zu Wand: 0| 38((2))

34 		-->|"&Delta;" zu Wand: 0| 41((1))
35		-->|"&Delta;" zWand: 2| 42[ -1]
```

## Umsetzung

Ich schreibe in [Typescript](https://www.typescriptlang.org/) und benutze die Laufzeit [Deno](https://deno.land/).

Ein Parkplatz wird durch `convertInput()` eingelesen, die Anweisungen zum Ausparken durch `convertOutput()` für die Ausgabe im Terminal arrangiert. Da die beiden aber keine Logik zur Bestimmung der Schiebeschritte enthalten, gehe ich nicht näher auf sie ein.

Folgende Schritte werden für jedes vertikale Auto auf einem Parkplatz ausgeführt, ich beschreibe die Schritte für ein Auto.

### Bestimmung des blockierenden Autos

[locateObstructing()](###locateObstructing()) vergleicht die Position des vertikalen Autos (`carIndex`) mit den Positionen der horiziontalen Autos und gibt bei Überschneidungen das störende Auto zurück. Die folgenden Schritte geschehen nicht, falls die Rückgabe `undefined` ist, was signalisiert, dass kein Auto im Weg steht.

### Verschiebung in beide Richtungen

Die Funktion wird für jedes vertikale Auto zweimal aufgerufen: Schieberichtung links und rechts.

[`shiftHorizontal()`](###shiftHorizontal()) prüft rekursiv den Abstand zum nächsten Auto und gibt eine Liste an nötigen [Verschiebungsanweisungen](###type%20shiftStep) zurück. Die beiden Wände / Parkplatzenden werden als unverschiebbare horizontale Autos gehandhabt.

#### Basisfälle

Das Verschieben war erfolgreich, wenn keine nötigen Verschiebungen mehr übrig sind. In diesem Fall wird die Liste, in die von den aufrufenden Funktionen Verschiebungsschritte hinzugefügt werden, zurückgegeben (Z. 7). Falls versucht wird, eine `"wall"`, das Parkplatzende, zu verschieben, ist das Ausparken nicht möglich (Z. 8).

#### Rekursion 

Das nächste zu verschiebende Auto ist abhängig von der gegebenen Schieberichtung, es ist entweder das vorige oder nächste Listenelement in der Liste aller horizontalen Autos (Z. 10 - 11).

Für den nächsten Aufruf ist die Distanz zum nächsten Auto erforderlich, da dieses um die Distanz *weniger* verschoben werden muss (Z. 13 - 16). Der Subtrahend ist natürlich richtungsabhängig, außerdem muss die Länge von 2 eines Autos beachtet werden. `furtherShifts` speichert die Verschiebungsschritte aller weiteren Autos, die durch den rekursiven Funktionsaufruf zurückgegeben werden (Z. 18 - 23).

#### Rückgabe

`undefined` tritt auf, wenn das Ausparken durch Verschiebung horizontaler Autos in die gegebene Richtung nicht möglich ist, es wird einfach weitergegeben (Z. 25).

Wenn die Funktion eine Liste erhält, sind dort die weiteren [Verschiebungsanweisungen](###type%20shiftStep) gespeichert. Nach Hinzufügen der hier getätigten Verschiebung wird diese Liste weitergegeben (Z. 27 - 33).

### Vergleich der Verschiebungsmöglichkeiten

[`determineBest()`](###determineBest()) vergleicht die Verschiebung nach links und rechts nach folgenden Kriterien :

1. Möglichkeit des Ausparkens
2. Geringere Anzahl an verschobenen Autos
3. Geringere Anzahl an verschobenen Positionen

Die bessere wird nach Formatierung durch `convertOutput()` im Terminal ausgegeben.

## Beispiele

## Quellcode

### locateObstructing()

```typescript
const locateObstructing = (
	carIndex: number,
	horizontalCars: Array<horizontalCar>
): horizontalCar | undefined => {
	for (let i = 0; horizontalCars[i].position - 1 < carIndex; i++) {
		if (
			horizontalCars[i].position === carIndex ||
			horizontalCars[i].position + 1 === carIndex
		)
			return horizontalCars[i];
	}
	return undefined;
};
```

### shiftHorizontal()

```typescript
const shiftHorizontal = (
	minShifts: number,
	direction: number, // -1: left, 1: right
	currentCar: horizontalCar,
	horizontalCars: Array<horizontalCar>
): Array<shiftStep> | undefined => {
	if (minShifts <= 0) return [];
	if (currentCar.name === "wall") return undefined;

	const nextCar =
		horizontalCars[horizontalCars.indexOf(currentCar) + direction];

	const distance =
		direction === -1
			? currentCar.position - (nextCar.position + 2)
			: nextCar.position - (currentCar.position + 2);

	const furtherShifts = shiftHorizontal(
		minShifts - distance,
		direction,
		nextCar,
		horizontalCars
	);

	if (furtherShifts === undefined) return undefined;

	const currentShift: shiftStep = {
		carLetter: currentCar.name,
		direction: direction,
		positions: minShifts
	};

	return [...furtherShifts, currentShift];
};
```

### determineBest()

```typescript
const determineBest = (
	shiftStepsLeft: Array<shiftStep> | undefined,
	shiftStepsRight: Array<shiftStep> | undefined
): Array<shiftStep> | undefined => {
	if (shiftStepsLeft === undefined) return shiftStepsRight;
	if (shiftStepsRight === undefined) return shiftStepsLeft;

	if (
		shiftStepsLeft.length === shiftStepsRight.length &&
		shiftStepsLeft.length !== 0
	)
		return shiftStepsLeft
			.map((step) => step.positions)
			.reduce((acc, current) => acc + current) <
			shiftStepsRight
				.map((step) => step.positions)
				.reduce((acc, current) => acc + current)
			? shiftStepsLeft
			: shiftStepsRight;

	return shiftStepsLeft.length < shiftStepsRight.length
		? shiftStepsLeft
		: shiftStepsRight;
};
```

### type horizontalCar

```typescript
type horizontalCar = {
	name: string;
	position: number;
};
```

### type shiftStep

```typescript
type shiftStep = {
	carLetter: string;
	direction: number;
	positions: number;
};
```

