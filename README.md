# ember-qunit-snapshots

[![Build Status](https://travis-ci.org/mike-north/ember-qunit-snapshots.svg?branch=master)](https://travis-ci.org/mike-north/ember-qunit-snapshots)
[![Version](https://img.shields.io/npm/v/ember-qunit-snapshots.svg)](https://www.npmjs.com/package/ember-qunit-snapshots)

## Installation

```
ember install ember-qunit-snapshots
```

## Why you shouldn't use snapshot testing

For a certain _narrow_ subset of software tests, a lot of time can be saved by asserting against a known value that was obtained at runtime called a "snapshot". However, there are MANY pitfalls involved with relying heavily on _only_ snapshot tests for release confidence. [Justin Searls articulates many of these issues well](https://twitter.com/searls/status/919594505938112512)

> Takes on snapshot testing schemes to follow. There are numerous categories of failures surrounding snapshot testing. Most of this is informed by my experience in 2008–2011 when QA teams thought Selenium RC record playback scripts were a panacea, but I’ve seen the same thing with tools like VCR in Ruby, HTML fixtures in JS tests, and other attempts at “easy” controls over API & DB dependencies:
>
> They are tests you don’t understand, so when they fail, you don’t usually understand why or how to fix it. That means you have to do true/false negative analysis & then suffer indirection as you debug how to resolve the issue
>
> Good tests encode the developer’s intention, they don’t only lock in the test’s behavior without editorialization of what’s important and why. Snapshot tests lack (or at least, fail to encourage) expressing the author’s intent as to what the code does (much less why)
>
> They are generated files, and developers tend to be undisciplined about scrutinizing generated files before committing them, if not at first then definitely over time. Most developers, upon seeing a snapshot test fail, will sooner just nuke the snapshot and record a fresh passing one instead of agonizing over what broke it.
>
> Because they’re more integrated and try to serialize an incomplete system (e.g. one with some kind of side effects: from browser/library/runtime versions to environment to database/API changes), they will tend to have high false-negatives (failing test for which the production code is actually fine and the test just needs to be changed). False negatives quickly erode the team’s trust in a test to actually find bugs and instead come to be seen as a chore on a checklist they need to satisfy before they can move on to the next thing.
> These four things lead to a near total loss in the intended utility of integrated/functional tests: as the code changes make sure nothing is broken.
> Instead, when the code changes, the tests will surely fail, but determining whether and what is actually “broken” by that failure is the more painful path than simply re-recording & committing a fresh snapshot. (After all, it’s not like the past snapshot was well understood or carefully expressed authorial intent.) As a result, if a snapshot test fails because some intended behavior disappeared, then there’s little stated intention describing it and we’d much rather regenerate the file than spend a lot of time agonizing over how to get the same test green again.

## Where snapshots make sense

A narrow subset of cases where snapshots are generally accepted:

- Very simple pure functions that are unlikely to change much over time
- Error messages
- JSON serialization
- Value formatting

When evaluating whether a snapshot may be appropriate for a given situation, you have to commit to carefully evaluating any changes to snapshots that may result from code changes. Blindly overwriting snapshots is an extremely bad practice, and often removes nearly 100% of the value of the test.

## Usage

First, install this qunit plugin in your app

```sh
ember install ember-qunit-snapshots
```

then, in your `./tests/test-helper.js` (or `.ts`), ensure the snapshots are installed and set up before kicking off your tests

```ts
// ---- ./tests/test-helper.js ----

import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

// import the install hook
import { install } from 'ember-qunit-snapshots/test-support';

// pass in the QUnit global
install(QUnit).then(() => {
  // wait for the promise to resolve
  // only then, do the stuff that's typically necessary for ember to set up for testing
  setApplication(Application.create(config.APP));
  start();
});
```

Now in your tests, you may use a new method available on the QUnit assert object

```ts
// ---- tests/integration/components/x-foo-test.ts ---

import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

// Define a test module as usual
module('Integration | Component | x-foo', hooks => {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Render a component as usual
    await render(hbs`{{x-foo}}`);
    // >> 📸 SNAPSHOT 📸 <<
    assert.snapshot(
      this.element, // Value to snapshot
      'x-foo component with no parameters' // Mandatory description
    );
  });
});
```

The first time you run this test it will _always_ pass. This is where the snapshot is created. For this example, we'd find a `__snapshots__` folder in the root of our project, containing a file like this

```js
// ---- __snapshots__/integration-component-x-foo.snapshot.js ----

exports['it-renders-x-foo-component-with-no-parameters'] = `
<div class="ember-view"><div class="ember-view"><h1>This is a test</h1>
<p>To see if snapshots work with components</p></div></div>
`;
```

Every time this test is re-run, the [`outerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML) of this element will be re-captured and compared against this value. **Snapshots should be committed to your git repo, as a known good value that future versions of your app may assert against**

## Contributing

### Installation

- `git clone <repository-url>`
- `cd ember-qunit-snapshots`
- `yarn install`

### Linting

- `yarn lint:hbs`
- `yarn lint:js`
- `yarn lint:js --fix`

### Running tests

- `ember test` – Runs the test suite on the current Ember version
- `ember test --server` – Runs the test suite in "watch mode"
- `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

- `ember serve`
- Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

## License

This project is licensed under the [BSD-2-Clause License](LICENSE.md).
