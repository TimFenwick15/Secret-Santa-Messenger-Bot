const santa = require('./secretSantaPairings')
const assert = require('assert')
const data = require('./data')
describe('convertExcludesToIncludes', function() {
  it('should invert the excludes array', function() {
    const data = {A:['A'], B:['B']}
    const test = santa.convertExcludesToIncludes(data)
    assert.deepEqual(test, {A:['B'],B:['A']})
  })
})

describe('addArrayLengthToKey', function() {
  it('should add the length of the array to the key', function() {
    const data = {A:['A'], B:['B']}
    const test = santa.addArrayLengthToKey(data)
    assert.deepEqual(test, {'A-1':['A'],'B-1':['B']})
  })
})

describe('sortPeopleByKeyNumber', function() {
  it('should place the keys in the correct order', function() {
    const data = {'A-3':1, 'B-2':2, 'C-1':3}
    const test = santa.sortPeopleByKeyNumber(data)
    const resultKeys = ['C-1', 'B-2', 'A-3']
    assert.deepEqual(resultKeys, Object.keys(test))
  })
})

describe('makePairings', function() {
  it('should pick the correct pairing', function() {
    const data = {'A-1':['A'], 'B-1':['B']}
    const test = santa.makePairings(data)
    assert.deepEqual(test, {A:'A',B:'B'})
  })
  it('should pick one of the correct solutions', function() {
    const data = {'A-2':['A', 'B'], 'B-2':['A', 'B']}
    const test = santa.makePairings(data, obj => obj[0])
    assert.deepEqual(test, {A:'A',B:'B'})
  })
  it('should report an error when no solution exists', function() {
    const data = {A:[]}
    const test = santa.makePairings(data)
    assert.equal(test, null)
  })
})

describe('sendMessages', function() {
  xit('should send pairings to participants', function() {
    //santa.sendMessages
  })
})
