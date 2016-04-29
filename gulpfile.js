const gulp = require('gulp');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const minifyCss = require('gulp-minify-css');
const strip = require('gulp-strip-comments');
const htmlmin = require('gulp-htmlmin');
const zip = require('gulp-zip');

/*
	A word on uglifying JS
	We should do that but currently all uglifiers have problems with ES6 syntax and we don't want to add babel to our dev stack.
	So for now no minified or uglified JS.

	At least we remove comments...
 */

/**
 *   Copy over files that need no handling.
 */
gulp.task('assets', function() {
	gulp.src(['manifest.json', 'fonts/**/*', 'img/**/*'],{base: './'})
	.pipe(gulp.dest('dist/'));
});

gulp.task('html', function() {
	gulp.src('index.html')
        .pipe(useref())
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulpif('*.js', strip()))
		.pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('dist'));
})

gulp.task('default', ['assets', 'html'], function () {
	gulp.src('dist/**/*')
	.pipe(zip('formosus.zip'))
	.pipe(gulp.dest('./'));
});
