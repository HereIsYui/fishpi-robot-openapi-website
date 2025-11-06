export default {
  title: "OpenBot",
  description: "I'ts very easy to use",
  base: process.env.GITHUB_ACTIONS ? '/fishpi-robot-openapi-website/' : '/', // 重要！
  lastUpdated: true,
  themeConfig: {
    logo: '/logo_row.png',
    outline: {
      level: [2, 6],
      label: "目录",
    },
    nav: [
      { text: "指南", link: "/guide" },
      { text: "参考", link: "/demo" },
      {
        text: "更新日志",
        link: "https://github.com/FishPiOffical/open-bot-platform",
      },
    ],
    search: {
      provider: "local",
    },
    sidebar: [
      {
        text: "概述",
        items: [
          {
            text: "指南",
            link: "/guide",
          },
          {
            text: "用户登录认证",
            link: "/userauth",
            items: [
              { text: "实时连接", link: "/userauth#实时连接" },
              { text: "登录流程", link: "/userauth#登录流程" },
              { text: "获取用户信息", link: "/userauth#获取用户信息" },
            ],
          },
          {
            text: "管理接口",
            link: "/adminApi",
            items: [
              { text: "认证机制", link: "/adminApi#认证机制" },
              { text: "用户管理", link: "/adminApi#用户管理" },
              { text: "积分管理", link: "/adminApi#积分管理" },
              { text: "勋章管理", link: "/adminApi#勋章管理" },
              { text: "背包管理", link: "/adminApi#背包管理" },
              { text: "活跃度查询", link: "/adminApi#活跃度查询" },
              { text: "VIP管理", link: "/adminApi#vip-管理" },
              { text: "消息推送", link: "/adminApi#消息推送" },
            ],
          },
          {
            text: "参考",
            link: "/demo",
          },
        ],
      },
    ],
  },
};
