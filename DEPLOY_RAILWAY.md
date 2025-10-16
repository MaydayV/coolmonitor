# Railway 部署指南

## 🚀 快速部署（4 步完成）

### 步骤 0：Fork 仓库（必须！）
⚠️ **Railway 只能部署你自己账号下的仓库**

1. 访问原仓库：https://github.com/star7th/coolmonitor
2. 点击右上角 **Fork** 按钮
3. Fork 到你的 GitHub 账号

### 步骤 1：注册 Railway
👉 **[点击注册 Railway](https://railway.com?referralCode=vip)**

### 步骤 2：开始部署
👉 **[点击这里开始部署](https://railway.app/new?referralCode=vip)**

然后：
1. 选择 **"Deploy from GitHub repo"**
2. **首次使用需要授权**：点击 "Configure GitHub App"
3. 在弹出窗口选择：
   - **All repositories**（推荐）
   - 或只选择 `coolmonitor` 仓库
4. 回到 Railway，搜索 `coolmonitor`
5. 选择 **你自己账号下的** `coolmonitor` 仓库
6. 点击 **Deploy**

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

**Q: 搜索不到仓库？（最常见问题）**  
A: 有两个原因：
1. **没有 Fork 仓库** - Railway 只能看到你账号下的仓库
2. **没有授权 GitHub** - 需要在 Railway 中配置 GitHub App 权限

解决方法：
```
1. 确保已经 Fork 了原仓库到你的账号
2. Railway Dashboard → 右上角头像 → Account Settings
3. Integrations → GitHub → Configure
4. 选择 "All repositories" 或添加 coolmonitor 仓库
5. 保存后重新部署
```

**Q: 数据丢失？**  
A: 必须配置 Volume（/app/data, 1GB）

**Q: 服务停止？**  
A: 免费 500h 用完，升级到 $5/月

**Q: 查看日志？**  
A: Deployments → View Logs

**Q: 更新代码？**  
A: 在你 Fork 的仓库 `git push`，Railway 自动重新部署

