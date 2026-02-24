# 猫头鹰基金研究院

智能投顾 - 综合策略管理平台

## 功能模块

- **首页** - 资产概览、推荐组合、市场资讯
- **微课堂** - 投资教育课程、热门话题
- **组合** - 我的组合、一键跟投、组合详情
- **工具** - 风险测评、定投计算器等投资工具
- **我的** - 用户中心、风险测评、设置

## 技术栈

- React 19 + TypeScript
- Vite 7
- React Router
- Tailwind CSS 4

## 响应式支持

- 手机端：底部 Tab 导航
- 平板 (iPad)：自适应布局
- PC / Mac：完整桌面体验

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建产物在 `dist/` 目录。

## 部署与刷新 404 问题

部署到静态托管后，直接访问或刷新 `/login`、`/forum` 等路径可能出现 404。需要配置服务器将所有请求回退到 `index.html`：

- **Vercel**：已包含 `vercel.json`
- **Netlify**：已包含 `netlify.toml` 和 `public/_redirects`
- **Nginx**：参考 `nginx.conf.example`，添加 `try_files $uri $uri/ /index.html;`
- **Apache**：已包含 `public/.htaccess`
