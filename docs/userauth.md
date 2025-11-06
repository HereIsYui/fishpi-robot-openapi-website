# 用户登录认证

### 实时连接

建立 SSE（Server-Sent Events）连接以接收实时消息和用户状态更新。

**接口**: `GET /api/realtime`

#### 连接响应

**未登录状态**:
```
id: AKuFeuHo0MmSOXJ4HifgQNh66HpRWMvZgdBLGDN6
event: PB_CONNECT
data: {"client_id":"AKuFeuHo0MmSOXJ4HifgQNh66HpRWMvZgdBLGDN6","login_status":false}
```

**已登录状态**:
```
id: 3GueRSm3JsHfyZS1TrZQi7F23KgojAOkjdy5C677
event: PB_CONNECT
data: {"client_id":"3GueRSm3JsHfyZS1TrZQi7F23KgojAOkjdy5C677","login_status":true,"user":{"avatar":"https://file.fishpi.cn/2022/08/blob-fbe21682.png","collectionId":"_pb_users_auth_","collectionName":"users","created":"2025-10-31 07:20:37.478Z","email":"1656984017362@fishpi.cn","emailVisibility":true,"id":"30yj63qb5yatav8","name":"8888","nickname":"开摆","oId":"1656984017362","updated":"2025-10-31 07:20:37.526Z","verified":true}}
```

**字段说明**:
- `client_id` - 客户端唯一标识，用于后续操作
- `login_status` - 登录状态（true=已登录，false=未登录）
- `user` - 用户信息对象（仅登录时返回）
  - `id` - 用户内部ID
  - `oId` - 鱼派用户OID（唯一标识）
  - `name` - 用户名
  - `nickname` - 昵称
  - `avatar` - 头像URL
  - `email` - 邮箱
  - `verified` - 是否已验证

---

### 登录流程

#### 1. 引导用户登录

在小窗口或新标签页中打开登录页面：

```
/fishpi/login?client_id={client_id}
```

**参数说明**:
- `client_id` - 从实时连接获取的客户端ID

**示例**:
```
https://fishpi-open-bot.aweoo.com/fishpi/login?client_id=3GueRSm3JsHfyZS1TrZQi7F23KgojAOkjdy5C677
```

#### 2. 用户完成登录

用户在登录页面完成鱼派账号授权后，会看到"您已成功登录"的提示页面，可以点击按钮关闭窗口。

#### 3. 接收登录事件

登录成功后，实时连接会收到 `login` 事件：

```
id: AKuFeuHo0MmSOXJ4HifgQNh66HpRWMvZgdBLGDN6
event: login
data: {"action":"login","user":{"avatar":"https://file.fishpi.cn/2022/08/blob-fbe21682.png","collectionId":"_pb_users_auth_","collectionName":"users","created":"2025-10-31 07:20:37.478Z","email":"1656984017362@fishpi.cn","emailVisibility":true,"id":"30yj63qb5yatav8","name":"8888","nickname":"开摆","oId":"1656984017362","updated":"2025-10-31 07:20:37.526Z","verified":true}}
```

---

### 获取用户信息

游戏服务器可以通过 `client_id` 查询当前连接的用户信息。

**接口**: `GET /adm/user/get`

**请求头**:
```
apiKey: your_api_key_here
```

**请求参数**:
- `client_id` (string, required) - 客户端ID

**请求示例**:
```bash
curl -X GET "https://fishpi-open-bot.aweoo.com/adm/user/get?client_id=3GueRSm3JsHfyZS1TrZQi7F23KgojAOkjdy5C677" \
  -H "apiKey: your_api_key_here"
```

#### 响应示例

**1. 客户端不存在或已断开**:
```json
{
  "data": {},
  "message": "Client not found or disconnected.",
  "status": 404
}
```

**2. 客户端未绑定用户（未登录）**:
```json
{
  "code": 0,
  "data": {
    "authenticated": false,
    "clientId": "6xB3BqL977sy2dzXS2bkxMVqiLhHg0ST553uCACl"
  },
  "msg": "success"
}
```

**3. 获取到用户信息**:
```json
{
  "code": 0,
  "data": {
    "authenticated": true,
    "clientId": "jallB5qhcizwENJv093CdCMaDUdCzo8lWZHzdnEw",
    "user": {
      "avatar": "https://file.fishpi.cn/2022/08/blob-fbe21682.png",
      "name": "8888",
      "nickname": "开摆",
      "oId": "1656984017362"
    }
  },
  "msg": "success"
}
```