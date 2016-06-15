import { module, test } from 'qunit';
import * as convertTime from 'merlin/common/convert-time-es6';

module('Unit | Common | convert time | quarter format to backend | phase start');

test('quarter format to backend for phase start 1', function(assert) {
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

test('quarter format to backend for phase start 2', function(assert) {
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

test('quarter format to backend for phase start 3', function(assert) {
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

test('quarter format to backend for phase start 4', function(assert) {
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


test('quarter format to backend for phase end 1', function(assert) {
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

test('quarter format to backend for phase end 2', function(assert) {
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

test('quarter format to backend for phase end 3', function(assert) {
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

test('quarter format to backend for phase end 4', function(assert) {
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






// (function() {
//     var module = '',
//         test = '',
//         lastModuleLogged = '',
//         lastTestLogged = '',
//         failuresOnCurrentTest = 0,
//         failureFound = false;

//     QUnit.moduleStart(function(details) {
//         module = details.name;
//     });
//     QUnit.testStart(function(details) {
//         test = details.name;
//     });

//     QUnit.log(function(details) {
//         if (!details.result) {
//             if (!failureFound) {
//                 failureFound = true;
//                 console.log('');
//                 console.log('/*********************************************************************/');
//                 console.log('/************************** FAILURE SUMMARY **************************/');
//                 console.log('/*********************************************************************/');
//             }

//             if (lastModuleLogged != module) {
//                 console.log('');
//                 console.log('-----------------------------------------------------------------------');
//                 console.log('Module: ' + module);
//             }

//             if (lastTestLogged != test) {
//                 failuresOnCurrentTest = 1;
//                 console.log('-----------------------------------------------------------------------');
//                 console.log('Test: ' + test);
//             } else {
//                 failuresOnCurrentTest++;
//             }

//             console.log(' ' + failuresOnCurrentTest + ') Message: ' + details.message);
//             if (typeof details.expected !== 'undefined') {
//                 console.log('    Expected: ' + details.expected);
//                 console.log('    Actual: ' + details.actual);
//             }
//             if (typeof details.source !== 'undefined') {
//                 console.log('    Source: ' + details.source);
//             }

//             lastModuleLogged = module;
//             lastTestLogged = test;
//         }
//     });

//     QUnit.done(function(details) {
//         if (details.failed > 0) {
//             console.log('-----------------------------------------------------------------------');
//             console.log('');
//         }
//     });
// }());





