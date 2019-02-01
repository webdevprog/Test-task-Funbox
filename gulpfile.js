var syntax        = 'scss'; // Syntax: sass or scss;

var 	gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleancss       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify"),
		rsync          = require('gulp-rsync');

	gulp.task('browser-sync', function() {
		browserSync({
			server: {
				baseDir: 'app'
			},
			notify: false,
			// tunnel: true,
			// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
		});
	});

// Пользовательские скрипты проекта

gulp.task('common-js', function() {
	return gulp.src([
		'app/js/common.js',
		])
	.pipe(concat('common.min.js'))
});

gulp.task('js', ['common-js'], function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/swiper/dist/js/swiper.min.js',
		'app/libs/bootstrap4/dist/js/bootstrap.min.js',
		'app/libs/fancybox/dist/jquery.fancybox.min.js',
		'app/libs/custom-plugin/plugins.js',
		'app/js/common.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload( {stream: true} ))
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('app/'+syntax+'/**/*.'+syntax+'', ['sass']);
	gulp.watch(['app/libs/**/*.js',  'app/js/common.js'], ['js']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/libs/custom-plugin/scss/*.'+syntax+'', ['sass']);
	
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin())) // Cache Images
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
