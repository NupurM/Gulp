'use strict';

var gulp = require('gulp'),
    cssmin = require('gulp-cssmin'),
    templateCache = require('gulp-angular-templatecache'),
    uglify = require('gulp-uglify'),
    merge = require('merge-stream'),
    print = require('gulp-print'),
    del = require('del'),
    rename = require('gulp-rename'),
    html_replace = require('gulp-html-replace'),
    useref = require('gulp-useref'),
    fs = require('fs'),
    path = require('path'),
    concat = require('gulp-concat'),
    stripDebug = require('gulp-strip-debug'),
    ngAnnotate = require('gulp-ng-annotate'),
    version = require('gulp-version-number'),
    gulpif = require('gulp-if'),
    jscs = require('gulp-jscs');

var paths = {
    index: 'wwwroot/index.html',
    distindex: 'dist/index.html'
};

var versionConfig = {
    'value': '%MDS%',
    'append': {
        'key': 'v',
        'to': ['css', 'js']
    }
};

gulp.task('analyzejscs', function () {
    console.log('Analyzing source with JSCS');

    return analyzejscs('wwwroot/app/**/*.js');
});

gulp.task('fixjscs', function () {
    console.log('Fixing source with JSCS');

    return analyzejscs('wwwroot/app/**/*.js');
});

gulp.task('build', ['build-step12']);

gulp.task('build-step1', function () {
    console.log('Minifying html to app/js/template.js');

    return cachehtml();
});

gulp.task('build-step2', ['build-step1'], function () {
    console.log('minimizing app and libs js and bundling');

    return gulp.src(paths.index)
        .pipe(useref())//file concatenation
        .pipe(gulpif('*.css', cssmin()))//min
        .pipe(gulpif('*.js', ngAnnotate()))//dependency injection annotations
        .pipe(gulpif('*.js', uglify()))//min
        .pipe(gulp.dest('dist'));
});

gulp.task('build-step3', ['build-step2'], function () {
    console.log('replacing templateJS build in index.html');

    return gulp.src(paths.distindex, { base: '.' })
        .pipe(print())
        .pipe(html_replace({
            templateJS: 'app/js/template.js'
        }
        ))
        .pipe(gulp.dest('.'));
});

gulp.task('build-step4', ['build-step3'], function () {
    console.log('copying data files');

    return gulp.src('wwwroot/app/data/*')
        .pipe(print())
        .pipe(gulp.dest('dist/app/data'));
});

gulp.task('build-step5', ['build-step4'], function () {
    console.log('copying img files');

    return gulp.src('wwwroot/app/img/*')
        .pipe(print())
        .pipe(gulp.dest('dist/app/img'));
});

gulp.task('build-step6', ['build-step5'], function () {
    console.log('copying font files');

    return gulp.src('wwwroot/lib/font-awesome/fonts/*')
        .pipe(print())
        .pipe(gulp.dest('dist/app/fonts'));
});

gulp.task('build-step7', ['build-step6'], function () {
    console.log('copying nap-common.js.template files');

    return gulp.src('wwwroot/app/js/nap-common*')
        .pipe(print())
        .pipe(gulp.dest('dist/app/js'));
});

gulp.task('build-step8', ['build-step7'], function () {
    console.log('copying favicon.ico');

    return gulp.src('wwwroot/*.ico')
        .pipe(print())
        .pipe(gulp.dest('dist'));
});

gulp.task('build-step9', ['build-step8'], function () {
    console.log('copying font files');

    return gulp.src('wwwroot/lib/bootstrap/fonts/*')
        .pipe(print())
        .pipe(gulp.dest('dist/app/fonts'));
});

gulp.task('build-step10', ['build-step9'], function () {
    console.log('adding versioning to dist index.html');

    return gulp.src(paths.distindex, { base: '.' })
        .pipe(print())
        .pipe(version(versionConfig))
        .pipe(gulp.dest('.'));
});

gulp.task('build-step11', ['build-step10'], function () {
    console.log('minifying nap-theme');

    return gulp.src('wwwroot/app/css/nap-theme.css')
        .pipe(cssmin())//min
        .pipe(gulp.dest('dist/app/css'));
});

gulp.task('build-step12', ['build-step11'], function () {
    console.log('minifying ces-theme');

    return gulp.src('wwwroot/app/css/ces-theme.css')
        .pipe(cssmin())//min
        .pipe(gulp.dest('dist/app/css'));
});

var cachehtml = function () {

    return gulp.src('./wwwroot/app/**/*.html')
        .pipe(print())
        .pipe(templateCache({
            module: 'NapResidentialApp',
            root: 'app'
        }))
        .pipe(rename('template.js'))
        .pipe(gulp.dest('dist/app/js/'));

};

/**
 * Execute JSCS on given source files
 * @param  {Array} sources
 * @return {Stream}
 */
function analyzejscs(sources) {
    console.log('Running JSCS');
    return gulp
        .src(sources)
        .pipe(jscs())
        .pipe(jscs.reporter());
}



