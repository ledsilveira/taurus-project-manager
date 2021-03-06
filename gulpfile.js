var elixir = require('laravel-elixir'),
    liveReload = require('gulp-livereload'),
    clean = require('rimraf'),
    gulp = require('gulp');

/*
    define a pata onde ficam os arquivos publicos buid e assetes onde fica o angular
 */
var config = {
 assets_path:'./resources/assets',
 build_path:'./public/build'
};

config.bower_path = config.assets_path + '/../bower_components';

/*
arquivs publicos de javascrtip
 */
config.build_path_js = config.build_path + '/js';
/**
 * onde ficam os javascripts de terceiros
 * @type {string}
 */
config.build_vendor_path_js = config.build_path_js + '/vendor';
config.vendor_path_js = [
    config.bower_path + '/jquery/dist/jquery.min.js',
    config.bower_path + '/bootstrap/dist/js/bootstrap.min.js',
    config.bower_path + '/angular/angular.min.js',
    config.bower_path + '/angular-route/angular-route.min.js',
    config.bower_path + '/angular-resource/angular-resource.min.js',
    config.bower_path + '/angular-animate/angular-animate.min.js',
    config.bower_path + '/angular-messages/angular-messages.min.js',
    config.bower_path + '/angular-bootstrap/ui-bootstrap-tpls.min.js',
    config.bower_path + '/angular-strap/dist/modules/navbar.min.js',
    config.bower_path + '/angular-cookies/angular-cookies.min.js',
    config.bower_path + '/query-string/query-string.js',
    config.bower_path + '/angular-oauth2/dist/angular-oauth2.min.js',
    config.bower_path + '/ng-file-upload/ng-file-upload.min.js',
    config.bower_path + '/angular-http-auth/src/http-auth-interceptor.js',
    config.bower_path + '/angularUtils-pagination/dirPagination.js',
];

/**
 * pasta de css do sistema
 * @type {string}
 */
config.build_path_css = config.build_path + '/css';
/*
pasta de css de terceiros
 */
config.build_vendor_path_css = config.build_path_css + '/vendor';
config.vendor_path_css = [
    config.bower_path + '/bootstrap/dist/css/bootstrap.min.css',
    config.bower_path + '/bootstrap/dist/css/bootstrap-theme.min.css',
];

/**
 * Build path dos html
 */
config.build_path_html = config.build_path + '/views';

config.build_path_font = config.build_path + '/fonts';

config.build_path_image = config.build_path + '/images';

/**
 * Tarefas
 */
gulp.task('copy-font', function() {
    //copia os css da aplicacao
    gulp.src([
        config.assets_path + '/fonts/**/*' //pega todos arquivos de todas as pastas
    ])
        .pipe(gulp.dest(config.build_path_font)) // copia os arquivos do path acima para este
        .pipe(liveReload()); //notifica
});

gulp.task('copy-image', function() {
    //copia os css da aplicacao
    gulp.src([
        config.assets_path + '/images/**/*' //pega todos arquivos de todas as pastas
    ])
        .pipe(gulp.dest(config.build_path_image)) // copia os arquivos do path acima para este
        .pipe(liveReload()); //notifica
});
gulp.task('copy-html', function() {
    //copia os css da aplicacao
    gulp.src([
        config.assets_path + '/js/views/**/*.html' //pega tods html de todas as pastas
    ])
        .pipe(gulp.dest(config.build_path_html)) // copia os arquivos do path acima para este
        .pipe(liveReload()); //notifica
});
gulp.task('copy-styles', function(){
   //copia os css da aplicacao
    gulp.src([
      config.assets_path + '/css/**/*.css' //pega tods css de todas as pastas
   ])
       .pipe(gulp.dest(config.build_path_css)) // copia os arquivos do path acima para este
       .pipe(liveReload()); //notifica
    //copia os css de terceiros
    gulp.src(config.vendor_path_css)
        .pipe(gulp.dest(config.build_vendor_path_css)) // copia os arquivos do path acima para este
        .pipe(liveReload()); //notifica
});
/**
 * Tarefa para altera os javascripts (path)
 */
gulp.task('copy-scripts',function(){
    gulp.src([
        config.assets_path + '/js/**/*.js' //pega tods js de todas as pastas
    ])
        .pipe(gulp.dest(config.build_path_js)) // copia os arquivos do path acima para este
        .pipe(liveReload());

    gulp.src(config.vendor_path_js)
        .pipe(gulp.dest(config.build_vendor_path_js)) // copia os arquivos do path acima para este
        .pipe(liveReload());
});

//sobrescrevendo o gulp ou gulp default

gulp.task('default', ['clear-build-folder'], function(){
    gulp.start('copy-html','copy-font','copy-image');
    elixir(function(mix){
       mix.styles(config.vendor_path_css.concat([config.assets_path + '/css/**/*.css']),
       'public/css/all.css',
       config.assets_path );
        mix.scripts(config.vendor_path_js.concat([config.assets_path + '/js/**/*.js']),
            'public/js/all.js',
            config.assets_path );
        //verisona os arquivos ( coloca o ?=HASHQUALQUER ) para sempre recarregar p javascript
        mix.version(['js/all.js','css/all.css']);
    });
});
/**
 * Tarefa que verifica modificacoes no assets e jogue para pasta build
 * (tarefa interminal) watch
 * segundo parametro da task � um array de tarefas a executar antes da task em si
 */
gulp.task('watch-dev',['clear-build-folder'], function(){
    //mostrar qualqeur coisa que aconteceu

    liveReload.listen();
    //start chama outras tarefas
   gulp.start('copy-styles','copy-scripts','copy-html','copy-font','copy-image');
    // path onde olha quando a mundacas, qualquer alteracao no path ele roda
    // as duas tasks no array
    gulp.watch(config.assets_path + '/**', [
        'copy-styles','copy-scripts','copy-html','copy-font','copy-image']);
});

gulp.task('clear-build-folder', function(){
    clean.sync(config.build_path);
});