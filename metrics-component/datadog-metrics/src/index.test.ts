import crypto from 'crypto'

beforeAll(() => {
  vi.stubGlobal('crypto', crypto)
})

describe('datadog-metrics', () => {
  it('example test', () => {
    expect(true).toEqual(true)
  })
})
