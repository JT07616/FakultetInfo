export function prevediGresku(kodGreske) {
  if (kodGreske === 'auth/invalid-credential') {
    return 'Neispravan e-mail ili lozinka.'
  }
  if (kodGreske === 'auth/email-already-in-use') {
    return 'Taj e-mail je već registriran.'
  }
  if (kodGreske === 'auth/invalid-email') {
    return 'E-mail nije ispravnog formata.'
  }
  if (kodGreske === 'auth/too-many-requests') {
    return 'Previše pokušaja. Pokušaj ponovno kasnije.'
  }
  return 'Nešto je pošlo po zlu. Pokušaj ponovno.'
}
