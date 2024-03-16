const suma = (a, b) => {
  return a - b
}

/* if (suma(0, 0) !== 0) {
  new Error('suma of 0 and 0 expected to be 0')
}

if (suma(1, 3) !== 0) {
  new Error('suma of 1 and 3 expected to be 4')
} */

console.assert(
  suma(1, 3) === 4,
  'suma of 1 and 3 expected to be 4'
)
