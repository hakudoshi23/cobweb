/* jshint ignore: start */

'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

var config = {
    dist: 'dist/',
    sass: {
        paths: {
            master: 'scss/**/*.scss'
        }
    },
    js: {
        paths: {
            master: [
                'src/utils/**/*.js',
                'src/events.js',
                'src/logger.js',
                'src/cobweb.js',
                'src/modules.js',
                'src/modules/**/*.js',
            ]
        }
    }
};

gulp.task('default', function () {
    return gulp.start('build');
});

gulp.task('watch', function () {
    return gulp.start('watch-sass', 'watch-js');
});

gulp.task('watch-sass', function () {
    return gulp.watch(config.sass.paths.master, ['sass'])
        .on('error', function (err) {
            plugins.util.log(plugins.util.colors.red(err));
        });
});

gulp.task('watch-js', function () {
    return gulp.watch(config.js.paths.master, ['js'])
        .on('error', function (err) {
            plugins.util.log(plugins.util.colors.red(err));
        });
});

gulp.task('clean', function () {
    return gulp.src(config.dist, { read: false }).pipe(plugins.clean());
});

gulp.task('build', ['clean'], function () {
    return gulp.start('sass', 'js');
});

gulp.task('lint', function () {
    return gulp.start('js-lint');
});

gulp.task('sass', function () {
    return gulp.src(config.sass.paths.master)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass(config.sass.options)
            .on('error', plugins.sass.logError))
        .pipe(plugins.cleanCss({
            processImport: false,
            compatibility: 'ie8'
        }))
        .pipe(plugins.concat('cobweb.min.css'))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(config.dist))
        .on('error', swallowError);
});

gulp.task('js', function () {
    return gulp.src(config.js.paths.master)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('cobweb.min.js'))
        .pipe(plugins.uglify().on('error', swallowError))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(config.dist))
        .on('error', swallowError);
});

gulp.task('js-lint', function () {
    return gulp.src(config.js.paths.master)
        .pipe(plugins.xo());
});

gulp.task('server', function () {
    return gulp.src('.')
        .pipe(plugins.webserver({
          livereload: true,
          directoryListing: true,
          open: 'index.html'
        }));
});

function swallowError (error) {
  console.log(error.toString());
  this.emit('end');
}
