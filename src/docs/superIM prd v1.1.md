# 前端产品需求文档 (PRD)：SuperIM v1.1

**产品名称：** SuperIM
**版本：** V1.1
**文档状态：** 进行中
**最后更新：** 2026-07-09
**范围：** 前端页面原型 + 对应后台管理页面

---

## 1. 文档概述

### 1.1 产品目标

在 v1.0 即时通讯与社交能力基础上，新增临时会话、对话文件夹、共同群聊、收藏夹和多账号切换 5 个核心功能，提升沟通效率和用户体验。

### 1.2 产品范围

本 PRD 涵盖 SuperIM v1.1 新增前端页面原型及现有页面改动，继续使用 `equatorial-minimalism` 主题并复用 v1.0 组件。

### 1.3 新增页面清单

| 模块 | 页面 | 路径 | 说明 |
|------|------|------|------|
| 临时会话 | 临时聊天室 | /temp-chat/:userId | 1 小时后自动销毁，可转正式 |
| 临时会话 | 添加临时会话入口 | 集成到 contacts / addcontact | 搜索用户后发起临时对话 |
| 临时会话 | 聊天列表展示 | /chats | 临时会话在列表中显示 Temp 标签 |
| 对话文件夹 | 文件夹管理 | /chat-folders | 新增/编辑/删除文件夹 |
| 收藏夹 | Saved Messages 首页 | /favorites | 以自聊形式查看/发送/管理收藏 |
| 收藏夹 | 收藏详情 | /favorite/:id | 查看单条收藏气泡并转发 |
| 多账号 | 账号切换面板 | /account-switcher | 切换/添加/管理多账号 |
| 多账号 | 账号消息中心 | 集成到 chats | 展示各账号未读消息 |
| 个人中心 | 设置二级页 | /settings | 聚合账号、偏好、登出、注销等设置项 |

### 1.4 需改动的现有页面

| 页面 | 改动内容 |
|------|----------|
| /chats | 顶部增加文件夹 Tab 切换；账号切换入口；会话列表展示临时会话并带 Temp 标签；置顶聊天时间以药丸徽章展示 |
| /contacts | 搜索结果增加「临时会话」入口 |
| /addcontact | 用户卡片的「临时会话」改为图标按钮；点击后弹出规则确认弹窗 |
| /userprofile | 参考 Telegram 风格重构：分享/屏蔽/举报收入右上角更多菜单；Media/Files/Links/Groups 做成 Tab 切换；优化 Message/Mute/Call/Video 图标按钮；非联系人展示「Add to Contacts」按钮；Media/Files/Links 数据来自与该用户的聊天消息，Groups 来自共同群聊 |
| /chatroom / /groupchat / /temp-chat / /addcontact | 点击用户头像/名称跳转 `/user-profile?isContact=xxx&name=xxx`，用户资料页根据参数判断是否为联系人 |
| /me | 参考 Telegram Settings 风格重构：顶部个人信息卡片；多账号时平铺展示所有已绑定账号及未读消息；平铺 My Posts / My Favorites / Chat Folders；Settings 入口聚合所有设置项；Help Center / About / Terms 平铺展示 |
| /settings（新增） | 二级设置页，聚合 Account（Edit Profile / Security / Privacy）、Preferences（Notifications / Sound & Vibration / Language）、Log Out |
| /security | 安全设置页，新增「Delete Account」入口及二次确认弹窗；返回按钮返回上一页 |

---

## 2. 用户故事

### US-01 临时会话

**As a** 用户  
**I want to** 在搜索到非好友用户时直接发起临时对话  
**So that** 无需先加好友即可快速沟通

**验收标准**

1. Given 用户在添加联系人页搜索到非好友用户  
   When 点击用户卡片右侧的临时会话图标  
   Then 弹出二次确认弹窗，告知临时会话规则（有效期 1 小时、到期自动销毁、加好友可保留记录）。

2. Given 用户已阅读临时会话规则  
   When 点击确认  
   Then 进入临时聊天室，页面顶部仅显示「Temp Chat」标签，不重复显示倒计时文案。

3. Given 临时会话已持续 55 分钟  
   When 顶部倒计时少于 5 分钟  
   Then 倒计时条变红，提示用户添加好友以保留对话。

4. Given 临时会话页面右上角存在更多按钮  
   When 点击更多按钮  
   Then 展开菜单，包含「添加好友」「清空记录」「删除对话」三个选项。

5. Given 临时会话中存在消息  
   When 用户点击「添加好友」并对方通过  
   Then 该对话自动转为正式对话，历史消息保留。

6. Given 临时会话达到 1 小时且未加好友  
   When 倒计时结束  
   Then 聊天室关闭，消息不可见，会话从列表移除。

7. Given 用户在聊天列表页  
   When 存在临时会话  
   Then 会话名称旁显示 Temp 标签，点击可进入临时聊天室。

---

### US-02 对话文件夹

**As a** 用户  
**I want to** 将聊天按主题/用途归类到不同文件夹  
**So that** 首页消息列表更有条理

**验收标准**

1. Given 用户在文件夹管理页  
   When 点击新建文件夹  
   Then 可输入文件夹名称、选择包含的聊天（单聊/群聊）。

2. Given 用户在文件夹管理页  
   When 长按/拖拽文件夹卡片  
   Then 可调整文件夹排序顺序。

3. Given 用户在个人中心页  
   When 点击「Manage Folders」入口  
   Then 进入文件夹管理页。

4. Given 用户回到首页  
   When 查看顶部文件夹 Tab  
   Then 默认展示「All」并展示全部会话；另有 2 个自定义文件夹（Work / Family），点击后仅展示该文件夹内的会话。

5. Given 用户创建多个文件夹  
   When 文件夹数量超过 5 个  
   Then Tab 支持横向滚动。

---

### US-03 用户资料与共同群聊

**As a** 用户  
**I want to** 查看其他用户资料并管理关系  
**So that** 快速发起沟通、查看共同群聊或处理骚扰用户

**验收标准**

1. Given 用户在单聊、群聊、临时会话或添加联系人页  
   When 点击用户头像或名称  
   Then 跳转 `/user-profile?isContact=xxx&name=xxx`；用户资料页根据 `isContact` 参数判断并展示「Add to Contacts」或已联系人布局。

2. Given 用户进入用户资料页  
   When 点击右上角更多菜单  
   Then 显示 Share Contact / Block(Unblock) / Report。

3. Given 用户点击「Share Contact」  
   When 确认分享  
   Then 跳转 `/forward-message?shareContact=xxx`，将联系人卡片转发给聊天/群聊。

4. Given 用户点击「Block」或「Unblock」  
   When 操作完成  
   Then 页面显示 Toast「Contact blocked」或「Contact unblocked」。

5. Given 用户点击「Report」  
   When 提交举报  
   Then 页面显示 Toast「Report submitted」。

6. Given 用户切换 Tab  
   When 选择 Media / Files / Links  
   Then 展示来自与该用户聊天记录中的图片、文件、链接；选择 Groups 时展示共同加入的群聊。

7. Given 用户点击某个共同群聊  
   Then 跳转到对应群聊页面。

---

### US-04 收藏夹

**As a** 用户  
**I want to** 将聊天记录、图片、视频、链接加入收藏  
**So that** 重要内容易于查找和再次分享

**验收标准**

1. Given 用户在临时会话中长按消息  
   When 选择「Save to Favorites」  
   Then 该消息加入收藏夹，并在页面显示 Toast「Saved to Favorites」。

2. Given 用户在转发选择器  
   When 选择「Saved Messages」  
   Then 消息被收藏到 /favorites。

3. Given 用户在收藏夹页  
   When 右键（或长按）某条收藏  
   Then 弹出操作菜单，提供 Reply / Forward / Copy / Delete / Select。

4. Given 用户在收藏夹页  
   When 在底部输入框输入文字并发送  
   Then 新增一条文本收藏（发给自己的笔记）。

5. Given 用户在操作菜单中选择「Select」  
   When 进入多选模式并选择多条收藏  
   Then 底部出现批量操作栏，支持批量 Forward 和批量 Delete。

6. Given 用户选择多条收藏并点击批量 Delete  
   When 确认删除  
   Then 已选收藏从列表移除。

7. Given 收藏夹内容较多  
   When 用户使用搜索  
   Then 仅展示匹配内容/来源的收藏消息。

8. Given 用户在收藏夹页底部输入框发送笔记  
   When 消息发送成功  
   Then 新消息追加到收藏夹列表底部，并自动滚动到底部。

9. Given 用户在收藏夹页  
   When 点击右上角更多按钮  
   Then 展开视图切换菜单，可选择「Chat Mode」或「Message Mode」，默认 Chat Mode。

10. Given 用户切换到 Message Mode  
    When 查看收藏夹  
    Then 消息以列表行形式展示来源头像、名称、内容摘要与时间。

---

### US-04b 聊天消息多选

**As a** 用户  
**I want to** 在单聊/群聊中多选消息并批量转发或删除  
**So that** 提高消息管理效率

**验收标准**

1. Given 用户在 /chatroom 或 /groupchat 长按消息  
   When 选择「Select」  
   Then 进入多选模式，所有消息左侧显示圆形复选框并统一左对齐。

2. Given 用户已进入多选模式  
   When 点击消息复选框  
   Then 切换该消息选中状态，顶部标题显示已选数量。

3. Given 用户已选中一条或多条消息  
   When 点击底部「Forward」按钮  
   Then 跳转 /forward-message 转发已选消息。

4. Given 用户已选中一条或多条消息  
   When 点击顶部「Delete」按钮并确认  
   Then 已选消息从列表移除并退出多选模式。

5. Given 用户处于多选模式  
   When 点击顶部关闭按钮  
   Then 退出多选模式并清空已选状态。

---

### US-05 多账号切换

**As a** 用户  
**I want to** 同时登录多个账号并快速切换  
**So that** 工作生活账号分离且不错过消息

**验收标准**

1. Given 用户在账号切换面板  
   When 点击「添加账号」  
   Then 弹出两步登录弹窗：第一步选择 Phone（带区号选择）或 Email 并填写账号，第二步输入密码；登录成功后保留已登录账号。

2. Given 用户已登录 3 个账号  
   When 查看账号切换面板  
   Then 「添加账号」按钮置灰并提示最多支持 3 个账号。

3. Given 用户有多个已登录账号  
   When 收到非当前账号消息  
   Then 在首页显示该账号头像及未读红点。

4. Given 用户点击账号头像  
   When 选择另一账号  
   Then 快速切换到该账号会话列表。

---

## 3. 页面结构模型

| 页面/区域 | 子项 | 说明 |
| --- | --- | --- |
| /temp-chat/:userId | 顶部 Temp Chat 标签、倒计时条、右上角更多操作菜单、消息列表、添加好友按钮；消息长按菜单提供 Reply / Copy / Forward / Select / Delete（无 Pin、无 Save to Favorites），Select 进入多选模式，复选框统一左对齐，底部批量 Forward、顶部批量 Delete | 临时会话页面 |
| /chat-folders | 文件夹列表、拖拽排序、新建/编辑抽屉、聊天选择器 | 文件夹管理 |
| /chats | 文件夹 Tab（All / Work / Family，默认 All）、账号切换浮标、会话列表（含 Saved Messages 普通项）、置顶且未读时时间药丸徽章点亮；会话时间按规则展示（当日 12 小时制 / 本周周内 / 当年月日 / 往年月日年） | 首页改动 |
| /me | 参考 Telegram Settings 风格重构：个人信息卡片（可进入 Edit Profile）、多账号时平铺展示其他已绑定账号及未读消息、底部提供 Manage Accounts 入口跳转账号管理页、My Posts / Saved Messages / Chat Folders / Settings / Help Center / About / Terms of Service 平铺列表 | 个人中心重构 |
| /settings | Account（Edit Profile / Security / Privacy）、Preferences（Notifications / Sound & Vibration / Language）、Log Out | 新增设置二级页 |
| /security | Change Password / Biometric Lock / Contact Methods / Sessions / Data / Delete Account | 安全设置页 |
| /favorites | 自聊式 Saved Messages 界面、消息气泡列表、底部输入框发笔记、消息按时间正序展示（新消息在底部追加并自动滚动到底部）、长按菜单（Reply / Forward / Copy / Delete / Select）、多选批量操作、搜索、右上角更多菜单切换 Chat Mode / Message Mode（默认 Chat Mode） | 收藏夹首页 |
| /favorite/:id | 单条收藏消息气泡预览、转发/删除按钮 | 收藏详情 |
| /account-switcher | 当前账号卡片、其他账号列表（未读红点）、添加账号（最多 3 个，两步登录：Phone/Email + 密码） | 账号管理 |
| /userprofile | Telegram 风格布局、右上角更多菜单（Share/Block/Report）、Quick Actions（Message/Mute/Call/Video）、非联系人 Add to Contacts、信息卡片、Media/Files/Links/Groups Tab 切换 | 用户主页改动 |
| /chatroom / /groupchat | 消息长按菜单提供 Reply / Copy / Forward / Pin / Select / Delete；Select 进入多选模式，复选框统一左对齐，底部批量 Forward、顶部批量 Delete | 聊天页改动 |
| /chatroom / /groupchat / /temp-chat / /favorites | 底部发送操作栏统一：附件按钮、带表情的输入框、语音/发送按钮、回复预览；图标按钮与输入框垂直居中对齐 | 聊天输入栏样式统一 |
| /forward-message | 转发选择器参考 Telegram：底部悬浮胶囊切换 Chats/Contacts、搜索框下方文件夹筛选（All/Work/Family）、不展示待转发内容、群聊项名称右侧 Group 标签无成员数、不显示最近活跃时间、顶部 Saved Messages | 转发页重构 |
| 二级页面导航条 | sticky top-0 z-20，px-4 py-3，text-headline-md text-[var(--primary)] 标题左对齐，左侧返回按钮（arrow icon + navigate(-1)），保留原有右侧操作按钮 | 全局导航统一 |

---

## 4. 非功能需求

1. **视觉一致性**：所有新增页面严格使用 `equatorial-minimalism` 主题 Token。
2. **组件复用**：优先复用 v1.0 的 Avatar、Button、Input、ListItem、Modal 等组件。
3. **移动端优先**：新增页面按 400×852 移动端尺寸设计。
4. **原型可验收**：每个新页面必须包含 `index.tsx`、`style.css`、`spec.md`。

---

## 5. 验收清单

- [ ] 5 个模块对应页面全部完成并通过 `check-app-ready.mjs` 验收。
- [ ] /chats 顶部文件夹 Tab 默认「All」并展示全部会话，另有 2 个自定义文件夹；Saved Messages 作为普通会话项展示（非固定置顶），点击跳转 `/favorites`。
- [ ] /chats 会话时间按规则展示：当日为 12 小时制（如 11:00 PM）、本周内为周几缩写（如 SAT）、本年内为月份日期（如 JUN 1）、往年为月.日.年（如 10.1.24）；置顶且存在未读时，时间与图钉以药丸徽章点亮展示，无未读时恢复灰色普通状态。
- [ ] /chat-folders 支持拖拽排序。
- [ ] /me 参考 Telegram Settings 风格重构：个人信息卡片（点击进入 Edit Profile）、多账号时平铺展示其他已绑定账号及未读消息、底部提供 Manage Accounts 入口、平铺 My Posts / My Favorites / Chat Folders / Settings / Help Center / About / Terms of Service。
- [ ] /settings（新增）聚合 Account（Edit Profile / Security / Privacy）、Preferences（Notifications / Sound & Vibration / Language）、Log Out。
- [ ] /security 新增「Delete Account」入口及二次确认弹窗；个人中心相关二级/三级页面返回按钮可返回上一页。
- [ ] /userprofile 参考 Telegram 风格重构：分享/屏蔽/举报收入右上角更多菜单；Media/Files/Links/Groups Tab 切换；Message/Mute/Call/Video 图标按钮；非联系人展示 Add to Contacts 按钮。
- [ ] /addcontact 临时会话入口为图标按钮，点击后展示规则确认弹窗。
- [ ] /temp-chat 顶部仅保留 Temp Chat 标签，倒计时文案不重复显示；消息长按菜单提供 Reply / Copy / Forward / Select / Delete（无 Pin、无 Save to Favorites），Select 进入多选模式后复选框统一左对齐，支持底部批量 Forward 与顶部批量 Delete。
- [ ] 收藏夹改为 Telegram Saved Messages 自聊式界面，支持底部输入框发送笔记；新消息追加到列表底部并自动滚动到底部。
- [ ] /chatroom / /groupchat 消息长按菜单提供 Reply / Copy / Forward / Pin / Select / Delete，Select 进入多选模式后复选框统一左对齐，支持底部批量 Forward 与顶部批量 Delete。
- [ ] /chatroom / /groupchat / /temp-chat / /favorites 底部发送操作栏样式统一，包含附件按钮、带表情的输入框、语音/发送按钮、回复预览；图标按钮与输入框垂直居中对齐。
- [ ] 转发选择器顶部包含 Saved Messages 目标；/forward-message 参考 Telegram 重构：底部悬浮胶囊切换 Chats/Contacts、搜索框下方文件夹筛选（All/Work/Family）、不展示待转发内容、群聊项名称右侧 Group 标签无成员数、不显示最近活跃时间。
- [ ] 所有前端二级页面导航条统一：sticky top-0 z-20，px-4 py-3，标题 text-headline-md text-[var(--primary)] 左对齐，左侧返回按钮使用 arrow icon + navigate(-1)，保留原有右侧操作按钮。
- [ ] 收藏夹消息长按菜单提供 Reply / Forward / Copy / Delete / Select，多选模式支持批量 Forward 与批量 Delete。
- [ ] /favorites 右上角更多菜单支持切换 Chat Mode / Message Mode，默认 Chat Mode。
- [ ] 多账号面板可切换并展示未读红点；最多支持 3 个账号；添加账号流程与登录一致（Phone/Email + 密码两步）。
- [ ] App.tsx 路径映射与前端分组已更新。
