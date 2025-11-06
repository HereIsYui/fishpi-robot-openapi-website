# 管理接口

### 认证机制

所有管理接口（`/adm/` 开头）都需要通过 API Key 进行认证。

**认证方式**: 在 HTTP Header 中添加 `apiKey`

```
apiKey: your_api_key_here
```

#### 认证流程

1. **API Key 验证** - 验证 Key 是否存在
2. **状态检查** - 检查 Key 是否启用
3. **过期检查** - 检查 Key 是否过期
4. **权限验证** - 验证是否有访问该接口的权限

#### 错误响应

**401 未授权**:

```json
{
  "code": 401,
  "message": "Invalid apiKey",
  "data": {}
}
```

**403 禁止访问**:

```json
{
  "code": 403,
  "message": "No permission to access this resource",
  "data": {}
}
```

---

### 用户管理

所有管理接口通过 `oId`（鱼派用户唯一标识）进行操作。

#### 用户同步机制

- 如果用户在本地数据库**存在** - 获取并更新用户信息
- 如果用户在本地数据库**不存在** - 从鱼派获取信息并创建用户

---

### 积分管理

#### 编辑用户积分

**接口**: `POST /adm/points/edit`

**请求体**:

```json
{
  "oId": "1656984017362",
  "point": 100,
  "memo": "活动奖励"
}
```

**参数说明**:

- `oId` (string, required) - 用户 OID
- `point` (int, required) - 积分变动值（正数=增加，负数=扣除）
- `memo` (string, required) - 操作备注

**响应示例**:

```json
{
  "code": 0,
  "msg": "操作成功"
}
```

**curl 示例**:

```bash
curl -X POST "https://fishpi-open-bot.aweoo.com/adm/points/edit" \
  -H "apiKey: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "oId": "1656984017362",
    "point": 100,
    "memo": "活动奖励"
  }'
```

---

### 勋章管理

#### 添加勋章

**接口**: `POST /adm/medal/give`

**请求体**:

```json
{
  "oId": "1656984017362",
  "name": "活动勋章",
  "description": "2025年活动参与奖",
  "attr": "url=https://example.com/badge.png&backcolor=ff6b6b&fontcolor=ffffff",
  "data": ""
}
```

**参数说明**:

- `oId` (string, required) - 用户 OID
- `name` (string, required) - 勋章名称
- `description` (string, required) - 勋章描述
- `attr` (string, required) - 勋章属性（格式：`url=图标URL&backcolor=背景色&fontcolor=字体颜色`）
- `data` (string, optional) - 附加数据

**响应示例**:

```json
{
  "code": 0,
  "msg": "操作成功"
}
```

#### 移除勋章

**接口**: `POST /adm/medal/remove`

**请求体**:

```json
{
  "oId": "1656984017362",
  "name": "活动勋章"
}
```

**参数说明**:

- `oId` (string, required) - 用户 OID
- `name` (string, required) - 要移除的勋章名称

**响应示例**:

```json
{
  "code": 0,
  "msg": "操作成功"
}
```

---

### 背包管理

#### 查询用户背包

**接口**: `POST /adm/items/query`

**请求体**:

```json
{
  "oId": "1656984017362"
}
```

**响应示例**:

```json
{
  "code": 0,
  "msg": "操作成功",
  "data": {
    "checkin2days": 10,
    "item1": 5,
    "item2": 3
  }
}
```

#### 调整用户背包

**接口**: `POST /adm/items/edit`

**请求体**:

```json
{
  "oId": "1656984017362",
  "item": "checkin2days",
  "sum": 10
}
```

**参数说明**:

- `oId` (string, required) - 用户 OID
- `item` (string, required) - 物品名称
- `sum` (int, required) - 数量变动（正数=增加，负数=扣除）

**响应示例**:

```json
{
  "code": 0,
  "msg": "操作成功"
}
```

---

### 活跃度查询

#### 获取用户活跃度

**接口**: `GET /adm/liveness/:oId`

**请求示例**:

```bash
curl -X GET "https://fishpi-open-bot.aweoo.com/adm/liveness/1656984017362" \
  -H "apiKey: your_api_key_here"
```

**响应示例**:

```json
{
  "code": 0,
  "msg": "操作成功",
  "liveness": 85.5
}
```

---

### VIP 管理

VIP 有两种类型：

- `vip` - 普通 VIP
- `svip` - 超级 VIP

每个用户的每种 VIP 类型只能有一条记录（通过唯一索引保证）。

#### 获取用户 VIP 记录

**接口**: `GET /adm/vip/:oId`

**请求示例**:

```bash
curl -X GET "https://fishpi-open-bot.aweoo.com/adm/vip/1656984017362" \
  -H "apiKey: your_api_key_here"
```

**响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "id": "rec_vip_001",
      "userId": "rec_user_001",
      "quality": "svip",
      "expired": "2025-12-31 23:59:59.000Z",
      "created": "2025-10-31 10:00:00.000Z",
      "updated": "2025-10-31 10:00:00.000Z"
    },
    {
      "id": "rec_vip_002",
      "userId": "rec_user_001",
      "quality": "vip",
      "expired": "2025-06-30 23:59:59.000Z",
      "created": "2025-01-01 10:00:00.000Z",
      "updated": "2025-01-01 10:00:00.000Z"
    }
  ]
}
```

#### 提交 VIP 记录

**接口**: `POST /adm/vip/submit`

**请求体**:

```json
{
  "oId": "1656984017362",
  "quality": "svip",
  "expired": "2025-12-31 23:59:59"
}
```

**参数说明**:

- `oId` (string, required) - 用户 OID
- `quality` (string, required) - VIP 类型（`vip` 或 `svip`）
- `expired` (string, required) - 过期时间（格式：`2006-01-02 15:04:05`）

**响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": "rec_vip_003",
    "userId": "rec_user_001",
    "quality": "svip",
    "expired": "2025-12-31 23:59:59.000Z",
    "created": "2025-10-31 12:00:00.000Z",
    "updated": "2025-10-31 12:00:00.000Z"
  }
}
```

#### 批量提交 VIP 记录

**接口**: `POST /adm/vip/batch-submit`

**请求体**:

```json
{
  "oId": "1656984017362",
  "vips": [
    {
      "quality": "vip",
      "expired": "2025-06-30 23:59:59"
    },
    {
      "quality": "svip",
      "expired": "2025-12-31 23:59:59"
    }
  ]
}
```

**参数说明**:

- `oId` (string, required) - 用户 OID
- `vips` (array, required) - VIP 记录数组
  - `quality` (string, required) - VIP 类型
  - `expired` (string, required) - 过期时间

**响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "success": [
      {
        "id": "rec_vip_001",
        "userId": "rec_user_001",
        "quality": "vip",
        "expired": "2025-06-30 23:59:59.000Z"
      },
      {
        "id": "rec_vip_002",
        "userId": "rec_user_001",
        "quality": "svip",
        "expired": "2025-12-31 23:59:59.000Z"
      }
    ],
    "total": 2,
    "succeed": 2,
    "failed": 0
  }
}
```

---

### 消息推送

向在线用户推送实时消息。

**接口**: `POST /adm/message/push`

**请求体**:

```json
{
  "oIds": ["1656984017362"],
  "name": "hello",
  "data": {
    "message": "world1"
  }
}
```

**参数说明**:

- `oIds` (array[string], optional) - 用户 OID 列表
- `userIds` (array[string], optional) - 用户 ID 列表（与 oIds 至少提供一个）
- `name` (string, required) - 消息名称/类型
- `data` (object, required) - 消息数据

**响应示例**:

```json
{
  "code": 0,
  "msg": "success"
}
```

#### 客户端接收消息

消息通过实时连接推送：

```
id:AKuFeuHo0MmSOXJ4HifgQNh66HpRWMvZgdBLGDN6
event:message
data:{"app_id":"hdspd727hnwmfl1","data":{"message":"world2"}}
```

> app_id 对应消息来自哪个应用，data 为消息内容。

**curl 示例**:

```bash
curl -X POST "https://fishpi-open-bot.aweoo.com/adm/message/push" \
  -H "apiKey: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "oIds": ["1656984017362"],
    "name": "notification",
    "data": {
      "title": "系统通知",
      "content": "您有一条新消息"
    }
  }'
```
