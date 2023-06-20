import { filtersByListType } from '#data/lists'

describe('filtersByListType', () => {
  test('should have the correct keys', () => {
    expect(Object.keys(filtersByListType)).toEqual(['all'])
  })
})
