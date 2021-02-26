module.exports = () => 
    $.gulp.task('css', () =>
    
      $.gulp.src($.path.src.css)
            .pipe($.GP.plumber())
            .pipe($.GP.sass({outputStyle: 'expanded'}))
            .pipe($.GP.autoprefixer())
            .pipe($.GP.groupCssMediaQueries())
            .pipe($.gulp.dest($.path.prod.css))
            .pipe($.GP.sass({outputStyle: 'compressed'}))
            .pipe($.GP.rename('main.min.css'))
            .pipe($.gulp.dest($.path.prod.css))
            .on('end', $.bs.reload)
    )