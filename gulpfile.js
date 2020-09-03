/*global require*/
"use strict";

const gulp = require('gulp');
const path = require('path');
const twig = require('gulp-twig');
const prefix = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const fs = require('fs');

const paths = {
	build: './build/',
	sass: 'public/scss/',
	css: '/dist/css/'
};

// gulp.task("default", () =>
// 	gulp
// 		.src("src/index.twig")
// 		.pipe(template({ title: "Nexocris", name: "Nexocris" }))
// 		.pipe(gulp.dest("dist"))
// );
//
// gulp.task('sass', function() {
// 	return gulp.src('public/scss/*')
// 		.pipe(sass())
// 		.pipe(gulp.dest('dist/css'))
// });
//
// gulp.task('watch', function(){
// 	gulp.watch('public/scss/*', ['sass']);
// 	// Other watchers
// });

// gulp.task('server' , function()
// {
// 	return gulp.src('dist')
// 		.pipe(webserver({
// 			livereload: false,
// 			directoryListing: false,
// 			open: true,
// 			port: 3333,
// 			ioDebugger: true
// 		}));
// });

gulp.task('twig', function () {
	return gulp.src(['./src/templates/*.twig'])
		// Stay live and reload on error
		.pipe(plumber({
			handleError: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(twig())
		.on('error', function (err) {
			process.stderr.write(err.message + '\n');
			this.emit('end');
		})
		.pipe(gulp.dest(paths.build));
});

gulp.task('rebuild', ['twig'], function () {
	// BrowserSync Reload
	browserSync.reload();
});

gulp.task('browser-sync', ['sass', 'twig', 'js'], function () {
	browserSync({
		server: {
			baseDir: paths.build
		},
		notify: false,
		browser:"google chrome"
	});
});

gulp.task('sass', function () {
	return gulp.src(paths.sass + 'app.scss')
		.pipe(sourcemaps.init())
		// Stay live and reload on error
		.pipe(plumber({
			handleError: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(
			sass({
				outputStyle: 'expanded'
			}).on('error', function (err) {
				console.log(err.message);
				this.emit('end');
			})
		)
		.pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
			cascade: true
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.css));
});

gulp.task('watch', function () {
	gulp.watch(paths.sass + 'app.scss', ['sass', browserSync.reload]);
	gulp.watch([
			'src/templates/*.twig'
		],
		{cwd:'./'},
		['rebuild']);
});
// Build task compile sass and twig.
gulp.task('build', ['sass', 'twig']);
gulp.task('default', ['browser-sync', 'watch']);
