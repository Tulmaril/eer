"use strict";

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    path = require('path'),
    prefix = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    notify = require("gulp-notify"),
    minify = require("gulp-minify"),
    gcmq = require('gulp-group-css-media-queries'),
    prettify = require('gulp-prettify'),
    imagemin = require('gulp-imagemin'),
    babel = require('gulp-babel'),
    svgSprite = require('gulp-svg-sprite');


var configSvggg = {
    mode: {
        defs: { // Activate the «css» mode
            render: {
                scss: true // Activate CSS output (with default options)
            }
        }
    }
};

gulp.task('svggg', function () {
    gulp.src('app/img/icons/*.svg')
        .pipe(svgSprite(configSvggg))
        .pipe(gulp.dest('sass'));
});

// Svg task

var svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    assetsDir = 'app/';

gulp.task('svgSpriteBuild', function () {
    return gulp.src(assetsDir + 'img/icons/*.svg')
    // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill and style declarations in out shapes
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg",
                    render: {
                        sass: {
                            dest:'../sass/_sprite.sass',
                            template: 'sass/templates/_sprite_template.sass'
                        }
                    },
                }
            }
        }))
        .pipe(gulp.dest(assetsDir + 'img/sprite/'));
});

// Build task

gulp.task('build', function () {
    gulp.src('app/js/main.js')
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.js', minify()))
        .pipe(gulp.dest('dist'));
    gulp.src('app/css/style.css')
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(gulp.dest('dist'));
    gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(gulp.dest('dist'));
});

// Imagemin task

gulp.task('imagemin', function() {

    gulp.src('app/img/**/*.{jpg,png,gif}')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/img/'));

    gulp.src("app/img/sprite/sprite.svg")
        .pipe(gulp.dest('dist/img/sprite'));

});

// Browsersync

gulp.task('browser-sync', ['sass', 'pug'], function() {
    browserSync({
        server: {
            baseDir: 'app',
        },
        notify: false,
        open: false,
    });
});

// Pug task

function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}

gulp.task('pug', function() {
    return gulp.src('pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .on('error', notify.onError(function (error) {
            return 'Pug compiling error\n' + error;
        }))
        .pipe(gulp.dest('app/'));
});

gulp.task('rebuild', ['pug'], function () {
    browserSync.reload();
});

// JS task

gulp.task('js', function () {
    gulp.src('js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('./app/js'))
        .pipe(browserSync.reload({stream: true}))
});

// SASS task

gulp.task('sass', function () {
    gulp.src('sass/*.sass')
        .pipe(sass({outputStyle: 'expanded'}))
        .on('error', notify.onError(function (error) {
            return 'Sass compiling error\n' + error;
        }))
        .pipe(prefix("last 15 version", "> 1%", "ie 10", "ie 8", "ie 7"), {cascade:false})
        .pipe(gulp.dest('./app/css'))
        .pipe(browserSync.reload({
            stream: true,
        }));
});

// Group css task

gulp.task('group-css', function () {
    gulp.src('app/css/style.css')
        .pipe(gcmq())
        .pipe(gulp.dest('app/css/test.css'));
});

// Watch task

gulp.task('watch', function() {
    gulp.watch('sass/**/*.sass', ['sass']);
    gulp.watch('pug/**/*.pug', ['rebuild']);
    gulp.watch('js/*.js', ['js']);
    gulp.watch('app/img/icons/*.svg', ['svgSpriteBuild']);
});

// Default task

gulp.task('default', ['watch', 'browser-sync']);
