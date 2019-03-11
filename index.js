/* eslint prefer-arrow-callback: 0 */
/* eslint no-shadow: 0 */

const Twig = require('twig');
const utils = require('loader-utils');
const path = require('path');

// https://github.com/twigjs/twig.js/issues/608
const normalizeNamespaces = function normalizeNamespacesPathnames(namespaces) {
  if (namespaces && typeof namespaces !== 'object') {
    throw new Error('namespaces option should be an object');
  }
  const result = namespaces || {};
  Object.keys(result).forEach((key) => {
    if (typeof result[key] === 'string') {
      result[key] += path.sep;
    }
  });
  return result;
};

module.exports = function loader(source) {
  try {
    const query = utils.getOptions(this) || {};
    let data = query.data || {};
    const templateFile = require.resolve(this.resource);
    const options = {
      path: templateFile,
      data: source,
      async: false,
      debug: Boolean(query.debug || false),
      trace: Boolean(query.trace || false),
      allowInlineIncludes: true,
      rethrow: true,
      namespaces: normalizeNamespaces(query.namespaces),
    };

    if (query.cache !== true) {
      Twig.cache(false);
    }

    if (query.functions) {
      Object.entries(query.functions).forEach(([name, fn]) => Twig.extendFunction(name, fn));
    }

    if (query.filters) {
      Object.entries(query.filters).forEach(([name, fn]) => Twig.extendFilter(name, fn));
    }

    if (query.tests) {
      Object.entries(query.tests).forEach(([name, fn]) => Twig.extendTest(name, fn));
    }

    if (query.extend) {
      Twig.extend(query.extend);
    }

    if (typeof data === 'function') {
      data = data(this);
      if (typeof data !== 'object') {
        this.emitError('data parameter should return an object');
      }
    }

    const registry = [];

    Twig.extend((Twig) => {
      const defaultSave = Object.assign(Twig.Templates.save);
      // eslint-disable-next-line no-param-reassign
      Twig.Templates.save = function customSave(template) {
        registry.push(path.normalize(template.path));
        return defaultSave.call(this, template);
      };
    });

    const template = Twig.twig(options);
    const output = template.render(data);

    registry.forEach(this.addDependency);

    Twig.extend((Twig) => {
      // eslint-disable-next-line no-param-reassign
      Twig.Templates.registry = {};
    });
    return output;
  } catch (e) {
    this.callback(e);
    return '';
  }
};
