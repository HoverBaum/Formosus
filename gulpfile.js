var gulp = require('gulp');
var useref = require('gulp-useref');

gulp.task('html', function() {
	var assets = useref.assets();

	gulp.src('index.html')
		.pipe(assets)
		.pipe(gulpif('*.css', rebaseUrls()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(minifyInline())
		.pipe(minifyHtml())
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', function () {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});
