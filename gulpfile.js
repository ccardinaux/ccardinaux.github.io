const gulp = require('gulp');
const child = require('child_process');
const gutil = require('gulp-util');
const eslint = require('gulp-eslint');
const browserSync = require('browser-sync').create();

gulp.task('eslint', () => {
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
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

  // add watch task here
});

gulp.task('default', ['eslint', 'jekyll', 'serve']);
