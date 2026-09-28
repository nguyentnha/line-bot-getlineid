const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// CÚ PHÁP MỚI: Khởi tạo MessagingApiClient từ submodule messagingApi
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

const app = express();

// Route kiểm tra server xem đã chạy chưa
app.get('/', (req, res) => {
  res.send('LINE Bot Webhook Server is running!');
});

// Endpoint Webhook cho LINE
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('Lỗi xử lý webhook:', err);
      res.status(500).end();
    });
});

// Hàm xử lý từng sự kiện nhắn tin từ LINE
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // Lấy User ID và nội dung tin nhắn
  const userId = event.source.userId;
  const userMessage = event.message.text;

  const replyText = `Xin chào!\n\n- User ID của bạn là: ${userId}\n- Bạn vừa nhắn: "${userMessage}"`;

  // CÚ PHÁP MỚI: Cấu trúc object truyền vào replyMessage
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [
      {
        type: 'text',
        text: replyText,
      },
    ],
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});