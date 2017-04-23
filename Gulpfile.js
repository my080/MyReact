var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var open = require('open');

// 环境配置信息
var config = {
    src:"src/", //源码环境目录
    build:"build/",  //开发环境目录
    dist:"dist/"  //生产环境目录
};

var htmlOptions = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
};

gulp.task('tmp', function () {
    gulp.src(config.src + 'app/**/*.html')
        .pipe(gulp.dest(config.build + "app/"))
        .pipe(plugins.htmlmin(htmlOptions))
        .pipe(gulp.dest(config.dist + "app/"))
        .pipe(plugins.connect.reload());
});

gulp.task('image', function () {
    var picArray = new Array();
    picArray.push(config.src + 'app/**/*.jpg');
    picArray.push(config.src + 'app/**/*.gif');
    picArray.push(config.src + 'app/**/*.png');
    picArray.push(config.src + 'app/**/*.jpeg');
    gulp.src(picArray)
        .pipe(gulp.dest(config.build + "app/"))
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(config.dist + "app/"))
        .pipe(plugins.connect.reload());
});

gulp.task('lib', function () {
    gulp.src(config.src + 'lib/**/*.js')
        .pipe(gulp.dest(config.build + "lib"))
        .pipe(plugins.connect.reload());
    gulp.src(config.src + 'lib/**/*.min.js')
        .pipe(gulp.dest(config.dist + "lib"))
        .pipe(plugins.connect.reload());
    gulp.src(config.src + 'lib/**/*.css')
        .pipe(gulp.dest(config.build + "lib"))
        .pipe(plugins.connect.reload());
    gulp.src(config.src + 'lib/**/*min.css')
        .pipe(gulp.dest(config.dist + "lib"))
        .pipe(plugins.connect.reload());
});

gulp.task('clean', function () {
    gulp.src([config.build,config.dist])
        .pipe(plugins.clean());
});

gulp.task('less', function () {
    gulp.src(config.src + 'app/index.less')
        .pipe(plugins.less())
        .pipe(gulp.dest(config.src + "app/"))
        .pipe(gulp.dest(config.build + "app/"))
        .pipe(plugins.cssmin())
        .pipe(gulp.dest(config.dist + "app/"))
        .pipe(plugins.connect.reload());
});

gulp.task('js', function () {
    gulp.src(config.src + 'app/**/*.js')
        .pipe(plugins.if('!index.js', plugins.concat('index.js')))
        .pipe(gulp.dest(config.src + "app/"))
        .pipe(gulp.dest(config.build + "app/"))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(config.dist + "app/"))
        .pipe(plugins.connect.reload());
});

gulp.task('json', function () {
    gulp.src(config.src + 'app/**/*.json')
        .pipe(gulp.dest(config.build + "app/"))
        .pipe(gulp.dest(config.dist + "app/"))
        .pipe(plugins.connect.reload());
});

gulp.task('build', ['image', 'js', 'less', 'lib', 'tmp', 'json']);

gulp.task('serve', ['build'], function () {
    plugins.connect.server({
        root: [config.src],
        livereload: true,
        port: 3000
    });
    open("http://localhost:3000");

    gulp.watch(config.src + 'lib/**/*', ['lib']);
    gulp.watch(config.src + "**/*.html", ['tmp']);
    gulp.watch(config.src + "data/**/*.json", ['json']);
    gulp.watch(config.src + "style/**/*.less", ['less']);
    gulp.watch(config.src + "scripts/**/*.js", ['js']);
    gulp.watch(config.src + "image/**/*", ['image']);

});

gulp.task('default', ['serve']);