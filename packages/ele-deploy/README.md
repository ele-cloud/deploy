<h3 align="center" style="margin: 30px 0 35px;">ELE DEPLOY</h3>
<p align="center">
  <a href="https://www.npmjs.com/package/ele-deploy"><img alt="npm" src="https://img.shields.io/npm/v/ele-deploy"></a>
  <a href="https://raw.githubusercontent.com/AngusYang9/ele-deploy/master/LICENSE"><img alt="NPM" src="https://img.shields.io/npm/l/ele-deploy"></a>
</p>

---

**执行 “一句” shell，将构建文件直接部署至前端资源服务器。**

现如今，全税部门项目日益增多，每个项目开发完成后，需要手动构建并将文件包发送给运维同学部署。测试环境、生产环境，每次部署都会听到运维向你呼喊：“同学，**项目前端打个包发我一份”，那么为了规避这种现象，我们的 `ele-deploy` 应运而生。只需一个命令，将前端包部署至资源系统，想要最新包，那你就去下👋。

[资源服务器地址](http://121.36.50.216:4002)

## 安装

```
npm install --save ele-deploy
```

## 使用说明

针对全税部门，我们将前端项目分为两类：

1. react
2. vue

#### react示例

package.json

```javascript
"scripts": {
  //...
  "deploy": "matriks2 dest && ele --company 大象产品线 --project declare-react.tar.gz --react"
 }
```

#### vue示例

package.json

```javascript
"scripts": {
  //...
  "deploy": "npm run build && ele --company 大象产品线 --project declare-vue.tar.gz"
 }
```

配置完成后，在项目根目录下运行 `npm run deploy` 或 `yarn deploy` ，开始进行部署。

## 配置参数

- `-c | --company` : 项目公司名称
- `-p | --project` : 项目文件包名称 （支持三种后缀名格式：`.zip` `.tar` `tar.gz`）
- `--react` : 是否为 react 项目 （默认：否）
- `-d | --debug`: 查看更多信息

## 删除项目

可直接在浏览器中输入：

```bash
http://121.36.50.216:4002/delete/${company}/${project}
```

- 删除项目

```bash
http://121.36.50.216:4002/delete/大象产品线/declare-vue.tar.gz
```

- 删除公司

```bash
http://121.36.50.216:4002/delete/大象产品线
```

> 为前端留个后门，谨防线上误操作。
