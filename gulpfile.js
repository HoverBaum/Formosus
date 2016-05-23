const gulp = require('gulp');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const minifyCss = require('gulp-minify-css');
const strip = require('gulp-strip-comments');
const htmlmin = require('gulp-htmlmin');
const zip = require('gulp-zip');
const concat = require('gulp-concat');
const del = require('del');
const runSequence = require('run-sequence');

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
	gulp.src(['fonts/**/*', 'img/**/*'],{base: './'})
	.pipe(gulp.dest('dist/'));
});

//Handle the frontend
gulp.task('html', function() {
	gulp.src('index.html')
        .pipe(useref())
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulpif('*.js', strip()))
		.pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('dist'));
});

//Update and save the manifest.
gulp.task('manifest', function() {
	var fs = require('fs');
	var path = require('path');
	var manifest = require('./manifest');
	manifest.background.scripts = ['backgroundScript.js'];
	fs.writeFile(path.join('dist', 'manifest.json'), JSON.stringify(manifest));
});

//Handle the background scripts.
gulp.task('background', function() {
	gulp.src('js/background/*.js')
	.pipe(concat('backgroundScript.js'))
	.pipe(strip())
	.pipe(gulp.dest('dist'))
});

//Delte old files.
gulp.task('clean', function() {
	return del([
		'dist/**/*',
		'formosus.zip'
	]);
});

gulp.task('dist', ['assets', 'html', 'manifest', 'background'], function() {
	gulp.src('dist/**/*')
	.pipe(zip('formosus.zip'))
	.pipe(gulp.dest('./'));
});

gulp.task('default', ['clean'], function () {
	runSequence('dist');
});
