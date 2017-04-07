var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  cleanCSS = require('gulp-clean-css');

var paths = {
  src: 'src/',
  bower: 'bower_components/',
  node: 'node_modules/',
  dist: 'dist/',
  demo: 'demo/',
  assets: 'assets/'
};

var modules = {
  http: paths.src + 'http/http.js',
  loader: paths.src + 'loader/loader.js',
  loaderCss: paths.src + 'loader/loader.css',
  modals: paths.src + 'modals/modals.js',
  props: paths.src + 'props/props.js'
};

gulp.task('imports',
  function () {
    gulp.src(paths.bower + 'angular/angular.min.js')
      .pipe(gulp.dest(paths.assets + 'lib/angular'));

    gulp.src(paths.bower + 'angular/angular-csp.css')
      .pipe(cleanCSS())
      .pipe(rename({
        extname: '.min.css'
      }))
      .pipe(gulp.dest(paths.assets + 'lib/angular'));

    gulp.src(paths.node + 'angular-ui-bootstrap/dist/*tpls.js')
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(gulp.dest(paths.assets + 'lib/angular-ui-bootstrap'));

    gulp.src(paths.node + 'angular-ui-bootstrap/dist/*.css')
      .pipe(cleanCSS())
      .pipe(rename({
        extname: '.min.css'
      }))
      .pipe(gulp.dest(paths.assets + 'lib/angular-ui-bootstrap'));

    gulp.src(paths.node + 'requirejs/require.js')
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(gulp.dest(paths.assets + 'lib/requirejs'));

    gulp.src(paths.bower + 'jquery/dist/jquery.min.js')
      .pipe(gulp.dest(paths.assets + 'lib/jquery'));

    gulp.src([
        paths.bower + 'bootstrap/dist/*/bootstrap.min.css',
        '!' + paths.bower + 'bootstrap/dist/*/*.min.css.map',
        paths.bower + 'bootstrap/dist/*/*.eot',
        paths.bower + 'bootstrap/dist/*/*.woff',
        paths.bower + 'bootstrap/dist/*/*.woff2',
        paths.bower + 'bootstrap/dist/*/*.ttf'
      ])
      .pipe(gulp.dest(paths.assets + 'lib/bootstrap'));

    gulp.src([
        paths.bower + 'font-awesome/*/*.min.css',
        paths.bower + 'font-awesome/*/*.eot',
        paths.bower + 'font-awesome/*/*.ttf',
        paths.bower + 'font-awesome/*/*.woff',
        paths.bower + 'font-awesome/*/*.woff2'
      ])
      .pipe(gulp.dest(paths.assets + 'lib/font-awesome'));

    gulp.src(paths.bower + 'angular-translate*/*.min.js')
      .pipe(rename({
        dirname: ''
      }))
      .pipe(gulp.dest(paths.assets + 'lib/angular-translate'));
  }
);

gulp.task('demos',
  function () {
    gulp.run('imports');

    Object.keys(modules).forEach((module) => {
      gulp.src(module)
        .pipe(rename(resolveRename('nggs-', '.js')))
        .pipe(gulp.dest(paths.demo));
    });

    gulp.src(modules.http)
      .pipe(rename({
        dirname: '',
        prefix: 'nggs-',
        extname: '.js'
      }))
      .pipe(gulp.dest(paths.demo + 'loader'));

    gulp.src(modules.loaderCss)
      .pipe(rename(resolveRename('nggs-', '.css')))
      .pipe(gulp.dest(paths.demo));
  }
);

gulp.task('dist',
  function () {

    Object.keys(modules).forEach((module) => {
      gulp.src(module)
        .pipe(rename(resolveRename('nggs-', '.js')))
        .pipe(gulp.dest(paths.dist));

      gulp.src(module)
        .pipe(uglify())
        .pipe(rename(resolveRename('nggs-', '.min.js')))
        .pipe(gulp.dest(paths.dist));
    });


    // CSS
    gulp.src([modules.loaderCss])
      .pipe(rename(resolveRename('nggs-', '.css')))
      .pipe(gulp.dest(paths.dist));

    gulp.src([modules.loaderCss])
      .pipe(cleanCSS())
      .pipe(rename(resolveRename('nggs-', '.min.css')))
      .pipe(gulp.dest(paths.dist));
  }
);

function resolveRename(prefix, extname) {
  return function (path) {
    path.dirname = path.basename;
    path.basename = prefix + path.basename;
    path.extname = extname;
  }
}