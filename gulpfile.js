var gulp = require('gulp');
var docs = require('gulp-ngdocs');
var rimraf = require('rimraf'); // rimraf directly
var connect = require('gulp-connect');
var webpack = require('webpack');
var gulpWebpack = require('gulp-webpack');

const output = './target/noderesources/doc';

gulp.task('ngdocs', ['webpack'], function () {
  return gulp.src('components/**/*.ts')
    .pipe(docs.process({
       title: "TomiTribe Components",
       scripts: [ 'build.js' ]
    }))
    .pipe(gulp.dest(output + '/ngdocs'));
});

gulp.task('webpack', ['clean-docs'], function () {
  return gulp.src('src/entry.js')
    .pipe(gulpWebpack(require('./webpack/webpack.docs.js'), webpack))
    .pipe(gulp.dest(output + '/ngdocs/js/'));
});

gulp.task('clean-docs', function (cb) {
  rimraf(output + '/ngdocs/*', cb);
});

gulp.task('default', ['ngdocs'], function() {
  // can need some adjustment now but ensure, "mvn package tomee:run" works
  connect.server({
    root: output + '/ngdocs',
    port: 8083,
    livereload: true,
    fallback: output + '/ngdocs/index.html'
  })
});