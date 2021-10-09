# Marktwaage

## Lösungsidee

Bei dieser Aufgabe ist es nötig, nahezu alle möglichen Kombinationen an Gewichten zu berechnen, die im Bereich 10 - 10000 liegen, da auch nicht genau passende berücksichtigt werden sollen. 

Zuerst gehe ich davon aus, dass das Ausgleichen von 0 in jedem Fall möglich ist, indem man kein Gewicht auf die Waage stellt. Wenn man also von einem Zielgewicht ausgehend durch Addition und Subtraktion von vorhandenen Gewichten 0 erreicht, bevor alle Gewichte aufgebraucht sind, ist das Zielgewicht erreichbar.

## Umsetzung

Dieses Konzept setze ich mithilfe einer rekursiven Funktion um, die ein Gewicht addiert / subtrahiert und dann sich selbst mit dem Ergebnis neu aufruft. 

Falls 0 herauskommt oder alle Gewichte aufgebraucht sind, wird ein Objekt zurückgegeben, das Informationen über den Abstand zum Zielgewicht sowie die verwendeten Gewichte enthält. Die Differenz zum Zielgewicht sollte möglichst klein sein, bestenfalls 0. Daher werden von der aufrufenden Funktion alle zurückgegebenen Objekte hinsichtlich ihrer Differenz verglichen&rarr; das mit dem kleinsten Betrag wird weitergegeben.

## Beispiele

## Quellcode

### Datentypen

### Funktionen

