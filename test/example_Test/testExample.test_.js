const { palindrome, average } = require('./for_testing')

describe.skip('palindromo', () => {
  test('jose to be esoj', () => {
    expect(palindrome('jose')).toBe('esoj')
  })

  test('empty string', () => {
    expect(palindrome('')).toBe('')
  })

  test('not param', () => {
    expect(palindrome()).toBeUndefined()
  })
})

describe.skip('average', () => {
  test('if send one value expect is the value itself', () => {
    expect(average([1])).toBe(1)
  })
  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })
})
