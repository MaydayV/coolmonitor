# Railway 部署指南

## 🚀 一键部署（3 步完成）

### 步骤 1：点击部署

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.com/deploy/GAsUJY?referralCode=vip)

点击上方按钮，会跳转到 Railway 模板页面

### 步骤 2：开始部署

在模板页面：
1. 如果未登录，会提示注册/登录（自动包含邀请码）
2. 点击 **Deploy Now** 按钮
3. Railway 会自动：
   - 创建新项目
   - 拉取代码
   - 构建 Docker 镜像
   - 启动服务

等待 3-5 分钟完成构建

### 步骤 3：配置 Volume（必须！）
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
A: 必须配置 Volume（/app/data, 1GB）。这是唯一需要手动操作的步骤。

**Q: 服务停止？**  
A: 免费 500h/月 用完，升级到 [$5/月 Developer Plan](https://railway.app/pricing?referralCode=vip)

**Q: 查看日志？**  
A: 项目页面 → Deployments → View Logs

**Q: 如何更新到最新版本？**  
A: 点击项目 → Settings → Redeploy，Railway 会自动拉取最新代码并重新部署

**Q: 如何自定义域名？**  
A: Settings → Networking → Custom Domain，添加你的域名并配置 DNS

