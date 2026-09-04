export const sveucilista = [
  {
    id: 'unizg',
    naziv: 'Sveučilište u Zagrebu',
    fakulteti: [
      {
        id: 'pmf',
        kratica: 'PMF',
        naziv: 'Prirodoslovno-matematički fakultet',
        grad: 'Zagreb',
        adresa: 'Horvatovac 102a, 10000 Zagreb',
        web: 'https://www.pmf.unizg.hr',
      },
      {
        id: 'efzg',
        kratica: 'EFZG',
        naziv: 'Ekonomski fakultet',
        grad: 'Zagreb',
        adresa: 'Trg J. F. Kennedyja 6, 10000 Zagreb',
        web: 'https://www.efzg.unizg.hr',
      },
      {
        id: 'pfzg',
        kratica: 'PFZG',
        naziv: 'Pravni fakultet',
        grad: 'Zagreb',
        adresa: 'Trg Republike Hrvatske 14, 10000 Zagreb',
        web: 'https://www.pravo.unizg.hr',
      },
      {
        id: 'ffzg',
        kratica: 'FFZG',
        naziv: 'Filozofski fakultet',
        grad: 'Zagreb',
        adresa: 'Ivana Lučića 3, 10000 Zagreb',
        web: 'https://www.ffzg.unizg.hr',
      },
      {
        id: 'foi',
        kratica: 'FOI',
        naziv: 'Fakultet organizacije i informatike',
        grad: 'Varaždin',
        adresa: 'Pavlinska 2, 42000 Varaždin',
        web: 'https://www.foi.unizg.hr',
      },
    ],
  },
  {
    id: 'unist',
    naziv: 'Sveučilište u Splitu',
    fakulteti: [
      {
        id: 'fesb',
        kratica: 'FESB',
        naziv: 'Fakultet elektrotehnike, strojarstva i brodogradnje',
        grad: 'Split',
        adresa: 'Ruđera Boškovića 32, 21000 Split',
        web: 'https://www.fesb.unist.hr',
      },
      {
        id: 'pmfst',
        kratica: 'PMFST',
        naziv: 'Prirodoslovno-matematički fakultet',
        grad: 'Split',
        adresa: 'Ruđera Boškovića 33, 21000 Split',
        web: 'https://www.pmfst.unist.hr',
      },
      {
        id: 'efst',
        kratica: 'EFST',
        naziv: 'Ekonomski fakultet',
        grad: 'Split',
        adresa: 'Cvite Fiskovića 5, 21000 Split',
        web: 'https://www.efst.unist.hr',
      },
    ],
  },
  {
    id: 'uniri',
    naziv: 'Sveučilište u Rijeci',
    fakulteti: [
      {
        id: 'riteh',
        kratica: 'RITEH',
        naziv: 'Tehnički fakultet',
        grad: 'Rijeka',
        adresa: 'Vukovarska 58, 51000 Rijeka',
        web: 'https://www.riteh.uniri.hr',
      },
      {
        id: 'efri',
        kratica: 'EFRI',
        naziv: 'Ekonomski fakultet',
        grad: 'Rijeka',
        adresa: 'Ivana Filipovića 4, 51000 Rijeka',
        web: 'https://efri.uniri.hr',
      },
    ],
  },
  {
    id: 'unios',
    naziv: 'Sveučilište Josipa Jurja Strossmayera u Osijeku',
    fakulteti: [
      {
        id: 'ferit',
        kratica: 'FERIT',
        naziv: 'Fakultet elektrotehnike, računarstva i informacijskih tehnologija',
        grad: 'Osijek',
        adresa: 'Kneza Trpimira 2B, 31000 Osijek',
        web: 'https://www.ferit.unios.hr',
      },
      {
        id: 'efos',
        kratica: 'EFOS',
        naziv: 'Ekonomski fakultet',
        grad: 'Osijek',
        adresa: 'Trg Ljudevita Gaja 7, 31000 Osijek',
        web: 'https://www.efos.unios.hr',
      },
    ],
  },
  {
    id: 'unizd',
    naziv: 'Sveučilište u Zadru',
    fakulteti: [
      {
        id: 'oiz',
        kratica: 'OIZ',
        naziv: 'Odjel za informacijske znanosti i tehnologije',
        grad: 'Zadar',
        adresa: 'Ulica dr. Franje Tuđmana 24i, 23000 Zadar',
        web: 'https://iz.unizd.hr',
      },
    ],
  },
  {
    id: 'unipu',
    naziv: 'Sveučilište Jurja Dobrile u Puli',
    fakulteti: [
      {
        id: 'fipu',
        kratica: 'FIPU',
        naziv: 'Fakultet informatike u Puli',
        grad: 'Pula',
        adresa: 'Ulica Alda Negrija 6, 52100 Pula',
        web: 'https://fipu.unipu.hr',
      },
    ],
  },
  {
    id: 'unidu',
    naziv: 'Sveučilište u Dubrovniku',
    fakulteti: [
      {
        id: 'fepr',
        kratica: 'FEPR',
        naziv: 'Fakultet elektrotehnike i primijenjenog računarstva',
        grad: 'Dubrovnik',
        adresa: 'Ćira Carića 4, 20000 Dubrovnik',
        web: 'https://www.unidu.hr',
      },
    ],
  },
  {
    id: 'unisb',
    naziv: 'Sveučilište u Slavonskom Brodu',
    fakulteti: [
      {
        id: 'teho',
        kratica: 'TEHO',
        naziv: 'Tehnički odjel',
        grad: 'Slavonski Brod',
        adresa: 'Ulica 108. brigade ZNG 28, 35000 Slavonski Brod',
        web: 'https://teho.unisb.hr',
      },
    ],
  },
]

// ravan popis za pretragu, filtere i stranicu fakulteta
export const fakulteti = []

for (const sveuciliste of sveucilista) {
  for (const fakultet of sveuciliste.fakulteti) {
    fakulteti.push({
      id: fakultet.id,
      kratica: fakultet.kratica,
      naziv: fakultet.naziv,
      grad: fakultet.grad,
      adresa: fakultet.adresa,
      web: fakultet.web,
      sveuciliste: sveuciliste.naziv,
    })
  }
}
