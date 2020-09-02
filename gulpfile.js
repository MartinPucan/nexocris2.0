const gulp = require("gulp");
const sass = require('gulp-sass');

gulp.task('hello', function() {
	return new Promise(function(resolve, reject) {
		console.log("HTTP Server Started");
		resolve();
	});
});

gulp.task('sass', function() {
	return gulp.src('public/scss/app.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist/css'))
});
