/* eslint-disable import/no-extraneous-dependencies, global-require, no-console */

const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('dist',
  () => gulp.src('src/marionette.virtual-dom.js')
            .pipe(babel())
            .pipe(gulp.dest('dist')));
