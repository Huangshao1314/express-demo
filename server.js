const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.get('/convertToImage', async (req, res) => {
    const url = req.query.url; // 获取路由参数中的 URL

    // 启动 Puppeteer 浏览器
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 设置视口大小，只限制宽度，不限制高度
    await page.setViewport({ width: 375*2,height: 80*2 }); //

    // 访问指定 URL
    await page.goto(url);

    // 截取整个页面并保存为图片
    const screenshotPath = `screenshot.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true, quality: 100 });

    // 关闭 Puppeteer 浏览器
    await browser.close();

    // 读取截图文件并发送给前端
    fs.readFile(screenshotPath, (err, data) => {
        if (err) {
            console.error('Failed to read screenshot:', err);
            res.status(500).send('Failed to read screenshot');
        } else {
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': data.length
            });
            res.end(data);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
