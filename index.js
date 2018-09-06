/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author radiocity <radiocity@bk.ru>
*/
const Twig = require('twig');
const utils = require('loader-utils');

module.exports = function(source) {
    try {
        let query = utils.getOptions(this) || {},
            data = query.data || {},
            options = {
                path: require.resolve(this.resource),
                data: source,
                async: false,
                debug: Boolean(query.debug || false),
                trace: Boolean(query.trace || false),
                allowInlineIncludes: true
            },
            template = Twig.twig(options);
        if (query.cache !== true) {
            Twig.cache(false);
        }      
        return template.render(data);
    } catch (e) {
        this.callback(e);
        return '';
    } 
}