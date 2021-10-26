# Hotels

## Lösungsidee

Zuerst sollen alle Hotels mit einer besseren Alternative bei gleicher Minutenzahl aussortiert werden. Das hat zwei Vorteile: Ein Hotel kann allein durch die Minutenzahl eindeutig identifiziert werden und es wird von vornherein unnötiger Rechenaufwand vermieden. Ebenso sind Hotels nach dem Ziel nicht relevant.

In einer Liste der Länge aller Hotels wird für jedes Hotel eine Liste aller Möglichkeiten, es zu erreichen, abgespeichert. Zunächst werden alle vom Start erreichbaren Hotels mit einem bestimmten Wert initialisiert, um anzuzeigen, dass eine Möglichkeit vorhanden ist, das Hotel zu erreichen und keine Hotels dafür benötigt werden. Danach wird für jedes Hotel die Liste an Möglichkeiten, es zu erreichen, allen Hotels innerhalb der nächsten 360 Minuten hinzugefügt, nachdem jede Möglichkeit um das Hotel ergänzt worden ist. Das ist nötig, da in diesem Hotel übernachtet werden muss, um die darauffolgenden zu erreichen.

Zwei Einschränkungen gibt es: 

1. Wenn bei dem Zielhotel bereits eine Möglichkeit vorhanden ist, es mit einer höheren kleinsten Bewertung zu erreichen, während die gleiche / geringere Anzahl an Hotels benötigt wird, soll die betreffende Möglichkeit nicht hinzugefügt werden. Andernfalls soll sie alle mit gleich vielen / mehr Zwischenstopps ersetzen, die eine schlechtere / gleiche Bewertung haben. Das bedeutet, es werden pro Hotel maximal 5 Möglichkeiten gleichzeitig existieren.

2. Eine Möglichkeit ist nur zielführend, wenn pro verbleibendem Tag durchschnittlich weniger als 360 Minuten zu fahren sind. 

   &rarr; Andernfalls wird diese Möglichkeit nicht fortgeführt. 

Nachdem das für jedes Hotel geschehen ist, wird die beste Fahrtmöglichkeit durch Vergleich aller Möglichkeiten am Ziel ermittelt.

Beispiel:

```mermaid
flowchart LR


s(Start)---h1(20min, 3.5*)---h2(300 min, 4.0*)---h3(540min, 4.8*)---z(Ziel: 600 min)

s -->|Seed| m1
s -->|Seed| m2

h1
m1("[ [ ] ]")
m1 -.-> m2 --> m3 -.-> m4

m2 --> m4


h2
m2("[ [ ] ]")

h3

m3("[ [ { 300min, 4.0* } ] ]")

m4("[ [ { 300min, 4.0* } ]")
```



*durchgezogen*: Hinzufügen einer Möglichkeit; *gepunktet*: Hinzufügen wäre möglich, allerdings ist bereits eine bessere Möglichkeit vorhanden

## Umsetzung

Ich schreibe in [Typescript](https://www.typescriptlang.org/) und benutze die Laufzeit [Deno](https://deno.land/).

Die Textdatei wird von der Funktion `convertInput()` eingelesen, daraus wird eine Liste aller Hotels erstellt. Die Umwandlug der besten Route in ein gut lesbares Format, das im Terminal ausgegeben werden kann, geschieht durch `convertOutput()`. Diese tragen aber nicht zur Bestimmung der besten Route bei, daher werde ich sie nicht behandeln.

### Herausfiltern irrelevanter Hotels

Zuerst wird die Liste an Informationen zu jedem Hotel (&rarr; Typ [`hotelInformation`](###type%20hotelInformation) ) durch [`filterHotels()`](###filterHotels()) geschickt. Die Funktion gibt die gleiche Liste an Hotels zurück, jedoch ohne folgende:

- Hotels hinter dem Ziel (Z. 6)

- Hotels, für die es bei gleicher Minutenzahl ein besseres gibt (Z. 8 - 23)

  Jeweils vor und hinter dem Hotel wird solange iteriert, bis eine andere Minutenzahl auftritt. Wenn irgendwann ein besseres Hotel erscheint, wird `false` zurückgegeben. &rarr; Das Hotel wird nicht in die neue Liste mit aufgenommen.

Das zweite Kriterium wäre für die Funktion des Programms nicht notwendig, jedoch trägt es zu einer Laufzeitverbesserung bei, da es weniger rechenaufwendig ist, die Hotels vorneweg herauszunehmen, als später die daraus entstehenden nicht optimalen Routen auszusortieren.

### Kalkulation der besten Route

Die gefilterte Liste an Hotels wird der Funktion [`bestRoute()`](###bestRoute()) weitergegeben. Dieser wird ein Element für das Ziel hinzugefügt, um später einen Ort zu haben, an dessen Anfahrtmöglichkeiten gespeichert werden können (Z. 5).

#### Initialisierung der Tabelle

Wie in meiner Idee bereits angedeutet, werde ich mit einer zweidimensionalen Liste arbeiten, um Anfahrtfmöglichkeiten (&rarr; Typ [`route`](###type%20route)) für jedes Hotel abzuspeichern. Daher wird jeder Index der Liste mit einer leeren, *unabhängigen* Liste initialisiert. Allen Hotels, die vom Start erreichbar sind, wird eine Route ohne Zwischenstopps und bestmöglicher niedrigster Bewertung hinzugefügt, da es keine Hotels gibt, die die Bewertung limitieren.

Es gibt also nun zwei Listen:

- `hotels`: Bewertung + Minutenzahl aller Hotels &rarr; unveränderlich
- `hotelsTable`: Anfahrtmöglichkeiten aller Hotels &rarr; initialisiert mit Startwerten

#### Iteration

Für 

- jedes Hotel &rarr; `hotels[i]` (Z. 18)
- jedes von diesem erreichbare Hotel &rarr; `hotels[i + delta]` (Z. 19 - 24)
- jede mögliche Route zu `hotels[i]` &rarr; `hotels[i][routeI]` (Z. 25)

geschieht folgendes:

Die zu den Anfahrtsmöglichkeiten des Zielhotels hinzuzufügende Route `newRoute` wird erstellt, wobei das aktuelle Hotels den Zwischenstopps angefügt und die niedrigste Bewertung der Route gegebenenfalls aktualisiert wird (Z. 26 - 35).

#### Aktualisierung der Routen des Zielhotels

Ob eine Ersetzung der Routen überhaubt in Betracht gezogen wird, hängt davon ab, ob das Ziel mit instgesamt maximal vier Hotels (&rarr; maximal fünf Reisetage) noch erreichbar ist (Z. 37 - 41).

Ist das der Fall, wird die Funktion [`substituteRoutes()`](###substituteRoutes()) aufgerufen, die dafür zuständig ist, falls schlechtere Routen beim Zielhotel vorhanden sind, diese herauszufiltern und *alle* durch die vorgeschlagene `newRoute` zu ersetzen. Zuerst wird geprüft, ob bereits eine bessere Route vorhanden ist, was nach den Kriterien *höhere niedrigste Bewertung* und *weniger Zwischenstopps* geschieht (Z. 6 - 12). Wenn eine bessere Alternative auftritt, wird nichts verändert, andernfalls wird die neue Route *sicherlich hinzugefügt* (Z. 20), weil sie entweder gleichwertig oder besser als die bisher beste ist. Davor werden aber alle schlechteren Routen (gleiche Kriterien wie zuvor) aus der Liste herausgenommen (Z. 13 - 18), damit mit ihnen keine weiteren Routen gebildet werden, die in jedem Fall eine bessere Alternative haben. &rarr; weniger Rechenaufwand

Diese aktualisierte Liste an Routen wird in [`bestRoute()`](###bestRoute()) natürlich dem Zielhotel zugewiesen (Z. 42 - 45).

#### Rückgabe

Die Funktion [`determineBest()`](###determineBest()) gibt die Route mit der besten niedrigsten Bewertung zurück, indem sie die Routen zuerst absteigend nach `lowestRating` sortiert und davon das erste Element nimmt. Sie wird auf die Liste an Routen zum Ziel (letztes Element in `hotelsTable`) angewendet, das Ergebnis ist die Rückgabe von [`bestRoute()`](###bestRoute()). &rarr; Ausgabe im Terminal nach Strukturierung durch `convertOutput()`

## Beispiele

## Quellcode

### filterHotels()

```typescript
const filterHotels = (
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
```

### bestRoute()

```typescript
const bestRoute = (
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
```

### substituteRoutes()

```typescript
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
```

### determineBest()

```typescript
const determineBest = (routes: Array<route>): route =>
	routes.sort((a, b) => b.lowestRating - a.lowestRating)[0];
```

### type hotelInformation

```typescript
type hotelInformation = {
	timestamp: number;
	rating: number;
};
```

### type route

```typescript
type route = {
	lowestRating: number;
	intermediateStops: Array<hotelInformation>;
};
```

