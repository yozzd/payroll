import Vue from 'vue';
import getProp from 'dotprop';

export default class Storage {
  constructor(ctx, options) {
    this.ctx = ctx;
    this.options = options;

    this.initState();
  }

  initState() {
    Vue.set(this, 'tstate', {});

    this.useVuex = this.options.vuex && this.ctx.store;

    if (this.useVuex) {
      const storeModule = {
        namespaced: true,
        state: () => this.options.initialState,
        mutations: {
          SET(state, payload) {
            Vue.set(state, payload.key, payload.value);
          },
        },
      };

      this.ctx.store.registerModule(this.options.vuex.namespace, storeModule, {
        preserveState: Boolean(
          this.ctx.store.state[this.options.vuex.namespace],
        ),
      });

      this.state = this.ctx.store.state[this.options.vuex.namespace];
    } else {
      Vue.set(this, 'state', {});
    }
  }

  watchState(key, fn) {
    return this.ctx.store.watch(
      (state) => getProp(state[this.options.vuex.namespace], key),
      fn,
    );
  }

  setUniversal(key, value) {
    this.setState(key, value);
    return value;
  }

  getUniversal(key) {
    const value = this.getState(key);
    return value;
  }

  setState(key, value) {
    if (key[0] === '_') {
      Vue.set(this.tstate, key, value);
    } else if (this.useVuex) {
      this.ctx.store.commit(`${this.options.vuex.namespace}/SET`, {
        key,
        value,
      });
    } else {
      Vue.set(this.state, key, value);
    }

    return value;
  }

  getState(key) {
    if (key[0] !== '_') {
      return this.state[key];
    }
    return this.tstate[key];
  }
}
