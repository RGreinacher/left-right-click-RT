var gulp = require('gulp');
var sass = require('gulp-sass');
var slim = require('gulp-slim');
var coffee = require('gulp-coffee');

gulp.task('coffee', function () {
  gulp.src('coffee/**/*.coffee')
    .pipe(coffee({ bare: true }))
    .pipe(gulp.dest('./js/'));
});

gulp.task('slim', function () {
  gulp.src('slim/**/*.slim')
    .pipe(slim({
      pretty: true,
      include: true,
      options: 'include_dirs=["slim"]',
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('styles', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'));
});

//Watch task
gulp.task('default', function () {
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('slim/**/*.slim', ['slim']);
    gulp.watch('coffee/**/*.coffee', ['coffee']);
});
