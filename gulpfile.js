/*==============================================================================
Gulp
==============================================================================*/

var gulp = require("gulp"),
  gulpLoadPlugins = require("gulp-load-plugins"),
  p = gulpLoadPlugins();

function handleError(err) {
  console.log(err.toString());
  this.emit("end");
}

/*==============================================================================
Clean
==============================================================================*/

gulp.task("clean", function () {
  gulp
    .src(["index.html", "css", "js", "img", "fnt", "snd", "slides"], {
      read: false,
    })
    .pipe(p.rimraf());
  //.pipe( p.notify( 'Gulp Clean Task Complete' ) );
});

/*==============================================================================
HTML
==============================================================================*/

gulp.task("html", function () {
  gulp.src("src/*.html").pipe(gulp.dest(""));
  //.pipe( p.notify( 'Gulp HTML Task Completed' ) );
});

/*==============================================================================
Styles
==============================================================================*/

gulp.task("styles", function () {
  return gulp
    .src("src/scss/import.scss")
    .pipe(
      p.sass({
        style: "expanded",
      })
    )
    .on("error", p.sass.logError)
    .pipe(p.autoprefixer())
    .pipe(
      p.cssnano({
        advanced: false,
        zindex: false,
      })
    )
    .pipe(p.rename("main.min.css"))
    .pipe(gulp.dest("css"));
  //.pipe( p.notify( 'Gulp Styles Task Completed' ) );
});

/*==============================================================================
Scripts
==============================================================================*/

gulp.task("scripts1", function () {
  return gulp
    .src(["src/js/*.js", "!src/js/imports.js"])
    .pipe(p.jshint())
    .pipe(p.jshint.reporter("default"));
});

gulp.task("scripts2", ["scripts1"], function () {
  return gulp
    .src("src/js/lib/imports.js")
    .pipe(p.imports())
    .pipe(p.uglify())
    .pipe(p.rename("imports.lib.min.js"))
    .pipe(gulp.dest("temp"));
});

gulp.task("scripts3", ["scripts2"], function () {
  return gulp
    .src("src/js/imports.js")
    .pipe(p.imports())
    .pipe(p.uglify())
    .on("error", handleError)
    .pipe(p.rename("imports.min.js"))
    .pipe(gulp.dest("temp"));
});

gulp.task("scripts4", ["scripts3"], function () {
  return gulp
    .src(["temp/imports.lib.min.js", "temp/imports.min.js"])
    .pipe(p.concat("main.min.js"))
    .pipe(gulp.dest("js"));
});

gulp.task("scripts5", ["scripts4"], function () {
  return gulp
    .src("temp", {
      read: false,
    })
    .pipe(p.rimraf());
});

gulp.task("scripts", ["scripts5"], function () {
  return gulp.src("src/js/lib/modernizr.min.js").pipe(gulp.dest("js"));
  //.pipe( p.notify( 'Gulp Scripts Task Complete' ) );
});

/*==============================================================================
Images
==============================================================================*/

gulp.task("images", function () {
  gulp.src("src/img/**/*").pipe(gulp.dest("img"));
  //.pipe( p.notify( 'Gulp Images Task Completed' ) );
});

/*==============================================================================
Fonts
==============================================================================*/

gulp.task("fonts", function () {
  gulp.src("src/fnt/**/*").pipe(gulp.dest("fnt"));
  //.pipe( p.notify( 'Gulp Fonts Task Completed' ) );
});

/*==============================================================================
Sounds
==============================================================================*/

gulp.task("sounds", function () {
  gulp.src("src/snd/**/*").pipe(gulp.dest("snd"));
  //.pipe( p.notify( 'Gulp Sounds Task Completed' ) );
});

/*==============================================================================
Slides
==============================================================================*/

gulp.task("slides", function () {
  gulp.src("src/slides/**/*").pipe(gulp.dest("slides"));
  //.pipe( p.notify( 'Gulp Slides Task Completed' ) );
});

/*==============================================================================
Watch
==============================================================================*/

gulp.task("watch", function () {
  gulp.watch("src/*.html", ["html"]);
  gulp.watch("src/scss/**/*", ["styles"]);
  gulp.watch("src/js/**/*", ["scripts"]);
  gulp.watch("src/img/**/*", ["images"]);
  gulp.watch("src/fnt/**/*", ["fonts"]);
  gulp.watch("src/snd/**/*", ["sounds"]);
  gulp.watch("src/slides/**/*", ["slides"]);
});

/*==============================================================================
Default
==============================================================================*/

gulp.task(
  "default",
  ["html", "styles", "scripts", "images", "fonts", "sounds", "slides"],
  function () {
    gulp.start("watch");
  }
);
