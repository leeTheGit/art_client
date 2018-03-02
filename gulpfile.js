var gulp        = require('gulp');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var gp_rename   = require("gulp-rename");
var gutil       = require('gulp-util');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var minifyCss   = require("gulp-clean-css");
var hasher      = require('gulp-hasher');
var buster      = require('gulp-cache-buster');
var runSequence = require('run-sequence');


gulp.task('styles', function(callback) {
    runSequence('sass', 'concat', 'minify-css', 'cache', callback);
});


gulp.task('cache',  function() {
  return gulp.src('layouts/main.twig')
    .pipe(buster({
      tokenRegExp: /\/(concat\.min\.css)\?v=[0-9a-z]+/,
      assetRoot: __dirname + '/static/deploy/',
      hashes: hasher.hashes,
    }))
    .pipe(gulp.dest('layouts/'));
});


gulp.task('minify-css', function () {
    return gulp.src([
        './public/css/concat.css',
    ]) 
    .pipe(gp_rename({suffix: '.min'}))
    .pipe(minifyCss())
    .pipe(gulp.dest('./public/dist'))
    .pipe(hasher());
});


gulp.task('concat', function () {
    return gulp.src([
        './public/css/main.css',
    ]) // path to your file
    .pipe(concat('concat.css'))
    .pipe(gulp.dest('./public/css'));
});


gulp.task('sass', function() {
    return gulp.src([
            './public/css/main.scss',
        ])
        .pipe(sourcemaps.init())
        .pipe(sass({includePaths: [
            './public/css/partials', 
        ]}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/dist'));
});





gulp.task('scripts', function(){
	return gulp.src([
		'./bower_components/jquery/dist/jquery.js',
		'./bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
		
        // './static/development/js/plugins/slick.js',
        './static/development/js/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.js',
        // './static/development/js/plugins/bootstrap-modalmanager.js',
        // './static/development/js/plugins/bootstrap-modal.js',
        './static/development/js/plugins/jquery.noty-2.3.8/js/noty/packaged/jquery.noty.packaged.min.js',
        './static/development/js/plugins/jquery.fancybox/source/jquery.fancybox.js',
        // './static/development/js/plugins/bootbox.min.js',
        // './static/development/js/plugins/jquery.validate/jquery.validate.min.js',
        './static/development/js/plugins/waypoint/lib/jquery.waypoints.min.js',
        './static/development/js/plugins/handlebars-v4.0.5.js',
        './static/development/js/plugins/jquery.lazyload.min.js',
        './static/development/js/plugins/jquery.dotdotdot.min.js',
        './static/development/js/plugins/owl.carousel.min.js',
        './static/development/js/plugins/owl.carousel2.thumbs.js',
        './static/development/js/plugins/moment.js',
        './static/development/js/plugins/bootstrap-datetimepicker.js',
        './static/development/js/plugins/ticker.js',


        './static/development/js/sdk/*.js', // all files that end in .js

        './static/development/js/sdk/media-player/mediaelement-and-player.min.js',
        './static/development/js/sdk/cloudinary/jquery.cloudinary.js',
        './static/development/js/sdk/yii/yii.js',
        './static/development/js/sdk/yii/yii.captcha.js',

        './static/development/js/common.js',
        './static/development/js/!(common)*.js', // all files that end in .js EXCEPT common*.js
		])
		.pipe(concat('concat.js'))
		.pipe(gulp.dest('./static/deploy'))
		.pipe(gp_rename('scripts.js'))
		.pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('./static/deploy'));

});



gulp.task('watch', function (){
	gulp.watch('./static/css/**/*.scss', ['styles']);
	gulp.watch('./static/development/js/**/*.js', ['scripts']);
});

gulp.task('default', ['scripts', 'styles']);7