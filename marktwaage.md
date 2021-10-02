# Marktwaage

## Lösungsidee

Bei dieser Aufgabe ist es schwierig, von einem Zielgewicht ausgehend eine passende Kombination zu finden. Das liegt daran, dass man keinen sinnvollen Einstiegspunkt hat, wie z.B. beim Schiebeparkplatz, bei dem man sinnvollerweise von einem Auto ausgehen kann. Außerdem sind auch Informationen über nicht passende Gewichtskombinationen wertvoll.

Daher habe ich mich entschieden, einfach alle Kombinationsmöglichkeiten zu errechnen und dann nach

1. Wertebereich (10 bis 10 000)
2. genau passend oder am nähsten liegend

zu filtern.

## Umsetzung

In dieser Aufgabe wird hauptsächlich mit **Listen** gearbeitet, da die Kombinationsmöglichkeiten keine Beziehung zueinander haben.

- `numbers`: Liste aller Zahlen von 10 bis 10 000

- `weights`: Liste aller Gewichte

  &rarr; Mehrfache werden mehrfach abgespeichert.

- `possible`: Liste aller Kombinationsmöglichkeiten

  &rarr; alle möglichen Abfolgen von Gewichten + Vorzeichen bei unterschiedlich vielen Gewichten

Die Kombinationen werden in folgender Struktur in `possible` abgespeichert:

```typescript
type weightCombination = {
	sum: number,
    left: Array<number>,
    right: Array<number>
}
```

Unter `right` stehen alle addierten Elemente, unter `left` alle subtrahierten.

## Beispiele
