import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import { setupSnapshots } from 'ember-qunit-snapshots';

setApplication(Application.create(config.APP));
setupSnapshots().then(start);
