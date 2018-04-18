const test = require('tape');
const filter = require('callbag-filter');
const forEach = require('callbag-for-each');
const fromIter = require('callbag-from-iter');
const map = require('callbag-map');
const pipe = require('callbag-pipe');
const operate = require('./index');

test('it calls first-order functions in sequence LTR', (t) => {
  t.plan(1);

  const operations = operate(
    x => x * 10, // 20
    x => x - 3, // 17
    x => x + 5 // 22
  );

  const res = pipe(
    2, // 2
    operations
  );

  t.equals(res, 22);
});

test('it calls first-order functions in a nested pipe', (t) => {
  t.plan(1);

  const res = pipe(
    2, // 2
    operate(
      x => x * 10, // 20
      x => x - 3 // 17
    ),
    x => x + 5 // 22
  );

  t.equals(res, 22);
});

test('it calls higher-order callbacks in sequence LTR', (t) => {
  t.plan(2);

  const operations = operate(
    prev => cb => prev(x => cb(x * 10)), // 20
    prev => cb => prev(x => cb(x - 3)), // 17
    prev => cb => prev(x => cb(x + 5)) // 22
  );

  const res = pipe(
    cb => cb(2), // 2
    operations
  );

  t.equals(typeof res, 'function');

  res((x) => {
    t.equals(x, 22);
    t.end();
  });
});

test('it can be nested in pipes', (t) => {
  t.plan(2);

  const res = pipe(
    cb => cb(2), // 2
    operate(
      prev => cb => prev(x => cb(x * 10)), // 20
      prev => cb => prev(x => cb(x - 3)) // 17
    ),
    prev => cb => prev(x => cb(x + 5)) // 22
  );

  t.equals(typeof res, 'function');

  res((x) => {
    t.equals(x, 22);
    t.end();
  });
});

test('it works with common callbag utilities', (t) => {
  t.plan(2);
  const expected = [1, 3];

  const operateAndObserve = operate(
    map(x => x / 10),
    filter(x => x % 2),
    forEach((x) => {
      t.equals(x, expected.shift());
      if (expected.length === 0) {
        t.end();
      }
    })
  );

  operateAndObserve(fromIter([10, 20, 30, 40]));
});

test('it can be nested with callbag utilities', (t) => {
  t.plan(2);

  const expected = [1, 3];

  pipe(
    fromIter([10, 20, 30, 40]),
    operate(
      map(x => x / 10),
      filter(x => x % 2)
    ),
    forEach((x) => {
      t.equals(x, expected.shift());
      if (expected.length === 0) {
        t.end();
      }
    })
  );
});