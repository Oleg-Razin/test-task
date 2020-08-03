var gulp    = require('gulp'),
    sass    = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglifyjs'),
    cleanCss= require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    rename  = require('gulp-rename'),
    htmlmin      = require('gulp-htmlmin'),
    del     = require('del');


gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'template'
        },
        notify: false
    });
});
gulp.task('sass' , function () {
    return gulp.src('template/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('template/css'))
        .pipe(browserSync.reload({stream:true}));
});
gulp.task('script' , function () {
    return gulp.src('template/js/libs/bootstrap/bootstrap.min.js')
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('template/js/libs'));
});
gulp.task('min-css' , function () {
    return gulp.src('template/css/libs/**/*.css')
        .pipe(cleanCss())
        .pipe(concat('libs.min.css'))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('project/css'))
});
gulp.task('main-min', function () {
    return gulp.src('template/css/style.css')
        .pipe(cleanCss())
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('template/css'))

});
gulp.task('minify-html', function() {
    return gulp.src('template/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(done) {
    del.sync('dist');
    done();
});


gulp.task('build-dist', function(done) {
    var buildCss = gulp.src('template/css/*.min.css')
        .pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src('template/js/**/*.js')
        .pipe(gulp.dest('dist/js'));

    var buildImages = gulp.src('template/images/**/*')
        .pipe(gulp.dest('dist/images'));

    done();
});
gulp.task('build', gulp.series('clean', 'sass', 'min-css' , 'main-min' , 'script', 'minify-html', 'build-dist'));

gulp.task('watch', function(){
    gulp.watch('template/scss/*.scss', gulp.parallel('sass'));
    gulp.watch('template/js/libs/**/*.js', gulp.parallel('script'));
    gulp.watch('template/css/style.css', gulp.parallel('main-min'));
    gulp.watch('template/js/*.js').on("change", browserSync.reload);
    gulp.watch('template/*.html').on('change', browserSync.reload);
});
gulp.task('default', gulp.parallel('sass','main-min', 'script', 'browser-sync', 'watch'));
