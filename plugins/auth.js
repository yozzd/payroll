import Auth from '../auth/class';

export default function auth(ctx, inject) {
  const client = ctx.app.apolloProvider.defaultClient;

  const $auth = new Auth(ctx, client);

  inject('auth', $auth);

  return $auth.init().catch((error) => {
    if (process.browser) {
      throw new Error(error);
    }
  });
}
