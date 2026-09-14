<img src="src/assets/slike/fipu_hr.png" alt="Fakultet informatike u Puli" width="340">

# FakultetInfo

Web aplikacija koja kandidatima za upis na fakultet drži katalog studijskih programa,
pravila bodovanja, upisne rokove i komunikaciju s fakultetima na jednom mjestu.

- **Aplikacija:** https://fakultetinfo-3e719.web.app
- **Figma prototip:** [Link na figma prototip](https://www.figma.com/proto/shDoJZ6uYTj9iEQVVs7GdD/FakultetInfo-prototip?node-id=20-3&t=G7VG5aAh48Jvraf7-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1)

## O projektu

- **Autor:** Juraj Tojčić
- **Ustanova:** [Fakultet informatike u Puli](https://fipu.unipu.hr)
- **Kolegij:** [Programsko inženjerstvo](https://ntankovic.unipu.hr/pi)
- **Mentor:** [doc. dr. sc. Nikola Tanković](https://ntankovic.unipu.hr)

## Funkcionalnosti

- Katalog 17 visokih učilišta i 52 studijska programa, s pretragom i filtrima
- Službena pravila bodovanja i upisni rokovi za svaki studijski program
- Kalkulator bodova prilagođen pravilima pojedinog studijskog programa, s provjerom uvjeta upisa
- Lista prioriteta s studijskim programima poredanima onako kako ih korisnik namjerava prijaviti
- Obavijesti svih fakulteta s liste na jednom mjestu
- Pitanja fakultetima i službeni odgovori predstavnika
- Portal za predstavnike fakulteta i nadzorna ploča za administratora

## Uloge

- **gost** - katalog, pravila bodovanja, kalkulator, čitanje obavijesti i pitanja
- **korisnik** - lista prioriteta, favoriti, postavljanje pitanja i odgovaranje
- **predstavnik fakulteta** - obavijesti, upisni rokovi i službeni odgovori svojeg fakulteta
- **administrator** - dodjela uloga predstavnicima i moderiranje sadržaja

## Tehnologije

- **Vue 3** - Composition API
- **Vue Router** - rute i zaštita pristupa
- **Pinia** - stanje prijavljenog korisnika
- **Tailwind CSS** - izgled sučelja
- **Lucide** - ikone
- **Firebase** - Authentication i Cloud Firestore
- **Vite** - razvojni poslužitelj i build

## Struktura baze

```
users/{uid}                 username, email, role, favoriti, fakultetId
upisi/{programId_rok}       programId, fakultetId, godina, rok, kvota, prijaveDo, upisiDo
obavijesti/{id}             fakultetId, naslov, tekst, datum
pitanja/{id}                fakultetId, tekst, username, uid, datum
odgovori/{id}               pitanjeId, pitanjeUid, fakultetId, tekst, username, uid, sluzbeni, datum
```

Fakulteti i studijski programi nisu u bazi nego u kodu, u mapi `src/data`.

## Struktura projekta

```
firestore.rules       sigurnosna pravila baze
UML_dijagrami/        dijagrami iz dokumentacije
src/
  assets/             stilovi i logotipi fakulteta
  components/         dijeljene komponente
  data/               katalog fakulteta i studijskih programa
  firebase/           inicijalizacija Firebasea
  router/             rute i zaštita pristupa
  stores/             stanje prijavljenog korisnika
  utils/              izračun bodova i poruke o pogreškama
  views/              stranice povezane s rutama
```

## UML dijagrami

Dijagrami iz projektne dokumentacije nalaze se u mapi [`UML_dijagrami/`](UML_dijagrami).

## Testni računi

| Uloga | E-mail | Lozinka |
|---|---|---|
| Korisnik | korisnik_prvi@fakultetinfo.com | Korisnik_prvi123 |
| Predstavnik fakulteta | fipu@fipu.hr | Fipu123 |
| Administrator | korisnik123@fakultetinfo.com | korisnik123 |
