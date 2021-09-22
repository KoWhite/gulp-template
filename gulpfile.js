const { task, series, src, dest, watch, parallel } = require("gulp");

const changed = require("gulp-changed"),
      sass = require("gulp-sass")(require("node-sass")),
      babel = require("gulp-babel"),
      webserver = require("gulp-webserver"),
      clean = require("gulp-clean")

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
  return src(`${srcPath.html}/**/*.html`)
    .pipe(changed(destPath.html))
    .pipe(dest(destPath.html))
})

task("sass", () => {
  return src(`${srcPath.css}/*.scss`)
    .pipe(sass())
    .pipe(changed(destPath.css))
    .pipe(dest(destPath.css))
})

task("script", () => {
  return src([`${srcPath.script}/*.js`, `!${srcPath.script}/*.min.js`])
    .pipe(changed(destPath.script))
    .pipe(babel({
      presets: ["es2015"] // es5检查机制
    }))
    .pipe(dest(destPath.script))
})

task("images", () => {
  return src(`${srcPath.images}/**/*`)
    .pipe(changed(destPath.images))
    .pipe(dest(destPath.images))
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
  return src([destPath.css, destPath.script], {read: false})
    .pipe(clean())
})

task("test", series("html", "sass", "script", "images"));

task("dev", series("test", parallel("webserver", "watch")));