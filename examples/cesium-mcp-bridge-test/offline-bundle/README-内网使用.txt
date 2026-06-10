cesium-mcp-bridge-test 离线开发包
================================

内网机要求：仅需安装 Node.js（无需 npm install，无需外网）。

启动：
  Windows: 进入 cesium-mcp-bridge-test 目录，双击 dev.cmd
  Linux/Mac: cd cesium-mcp-bridge-test && sh dev.sh

浏览器打开 http://localhost:5173/

目录结构：
  cesium-mcp-bridge/          bridge 源码（HMR）
  cesium-mcp-bridge-test/     示例 + node_modules（已预装）

本包由外网机 npm run prepare:offline 生成，请勿删除 node_modules。
