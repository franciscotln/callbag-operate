# callbag-operate

Utility function for plugging callbags operators together in chain.
It differs from callbag-pipe in that it doesn't expect the first
function to be the source.
It takes as many operators as you want and executes them from
left to right and the right most function passed can be a sink.
The returned function expects the callbag source as argument so you can
combine operators together and reuse them for different sources.

`npm install callbag-operate`

## Examples

### Create operators chain and plug them to the source and sink via pipe
```js
const operate = require('callbag-operate');
const interval = require('callbag-interval');
const forEach = require('callbag-for-each');
const combine = require('callbag-combine');
const pipe = require('callbag-pipe');
const take = require('callbag-take');
const map = require('callbag-map');

const source = combine(interval(100), interval(350));

const mapAndTake10 = operate(
  map(([x, y]) => `X${x},Y${y}`),
  take(10)
);

const modifiedSource = pipe(
  source,
  mapAndTake10,
  forEach((x) => console.log(x)) // X2,Y0
);                               // X3,Y0
                                 // X4,Y0
                                 // X5,Y0
                                 // X6,Y0
                                 // X6,Y1
                                 // X7,Y1
                                 // X8,Y1
                                 // X9,Y1
                                 // X9,Y2
```

### Create operators chain with sink and plug them to the source via pipe
```js
const operate = require('callbag-operate');
const interval = require('callbag-interval');
const forEach = require('callbag-for-each');
const combine = require('callbag-combine');
const pipe = require('callbag-pipe');
const take = require('callbag-take');
const map = require('callbag-map');

const source = combine(interval(100), interval(350));

const mapAndObserve10 = operate(
  map(([x, y]) => `X${x},Y${y}`),
  take(10),
  forEach((x) => console.log(x))
);

const modifiedSource = pipe(
  source,
  mapAndObserve10 // X2,Y0
);                // X3,Y0
                  // X4,Y0
                  // X5,Y0
                  // X6,Y0
                  // X6,Y1
                  // X7,Y1
                  // X8,Y1
                  // X9,Y1
                  // X9,Y2

// Or
mapAndObserve10(source);
```