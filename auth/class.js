import Storage from './storage';
import {
  routeOption,
  isRelativeURL,
  isSameURL,
  userRoles,
} from './utilities';
import AUTH from '../apollo/query/auth';
import { Me } from '../apollo/query/user';

export default class Auth {
  constructor(ctx, client) {
    this.ctx = ctx;
    this.client = client;
    this.options = {
      resetOnError: true,
      rewriteRedirects: true,
      fullPathRedirect: false,
      watchLoggedIn: true,
      initialState: { user: null, loggedIn: false },
      redirect: {
        home: '/dashboard/',
        login: '/',
        callback: '/',
        logout: '/',
        guard: '/guard',
      },
      vuex: {
        namespace: 'auth',
      },
    };

    this.errorListeners = [];

    const storage = new Storage(this.ctx, this.options);

    this.$storage = storage;
    this.$state = storage.state;
  }

  async init() {
    if (this.options.resetOnError) {
      this.onError((...args) => {
        if (
          typeof this.options.resetOnError !== 'function'
          || this.options.resetOnError(...args)
        ) {
          this.reset();
        }
      });
    }

    try {
      await this.mounted();
    } catch (error) {
      this.callOnError(error);
    } finally {
      if (process.client && this.options.watchLoggedIn) {
        this.$storage.watchState('loggedIn', (loggedIn) => {
          if (!routeOption(this.ctx.route, 'auth', false)) {
            this.redirect(loggedIn ? 'home' : 'logout');
          }
        });
      }
    }
  }

  mounted() {
    try {
      return this.fetchUserOnce();
    } catch (err) {
      this.callOnError(err, { method: 'mounted' });
      return Promise.reject(err);
    }
  }

  fetchUserOnce(...args) {
    if (!this.$state.user) {
      return this.fetchUser(...args);
    }
    return Promise.resolve();
  }

  async login(user) {
    try {
      await this.logout();

      const { data: { auth: { token } } } = await this.client.query({
        query: AUTH,
        variables: {
          username: user.username,
          password: user.password,
        },
      });

      await this.ctx.$apolloHelpers.onLogin(token);

      return this.fetchUser();
    } catch (err) {
      this.callOnError(err, { method: 'login' });
      return Promise.reject(err);
    }
  }

  async logout() {
    try {
      await this.reset();
      await this.ctx.$apolloHelpers.onLogout();
      return Promise.resolve();
    } catch (err) {
      this.callOnError(err, { method: 'logout' });
      return Promise.reject(err);
    }
  }

  async fetchUser() {
    try {
      if (!this.ctx.$apolloHelpers.getToken()) {
        return {};
      }

      const { data: { me } } = await this.client.query({
        query: Me,
        fetchPolicy: 'no-cache',
      });

      this.setUser(me);
      return Promise.resolve();
    } catch (err) {
      this.callOnError(err, { method: 'fetchUser' });
      return Promise.reject(err);
    }
  }

  reset() {
    this.setUser(false);
    return Promise.resolve();
  }

  setUser(user) {
    this.$storage.setState('loggedIn', Boolean(user));
    this.$storage.setState('user', user);
  }

  onError(listener) {
    this.errorListeners.push(listener);
  }

  callOnError(error, payload = {}) {
    this.error = error;

    this.errorListeners.map((fn) => fn(error, payload));
  }

  redirect(name, noRouter = false) {
    if (!this.options.redirect) {
      return;
    }

    const from = this.options.fullPathRedirect
      ? this.ctx.route.fullPath
      : this.ctx.route.path;

    let to = this.options.redirect[name];
    if (!to) {
      return;
    }

    if (this.options.rewriteRedirects) {
      if (name === 'login' && isRelativeURL(from) && !isSameURL(to, from)) {
        this.$storage.setUniversal('redirect', from);
      }

      if (name === 'home') {
        const redirect = this.$storage.getUniversal('redirect');
        this.$storage.setUniversal('redirect', null);

        if (isRelativeURL(redirect)) {
          to = redirect;
        }
      }
    }

    if (isSameURL(to, from)) {
      return;
    }

    if (process.browser) {
      if (noRouter) {
        window.location.replace(to);
      } else {
        this.ctx.redirect(to);
      }
    } else {
      this.ctx.redirect(to);
    }
  }

  hasRole(role) {
    if (!this.$state.user) {
      return false;
    }
    return Boolean(
      userRoles.indexOf(this.$state.user.role) >= userRoles.indexOf(role),
    );
  }
}
