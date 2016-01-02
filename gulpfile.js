var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var postcss = require('gulp-postcss');
var unprefix = require('postcss-unprefix');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var path = require('path');
var connect = require('gulp-connect');

function handleError(err) {
  console.log(err.message);
  this.emit('end');
}

gulp.task('default', ['connect','watch']);

gulp.task('connect', function() {
  connect.server({
    root: ['dev'],
    livereload: true,
    fallback: 'dev/index.html'
  });
});

gulp.task('html', function() {
  gulp.src('./dev/*.html')
    .pipe(connect.reload());
});

gulp.task('less', function () {
  return gulp.src('./dev/assets/less/master.less')
    .pipe(less())
    .on('error', handleError)
    .pipe(postcss([
        unprefix,
        mqpacker,
        autoprefixer({browsers: ['last 3 version']})
    ]))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dev/assets/css'))
    .pipe(connect.reload());
});

// gulp.task('production', function() {
//
// });

gulp.task('watch', function() {
  gulp.watch('./dev/**/*.html', ['html']);
  gulp.watch('./dev/assets/less/**/*.less', ['less']);
});
