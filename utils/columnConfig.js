export default {
  mapping: {
    lianke: 'lianke',// 链氪
    zhengce: 'lianke',// 政策一览
    hangye: 'lianke',// 行业动向
    hangqing: 'lianke',// 行情分析
    guandian: 'lianke',// 百家观点
    jishu: 'lianke',// 技术动态
    show: 'lianke', // 项目展示
    shike: 'shike', // 识氪
    zhaowen: 'shike', // 千氪朝闻
    zhuanfang: 'shike', // 千氪专访
    baodao: 'shike', // 千氪报道
    sudi: 'shike', // 千氪速递
    kgguandian: 'shike', // 千氪观点
    shipin: 'shipin', // 视频
    baike: 'baike', // 百科
    caijing: 'caijing', // 财经
    jinrong: 'caijing',  // 新金融
    jingji: 'caijing', // 宏观经济
    waihui: 'caijing',  // 外汇风向
    gupiao: 'caijing',  // 股票期货
    shangye: 'caijing',  // 商业产经
    dongtai: 'dongtai',  // 动态
    banben: 'dongtai',  // 版本更新"
    yure: 'dongtai',  // 产品上线预热
    tongzhi: 'dongtai',  // 通知
    gonggao: 'dongtai'  // 奖励公告

  },
  bannerConfig: {
    lianke: 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/newindex/new_web/liankebanner.png',
    shike: 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/newindex/new_web/shikebanner.png',
    shipin: 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/newindex/new_web/shipinbanner.png',
    baike: 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/newindex/new_web/baikebanner.png',
    caijing: 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/newindex/new_web/caijingbanner.png',
    dongtai: 'https://pro-kg-oss.oss-cn-beijing.aliyuncs.com/newindex/new_web/dongtaibanner.png',
  },
  config: {
    lianke: [
      {
        type: 'zhengce',
        columnId: 361,
        columnName: "政策一览"
      },
      {
        type: 'hangye',
        columnId: 362,
        columnName: "行业动向"
      },
      {
        type: 'hangqing',
        columnId: 364,
        columnName: "行情分析"
      },
      {
        type: 'guandian',
        columnId: 366,
        columnName: "百家观点"
      },
      {
        type: 'jishu',
        columnId: 367,
        columnName: "技术动态"
      },
      {
        type: 'show',
        columnId: 369,
        columnName: "项目展示"
      }
    ],
    shike: [
      {
        type: 'zhaowen',
        columnId: 370,
        columnName: "千氪朝闻"
      },
      {
        type: 'zhuanfang',
        columnId: 371,
        columnName: "千氪专访"
      },
      {
        type: 'baodao',
        columnId: 372,
        columnName: "千氪报道"
      },
      {
        type: 'sudi',
        columnId: 373,
        columnName: "千氪速递"
      },
      {
        type: 'kgguandian',
        columnId: 374,
        columnName: "千氪观点"
      }
    ],
    shipin: [{
      type: 'shipin',
      columnId: 360,
      columnName: "视频",
    }],
    baike: [{
      type: 'baike',
      columnId: 379,
      columnName: "百科",
    }],
    caijing: [
      {
        type: 'jinrong',
        columnId: 311,
        columnName: "新金融"
      },
      {
        type: 'jingji',
        columnId: 340,
        columnName: "宏观经济"
      },
      {
        type: 'waihui',
        columnId: 346,
        columnName: "外汇风向"
      },
      {
        type: 'gupiao',
        columnId: 312,
        columnName: "股票期货"
      },
      {
        type: 'shangye',
        columnId: 344,
        columnName: "商业产经"
      }
    ],
    dongtai: [
      {
        type: 'banben',
        columnId: 375,
        columnName: "版本更新"
      },
      {
        type: 'yure',
        columnId: 376,
        columnName: "产品上线预热"
      },
      {
        type: 'tongzhi',
        columnId: 377,
        columnName: "通知"
      },
      {
        type: 'gonggao',
        columnId: 378,
        columnName: "奖励公告"
      }
    ]
  }
}
