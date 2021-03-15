export const userRoles = ['guest', 'user', 'admin', 'root'];

export const isUnset = (o) => typeof o === 'undefined' || o === null;

export const isSet = (o) => !isUnset(o);

export const isSameURL = (a, b) => a.split('?')[0] === b.split('?')[0];

export const isRelativeURL = (u) => u && u.length && /^\/[a-zA-Z0-9@\-%_~][/a-zA-Z0-9@\-%_~]*[?]?([^#]*)#?([^#]*)$/.test(u);

export const routeOption = (route, key, value) => route.matched.some((m) => {
  if (process.browser) {
    return Object.values(m.components).some(
      (component) => component.options && component.options[key] === value,
    );
  }
  // eslint-disable-next-line no-underscore-dangle
  return Object.values(m.components).some((component) => Object.values(component._Ctor).some(
    (ctor) => ctor.options && ctor.options[key] === value,
  ));
});

export const getMatchedComponents = (route, matches = false) => [].concat(
  ...route.matched.map((m, index) => Object.keys(m.components).map((key) => {
    matches.push(index);
    return m.components[key];
  })),
);

export function normalizePath(path = '') {
  let result = path.split('?')[0];

  if (result.charAt(result.length - 1) === '/') {
    result = result.slice(0, -1);
  }

  return result;
}
