# Hotels

## Lösungsidee

In einer Liste der Länge aller Hotels wird für jedes Hotel eine Liste aller Möglichkeiten, es zu erreichen, abgespeichert. Die Liste an Hotels, um das aktuelle zu erreichen, ergänzt um das aktuelle Hotel, wird dafür der Liste an Möglichkeiten aller Hotels innerhalb der nächsten 360 Minuten hinzugefügt. Schließlich wird die beste Fahrtmöglichkeit durch Vergleich aller Möglichkeiten am Ziel ermittelt.

Beispiel:

```mermaid
flowchart LR


s(Start)---h1(20min, 3.5*)---h2(300 min, 4.0*)---h3(540min, 4.8*)---z(600 min)

subgraph Hotel1
h1
m1("[ ]")
end
s --> m1

subgraph Hotel2
h2
m2("[ ]")
m3("[ { 20min, 3.5* } ]")
end
s --> m2
m1 --> m3

subgraph Hotel3
h3

m5("[ { 20min, 3.5* }, 
{ 300min, 4.0* } ]")
m6("[ { 300min, 4.0* } ]")
end
m3 --> m5
m2 --> m6

subgraph Ziel
z
m7("[ { 20min, 3.5* }, 
{ 300min, 4.0* },
{ 540min, 4.8* } ]")
m8("[ { 300min, 4.0* },
{540min, 4.8*}]")
m9("[ { 300min, 4.0* } ]")
end
m5 --> m7
m6 --> m8
m2 --> m9
```

Eine Möglichkeit ist jedoch nur zielführend, wenn pro verbleibendem Tag durchschnittlich weniger als 360 Minuten zu fahren sind. &rarr; Andernfalls wird diese Möglichkeit nicht fortgeführt.

## Umsetzung

## Beispiele

## Quellcode

