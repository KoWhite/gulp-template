const { task, series, src, dest, watch, parallel } = require("gulp");

const changed = require("gulp-changed"),
      sass = require("gulp-sass")(require("node-sass")),
      babel = require("gulp-babel"),
      webserver = require("gulp-webserver"),
      clean = require("gulp-clean"),
      combiner = require('stream-combiner2'),
      gutil = require('gulp-util'),
      htmlmin = require('gulp-htmlmin'),
      autoprefixer = require("gulp-autoprefixer"),
      cleanCss = require("gulp-clean-css"),
      uglify = require('gulp-uglify');

const combine = (strems) => {
  const colors = gutil.colors;
  const combined = combiner.obj(strems);
  combined.on('error', error => {
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(error.fileName))
    gutil.log('lineNumber: ' + colors.red(error.lineNumber))
    gutil.log('message: ' + error.message)
    gutil.log('plugin: ', colors.yellow(error.plugin))
  });
  return combined;
}

const srcPath = {
  html: "src",
  css: "src/scss",
  script: "src/js",
  images: "src/images"
}

const destPath = {
  html: "dist",
  css: "dist/css",
  script: "dist/js",
  images: "dist/images"
}

task("html", () => {
  return combine([
    src(`${srcPath.html}/**/*.html`)
    .pipe(changed(destPath.html))
    .pipe(dest(destPath.html))
  ])
})

task("sass", () => {
  return combine([
    src(`${srcPath.css}/*.scss`)
    .pipe(sass())
    .pipe(changed(destPath.css))
    .pipe(dest(destPath.css))
  ])
})

task("script", () => {
  return combine([
    src([`${srcPath.script}/*.js`, `!${srcPath.script}/*.min.js`])
    .pipe(changed(destPath.script))
    .pipe(babel({
      presets: ["es2015"] // es5检查机制
    }))
    .pipe(dest(destPath.script))
  ])
})

task("images", () => {
  return combine([ 
    src(`${srcPath.images}/**/*`)
    .pipe(changed(destPath.images))
    .pipe(dest(destPath.images))
  ])
})

task("webserver", () => {
  src(destPath.html)
    .pipe(webserver({
      livereload: true,
      open: true,
      port: 8000
    }))
})

task("watch", () => {
  watch(`${srcPath.html}/**/*.html`, {ignoreInitial: false}, series("html"));
  watch(`${srcPath.css}/*.scss`, {ignoreInitial: false}, series("html"));
  watch(`${srcPath.images}/**/*`, {ignoreInitial: false}, series("images"));
  watch([`${srcPath.script}/*.js`, `!${srcPath.script}/*.min.js`], {ignoreInitial: false}, series("images"))
})

task("clean", () => {
  return src([destPath.html, destPath.css, destPath.script], {read: false})
    .pipe(clean())
})

task("htmlRelease", function () {
  return src(srcPath.html+"/**/*.html")
    .pipe(changed(destPath.html))
    .pipe(htmlmin({
      collapseWhitespace:true, // 清除空格
      collapseBooleanAttributes:true, // 省略布尔属性的值
      removeComments:true, // 清除html中注释的部分
      removeEmptyAttributes:true, // 清除所有的空属性
      removeScriptTypeAttributes:true, // 清除所有script标签中的type="text/javascript"属性
      removeStyleLinkTypeAttributes:true, // 清除所有Link标签上的type属性
      minifyJS:true, // 压缩html中的javascript代码
      minifyCSS:true // 压缩html中的css代码
    }))
    .pipe(dest(destPath.html))
})

task("sassRelease", function () {
  return src(srcPath.css + "/*.scss")
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['Chrome 9','IE 8','last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCss({
      advanced: false,
      compatibility: 'ie8',
      keepSpecialComments: '*'
    }))
    .pipe(dest(destPath.css))
})

task("scriptRelease", function () {
  return src([srcPath.script + "/*.js", "!" + srcPath.script + "/*.min.js"])
    .pipe(changed( destPath.script ))
    .pipe(babel({
      presets: ['es2015'] // es5检查机制
    }))
    .pipe(uglify())
    .pipe(dest( destPath.script ));
})

task("test", series("html", "sass", "script", "images"));

task("release", series('clean', parallel("htmlRelease", "sassRelease", "scriptRelease", "images")));

task("dev", series("test", parallel("webserver", "watch")));