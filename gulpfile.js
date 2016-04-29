var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var strip = require('gulp-strip-comments');
var htmlmin = require('gulp-htmlmin');

/*
	A word on uglifying JS
	We should do that but currently all uglifiers have problems with ES6 syntax and we don't want to add babel to our dev stack.
	So for now no minified or uglified JS.

	At least we remove comments...
 */

gulp.task('default', function () {
    return gulp.src('index.html')
        .pipe(useref())
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulpif('*.js', strip()))
		.pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('dist'));
});
