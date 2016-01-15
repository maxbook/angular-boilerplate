var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var unprefix = require('postcss-unprefix');
var autoprefixer = require('autoprefixer');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var inject = require('gulp-inject');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var useref = require('gulp-useref');
var templateCache = require('gulp-angular-templatecache');
var runSequence = require('run-sequence');
var del = require('del');

function handleError(err) {
  console.log(err.message);
  this.emit('end');
}

var files = {
  dev : {
    css : 'src/assets/css',
    indexHtml : 'src/index.html',
    js : 'src/app'
  },
  dist : {
    css : 'dist/assets/css',
    js : 'dist/app',
    indexHtml : 'dist/index.html'
  },
  less : [
    'src/assets/less/reset.less',
    'src/assets/less/variables_mixins.less',
    'src/assets/less/typography.less',
    'src/assets/less/layout.less',
    'src/assets/less/master.less',
    'src/app/partials/**/*.less',
    'src/app/components/**/*.less',
    'src/app/common/directives/**/*.less'
  ],
  html : [
    'src/*.html',
    'src/app/partials/**/*.html',
    'src/app/components/**/*.html',
    'src/app/common/directives/**/*.html'
  ],
  angularTemplate : [
    'src/app/**/*.html',
    'src/app/**/*.html',
    'src/app/common/**/*.html'
  ],
  js : [
    'src/app/app.module.js',
    'src/app/app.routes.js',
    'src/app/*.js',
    'src/app/components/**/*.js',
    'src/app/common/**/*.js'
  ]
}

gulp.task('connect', function() {
  connect.server({
    root: ['src'],
    livereload: true,
    fallback: files.dev.indexHtml
  });
});

gulp.task('reload', function() {
    gulp.src(files.dev.indexHtml)
      .pipe(connect.reload());
});

gulp.task('less', function () {
  return gulp.src(files.less)
    .pipe(concat('master.css'))
    .pipe(less())
    .on('error', handleError)
    .pipe(postcss([
      unprefix,
      autoprefixer({browsers: ['last 3 version']})
    ]))
    .pipe(cssnano())
    .pipe(gulp.dest(files.dev.css));
});

gulp.task('inject-dependency', function () {
  var sources = files.js;
  sources.push(files.dev.css+'/*.css');
  return gulp.src(files.dev.indexHtml)
    .pipe(inject(gulp.src(sources, {read: false}), {relative: true}))
    .pipe(gulp.dest('src'));
});

gulp.task('build:angular-template-cache', function() {
  return gulp.src(files.angularTemplate)
    .pipe(templateCache({filename:'app.templates.js', module:'app', root:'app/'}))
    .pipe(gulp.dest('src/app'));
});

gulp.task('build:inject-dependency', function () {
  return gulp.src(files.dev.indexHtml)
    .pipe(inject(gulp.src([files.dev.css+'/*.css', files.dev.js+'/app.min.js'], {read: false}), {relative: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:concat-src', function () {
    return gulp.src(files.dist.indexHtml)
        .pipe(useref({ searchPath: 'src' }))
        .pipe(gulpif('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:script', function () {
  return gulp.src(files.js)
    .pipe(concat('app.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(files.dev.js));
});

gulp.task('build:del-tmp', function() {
  del(['src/app/app.min.js']).then(paths => {
  	console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});

gulp.task('build:del-previous', function() {
  del(['src/app/app.min.js', 'dist']).then(paths => {
  	console.log('Deleted files and folders:\n', paths.join('\n'));
  });
})

gulp.task('build', function(callback) {
  runSequence(
    'build:del-previous',
    'build:angular-template-cache',
    'build:script',
    'build:inject-dependency',
    'build:concat-src',
    'build:del-tmp',
    callback
  );
});

gulp.task('build:dev', function(callback) {
  runSequence(
    'build:del-previous',
    'less',
    'inject-dependency',
    callback
  );
});

gulp.task('development', ['build:dev','connect'] , function() {
  gulp.watch(files.less, function(callback) {
    runSequence(
      'less',
      'reload'
    );
  });
  gulp.watch(files.html, ['reload']);
  gulp.watch(files.js, function(callback) {
    runSequence(
      'inject-dependency',
      'reload'
    );
  });
});

gulp.task('default', ['development']);
