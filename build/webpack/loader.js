var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = require('./config');
var resolve = require('../utils').resolve;

var styleLoader = {
  loader: 'style-loader',
  options: {
    sourceMap: config.dev
  }
};

// vue-style
var vueStyleLoader = {
  loader: 'vue-style-loader',
  options: {
    sourceMap: config.dev
  }
};

// css
var cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: config.dev,
    modules: false,
    importLoaders: 1
  }
};

var moduleCSSLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: config.dev,
    modules: true,
    camelCase: 'only',
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:8]'
  }
};

// postcss
var postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: config.dev,
    config: {
      path: path.join(__dirname, './postcss.config.js')
    }
  }
};

var cssLoaders = config.dev ?
  [styleLoader, cssLoader, postCSSLoader]
  :
  ExtractTextPlugin.extract({
    fallback: styleLoader,
    use: [cssLoader, postCSSLoader]
  });

var vueCSSLoaders = config.dev ?
  [vueStyleLoader, cssLoader, postCSSLoader]
  :
  ExtractTextPlugin.extract({
    fallback: vueStyleLoader,
    use: [cssLoader, postCSSLoader]
  });

var moduleCSSLoaders = config.dev ?
  [styleLoader, moduleCSSLoader, postCSSLoader]
  :
  ExtractTextPlugin.extract({
    fallback: styleLoader,
    use: [moduleCSSLoader, postCSSLoader]
  });

exports.css = () => {
  return {
    test: /\.css$/,
    exclude: /\.module\.css$/,
    use: cssLoaders
  };
}

exports.cssModules = () => {
  return {
    test: /\.module\.css$/,
    use: moduleCSSLoaders
  };
}

// eslint
exports.eslint = () => {
  return {
    enforce: 'pre',
    test: /\.jsx?$/,
    loader: 'eslint-loader',
    include: resolve('src'),
    options: {
      fix: true,
      // cache: resolve('.cache/eslint'),
      // failOnError: !config.dev, // 生产环境发现代码不合法，则中断编译
      formatter: require('eslint-friendly-formatter'),
      baseConfig: {
        extends: [path.join(__dirname, './eslint.js')]
      }
    }
  };
}

// babel
exports.babel = () => {
  return {
    test: /\.jsx?$/,
    include: resolve('src'),
    use: {
      loader: 'babel-loader',
      options: Object.assign({
        cacheDirectory: resolve('.cache/babel')
      }, require(path.join(__dirname, './babel.js')))
    }
  };
}

exports.vue = () => {
  return {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      loaders: {
        css: vueCSSLoaders
      },
      cssModules: {
        camelCase: 'only',
        importLoaders: 1,
        localIdentName: '[local]___[hash:base64:8]'
      },
      cssSourceMap: config.dev,
      cacheBusting: true,
      transformToRequire: {
        video: ['src', 'poster'],
        source: 'src',
        img: 'src',
        image: 'xlink:href'
      }
    }
  }
}

// images
exports.images = (opt = {}) => {
  return {
    test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name:  opt.filename ? opt.filename : 'images/[name].[hash:8].[ext]'
        }
      },
      // 生产模式启用图片压缩
      !config.dev && {
        loader: 'imagemin-loader',
        options: {
          plugins: [
            {
              use: 'imagemin-pngquant'
            },
            {
              use: 'imagemin-mozjpeg'
            },
            // {
            //   use: 'imagemin-guetzli'
            // },
            // {
            //   use: 'imagemin-gifsicle'
            // },
            // {
            //   use: 'imagemin-svgo'
            // },
            // {
            //   use: 'imagemin-webp'
            // }
          ]
        }
      }
    ].filter(p => p)
  };
}

// fonts
exports.fonts = (opt = {}) => {
  return {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: opt.filename ? opt.filename : 'fonts/[name].[hash:8].[ext]'
    }
  };
}

// media
exports.medias = (opt = {}) => {
  return {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: opt.filename ? opt.filename : 'medias/[name].[hash:8].[ext]'
    }
  };
}

// text
exports.text = () => {
  return {
    test: /\.(md|txt|tpl)$/,
    loader: 'text-loader'
  };
}