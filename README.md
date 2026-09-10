# 湖南人工智能教育综合平台

纯前端静态原型，包含主站、登录页和数据大屏等页面。

## 多电脑一键同步与本地预览

推荐开发目录：`~/Documents/www/hunan-ai-edu`。

### 开始工作

```bash
npm run work:start
```

该命令会检查当前 Git 分支和工作区。存在未提交修改时会立即停止，防止覆盖本地内容；工作区干净时会执行 `git pull --ff-only`、检查依赖、启动本地服务，并打开 `http://127.0.0.1:4179`。

### 结束工作

```bash
npm run sync:up
```

该命令会运行测试、暂存项目文件、排查常见密钥和构建产物、创建中文提交，然后执行 `git pull --rebase` 和 `git push`。推送成功后会停止本地预览。

可传入更具体的中文提交信息：

```bash
npm run sync:up -- "完善课堂播放功能"
```

### 手动预览

```bash
npm run dev
```

访问地址：`http://127.0.0.1:4179`。

### 其他电脑首次使用

```bash
mkdir -p ~/Documents/www
git clone git@github.com:lichaotao-gif/hunan-ai-edu.git ~/Documents/www/hunan-ai-edu
cd ~/Documents/www/hunan-ai-edu
npm run work:start
```
