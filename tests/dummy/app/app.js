import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

const App = Application.extend({
  Resolver,
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix
});

loadInitializers(App, config.modulePrefix);

export default App;
