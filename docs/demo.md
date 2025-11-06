# 完整使用示例

### JavaScript 客户端示例

```javascript
// 1. 建立实时连接
const eventSource = new EventSource(
  "https://fishpi-open-bot.aweoo.com/api/realtime"
);

let clientId = null;
let isLoggedIn = false;

// 2. 监听连接事件
eventSource.addEventListener("PB_CONNECT", (e) => {
  const data = JSON.parse(e.data);
  clientId = data.client_id;
  isLoggedIn = data.login_status;

  console.log("客户端ID:", clientId);
  console.log("登录状态:", isLoggedIn);

  if (isLoggedIn) {
    console.log("用户信息:", data.user);
  }
});

// 3. 监听登录事件
eventSource.addEventListener("login", (e) => {
  const data = JSON.parse(e.data);
  console.log("用户已登录:", data.user);
  isLoggedIn = true;
});

// 4. 监听自定义消息
eventSource.addEventListener("hello", (e) => {
  const data = JSON.parse(e.data);
  console.log("收到消息:", data);
});

// 5. 引导用户登录
function openLogin() {
  if (!clientId) {
    console.error("客户端ID未获取");
    return;
  }

  const loginUrl = `https://fishpi-open-bot.aweoo.com/fishpi/login?client_id=${clientId}`;
  window.open(loginUrl, "_blank", "width=600,height=700");
}

// 6. 检查登录状态
if (!isLoggedIn) {
  openLogin();
}
```

### 游戏服务器示例（Node.js）

```javascript
const axios = require("axios");

const API_KEY = "your_api_key_here";
const BASE_URL = "https://fishpi-open-bot.aweoo.com";

// 1. 获取用户信息
async function getUserInfo(clientId) {
  try {
    const response = await axios.get(`${BASE_URL}/adm/user/get`, {
      params: { client_id: clientId },
      headers: { apiKey: API_KEY },
    });

    if (response.data.data.authenticated) {
      return response.data.data.user;
    } else {
      console.log("用户未登录");
      return null;
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return null;
  }
}

// 2. 增加用户积分
async function addPoints(oId, points, memo) {
  try {
    const response = await axios.post(
      `${BASE_URL}/adm/points/edit`,
      { oId, point: points, memo },
      { headers: { apiKey: API_KEY } }
    );
    return response.data;
  } catch (error) {
    console.error("增加积分失败:", error);
    return null;
  }
}

// 3. 推送消息
async function pushMessage(oIds, name, data) {
  try {
    const response = await axios.post(
      `${BASE_URL}/adm/message/push`,
      { oIds, name, data },
      { headers: { apiKey: API_KEY } }
    );
    return response.data;
  } catch (error) {
    console.error("推送消息失败:", error);
    return null;
  }
}

// 使用示例
(async () => {
  // 获取用户信息
  const user = await getUserInfo("client_id_here");
  if (user) {
    console.log("用户:", user.name, user.nickname);

    // 增加积分
    await addPoints(user.oId, 100, "游戏胜利奖励");

    // 推送消息
    await pushMessage([user.oId], "game_reward", {
      title: "恭喜获得奖励",
      points: 100,
    });
  }
})();
```
