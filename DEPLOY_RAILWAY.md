# Railway 部署指南

## 🚀 快速部署（3 步完成）

### 1. 注册 Railway 账号
👉 **[点击注册 Railway](https://railway.com?referralCode=vip)**

### 2. 一键部署
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template?referralCode=vip)

或手动部署：
1. 访问 [Railway Dashboard](https://railway.app/dashboard?referralCode=vip)
2. New Project → Deploy from GitHub repo
3. 选择 `coolmonitor` 仓库

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

