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

/**
 * Vérifie que *expected* et *actual* sont égaux et de même type.
 *
 * @param {T} expected
 * @param {T} actual
 * @template T
 */
export const assertEquals = function (expected, actual) {
  let difference = expected !== actual;
  if (Array.isArray(expected) && Array.isArray(actual)) {
    difference = expected.length !== actual.length || expected.some((val, i) => val !== actual[i])
  }
  if (difference) {
    throw new AssertionFailed('Expected:', expected, '\n Actual:', actual)
  }
};

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
