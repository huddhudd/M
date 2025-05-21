// Vuex
window.vuex = new Vuex.Store({
  state: {
    // 英雄数据
    TFTChampionData: null,
    // 不包含召唤物和特殊棋子的英雄数据
    TFTHeroData: null,
    // 特质数据
    TFTRaceData: null,
    // 职业数据
    TFTJobData: null,
    // 装备数据
    TFTEquipmentData: null,
    // 装备分类数据
    TFTEquipTypeData: [
      { name: '全部', value: '255' },
      { name: '基础装备', value: '1' },
      { name: '合成装备', value: '2' },
      { name: '光明武器', value: '3' },
      { name: '特殊装备', value: '4' },
      { name: '转职纹章', value: '5' },
      { name: '奥恩神器', value: '6' },
      { name: '金鳞龙装备', value: '7' },
      { name: '辅助装备', value: '8' },
    ],
    // 海克斯数据
    TFTHexData: null,
    // 英雄传说之力（战斗手册）数据
    TFTPlayBookData: null,
    // 传送门（阵营/国度）数据
    TFTGalaxyData: null,
    // 阵容数据
    TFTLineupList: [],
    // 双人模式阵容数据
    TFTDoubleLineupList: [],
    // 游戏当前版本号
    TFTVersion: '',
    // 游戏当前版本号链接
    TFTVersionLink: null,
    // 当前浮层英雄{ isActive: 是否显示, event: 事件, chessId: 英雄数据 }
    TooltipChampionSummaryData: {},
    // 当前浮层装备{ isActive: 是否显示, event: 事件, equipmentData: 装备数据 }
    TooltipEquipmentSummaryData: {},
    // 当前浮层羁绊{ isActive: 是否显示, event: 事件, synergyData: 羁绊数据 }
    TooltipSynergySummaryData: {},
    // 当前浮层海克斯{ isActive: 是否显示, event: 事件, hexData: 海克斯数据 }
    TooltipHexSummaryData: {},
    // 当前浮层英雄传说之力{ isActive: 是否显示, event: 事件, playBookData: 英雄传说之力数据 }
    TooltipPlayBookSummaryData: {},
    // 当前浮层传送门{ isActive: 是否显示, event: 事件, galaxyData: 传送门数据 }
    TooltipGalaxySummaryData: {},
    // 掌盟浮层
    TooltipZMQrcodeData: {},
    // 玩家OpenID
    PlayerOpenId: null,
    // 玩家信息
    PlayerNickname: null,
    // 用户头像
    PlayerUserFace: null,
    // 绑定大区
    PlayerArea: null,
    // 左侧导航大小模式
    // IsLeftMenuSmallSize: window.TFTLocalstorage.get('app_left_menu_small_size') || false,
    IsLeftMenuSmallSize: false,
    // 作者列表
    AuthorList: null,
    // 白名单用户数据, 为false表示非白名单
    WhiteAuthorData: null,
    // 当前点击下拉的select, 其他的select收起
    CurrentComponentSelect: null,
    // 通用文字弹窗
    DialogMsg: '',
    // 页面主题
    PageTheme: _.get(window.TFTLocalstorage.get('main'), 'theme') || 'dark',
    // 是否在引导页
    // IsIntro: true,
    // 英雄数据
    TFTRGMChampionData: null,
    // 不包含召唤物和特殊棋子的英雄数据
    TFTRGMHeroData: null,
    // 特质数据
    TFTRGMRaceData: null,
    // 职业数据
    TFTRGMJobData: null,
    // 装备数据
    TFTRGMEquipmentData: null,
    // 海克斯数据
    TFTRGMHexData: null,
    // 传送门（阵营/国度）数据
    TFTRGMGalaxyData: null,
    // 赛季主题名称
    CurrentSetName: '赛博之城',
    // 模式列表
    GameModeList: ['赛博之城', '强音争霸'],
    // 奇遇数据
    TFTAdventureData: null,
  },
  mutations: {
    setTFTRaceData: function (state, payload) {
      state.TFTRaceData = payload
    },
    setTFTJobData: function (state, payload) {
      state.TFTJobData = payload
    },
    setTFTEquipmentData: function (state, payload) {
      state.TFTEquipmentData = payload
    },
    setTFTChampionData: function (state, payload) {
      state.TFTChampionData = payload
    },
    setTFTHeroData: function (state, payload) {
      state.TFTHeroData = payload;
    },
    setTFTHexData: function (state, payload) {
      state.TFTHexData = payload;
    },
    setTFTPlayBookData: function (state, payload) {
      state.TFTPlayBookData = payload;
    },
    setTFTGalaxyData: function (state, payload) {
      state.TFTGalaxyData = payload;
    },
    setTFTLineupList: function (state, payload) {
      state.TFTLineupList = payload
    },
    setTFTDoubleLineupList: function (state, payload) {
      state.TFTDoubleLineupList = payload;
    },
    setTFTVersion: function (state, payload) {
      state.TFTVersion = payload
    },
    setTFTVersionLink: function (state, payload) {
      state.TFTVersionLink = payload
    },
    setTooltipChampionSummaryData: function (state, payload) {
      state.TooltipChampionSummaryData = payload
    },
    setTooltipEquipmentSummaryData: function (state, payload) {
      state.TooltipEquipmentSummaryData = payload
    },
    setTooltipSynergySummaryData: function (state, payload) {
      state.TooltipSynergySummaryData = payload
    },
    setTooltipHexSummaryData: function(state, payload) {
      state.TooltipHexSummaryData = payload;
    },
    setTooltipPlayBookSummaryData: function (state, payload) {
      state.TooltipPlayBookSummaryData = payload;
    },
    setTooltipGalaxySummaryData: function (state, payload) {
      state.TooltipGalaxySummaryData = payload;
    },
    setTooltipZMQrcodeData: function (state, payload) {
      state.TooltipZMQrcodeData = payload;
    },
    setPlayerOpenId: function (state, payload) {
      state.PlayerOpenId = payload;
    },
    setPlayerNickname: function (state, payload) {
      state.PlayerNickname = payload
    },
    setPlayerUserFace: function (state, payload) {
      state.PlayerUserFace = payload
    },
    setPlayerArea: function (state, payload) {
      state.PlayerArea = payload
    },
    setIsLeftMenuSmallSize: function (state, payload) {
      state.IsLeftMenuSmallSize = payload
    },
    setAuthorList: function (state, payload) {
      state.AuthorList = payload
    },
    setWhiteAuthorData: function (state, payload) {
      state.WhiteAuthorData = payload
    },
    setCurrentComponentSelect: function (state, payload) {
      state.CurrentComponentSelect = payload
    },
    setDialogMsg: function (state, payload) {
      state.DialogMsg = payload
    },
    setPageTheme: function (state, payload) {
      state.PageTheme = payload;
    },
    setTFTRGMRaceData: function (state, payload) {
      state.TFTRGMRaceData = payload;
    },
    setTFTRGMJobData: function (state, payload) {
      state.TFTRGMJobData = payload;
    },
    setTFTRGMEquipmentData: function (state, payload) {
      state.TFTRGMEquipmentData = payload;
    },
    setTFTRGMChampionData: function (state, payload) {
      state.TFTRGMChampionData = payload;
    },
    setTFTRGMHeroData: function (state, payload) {
      state.TFTRGMHeroData = payload;
    },
    setTFTRGMHexData: function (state, payload) {
      state.TFTRGMHexData = payload;
    },
    setTFTRGMGalaxyData: function (state, payload) {
      state.TFTRGMGalaxyData = payload;
    },
    setTFTAdventureData: function (state, payload) {
      state.TFTAdventureData = payload;
    },
    // setIsIntro: function (state, payload) {
    //   state.IsIntro = payload
    // },
    // setRankSynergyInfo: function (state, payload) {
    //   state.RankSynergyInfo = payload
    // },
  }
})
// Vue Router
window.vueRouter = new VueRouter({
  mode: 'hash',
  // mode: 'history',
  // base: '/tft/',
  routes: [
    { path: '/', redirect: '/index' },
    // { path: '/', redirect: '/intro' },
    // { path: '/intro', component: appIntroPage },
    { path: '/index', component: pageLineup },
    { path: '/wrlineup', component: pageWRLineup },
    { path: '/champion', component: pageChampion },
    { path: '/equipment', component: pageEquipment },
    { path: '/synergy', component: pageSynergy },
    { path: '/littlehero', component: pageLittleHero },
    { path: '/news', component: pageNews },
    { path: '/championDetail/:id/:modeId', component: pageChampionDetail },
    { path: '/lineupDetail/:id/:modeType/:detailKey', component: pageLineupDetail },
    { path: '/rank/list', component: pageRankList },
    { path: '/rank/tier', component: pageTierRank },
    { path: '/overview', component: pageOverview },
    { path: '/authorDetail/:id', component: pageAuthorDetail },
    // { path: '/masterDetail/:id/:area', component: pageMasterDetail },
    { path: '/hex', component: pageHex },
    // { path: '/pageHexPlayBookDetails/:hexid', component: pageHexPlayBookDetails },
    { path: '/strategy', component: pageStrategy }
  ]
});
window.vueRouter.beforeEach(function (to, from, next) {
  if (from.query.test && !to.query.test && to.path === from.path) {
    window.location.reload();
  }
  if (to.query.test && !from.query.test && to.path === from.path) {
    window.location.reload();
  }
  if (to.query.test) {
    next();
    return;
  }
  if (from.query.test) {
    var toQuery = JSON.parse(JSON.stringify(to.query));
    toQuery.test = from.query.test;
    next({
      path: to.path,
      query: toQuery
    });
  } else {
    next()
  }
});
// 顶部导航
var appTopMenu = {
  template: window.TFTFuncLib.getTemplateBySelector('#AppTopMenuTemplate'),
  data: function () {
    return {
      isShowSiteSelect: false,
      // isShowMobile: false
    }
  },
  computed: {
    PlayerOpenId: function () {
      return this.$store.state.PlayerOpenId;
    },
    PlayerNickname: function () {
      return this.$store.state.PlayerNickname;
    },
    PlayerUserFace: function () {
      return this.$store.state.PlayerUserFace;
    },
    PlayerArea: function () {
      return this.$store.state.PlayerArea;
    },
    IsLeftMenuSmallSize: function () {
      return this.$store.state.IsLeftMenuSmallSize
    },
    PageTheme: function () {
      return this.$store.state.PageTheme;
    },
  },
  methods: {
    showSiteSelect: function () {
      this.isShowSiteSelect = true;
    },
    hideSiteSelect: function () {
      this.isShowSiteSelect = false;
    },
    login: function () {
      TFTLogin.login();
    },
    logout: function () {
      TFTLogin.logout();
    },
    changeArea: function () {
      TFTLogin.changeArea();
    },
    switchTheme: function () {
      this.$store.commit('setPageTheme', this.PageTheme === 'dark' ? 'white' : 'dark');
      // 保存主题配置到localstorage
      var localOptions = window.TFTLocalstorage.get('main');
      !localOptions && (localOptions = {});
      localOptions.theme = this.PageTheme;
      window.TFTLocalstorage.save('main', localOptions);
      document.documentElement.setAttribute('class', this.PageTheme === 'dark' ? '' : '' + this.PageTheme);
      this.$PingClick('topMenu', 'switchTheme', '切换主题' + (this.PageTheme === 'dark' ? '深色' : '浅色'));
    },
    // hover显示二维码
    // showMobile: function () {
    //   this.isShowMobile = true;
    //   this.$PingClick('topMenu', 'showMobile', '显示二维码')
    // }
  }
};
// 左侧导航
var appLeftMenu = {
  template: window.TFTFuncLib.getTemplateBySelector('#AppLeftMenuTemplate'),
  computed: {
    TFTVersion: function () {
      return this.$store.state.TFTVersion;
    },
    TFTVersionLink: function () {
      return this.$store.state.TFTVersionLink;
    },
    IsLeftMenuSmallSize: function () {
      return this.$store.state.IsLeftMenuSmallSize
    }
  },
  // created: function () {
  //   window.addEventListener('resize', function () {
  //     var width = document.documentElement.clientWidth;
  //     if (width <= 1600 && !this.smallSize) this.smallSize = true;
  //   }.bind(this), false);
  // },
  methods: {
    // 切换左侧导航大小模式
    switchMode: function () {
      this.$store.commit('setIsLeftMenuSmallSize', !this.IsLeftMenuSmallSize);
      // window.TFTLocalstorage.save('app_left_menu_small_size', this.IsLeftMenuSmallSize);
      this.$PingClick('leftMenu', 'switchMode', '切换模式' + (this.IsLeftMenuSmallSize ? '小' : '大'));
    }
  }
};
// 入口函数
var TFTMain = {
  init: function () {
    // document.body.removeChild(document.getElementById('appEnterLoading'));
    // 进入app动画
    document.getElementById('app').removeAttribute('style');
    setTimeout(function () {
      // document.getElementById('app').className = 'app-wrap fade-slow-enter-active';
      document.getElementById('app').classList.remove('fade-slow-enter');
      setTimeout(function () {
        // document.getElementById('app').className = 'app-wrap';
        document.getElementById('app').classList.remove('fade-slow-enter-active');
      }, 1000);
    }, 1000);
    // 获取基础数据
    window.ApiManager.getBaseData().then(function (res) {
      this.handleBaseDataRes(res[0], false);
      this.handleBaseDataRes(res[1], true);// 轮换模式
      // window.vuex.commit('setTFTPlayBookData', res[2]);
      // window.vuex.commit('setTFTGalaxyData', res[1]);
      // window.vuex.commit('setTFTRGMGalaxyData', res[3]);
      // window.vuex.commit('setTFTAdventureData', res[1]);

      // loading移除
      document.body.removeChild(document.getElementById('appEnterLoading'));
      // Vue初始化 Start
      this.initVue();
      // Vue初始化 End
      TFTLogin.init();
    }.bind(this)).catch(function (err) {
      console.error(err);
    });

    // 获取游戏版本号相关
    ApiManager.requestTFTVersion().then(function (res) {
      window.vuex.commit('setTFTVersion', 'Ver ' + _.get(res, 'data.0.name'));
    }).then(function () {
      ApiManager.requestTFTVersionLink().then(function (res) {
        if (res.status == 0) {
          var data = res.data.items;
          window.vuex.commit('setTFTVersionLink', '//lol.qq.com/gicp/news/662/' + data[0]['iNewsId'] + '.html');
        }
      });
    });
  },
  // Vue初始化
  initVue: function () {
    // 点击流
    Vue.prototype.$PingClick = function (page, type, name) {
      PTTSendClick(page, type, name)
      // EAS.SendClick({ e_c: 'guide.tft.btn.' + type + '', c_t: 4 })
    };
    window.mainVue = new Vue({
      el: '#app',
      router: window.vueRouter,
      store: window.vuex,
      components: {
        'app-top-menu': appTopMenu,
        'app-left-menu': appLeftMenu,
        'tooltip-champion-summary': tooltipChampionSummary,
        'tooltip-equipement-summary': tooltipEquipementSummary,
        'tooltip-synergy-summary': tooltipSynergySummary,
        'tooltip-hex-summary': tooltipHexSummary,
        'tooltip-play-book-summary': tooltipPlayBookSummary,
        'tooltip-galaxy-summary': tooltipGalaxySummary,
        'tooltip-zm-qrcode': tooltipZMQrcode,
      },
      data: function () {
        return {
          transitionName: '',
          isIE: false
        }
      },
      computed: {
        // IsIntro: function () {
        //   return this.$store.state.IsIntro
        // },
        IsLeftMenuSmallSize: function () {
          return this.$store.state.IsLeftMenuSmallSize
        },
        DialogMsg: function () {
          return this.$store.state.DialogMsg
        },
        // 获取随机背景
        // randomBgClass: function () {
        //   var classArray = ['bg1', 'bg2'];
        //   var num = Math.floor(Math.random() * classArray.length);
        //   return classArray[num];
        // }
      },
      watch: {//使用watch 监听$router的变化
        $route: function (to, from) {
          if (to.path === '/intro' || from.path === '/intro') {
            this.transitionName = 'fade-slow';
          } else {
            //如果to索引大于from索引,判断为前进状态,反之则为后退状态
            if (to.meta.index > from.meta.index) {
              //设置动画名称
              this.transitionName = 'slide-left';
            } else {
              this.transitionName = 'slide-right';
            }
          }
        }
      },
      created: function () {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          this.isIE = true
        }
        // 用户输入地址非引导页, 恢复显示主页
        // if (this.$route.path !== '/intro') {
        //   this.$store.commit('setIsIntro', false);
        // }
        // 版权div移动
        document.getElementById('appMain').appendChild(document.getElementById('afooter'));
        document.getElementById('afooter').style.cssText = 'display: block';
        // document.getElementById('app').removeAttribute('style');

        // 设置主题
        if (this.$store.state.PageTheme !== 'dark') {
          document.documentElement.setAttribute('class', '' + this.$store.state.PageTheme);
        }
      },
      methods: {
        // 显示通用文字弹窗
        showDialogMsg: function (msg) {
          this.$store.commit('setDialogMsg', msg);
        },
        // 关闭通用文字弹窗
        hideDialogMsg: function () {
          this.$store.commit('setDialogMsg', '');
        },
        beforeEnter: function () {
          document.getElementById('appMain').scrollTop = 0;
          document.getElementById('afooter').style.cssText = 'display: none';
        },
        // 防止切换页面未触发隐藏事件
        afterLeave: function () {
          this.$store.commit('setTooltipChampionSummaryData', { isActive: false });
          this.$store.commit('setTooltipEquipmentSummaryData', { isActive: false });
          this.$store.commit('setTooltipSynergySummaryData', { isActive: false });
          this.$store.commit('setTooltipHexSummaryData', { isActive: false });
          this.$store.commit('setTooltipPlayBookSummaryData', { isActive: false });
          this.$store.commit('setTooltipGalaxySummaryData', { isActive: false });
          document.getElementById('afooter').style.cssText = 'display: block';
        }
      }
    });
  },
  handleTFTRaceData: function (raceData) {
    _.forEach(raceData, function (el) {
      //把英文名里的.png去掉
      el.alias = el.alias.replace('.png', '');
    });
    // console.log(JSON.parse(JSON.stringify(raceData)))
    return raceData;
  },
  handleTFTJobData: function (jobData) {
    _.forEach(jobData, function (el) {
      //把英文名里的.png去掉
      el.alias = el.alias.replace('.png', '');
    });
    // console.log(JSON.parse(JSON.stringify(jobData)))
    return jobData;
  },
  handleTFTEquipmentData: function (equipmentData) {
    _.forEach(equipmentData, function (equip) {
      //把子装备id换成数据对象
      if (typeof equip.formula === 'string') {
        equip.formula =  _.compact(_.split(equip.formula, ','));
        equip.formula_data = _.flatMap(equip.formula, function(equip_id) {
          return _.find(equipmentData, { equipId: equip_id });
        });
        equip.formula_data = _.compact(equip.formula_data);
      }
    });
    // console.log(JSON.parse(JSON.stringify(equipmentData)))
    return equipmentData;
  },
  handleTFTChampionData: function (championData, isRGM) {
    // TODO: 过滤无效英雄但保留召唤物，每赛季都要注意召唤物id
    championData = _.filter(championData, function (o) {
      return +o.price > 0 || o.chessId === '10331' || o.chessId === '10345' || o.chessId === '30001' || o.chessId === '30002'
    });
    //英雄图标处理
    var status_data = [
      { cn: "增强", en: 'buff' },
      { cn: "削弱", en: 'debuff' },
      { cn: "最新", en: 'new' },
      { cn: "即将到来", en: 'upcoming' }
    ];
    _.forEach(championData, function (el) {
      //把英文名里的.png去掉
      el.name = el.name.replace('.png', '');
      //划分,号间隔的数据为数组
      el.raceIds = _.split(el.raceIds, ",");
      el.jobIds = _.split(el.jobIds, ",");
      el.synergies = _.split(el.synergies, ",");
      el.recEquip = _.split(el.recEquip, ",");
      //生成头像地址
      el.set_avatar_path = window.PicUrlManager.getPicUrl('hero_avatar', window.CurrentSet, el.TFTID);
      // el.big_image = window.PicUrlManager.getPicUrl('hero_pic_1', !isRGM ? window.CurrentSet : window.RGMCurrentSet, el.TFTID);
      el.big_image_2 = window.PicUrlManager.getPicUrl('hero_pic_2', !isRGM ? window.CurrentSet : window.RGMCurrentSet, el.TFTID);
      el.ori_avatar_path = window.PicUrlManager.getPicUrl('hero_avatar', 'origin', el.chessId);
      //转换中文的"改动状态"为英文,对应样式类
      var status = _.find(status_data, { cn: el.proStatus });
      status && (el.proStatusClass = status.en);
      //推荐装备(依赖TFTEquipmentData)
      var equip_data = _.flatMap(el.recEquip, function (id) {
        return _.find(window.vuex.state.TFTEquipmentData, { equipId: id });
      });
      el.recEquipData = _.compact(equip_data);
      // Set12：组件在Promise.all污染了$idSeason
      el.$idSeason = isRGM ? window.RGMTFTLibIdSeason : window.CurrentSet;
    }.bind(this));
    championData = _.sortBy(championData, 'price');
    // console.log(JSON.parse(JSON.stringify(championData)))
    return championData;
  },
  handleBaseDataRes: function (res, isRGM) {
    var baseDataRes = res;
    var chess = baseDataRes[0];
    // 过滤掉召唤物
    var hero = _.filter(baseDataRes[0], { '$typeChess': 'hero' });
    var equip = baseDataRes[1];
    var trait = baseDataRes[2];
    var buff = {
      normalBuff: baseDataRes[3],
      // heroBuff: res[2]
    };
    var race = _.filter(trait, function (item) {
      return item.$typeTrait === 'race';
    });
    var job = _.filter(trait, function (item) {
      return item.$typeTrait === 'job';
    });
    if (!isRGM) {
      window.vuex.commit('setTFTEquipmentData', this.handleTFTEquipmentData(_.cloneDeep(equip)));
      window.vuex.commit('setTFTChampionData', this.handleTFTChampionData(_.cloneDeep(chess)));
      window.vuex.commit('setTFTHeroData', this.handleTFTChampionData(_.cloneDeep(hero)));
      window.vuex.commit('setTFTRaceData', this.handleTFTRaceData(_.cloneDeep(race)));
      window.vuex.commit('setTFTJobData', this.handleTFTJobData(_.cloneDeep(job)));
      window.vuex.commit('setTFTHexData', buff);
    } else {
      window.vuex.commit('setTFTRGMEquipmentData', this.handleTFTEquipmentData(_.cloneDeep(equip)));
      window.vuex.commit('setTFTRGMChampionData', this.handleTFTChampionData(_.cloneDeep(chess), isRGM));
      window.vuex.commit('setTFTRGMHeroData', this.handleTFTChampionData(_.cloneDeep(hero), isRGM));
      window.vuex.commit('setTFTRGMRaceData', this.handleTFTRaceData(_.cloneDeep(race)));
      window.vuex.commit('setTFTRGMJobData', this.handleTFTJobData(_.cloneDeep(job)));
      window.vuex.commit('setTFTRGMHexData', buff);
    }
  }
};
// 整个app入口
TFTMain.init();