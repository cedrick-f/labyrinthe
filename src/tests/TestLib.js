/**
 * Liste les tests à exécuter.
 *
 * @param {Object.<string, function (): void>} tests
 */
export const tests = function (tests) {
  const results = {};
  for (const [testName, testAction] of Object.entries(tests)) {
    try {
      testAction();
      console.log("%cTest " + testName + ':', 'font-weight: bold; color: #1b5725;', "OK")
      results[testName] = true;
    } catch (e) {
      results[testName] = false;
      if (e instanceof AssertionFailed) {
        e.log("%cTest " + testName + ':')
      } else {
        console.error("%cTest " + testName + ':', 'font-weight: bold;', e)
      }
    }
  }
  if (document.body) {
    document.head.insertAdjacentHTML("beforeend", `<style>table{border-collapse: collapse;color: #202020;font-family: sans-serif}tr{border-bottom: solid #d0d0d0 1px}td:not(:first-child){padding-left: 5em}</style>`)
    const table = document.createElement('table')
    for (const [testName, success] of Object.entries(results)) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${testName}</td><td style="color: ${success ? SUCCESS_COLOR : FAILURE_COLOR}">${success ? 'OK' : 'Failure'}</td>`
      table.appendChild(tr)
    }
    document.body.appendChild(table)
  }
};

const deepEquals = function (expected, actual) {
    if (Array.isArray(expected) && Array.isArray(actual)) {
        return expected.length === actual.length && expected.every((val, i) => val === actual[i])
    }
    if (expected instanceof Set && actual instanceof Set) {
        if (expected.size !== actual.size) {
            return false
        }
        for (const e of expected) {
            if (!actual.has(e)) {
                return false
            }
        }
        return true
    }
    if (typeof expected === 'object' && typeof actual === 'object') {
        return Object.keys(expected).length === Object.keys(actual).length
            && Object.keys(expected).every(p => deepEquals(expected[p], actual[p]));
    }
    return expected === actual
}

/**
 * Vérifie que *expected* et *actual* sont égaux et de même type.
 *
 * @param {T} expected
 * @param {T} actual
 * @template T
 */
export const assertEquals = function (expected, actual) {
    if (!deepEquals(expected, actual)) {
        throw new AssertionFailed('Expected:', expected, '\n Actual:', actual)
    }
};

export const assertContains = function (expected, actual) {
    expected = Array.isArray(expected) ? expected : [expected]
    if (typeof actual[Symbol.iterator] !== 'function') {
        throw new AssertionFailed('Expected an iterable, got:', actual)
    }
    if (expected.length !== (typeof actual.length === 'number' ? actual.length : actual.size)) {
        throw new AssertionFailed('Expected:', expected, '\n Actual:', actual)
    }
    for (const expectedValue of expected) {
        let found = false
        for (const e of actual) {
            if (deepEquals(expectedValue, e)) {
                found = true
                break
            }
        }

        if (!found) {
            throw new AssertionFailed('Expected the iterable to contains:', expected, '\n Actual:', actual)
        }
    }
}

class AssertionFailed extends Error {

  constructor(...args) {
    super('Assertion failed');
    this.args = args;
  }

  log(prefix) {
    console.error(prefix, 'font-weight: bold', this.message, '\n', ...this.args);
  }
}

const FAILURE_COLOR = '#b60808';
const SUCCESS_COLOR = '#008000';
