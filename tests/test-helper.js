import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import { install } from 'ember-qunit-snapshots/test-support';

install(QUnit).then(() => {
  setApplication(Application.create(config.APP));
  start();
});
