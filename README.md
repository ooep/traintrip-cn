# TRAIN TRIP 中文本地版

对 https://railway150.jp/contents/stamp/（JR集团「TRAIN TRIP」数字集章 Web 应用）的完整逆向与本地化工程。

## 完成内容

### 1. 逆向
- 还原站点为 Nuxt.js SPA 架构（`_nuxt/*.js` 懒加载 chunk），提取全部路由与页面
- 从 JS bundle 中提取全部数据：
  - **车站印章数据**（1482 站，含站名、坐标、JR 公司、地区、印章类型）→ `data/stations_cn.json`
  - **生物图鉴**（120 种生物，含名称/分类/说明/所属车站）→ `data/ikimono_cn.json`
  - **车站便当**（15 种，含名称/厂商/获得条件/售卖场所）→ `data/ekiben_cn.json`
  - **车站荞麦**（24 种，含车站/店铺/菜单）→ `data/ekisoba_cn.json`
  - **特殊印章**（45 枚，含主题/获得条件）→ `data/special_cn.json`
  - **车辆基地·铁道之颜**（62 个目标车站，按 JR 公司分组）→ `data/traindepot_cn.json`
- 下载全部静态资源（图片/PDF/图标，3.7MB）→ `assets/`

### 2. 本地化（汉化）
- 全部界面文案、导航、提示已翻译为简体中文（豆包 LLM 翻译）
- 生物图鉴 120 条、特殊印章 45 条、便当 15 条、荞麦 24 条全部翻译
- 使用规约、隐私政策两份法律文本全文翻译
- 设计保留原站语言：JR 绿 #02af00、JR 红 #e60012、原站 LOGO 与图标

### 3. 移除登录与注册
- 删除 `/login`、`/mypage`、`/ranking` 页面及导航「LOGIN」入口
- 移除 LINE / X 账号登录、游客注册、应募提交等全部账号功能
- 印章收集改为**纯本地模拟**：点击站点即盖章，数据存 `localStorage`
- 站点为纯静态，无任何服务器请求、无 API、无定位、无 Cookie 分析

## 页面清单

| 页面 | 说明 |
|---|---|
| `index.html` | 首页：菜单导航 + 添加主屏教程 |
| `find.html` | 印章地图：1482 站按地区/公司浏览、搜索、模拟盖章 |
| `ikimono.html` | 生物图鉴：120 种生物卡片 + 详情弹窗 |
| `ekiben.html` | 车站便当（15）・车站荞麦（24） |
| `special-stamp.html` | 特殊印章 45 枚 |
| `traindepot.html` | 车辆基地·铁道之颜 62 站 |
| `campaign.html` | 应募活动规则说明 |
| `howto.html` | 玩法指南 |
| `my.html` | 我的集章：已收集印章一览（本地） |
| `save.html` | 保存印章：布局/信息选择 + 预览 |
| `terms.html` | 使用规约（中文翻译） |
| `privacy.html` | 隐私政策（中文翻译） |

## 部署

纯静态站点，可直接部署到任意静态托管（Vercel / Cloudflare Pages / GitHub Pages / Nginx）：

```bash
# 本地预览
cd traintrip-cn && python3 -m http.server 8080
# 或
npx serve traintrip-cn

# Vercel
vercel deploy --cwd traintrip-cn --prod

# Cloudflare Pages
npx wrangler pages deploy traintrip-cn
```

## 验证记录

- [x] 12 个页面无头浏览器渲染通过
- [x] 全部数据文件加载正常（1482 站 / 120 生物 / 45 特殊 / 15 便当 / 24 荞麦 / 62 车辆基地站）
- [x] 盖章逻辑单测通过（去重 / 计数 / 移除）
- [x] 无死链、无缺失资源
- [x] 无登录/注册功能残留

## 与原站差异说明

| 项目 | 原站 | 本地版 |
|---|---|---|
| 登录/注册 | LINE / X 账号 | 无（已移除） |
| 印章获取 | 定位 + 服务器 | 本地点击模拟 |
| 数据存储 | 服务器账号 | localStorage |
| 应募/排名 | 在线参与 | 仅规则说明 |
| 语言 | 日语 | 简体中文 |
| 运行 | 需联网 | 纯静态可离线 |
