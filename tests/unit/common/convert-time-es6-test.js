import { module, test } from 'qunit';
import * as convertTime from 'merlin/common/convert-time-es6';

module('Unit | Common | convert-time-es6 | quarterToBackend() | phase start');

test('1', function(assert) {
  let time = {
    year : 2017,
    value : 1,
  }
  let expected = '2016-07-01'
  let result = convertTime.quarterToBackend({
    time : time
  })
  let message = `expected: ${expected}, result : ${result}`
  assert.equal(result, expected, message);
});

test('2', function(assert) {
  let time = {
    year : 2017,
    value : 2,
  }
  let expected = '2016-10-01'
  let result = convertTime.quarterToBackend({
    time : time
  })
  let message = `expected: ${expected}, result : ${result}`
  assert.equal(result, expected, message);
});

test('3', function(assert) {
  let time = {
    year : 2017,
    value : 3,
  }
  let expected = '2017-01-01'
  let result = convertTime.quarterToBackend({
    time : time
  })
  let message = `expected: ${expected}, result : ${result}`
  assert.equal(result, expected, message);
});

test('4', function(assert) {
  let time = {
    year : 2017,
    value : 4,
  }
  let expected = '2017-04-01'
  let result = convertTime.quarterToBackend({
    time : time
  })
  let message = `expected: ${expected}, result : ${result}`
  assert.equal(result, expected, message);
});


module('Unit | Common | convert time | quarterToBackend() | phase end');

test('1', function(assert) {
  let time = {
    year : 2017,
    value : 1,
  }
  let expected = '2016-09-30'
  let result = convertTime.quarterToBackend({
    time : time,
    isEndDate : true
  })
  let message = `expected: ${expected}, result : ${result}`
  assert.equal(result, expected, message);
});

test('2', function(assert) {
  let time = {
    year : 2017,
    value : 2,
  }
  let expected = '2016-12-31'
  let result = convertTime.quarterToBackend({
    time : time,
    isEndDate : true
  })
  let message = `expected: ${expected}, result : ${result}`
  assert.equal(result, expected, message);
});

test('3', function(assert) {
  let time = {
    year : 2017,
    value : 3,
  }
  let expected = '2017-03-31'
  let result = convertTime.quarterToBackend({
    time : time,
    isEndDate : true
  })
  let message = `expected: ${expected}, result : ${result}`
  assert.equal(result, expected, message);
});

test('4', function(assert) {
  let time = {
    year : 2017,
    value : 4,
  }
  let expected = '2017-06-30'
  let result = convertTime.quarterToBackend({
    time : time,
    isEndDate : true
  })
  let message = `expected: ${expected}, result : ${result}`
  assert.equal(result, expected, message);
});




module('Unit | Common | convert-time-es6 | toQuater() | phase start');

test('1', function(assert) {
  let time = '2016-07-01'
  let expected = {
    year : 2017,
    value : 1,
  }
  let result = convertTime.toQuater( time )
  let message = `expected: ${expected}, result : ${result}`
  assert.deepEqual(result, expected, message);
});

test('2', function(assert) {
  let time = '2016-10-01'
  let expected = {
    year : 2017,
    value : 2,
  }
  let result = convertTime.toQuater( time )
  let message = `expected: ${expected}, result : ${result}`
  assert.deepEqual(result, expected, message);
});

test('3', function(assert) {
  let time = '2017-01-01'
  let expected = {
    year : 2017,
    value : 3,
  }
  let result = convertTime.toQuater( time )
  let message = `expected: ${expected}, result : ${result}`
  assert.deepEqual(result, expected, message);
});

test('4', function(assert) {
  let time = '2017-04-01'
  let expected = {
    year : 2017,
    value : 4,
  }
  let result = convertTime.toQuater( time )
  let message = `expected: ${expected}, result : ${result}`
  assert.deepEqual(result, expected, message);
});


module('Unit | Common | convert time | toQuater() | phase end');

test('1', function(assert) {
  let time = '2016-09-30'
  let expected = {
    year : 2017,
    value : 1,
  }
  let result = convertTime.toQuater( time )
  let message = `expected: ${expected}, result : ${result}`
  assert.deepEqual(result, expected, message);
});

test('2', function(assert) {
  let time = '2016-12-31'
  let expected = {
    year : 2017,
    value : 2,
  }
  let result = convertTime.toQuater( time )
  let message = `expected: ${expected}, result : ${result}`
  assert.deepEqual(result, expected, message);
});

test('3', function(assert) {
  let time = '2017-03-31'
  let expected = {
    year : 2017,
    value : 3,
  }
  let result = convertTime.toQuater( time )
  let message = `expected: ${expected}, result : ${result}`
  assert.deepEqual(result, expected, message);
});

test('4', function(assert) {
  let time = '2017-06-30'
  let expected = {
    year : 2017,
    value : 4,
  }
  let result = convertTime.toQuater( time )
  let message = `expected: ${expected}, result : ${result}`
  assert.deepEqual(result, expected, message);
});
