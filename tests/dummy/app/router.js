import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

// tslint:disable-next-line no-empty
Router.map(function() {});

export default Router;
