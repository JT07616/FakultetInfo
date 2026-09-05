// slike (logotipi) fakulteta
import slikaFipu from '../assets/slike/fipu.png'
import slikaEfzg from '../assets/slike/efzg.png'
import slikaPmf from '../assets/slike/pmf.png'
import slikaFesb from '../assets/slike/fesb.png'
import slikaFerit from '../assets/slike/ferit.png'
import slikaRiteh from '../assets/slike/riteh.png'
import slikaPfzg from '../assets/slike/pfzg.jpg'
import slikaFfzg from '../assets/slike/ffzg.jpg'
import slikaFoi from '../assets/slike/foi.png'
import slikaFer from '../assets/slike/fer.png'
import slikaFsb from '../assets/slike/fsb.png'
import slikaPmfst from '../assets/slike/pmfst.png'
import slikaEfst from '../assets/slike/efst.jpg'
import slikaEfri from '../assets/slike/efri.jpg'
import slikaFidit from '../assets/slike/fidit.jpg'
import slikaEfos from '../assets/slike/efos.png'
import slikaOiz from '../assets/slike/oiz.png'
import slikaFepr from '../assets/slike/fepr.png'
import slikaTeho from '../assets/slike/teho.png'
import slikaTvz from '../assets/slike/tvz.jpg'

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
        slika: slikaPmf,
      },
      {
        id: 'efzg',
        kratica: 'EFZG',
        naziv: 'Ekonomski fakultet',
        grad: 'Zagreb',
        adresa: 'Trg J. F. Kennedyja 6, 10000 Zagreb',
        web: 'https://www.efzg.unizg.hr',
        slika: slikaEfzg,
      },
      {
        id: 'pfzg',
        kratica: 'PFZG',
        naziv: 'Pravni fakultet',
        grad: 'Zagreb',
        adresa: 'Trg Republike Hrvatske 14, 10000 Zagreb',
        web: 'https://www.pravo.unizg.hr',
        slika: slikaPfzg,
      },
      {
        id: 'ffzg',
        kratica: 'FFZG',
        naziv: 'Filozofski fakultet',
        grad: 'Zagreb',
        adresa: 'Ivana Lučića 3, 10000 Zagreb',
        web: 'https://www.ffzg.unizg.hr',
        slika: slikaFfzg,
      },
      {
        id: 'foi',
        kratica: 'FOI',
        naziv: 'Fakultet organizacije i informatike',
        grad: 'Varaždin',
        adresa: 'Pavlinska 2, 42000 Varaždin',
        web: 'https://www.foi.unizg.hr',
        slika: slikaFoi,
      },
      {
        id: 'fer',
        kratica: 'FER',
        naziv: 'Fakultet elektrotehnike i računarstva',
        grad: 'Zagreb',
        adresa: 'Unska 3, 10000 Zagreb',
        web: 'https://www.fer.unizg.hr',
        slika: slikaFer,
      },
      {
        id: 'fsb',
        kratica: 'FSB',
        naziv: 'Fakultet strojarstva i brodogradnje',
        grad: 'Zagreb',
        adresa: 'Ivana Lučića 5, 10000 Zagreb',
        web: 'https://www.fsb.unizg.hr',
        slika: slikaFsb,
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
        slika: slikaFesb,
      },
      {
        id: 'pmfst',
        kratica: 'PMFST',
        naziv: 'Prirodoslovno-matematički fakultet',
        grad: 'Split',
        adresa: 'Ruđera Boškovića 33, 21000 Split',
        web: 'https://www.pmfst.unist.hr',
        slika: slikaPmfst,
      },
      {
        id: 'efst',
        kratica: 'EFST',
        naziv: 'Ekonomski fakultet',
        grad: 'Split',
        adresa: 'Cvite Fiskovića 5, 21000 Split',
        web: 'https://www.efst.unist.hr',
        slika: slikaEfst,
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
        slika: slikaRiteh,
      },
      {
        id: 'efri',
        kratica: 'EFRI',
        naziv: 'Ekonomski fakultet',
        grad: 'Rijeka',
        adresa: 'Ivana Filipovića 4, 51000 Rijeka',
        web: 'https://efri.uniri.hr',
        slika: slikaEfri,
      },
      {
        id: 'fidit',
        kratica: 'FIDIT',
        naziv: 'Fakultet informatike i digitalnih tehnologija',
        grad: 'Rijeka',
        adresa: 'Radmile Matejčić 2, 51000 Rijeka',
        web: 'https://www.inf.uniri.hr',
        slika: slikaFidit,
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
        slika: slikaFerit,
      },
      {
        id: 'efos',
        kratica: 'EFOS',
        naziv: 'Ekonomski fakultet',
        grad: 'Osijek',
        adresa: 'Trg Ljudevita Gaja 7, 31000 Osijek',
        web: 'https://www.efos.unios.hr',
        slika: slikaEfos,
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
        slika: slikaOiz,
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
        slika: slikaFipu,
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
        slika: slikaFepr,
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
        slika: slikaTeho,
      },
    ],
  },
]

// samostalna visoka ucilista - nemaju sveuciliste, na njih se upisuje izravno
export const samostalna = [
  {
    id: 'tvz',
    kratica: 'TVZ',
    naziv: 'Tehničko veleučilište u Zagrebu',
    grad: 'Zagreb',
    adresa: 'Vrbik 8, 10000 Zagreb',
    web: 'https://www.tvz.hr',
    slika: slikaTvz,
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
      slika: fakultet.slika,
      sveuciliste: sveuciliste.naziv,
    })
  }
}

for (const uciliste of samostalna) {
  fakulteti.push({ ...uciliste, sveuciliste: '' })
}
