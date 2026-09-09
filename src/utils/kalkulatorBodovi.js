// nazivi obveznih ispita drzavne mature
const OBVEZNI = ['hrvatski', 'matematika', 'straniJezik']
const NAZIVI = { hrvatski: 'Hrvatski jezik', matematika: 'Matematika', straniJezik: 'Strani jezik' }

// da krivi upis (750 umjesto 75) ne razbije izracun
function ogranici(vrijednost, maks) {
  const broj = Number(vrijednost) || 0
  if (broj < 0) return 0
  if (broj > maks) return maks
  return broj
}

// A razina vrijedi 1.6x kad studijski program trazi samo B
function preracunajRazinu(postotak, razina, trazena) {
  if (trazena === 'B' && razina === 'A') {
    return Math.min(postotak * 1.6, 100)
  }
  return postotak
}

export function izracunajBodove(program, unosi) {
  const b = program.bodovanje

  const razrada = []
  const nedostaju = []
  const kriveRazine = []
  const neispunjeniPragovi = []
  const napomene = []
  let sviPolozeni = true

  // prosjek srednje skole
  const prosjek = ogranici(unosi.prosjek, 5)
  razrada.push({ naziv: 'Prosjek ocjena', maks: b.prosjek, bodovi: (prosjek / 5) * b.prosjek })

  // obvezni dio mature
  for (const kljuc of OBVEZNI) {
    const trazi = b[kljuc]
    const naziv = trazi.predmet || NAZIVI[kljuc]
    const postotak = ogranici(unosi.matura[kljuc], 100)
    const razina = unosi.razine[kljuc]

    if (postotak < 50) {
      sviPolozeni = false
    }
    if (trazi.razina === 'A' && razina === 'B') {
      kriveRazine.push(naziv)
    }

    // sluzbeni prag programa: broj se provjerava, centil se iz postotka ne moze
    if (typeof trazi.prag === 'number' && postotak < trazi.prag) {
      neispunjeniPragovi.push(naziv + ' (najmanje ' + trazi.prag + ' %)')
    }
    if (typeof trazi.prag === 'string') {
      napomene.push(naziv + ': prag je ' + trazi.prag + ' i ovisi o rezultatima svih kandidata')
    }

    // predmeti koji se ne boduju (postotak 0) ulaze samo u uvjete, ne u razradu
    if (trazi.postotak > 0) {
      const zaBodove = preracunajRazinu(postotak, razina, trazi.razina)
      razrada.push({ naziv: naziv + ' (' + razina + ')', maks: trazi.postotak, bodovi: (zaBodove / 100) * trazi.postotak })
    }
  }
// izborni
  for (const izbor of program.izborni) {
    if (izbor.postotak > 0) {
      // bodovani izborni je u nasim podacima uvijek tocno jedan predmet
      const naziv = izbor.predmeti[0]
      const rezultat = unosi.izborni[naziv]
      const pisan = rezultat !== '' && rezultat != null
      const postotak = ogranici(rezultat, 100)

      if (izbor.obavezan && !pisan) {
        nedostaju.push(naziv)
      }
      // pao neobavezan izborni ne sprjecava upis, samo ne donosi bodove
      if (izbor.obavezan && pisan && postotak < 50) {
        sviPolozeni = false
      }
      if (typeof izbor.prag === 'number' && pisan && postotak < izbor.prag) {
        neispunjeniPragovi.push(naziv + ' (najmanje ' + izbor.prag + ' %)')
      }
      if (typeof izbor.prag === 'string') {
        napomene.push(naziv + ': prag je ' + izbor.prag + ' i ovisi o rezultatima svih kandidata')
      }

      const bodovi = pisan && postotak >= 50 ? (postotak / 100) * izbor.postotak : 0
      razrada.push({ naziv: naziv + ' (izborni)', maks: izbor.postotak, bodovi: bodovi })
    } else if (izbor.obavezan && !unosi.polozenIzborni) {
      // "jedan predmet s popisa": ne nosi bodove, u formi je kvacica
      nedostaju.push('jedan izborni predmet s popisa')
    }
  }

  // postoci su sluzbeni udjeli od ukupnih 1000 bodova pa se samo mnoze s 10
  let zbrojTezina = 0
  let zbrojBodova = 0
  for (const redak of razrada) {
    zbrojTezina += redak.maks
    zbrojBodova += redak.bodovi
  }

  // dio programa ostatak bodova daje za natjecanja i slicno, to ne racunamo
  if (zbrojTezina < 99.9) {
    napomene.push('program dodatno boduje posebna postignuća (npr. natjecanja) koja kalkulator ne obuhvaća — ' + Math.round(100 - zbrojTezina) + ' % ukupnih bodova')
  }

  const skalirano = []
  for (const redak of razrada) {
    skalirano.push({ naziv: redak.naziv, maks: Math.round(redak.maks * 10), bodovi: Math.round(redak.bodovi * 10) })
  }

  const polozenaMatura = prosjek >= 2 && sviPolozeni
  return {
    ukupno: Math.round(zbrojBodova * 10),
    razrada: skalirano,
    nedostaju: nedostaju,
    kriveRazine: kriveRazine,
    neispunjeniPragovi: neispunjeniPragovi,
    napomene: napomene,
    polozenaMatura: polozenaMatura,
    uvjetiIspunjeni: polozenaMatura && !nedostaju.length && !kriveRazine.length && !neispunjeniPragovi.length,
  }
}