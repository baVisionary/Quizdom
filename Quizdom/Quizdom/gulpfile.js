var gulp     = require('gulp');
var sass     = require('gulp-sass');
var uglify   = require('gulp-uglify');
var concat   = require('gulp-concat');
var imagemin = require('gulp-imagemin');

/* FILE SOURCES */

var sources = [ ['wwwroot/sass/**/*.scss'], ['wwwroot/js/**/*.js'] ];

/* SASS TASKS */

gulp.task('sass', function() {
  return gulp.src('wwwroot/sass/components/extra.scss')
  .pipe(sass({
    outputStyle: 'compressed'
  }).on('error', sass.logError))
  .pipe(gulp.dest('wwwroot/dist/css'));
});

gulp.task('sass:watch', function() {
  return gulp.watch(sources[0], ['sass']);
});

/* JAVASCRIPT TASKS */

gulp.task('js:uglify', function() {
  return gulp.src(sources[1])
  .pipe(uglify({
    mangle: false
  }))
  .pipe(gulp.dest('dist/js'));
});

gulp.task('js:concat', function() {
  return gulp.src('js/**/*.js')
  .pipe(concat('app.min.js'))
  .pipe(gulp.dest('dist/js'));
});

gulp.task('js', ['js:uglify', 'js:concat']);

/* JQUERY TASKS */

gulp.task('jquery:uglify', function() {
  return gulp.src(sources[2])
  .pipe(uglify({
    mangle: false
  }))
  .pipe(gulp.dest('app/frontend/tmp/jquery'));
});

gulp.task('jquery:concat', function() {
  return gulp.src('app/frontend/tmp/jquery/**/*.js')
  .pipe(concat('ui.min.js'))
  .pipe(gulp.dest('app/frontend/dist/jquery'));
});

gulp.task('jquery', ['jquery:uglify', 'jquery:concat']);

/* WATCH ALL JAVASCRIPT FILES */

gulp.task('js:watch', function() {
  return gulp.watch([sources[1]], ['js', 'jquery']);
});

/* IMAGE COMPRESSION TASKS */

gulp.task('imagemin', function() {
  return gulp.src('images/**/*')
  .pipe(imagemin())
  .pipe(gulp.dest('assets/gfx-c'));
});