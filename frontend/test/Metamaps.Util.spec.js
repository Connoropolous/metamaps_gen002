/* global describe, it */

import chai from 'chai'

import Util from '../src/Metamaps/Util'

const { expect } = chai

describe('Metamaps.Util.js', function () {
  describe('splitLine', function() {
    it('splits on words', function() {
      expect(Util.splitLine('test test test', 10))
        .to.equal('test test\ntest')
    })
    // TODO this test seems like it's incorrect behaviour
    it('splits mid-word if need be', function() {
      expect(Util.splitLine('test test', 2))
        .to.equal("te\nt\nte\nt")
    })
    it('splits words over 30 chars', function() {
      expect(Util.splitLine('suprainterpostantidisestablishmentarianism', 30))
        .to.equal("suprainterpostantidisestablish\nentarianism")
    })
  })
  describe('nowDateFormatted', function() {
    // TODO need `Date`
  })
  describe('decodeEntities', function() {
    // TODO need `document`
  })
  describe('getDistance', function() {
    it('(0,0) -> (0,0) = 0', function() {
      expect(Util.getDistance({ x: 0, y: 0 }, { x: 0, y: 0 }))
        .to.equal(0)
    })
    it('(-5,0) -> (5,0) = 10', function() {
      expect(Util.getDistance({ x: -5, y: 0 }, { x: 5, y: 0 }))
        .to.equal(10)
    })
    it('(0,0) -> (5,7) = 8.6023', function() {
      expect(Util.getDistance({ x: 0, y: 0 }, { x: 5, y: 7 }).toFixed(4))
        .to.equal('8.6023')
    })
  })
})
