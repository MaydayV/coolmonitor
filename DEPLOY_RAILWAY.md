# Railway 部署指南

## 🚀 快速部署（3 步完成）

### 1. 注册 Railway 账号
👉 **[点击注册 Railway](https://railway.com?referralCode=vip)**

### 2. 一键部署

**方式 A：从 GitHub 直接部署（推荐）**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/github.com/maydayv/coolmonitor?referralCode=vip)

点击按钮后：
- 选择从 GitHub 部署
- 授权 Railway 访问仓库
- 自动开始构建

**方式 B：手动部署**
1. 访问 [Railway Dashboard](https://railway.app/dashboard?referralCode=vip)
2. New Project → Deploy from GitHub repo
3. 搜索并选择 `coolmonitor` 仓库
4. 点击 Deploy

### 3. 配置 Volume（必须！）
**这是最关键的一步，否则数据会丢失！**

```
服务部署后 → Settings → Volumes → Add Volume
- Mount Path: /app/data
- Size: 1 GB
```

完成！访问生成的域名，创建管理员账户即可使用。

## 💰 费用说明

| 计划 | 价格 | 运行时间 | 说明 |
|------|------|----------|------|
| **Trial** | 免费 | 500h/月 | ≈ 20.8天，超出暂停 |
| **Developer** | $5/月 | 无限 | ✅ 推荐（24/7运行）|

[查看详细定价](https://railway.app/pricing?referralCode=vip)

## 🔧 常见问题

**Q: 数据丢失？**  
A: 必须配置 Volume（/app/data）

**Q: 服务停止？**  
A: 免费 500h 用完，升级到 $5/月

**Q: 查看日志？**  
A: Deployments → View Logs

**Q: 更新代码？**  
A: `git push` 自动重新部署

