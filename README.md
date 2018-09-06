# twig-html-loader

A loader for webpack that allows compiling [twig](https://twig.symfony.com/) templates into html string.

## Getting Started

To begin, you'll need to install `twig-html-loader`:

```console
npm install twig-html-loader --save-dev
```

Add twig template to your sources:

```js
var html = require('./index.twig');
```

Then add the loader to your `webpack` config. For example:

```js
module.exports = {
  // ...
  rules: [
    // ...
    {
      test: /\.twig$/,
      use: [
        'raw-loader',
        {
          loader: 'twig-html-loader',
          options: {
            data: {}
          }
        }
      ]
    }
    // ...
  ]
};
```

  
## Using with html-webpack-plugin

Install plugin:

```console
npm install html-webpack-plugin --save-dev
```

Improve your config: 

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
// ...
module.exports = {
  // ...
  rules: [
    // ...
    {
      test: /\.twig$/,
      use: [
        'raw-loader',
        'twig-html-loader'
      ]
    }
    // ...
  ],
  plugins: [
    // ...
    new HtmlWebpackPlugin({
      template: 'index.twig'
    })
  ]
};
```

## Options

|Name|Type|Default|Description|
|--|--|-----|----------|
|cache|boolean|false|Enables the Twigjs cache|
|data|object|{}|The data that is exposed in the templates|
|debug|boolean|false|Enables debug info logging|
|trace|boolean|false|Enables tracing info logging|

## Alternatives

[twig-loader](https://github.com/zimmo-be/twig-loader)

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
