const path = require('path');
const gulp = require('gulp');
const child = require('child_process');
const gutil = require('gulp-util');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const sass = require('gulp-sass');
const minifycss = require('gulp-uglifycss');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

gulp.task('eslint', () => {
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Lint Sass
gulp.task('stylelint', () => {
  gulp.src('_sass/**/*.scss')
    .pipe(stylelint({
      failAfterError: false,
      reporters: [
        {
          formatter: 'string',
          console: true,
        },
      ],
    }));
});

// Compile and minify Sass
gulp.task('sass', ['stylelint'], () => {
  gulp.src('_sass/main.scss')
    .pipe(sass({
      includePaths: [
        path.join(__dirname, '/node_modules/normalize-scss/sass/'),
      ],
    }))
    .pipe(autoprefixer(['last 2 versions']))
    .pipe(minifycss())
    .pipe(gulp.dest('./assets'));
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('bundle', [
    'exec',
    'jekyll',
    'build',
    '--watch',
    '--incremental',
    '--drafts',
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach(message => gutil.log(`Jekyll: ${message}`));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: ['_site/**'],
    port: 4000,
    server: {
      baseDir: '_site',
    },
  });

  gulp.watch('_sass/**/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'jekyll', 'serve']);
