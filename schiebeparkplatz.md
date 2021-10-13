# Schiebeparkplatz

## Lösungsidee

Für das Ausparken eines vertikal stehenden Autos ist zunächst nur das direkt davorstehende horizontale Auto relevant. Kann man dieses nicht ausreichend verschieben, werden auch die zwei benachbarten relevant.

Da die Verschiebung von querstehenden (horizontalen) Autos für eine Lösung logischerweise nur in eine Richtung geschieht, lässt sich das Problem in zwei einfache Probleme aufteilen:

- Wie oft muss zum Ausparken nach links / rechts verschoben werden (bzw. ist es möglich)?
- In welche Richtung müssen weniger Autos verschoben werden?

Jeder Behinderung eines vertikalen Autos durch ein horizontales Auto ist für jede Richtung (links / rechts) eine Mindestzahl an Positionen zugeordnet, um die das horizontale Auto zum Ausparken verschoben werden muss (1 oder 2). Der Abstand zum nächsten Auto einer Richtung (links / rechts), subtrahiert von der Mindestzahl an Verschiebungen dieser Richtung, ist die Anzahl an Positionen, um die das nächste Auto verschoben werden muss. Das wird so lange fortgeführt, bis die Mindestzahl an Positionsverschiebungen <= 0 ist, denn dann kann ausgeparkt werden.

Beispiel (Situation auf dem Flyer):

```mermaid
flowchart TB

11((A)) --> 21[0]
12((B)) --> 22[0]
13((C)) -->|H links| 23((2))
13 		-->|H rechts| 24((1))	
14((D)) -->|H links| 25((1))
14 		-->|H rechts| 26((2))
15((E)) --> 27[0]
16((F)) -->|I links| 28((2))
16		-->|I rechts| 29((1))	
17((G)) -->|I links| 210((1))
17		-->|I rechts| 211((2))	

23 		-->|"&Delta;" Wand: 2| 31[0]
24 		-->|"&Delta;" I: 1| 32[0]
25		-->|"&Delta;" Wand: 2| 33[-1]
26		-->|"&Delta;" I: 1| 34((1))
28		-->|"&Delta;" H: 1| 35((1))
29		-->|"&Delta;" Wand: 0| 36((1))
210		-->|"&Delta;" H: 1| 37[0]
211		-->|"&Delta;" Wand: 0| 38((2))

34 		-->|"&Delta;" Wand: 0| 41((1))
35		-->|"&Delta;" Wand: 2| 42[ -1]
```

## Umsetzung

## Quellcode

### Datentypen

### Funktionen

