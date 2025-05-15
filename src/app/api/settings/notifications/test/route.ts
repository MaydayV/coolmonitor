import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { validateAuth } from '@/lib/auth-helpers';

// 定义不同类型通知的配置接口
interface EmailConfig {
  email: string;
  smtpServer: string;
  smtpPort: string | number;
  username?: string;
  password?: string;
}

interface WebhookConfig {
  url: string;
}

interface WechatConfig {
  pushUrl: string;
  titleTemplate?: string;
  contentTemplate?: string;
}

// 测试通知接口
export async function POST(request: NextRequest) {
  try {
    // 验证用户是否已登录
    const authError = await validateAuth();
    if (authError) return authError;
    
    const body = await request.json();
    
    if (!body || !body.type || !body.config) {
      return NextResponse.json(
        { success: false, error: '缺少必要的字段' },
        { status: 400 }
      );
    }
    
    // 根据不同类型的通知渠道执行测试
    const { type, name, config } = body;
    
    switch (type) {
      case '邮件':
        return await testEmailNotification(name, config as EmailConfig);
      case 'Webhook':
        return await testWebhookNotification(name, config as WebhookConfig);
      case '微信推送':
        return await testWechatNotification(name, config as WechatConfig);
      default:
        return NextResponse.json(
          { success: false, error: '不支持的通知类型' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('测试通知失败:', error);
    return NextResponse.json(
      { success: false, error: '测试通知失败: ' + (error instanceof Error ? error.message : '未知错误') },
      { status: 500 }
    );
  }
}

// 测试邮件通知
async function testEmailNotification(name: string, config: EmailConfig) {
  const { email, smtpServer, smtpPort, username, password } = config;
  
  if (!email || !smtpServer || !smtpPort) {
    return NextResponse.json(
      { success: false, error: '邮件配置不完整，请检查收件人地址、SMTP服务器和端口' },
      { status: 400 }
    );
  }
  
  try {
    // 创建一个Nodemailer传输器
    const transporter = nodemailer.createTransport({
      host: smtpServer,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465, // true表示465端口，false表示其他端口
      auth: {
        user: username || email, // 如果未提供用户名，使用邮箱地址
        pass: password
      }
    });
    
    // 发送测试邮件
    const info = await transporter.sendMail({
      from: username || email,
      to: email,
      subject: `酷监控 - 测试通知 - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #6366F1; border-radius: 10px;">
          <h2 style="color: #6366F1;">🔔 酷监控通知测试</h2>
          <p>您好，这是来自 <strong>酷监控</strong> 系统的测试通知邮件。</p>
          <p>通知渠道名称: <strong>${name}</strong></p>
          <p>如果您收到此邮件，表示您的邮件通知设置已配置成功！</p>
          <hr style="border-top: 1px solid #EEE; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
        </div>
      `
    });
    
    console.log('邮件测试成功:', info.messageId);
    return NextResponse.json({ success: true, message: `测试邮件已成功发送至 ${email}` });
  } catch (error) {
    console.error('发送测试邮件失败:', error);
    return NextResponse.json(
      { success: false, error: '发送测试邮件失败: ' + (error instanceof Error ? error.message : '未知错误') },
      { status: 500 }
    );
  }
}

// 测试Webhook通知
async function testWebhookNotification(name: string, config: WebhookConfig) {
  const { url } = config;
  
  if (!url) {
    return NextResponse.json(
      { success: false, error: 'Webhook URL不能为空' },
      { status: 400 }
    );
  }
  
  try {
    console.log(`开始测试Webhook通知: ${name}, URL: ${url}`);
    
    // 准备测试数据 - 使用与实际通知一致的格式
    const webhookData = {
      event: 'status_change',
      timestamp: new Date().toISOString(),
      monitor: {
        name: '测试监控项',
        type: 'http',
        status: '正常',  // 中文状态描述
        status_code: 1,  // 状态码: 1=正常
        time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        message: '这是一条来自酷监控的测试通知'
      },
      // 添加失败信息结构，与实际通知保持一致
      failure_info: null
    };
    
    console.log(`Webhook测试数据: ${JSON.stringify(webhookData)}`);
    
    // 发送Webhook请求
    const response = await axios.post(url, webhookData, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CoolMonitor-Notification-Service'
      },
      timeout: 10000 // 10秒超时
    });
    
    console.log(`Webhook测试响应: 状态码=${response.status}, 数据=${JSON.stringify(response.data)}`);
    
    if (response.status >= 200 && response.status < 300) {
      return NextResponse.json({ success: true, message: `测试Webhook请求已成功发送，响应状态码: ${response.status}` });
    } else {
      return NextResponse.json(
        { success: false, error: `Webhook请求失败，响应状态码: ${response.status}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('发送Webhook通知失败:', error);
    let errorMessage = '发送Webhook请求失败';
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`Webhook请求失败，服务器响应: 状态码=${error.response.status}, 数据=${JSON.stringify(error.response.data)}`);
        errorMessage += `: 服务器返回状态码 ${error.response.status}`;
      } else if (error.request) {
        console.error(`Webhook请求失败，无响应: ${error.message}`);
        errorMessage += `: 请求发送成功但未收到响应，可能是网络问题或URL无效`;
      } else {
        console.error(`Webhook请求失败，请求配置错误: ${error.message}`);
        errorMessage += `: ${error.message}`;
      }
    } else if (error instanceof Error) {
      console.error(`Webhook请求失败，其他错误: ${error.message}`);
      errorMessage += `: ${error.message}`;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// 测试微信推送通知
async function testWechatNotification(name: string, config: WechatConfig) {
  const { pushUrl } = config;
  
  if (!pushUrl) {
    return NextResponse.json(
      { success: false, error: '微信推送URL不能为空' },
      { status: 400 }
    );
  }
  
  try {
    // 准备测试数据
    const title = '酷监控 - 测试通知';
    const content = `## 酷监控通知测试\n\n这是来自酷监控系统的测试通知。\n\n- **通知渠道**: ${name}\n- **测试时间**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n\n如果您收到此通知，表示您的微信推送设置已配置成功！`;
    
    console.log(`开始测试微信推送: ${name}, URL: ${pushUrl}`);
    console.log(`微信推送测试数据: 标题=${title}, 内容=${content}`);
    
    // 发送推送请求
    const response = await axios.post(pushUrl, { 
      title, 
      content 
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10秒超时
    });
    
    console.log(`微信推送测试响应: 状态码=${response.status}, 数据=${JSON.stringify(response.data)}`);
    
    if (response.status >= 200 && response.status < 300) {
      return NextResponse.json({ success: true, message: '测试微信推送已成功发送' });
    } else {
      return NextResponse.json(
        { success: false, error: `微信推送请求失败，响应状态码: ${response.status}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('发送微信推送通知失败:', error);
    let errorMessage = '发送微信推送请求失败';
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`微信推送请求失败，服务器响应: 状态码=${error.response.status}, 数据=${JSON.stringify(error.response.data)}`);
        errorMessage += `: 服务器返回状态码 ${error.response.status}`;
      } else if (error.request) {
        console.error(`微信推送请求失败，无响应: ${error.message}`);
        errorMessage += `: 请求发送成功但未收到响应，可能是网络问题或URL无效`;
      } else {
        console.error(`微信推送请求失败，请求配置错误: ${error.message}`);
        errorMessage += `: ${error.message}`;
      }
    } else if (error instanceof Error) {
      console.error(`微信推送请求失败，其他错误: ${error.message}`);
      errorMessage += `: ${error.message}`;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
} 