var gulp = require('gulp');
var docs = require('gulp-ngdocs');
var rimraf = require('rimraf'); // rimraf directly
var connect = require('gulp-connect');
var webpack = require('webpack');
var gulpWebpack = require('gulp-webpack');
//var connect = require('gulp-connect-multi')();

gulp.task('ngdocs', ['webpack'], function () {
  var options = {
    html5Mode: true,
    title: "TomiTribe Components",
    scripts: [
      './docs/static/build.js'
    ],
    styles: [
      './docs/styles/doc.css'
    ]
  };
  return gulp.src('components/**/*.ts')
    .pipe(docs.process(options))
    .pipe(gulp.dest('./docs/ngdocs'));
});

gulp.task('webpack', ['clean-docs'], function () {
  return gulp.src('src/entry.js')
    .pipe(gulpWebpack(require('./webpack/webpack.docs.js'), webpack))
    .pipe(gulp.dest('docs/static'));
});

gulp.task('clean-docs', function (cb) {
  rimraf('./docs/ngdocs/*', function () {
    rimraf('./docs/static/*', cb)
  });
});

gulp.task('default', ['ngdocs'], function() {
  connect.server({
    root: './docs/ngdocs',// './docs/static'],
    port: 8083,
    livereload: true,
    fallback: './docs/ngdocs/index.html'
  })

});