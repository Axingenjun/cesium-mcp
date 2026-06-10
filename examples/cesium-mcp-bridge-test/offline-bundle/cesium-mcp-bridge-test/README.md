# cesium-mcp-bridge-test

`cesium-mcp-bridge` 的浏览器联调项目，UI 与功能对齐 `examples/minimal`。

- 通过 Vite 直接加载 `packages/cesium-mcp-bridge/src` 源码，保存即 HMR，无需 `tsup` 打包
- **Cesium / heatmap.js 等运行时依赖复用 `cesium-mcp-bridge` 的依赖树**，不在本目录重复声明
- 默认使用 **椭球地形** + bridge 依赖 cesium 包内的 Natural Earth II 影像（经 `/cesium/` 托管，无需 `public/` 拷贝）

## 快速开始

在**仓库根目录**安装依赖（workspace 会链接 `cesium-mcp-bridge`）：

```bash
npm install
cd examples/cesium-mcp-bridge-test
npm run dev
```

浏览器打开 `http://localhost:5173/`。

可选：启动 `cesium-mcp-runtime` 后，页面 WebSocket 会自动连接 `ws://localhost:9100`。

## 项目结构

```
examples/cesium-mcp-bridge-test/
├── index.html              # 页面骨架（UI 面板 + onclick 按钮）
├── styles/app.css          # 样式
├── shims/                  # Vite 兼容 shim
├── src/
│   ├── main.ts             # 入口 + HMR
│   ├── bootstrap.ts        # Viewer / Bridge 生命周期
│   ├── config.ts           # 常量配置
│   ├── cesium/             # Cesium 运行时
│   │   ├── entry.ts        # Vite alias: cesium
│   │   └── viewer.ts       # 离线 Viewer + 坐标栏
│   ├── app/                # 应用核心
│   │   ├── bridge.ts       # cmd / log / getBridge
│   │   ├── init.ts         # initApp / teardownApp
│   │   ├── runtime.ts      # WebSocket 连接 runtime
│   │   └── window-api.ts   # HTML onclick 全局函数挂载
│   ├── demos/              # 演示命令
│   │   ├── data.ts         # 示例数据
│   │   └── commands.ts     # 按钮触发的 demo 动作
│   ├── ui/                 # 面板 UI 逻辑
│   │   ├── i18n.ts
│   │   ├── chrome.ts       # 主题 / 面板折叠
│   │   ├── layers.ts
│   │   ├── screenshot.ts
│   │   └── custom-cmd.ts
│   └── types/
├── scripts/
│   └── resolve-deps.ts     # 从 bridge / monorepo 解析 Cesium 路径
└── vite.config.ts
```

## 内网部署（内网机永不执行 npm install）

内网机**只需安装 Node.js**，不需要 npm、不需要外网、不需要 `npm install`。

### 外网机：打离线包（只做一次）

在 monorepo 根目录：

```bash
npm install
npm run prepare:offline --prefix examples/cesium-mcp-bridge-test
```

生成目录 `examples/cesium-mcp-bridge-test/offline-bundle/`：

```text
offline-bundle/
├── README-内网使用.txt
├── cesium-mcp-bridge/              bridge 源码
└── cesium-mcp-bridge-test/
    ├── node_modules/               已预装全部依赖（含 vite-plugin-cesium）
    ├── dev.cmd                     Windows 启动
    ├── dev.sh                      Linux/Mac 启动
    └── ...
```

将整个 **`offline-bundle` 文件夹**（含 `node_modules`）压缩后拷入内网。

### 内网机：直接启动

```text
cd offline-bundle\cesium-mcp-bridge-test
dev.cmd          REM Windows 双击或命令行运行
```

或 Linux/Mac：`sh dev.sh`

浏览器打开 `http://localhost:5173/`。

> 切勿只拷贝源码、不要删除 `node_modules`。若误删，需回外网机重新 `prepare:offline`。

---

## 依赖说明

| 包 | 来源 |
|----|------|
| `cesium-mcp-bridge` | workspace 链接，Vite alias 指向 `packages/cesium-mcp-bridge/src` |
| `cesium` / `@cesium/*` | `cesium-mcp-bridge` 的 devDependency，由 `scripts/resolve-deps.mjs` 解析；离线影像位于 `cesium/Build/Cesium/Assets/Textures/` |
| `heatmap.js` | `cesium-mcp-bridge` 的 dependency，随 bridge 一并安装 |

## 与 minimal 的区别

| 项目 | Bridge 加载 | 默认底图/地形 |
|------|-------------|---------------|
| **cesium-mcp-bridge-test** | 源码 HMR | Natural Earth II + 椭球 |
| **minimal** | `dist/` IIFE | Ion 世界地形 + 默认影像 |

底图切换、3D Tiles / Ion 地形等按钮仍会调用在线服务，内网环境下仅基础 GeoJSON / 标注 / 轨迹等功能可用。
