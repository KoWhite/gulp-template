# gulp打包器

## 简介

工作中需要兼容IE8的项目，不能使用IE6的语法，开发体验落后，此打包器是为了提高此类项目的开发体验。

> 通过babel转译ES6以适配浏览器

> 无需手动压缩代码

## 基础功能

&#9745;热更新

&#9745;环境区分

&#9745;代码压缩

&#9745;图片压缩

&#9745;部分ES6可用

&#9745;错误提示

## 安装

```
# 克隆项目
git clone git@github.com:KoWhite/gulp-template.git
# 进入项目目录
cd gulp-template
# 安装依赖
npm i
# 本地开发 启动项目
npm run dev
```

## 部署

```
# 开发环境
npm run build:dev
# 正式环境
npm run build:prod
```