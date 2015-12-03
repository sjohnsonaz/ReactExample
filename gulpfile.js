var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var watchLess = require('gulp-watch-less');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");

var webpackConfig = require('./webpack.config');

gulp.task('clean', function() {
    return gulp.src('public/css')
        .pipe(clean({
            force: true
        }))
});

gulp.task('less:build', function() {
    return gulp.src('src/less/main.less')
        .pipe(less())
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('less:build-watch', ['less:build'], function() {
    return gulp.src('src/less/main.less')
        .pipe(watchLess('src/less/main.less', function() {
            gulp.start('less:build');
        }));
});

var webpackConfigProduction = Object.create(webpackConfig);
webpackConfigProduction.plugins = webpackConfigProduction.plugins.concat(
    new webpack.DefinePlugin({
        "process.env": {
            // This has effect on the react lib size
            "NODE_ENV": JSON.stringify("production")
        }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
);
var webpackCompilerProduction = webpack(webpackConfigProduction);

gulp.task('webpack:build', function(callback) {
    webpackCompilerProduction.run(function(err, stats) {
        if (err) {
            gutil.error("[webpack:build]", err.toString({
                colors: true
            }));
            throw new gutil.PluginError("webpack:build", err);
        } else {
            gutil.log("[webpack:build]", stats.toString({
                colors: true
            }));
        }
        callback();
    });
});

var webpackConfigDev = Object.create(webpackConfig);
webpackConfigDev.plugins = webpackConfigDev.plugins.concat(
    //new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
);
webpackConfigDev.devtool = "sourcemap";
webpackConfigDev.debug = true;
var webpackCompilerDev = webpack(webpackConfigDev);

gulp.task('webpack:build-dev', function(callback) {
    webpackCompilerDev.run(function(err, stats) {
        if (err) {
            gutil.error("[webpack:build-dev]", err.toString({
                colors: true
            }));
            throw new gutil.PluginError("webpack:build-dev", err);
        } else {
            //gutil.log("[webpack:build-dev]", stats.toString({
            //colors: true
            //}));
        }
        callback();
    });
});

gulp.task('webpack:server', function(callback) {
    var server = new WebpackDevServer(webpack(webpackConfigDev), {
        publicPath: webpackConfigDev.output.publicPath,
        hot: true,
        historyApiFallback: true
    }).listen(3000, 'localhost', function(err, result) {
        if (err) {
            console.log(err);
        }

        console.log('Listening at localhost:3000');
    });
})

gulp.task("webpack:build-watch", ["webpack:build-dev"], function() {
    gulp.watch(["src/js/**/*"], ["webpack:build-dev"]);
});

gulp.task('default', ['less:build', 'webpack:build']);

gulp.task('dev', ['less:build-watch', 'webpack:build-watch']);

gulp.task('dev-server', ['less:build-watch', 'webpack:server']);
