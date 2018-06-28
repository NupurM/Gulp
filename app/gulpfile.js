var gulp = require('gulp'), //task runner
    concat = require('gulp-concat'), //concatinate all file types
    clean_css = require('gulp-clean-css'), //minify css
    plumber = require('gulp-plumber'), //Prevent errors from breaking the watch
    sass = require('gulp-sass'), //compile sass to css
    png_tinifier = require('gulp-tinifier'), //compress png
    uglify = require('gulp-uglify'); //minify js

gulp.task('sass', function () {
    return gulp.src('scss/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('css'));
});

gulp.task('css', ['sass'], function () {
    return gulp.src('css/*.css')
        .pipe(concat('styles.css'))
        .pipe(clean_css())
        .pipe(gulp.dest('dist'));
});

gulp.task('jquery-scripts', function () {
    return gulp.src('node_modules/jquery/src/*.js')
        .pipe(concat('jquery.js'))
        .pipe(uglify('jquery.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('compress-png', function () {
    var tinifierOptions = {
        key: 'cgNFda0kjG8mLKr85GTs88oUCS0Om8w6',
        verbose: 'true'
    }
    return gulp.src('image/*.png')
        .pipe(png_tinifier(tinifierOptions))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('watch', function () {
    gulp.watch(['scss/*.scss', 'css/*.css'], ['sass', 'css']);
});

gulp.task('run-all', ['css', 'jquery-scripts', 'compress-png']);
