/*==============================================================================
Gulp
==============================================================================*/

var gulp = require( 'gulp' ),
	gulpLoadPlugins = require( 'gulp-load-plugins' ),
	p = gulpLoadPlugins();

function handleError( err ) {
	console.log( err.toString() );
	this.emit( 'end' );
}

/*==============================================================================
Clean
==============================================================================*/

gulp.task( 'clean', function() {
	gulp.src( [ 'index.html', 'css', 'js', 'img', 'fnt', 'snd' ], { 
			read: false
		})
		.pipe( p.rimraf() )
		.pipe( p.notify( 'Gulp Clean Task Complete' ) );
});

/*==============================================================================
HTML
==============================================================================*/

gulp.task('html', function() {
	gulp.src( 'src/index.html' )
	.pipe( gulp.dest( '' ) )
	.pipe( p.notify( 'Gulp HTML Task Completed' ) );
});

/*==============================================================================
Styles
==============================================================================*/

gulp.task( 'styles', function() {
	return gulp.src( 'src/scss/main.scss' )
		.pipe( p.sass( {
			style: 'expanded'
		}))
		.on( 'error', p.sass.logError)
		.pipe( p.autoprefixer() )
		.pipe( p.cssnano( { advanced: false } ) )
		.pipe( p.rename( 'main.min.css' ) )
		.pipe( gulp.dest( 'css' ) )
		.pipe( p.notify( 'Gulp Styles Task Completed' ) );
});

/*==============================================================================
Scripts
==============================================================================*/

gulp.task( 'scripts', function() {
	gulp.src( 'src/js/**/*' )
	.pipe( p.uglify() )
	.pipe( gulp.dest( 'js' ) )
	.pipe( p.notify( 'Gulp Scripts Task Completed' ) );
});

/*==============================================================================
Images
==============================================================================*/

gulp.task( 'images', function() {
	gulp.src( 'src/img/**/*' )
	.pipe( gulp.dest( 'img' ) )
	.pipe( p.notify( 'Gulp Images Task Completed' ) );
});

/*==============================================================================
Fonts
==============================================================================*/

gulp.task( 'fonts', function() {
	gulp.src( 'src/fnt/**/*' )
	.pipe( gulp.dest( 'fnt' ) )
	.pipe( p.notify( 'Gulp Fonts Task Completed' ) );
});

/*==============================================================================
Sounds
==============================================================================*/

gulp.task( 'sounds', function() {
	gulp.src( 'src/snd/**/*' )
	.pipe( gulp.dest( 'snd' ) )
	.pipe( p.notify( 'Gulp Sounds Task Completed' ) );
});


/*==============================================================================
Watch
==============================================================================*/

gulp.task('watch', function() {
	gulp.watch( 'src/index.html', [ 'html' ] );
	gulp.watch( 'src/scss/**/*', [ 'styles' ] );
	gulp.watch( 'src/js/**/*', [ 'scripts' ] );
	gulp.watch( 'src/img/**/*', [ 'images' ] );
	gulp.watch( 'src/fnt/**/*', [ 'fonts' ] );
	gulp.watch( 'src/snd/**/*', [ 'sounds' ] );
});

/*==============================================================================
Default
==============================================================================*/

gulp.task( 'default', [ 'html', 'styles', 'scripts', 'images', 'fonts', 'sounds' ], function() {
	gulp.start( 'watch' );
});