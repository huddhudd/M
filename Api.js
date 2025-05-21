


// 当前赛季
window.CurrentSet = 's14';
// 阵容渠道id
window.TFTChannelId = '6';
// 轮换模式相关
window.RGMCurrentSet = 's10m14';
window.RGMTFTLibSeason = 's10m14';
window.RGMTFTLibIdSeason = 's10m14';// 对应英雄$idSeason值，无轮换模式的时候为''
window.RGMModeId = '8';// 对应管理端的模式id（管理端-模式管理-第一列的自增id）
// 阵容相关方法，方便统一维护
window.requestLineupList = tftlib.LineupManager.requestS14LineupList;
window.requestLineupDetailByLineupId = tftlib.LineupManager.requestS14LineupDetailByLineupId;
window.requestRGMLineupList = tftlib.LineupManager.requestS10m14LineupList;
window.requestRGMLineupDetailByLineupId = tftlib.LineupManager.requestS10m14LineupDetailByLineupId;
// queue_id
window.QtQueueId = '1100';
window.QtQueueIdRGM = '6110';

/**
 * 资料接口管理
 * 为了因对不同赛季的目录地址不一样,导致目录混乱,因此手动维护一个目录,并提供接口地址
 * s7.5开始使用组件提供基础数据，后续只需要更新常规模式阵容和双人模式阵容接口即可
 * 注意
 * 1 为了提高数据的命中率,添加地址数据时,越新的数据,key的位置应该越靠前
 * 2 赛季字段,数据是2019.S2这种格式,应该把只保留S2,并转为小写s.
 */
window.DataUrlManager = {
  linelist: {
    's14': '//game.gtimg.cn/images/lol/act/tftzlkauto/json/lineupJson/s14/' + window.TFTChannelId + '/lineup_detail_total.json?v=' + (Date.now() / 180000 >> 0),
  },
  // double_linelist: {
  //   's14': '//game.gtimg.cn/images/lol/act/tftzlkauto/json/doubleLineupJson/s14/' + window.TFTChannelId + '/doubleLineup_detail_total.json?v=' + (Date.now() / 180000 >> 0),
  // },
  rgm_lineList: {
    's10m14': '//game.gtimg.cn/images/lol/act/tftzlkauto/json/lineupJson/s14/' + window.TFTChannelId + '/6110/lineup_detail_total.json?v=' + (Date.now() / 180000 >> 0),
  },
  authorList: '//game.gtimg.cn/images/lol/act/tftzlkauto/json/authorJson/author.json?v=' + (Date.now() / 100000 >> 0),
  // equipment_strength: {
  //   's3': '//lol.qq.com/act/AutoCMS/publish/LOLAct/TFTequipment_set3/TFTequipment_set3.js'
  // },
  /**获取某个数据类型,全部的数据地址的key数组 */
  getUrlAllKey: function (data_type) {
    var rs = [];
    var temp_data = this[data_type];
    if (temp_data) {
      for (var key in temp_data) {
        rs.push(key);
      }
    }
    return rs;
  }
};
/**
 * 图片目录管理
 * 为了因对不同赛季的目录地址不一样,导致目录混乱,因此手动维护一个目录,并提供图片拼接地址
 */
window.PicUrlManager = {
  /**使用分析logo作为默认图片,获取图片地址发生错误时使用 */
  defaultPic: '//game.gtimg.cn/images/lol/act/a20190704tft/share.png',
  /**英雄头像*/
  hero_avatar: {
    origin: '//game.gtimg.cn/images/lol/act/img/tft/hero-icon/icon_{{pic_name}}.png',
    s14: '//game.gtimg.cn/images/lol/act/img/tft/champions/{{pic_name}}.png',
  },
  /**英雄大图624x318 */
  hero_pic_2: {
    s14: '//game.gtimg.cn/images/lol/tftstore/s14/624x318/{{pic_name}}.jpg',
    s10m14: '//game.gtimg.cn/images/lol/tftstore/s10m14/624x318/{{pic_name}}.jpg',
  },
  // 控制整个页面切换"皮肤头像"
  // SkinVersion: milo.cookie.get('guide_tft_skin_version') ? milo.cookie.get('guide_tft_skin_version') : CurrentSet,
  // 20200422隐藏皮肤头像切换功能
  SkinVersion: CurrentSet,
  /**获取图片地址
   * @param pic_type 图片类型:race_job_icon,skill......
   * @param season_id 赛季id:1,2.......
   * @param pic_name 图片名称
   */
  getPicUrl: function (pic_type, season_id, pic_name) {
    if (!season_id || !pic_type || pic_name === undefined) return this.defaultPic;
    var basePicString = _.get(this, pic_type + '.' + season_id);
    if (!basePicString) return this.defaultPic;
    return basePicString.replace('{{pic_name}}', pic_name);
  }
};

// 登录
var TFTLogin = {
  areaCookieKey: '',
  init: function () {
    Milo.checkLogin({
      iUseQQConnect: true,
      success: function (res) {
        var userInfo = res && res.userInfo;
        console.log("登录成功");
        window.vuex.commit("setPlayerOpenId", userInfo.openid);
        window.vuex.commit("setPlayerNickname", userInfo.nickName);
        window.vuex.commit("setPlayerUserFace", userInfo.avatarUrl);
        // 20240510 不依赖组件，读取已绑定大区
        var areaId = window.TFTLocalstorage.get('TFTAreaId');
        if (areaId) {
          window.vuex.commit("setPlayerNickname", window.TFTLocalstorage.get('TFTAreaNickName'));
          window.vuex.commit("setPlayerArea", window.TFTLocalstorage.get('TFTArea'));
          TFTLogin.getPlayerInfo(Number(areaId));
        }
      },
      fail: function (res) {
      },
    });
  },
  login: function () {
    Milo.loginByQQConnect({
      appId: "101491592",
      scope: "get_user_info",
      state: "STATE",
      redirectUri: "https://milo.qq.com/comm-htdocs/login/qc_redirect.html",
      sUrl: window.location.href, //登录之后的跳转地址
      callback: function () {
        Milo.syncToAME();
        window.location.reload();
      }, //登录成功后的回调
    });
    // return false;
  },
  logout: function (logoutCallback) {
    Milo.logout({
      callback: function () {
        window.vuex.commit("setPlayerOpenId", null);
        window.vuex.commit("setPlayerNickname", null);
        window.vuex.commit("setPlayerArea", null);
        window.vuex.commit("setWhiteAuthorData", null);
        window.vuex.commit("setPlayerUserFace", null);
        window.TFTLocalstorage.delete('TFTAreaNickName');
        window.TFTLocalstorage.delete('TFTArea');
        window.TFTLocalstorage.delete('TFTAreaId');
        logoutCallback && logoutCallback();
      },
    });
    // return false;
  },
  changeArea: function () {
    need(["biz.roleselector"], function (RoleSelector) {
      RoleSelector.init({
        gameId: "lol",
        submitEvent: function (roleObject) {
          var iArea = roleObject.submitData["areaid"];
          var sRoleName = roleObject.submitData["rolename"];
          areaCookieKey = "area" + roleObject.submitData["roleid"];
          // console.log(roleObject);
          milo.cookie.set(
            areaCookieKey,
            LOLServerSelect.zoneToName(iArea) + "-" + sRoleName + "-" + iArea,
            false
          );
          // 20240510 不依赖组件，手动保存已绑定大区
          window.TFTLocalstorage.save('TFTAreaNickName', sRoleName);
          window.TFTLocalstorage.save('TFTArea', LOLServerSelect.zoneToName(iArea));
          window.TFTLocalstorage.save('TFTAreaId', iArea);

          alert("大区绑定成功！当前绑定大区【" + LOLServerSelect.zoneToName(iArea) + "】");
          window.vuex.commit("setPlayerNickname", sRoleName);
          window.vuex.commit("setPlayerArea", LOLServerSelect.zoneToName(iArea));
          this.getPlayerInfo(Number(iArea)); //获取玩家信息
        }.bind(this),
        // 'cancelEvent': function () {
        // }
      });
      RoleSelector.show();
    }.bind(this));
  },
  // 请求玩家信息接口次数
  getPlayerInfoTimes: 0,
  // 获取玩家信息
  getPlayerInfo: function (area) {
    ApiManager.requestPlayerInfo(area).then(function (resp) {
      if (resp.MobilePlayerInfo.status === 0) {
        var profile = _.head(resp.MobilePlayerInfo.msg.res.uuid_prifle_list);
        var logoUrl = profile.logo_url.replace('http://', '//');
        logoUrl = this.parseLogoUrl(logoUrl);
        profile && window.vuex.commit('setPlayerUserFace', logoUrl);
        this.getPlayerInfoTimes = 0;
      } else {
        this.getPlayerInfoTimes++;
        if (this.getPlayerInfoTimes < 5) this.getPlayerInfo(area);
        // else this.logout();
      }
    }.bind(this));
    // 判断是否是白名单
    ApiManager.requestWhiteAuthorData().then(function (authorResp) {
      if (_.get(authorResp, 'status') === 0) {
        if (_.get(authorResp, 'data.allow') === 1) {
          window.vuex.commit('setWhiteAuthorData', true);
        }
      }
    }.bind(this));
  },
  //判断掌盟头像是否需要加尺寸参数
  parseLogoUrl: function (o) {
    var logoSizeParam = '/0';
    if (typeof (o) === 'string') {
      if (!this.judgeEndStr(o, logoSizeParam)) {
        if (o.indexOf('qtl_user') !== -1 || o.indexOf('//p.qpic.cn/qtlinfo') !== -1) {
          o += logoSizeParam;
        }
      }
      return o;
    }
    if (typeof (o) === 'object') {
      for (var i = 0, j = o.length; i < j; ++i) {
        var obj = o[i];
        var logoUrl = obj.logo_url;
        if (!this.judgeEndStr(logoUrl, logoSizeParam)) {
          if (logoUrl.indexOf('qtl_user') !== -1 || logoUrl.indexOf('//p.qpic.cn/qtlinfo') !== -1) {
            logoUrl += logoSizeParam;
          }
          obj.logo_url = logoUrl;
        }
      }
      return o;
    }
  },
  //判断a字符串结尾是否有b字符串
  judgeEndStr: function (a, b) {
    var d = a.length - b.length;
    return (d >= 0 && a.lastIndexOf(b) === d);
  }
};
/**
 * API管理, 所有API都封装在此 
 */
window.ApiManager = {
  /**
  * 基于FetchRequest封装的Promise
  * @param url 请求地址
  * @param catchData 请求附带的设置对象
  * @param type 不填: 默认请求, 'script': 获取js脚本
  */
  baseRequestPromise: function (url, catchData, type) {
    return new Promise(function (resolve, reject) {
      fetchRequest(url, catchData).then(function (res) {
        resolve(type !== 'script' ? res.json() : res.text())
      }).catch(function (error) {
        console.log(error);
        reject(error);
      })
    })
  },
  baseScriptRequestPromise: function (url, datakey, charset) {
    return fetchDataScript(url, datakey, charset)
  },
  // 通过组件获取基础数据
  getBaseData: function () {
    var curSeason = window.CurrentSet;
    return Promise.all([
      tftlib.DataManager.getGameDataSetBatch(['chess', 'equip', 'traitWithoutPet', 'buff'], 'season', curSeason),
      // tftlib.DataManager.getAdventureDataBySeason(curSeason),
      // tftlib.DataManager.getGoopDataBySeason(curSeason),
      // tftlib.DataManager.getCommBuffWithoutPlayBookBySeason(curSeason),
      // tftlib.DataManager.getPlayBookBuffBySeason(curSeason),
      // tftlib.DataManager.getGalaxyDataBySeason(curSeason),
      // tftlib.DataManager.getPlayBookBySeason(window.RGMTFTLibSeason),
      tftlib.DataManager.getGameDataSetBatch(['chess', 'equip', 'traitWithoutPet', 'buff'], 'season', window.RGMTFTLibSeason),
      // tftlib.DataManager.getGalaxyDataBySeason(window.RGMTFTLibSeason)
    ]);
  },
  // 请求当前赛季下渠道6的阵容列表
  requestLineupData: function () {
    if (this.requestLineupData.cache) return this.requestLineupData.cache;
    return this.requestLineupData.cache = window.requestLineupList(DataUrlManager['linelist'][CurrentSet], true).catch(function (err) {
      console.error(err);
      this.requestLineupData.cache = null;
      return Promise.reject(err);
    }.bind(this));
  },
  // 请求双人模式阵容数据
  requestDoubleLineupData: function () {
    return this.baseRequestPromise(DataUrlManager['double_linelist'][CurrentSet]);
  },
  // 请求TMO阵容列表
  requestTMOLineupData: function () {
    if (this.requestTMOLineupData.cache) return this.requestTMOLineupData.cache;
    return this.requestTMOLineupData.cache = window.requestLineupList('https://game.gtimg.cn/images/lol/act/tftzlkauto/json/lineupJson/s13/62/lineup_detail_total.json?v=' + (Date.now() / 180000 >> 0), true).catch(function (err) {
      console.error(err);
      this.requestTMOLineupData.cache = null;
      return Promise.reject(err);
    }.bind(this));
  },
  // 轮换模式阵容列表
  requestRGMLineupData: function () {
    if (this.requestRGMLineupData.cache) return this.requestRGMLineupData.cache;
    return this.requestRGMLineupData.cache = window.requestRGMLineupList(DataUrlManager['rgm_lineList'][RGMCurrentSet], true).catch(function (err) {
      console.error(err);
      this.requestRGMLineupData.cache = null;
      return Promise.reject(err);
    }.bind(this));
  },
  // 获取作者信息
  requestAuthorList: function () {
    return this.baseRequestPromise(DataUrlManager['authorList']);
  },
  // 获取作者详情页阵容列表
  requestAuthorDetailLineup: function (authorId) {
    return tftlib.LineupManager.requestMixedSeasonLineupList('//game.gtimg.cn/images/lol/act/tftzlkauto/json/lineupJson/' + window.CurrentSet + '/author/' + authorId + '.json?v=' + (Date.now() / 180000 >> 0), true)
  },
  // 获取渠道列表
  requestPlatformList: function () {
    return this.baseRequestPromise('//game.gtimg.cn/images/lol/act/tftzlkauto/json/platJson/plat.json');
  },
  // 获取小小英雄
  requestLittleHero: function () {
    return tftlib.DataManager.requestTacticianData();
  },
  // 按需加载html2canvas组件
  requestHtml2canvasJs: function () {
    return this.baseScriptRequestPromise('js/lib/html2canvas.min.js', 'html2canvas');
  },
  // 按需加载腾讯视频组件
  requestTxplayerJs: function () {
    return this.baseScriptRequestPromise('//vm.gtimg.cn/tencentvideo/txp/js/txplayer.js', 'Txplayer');
  },
  // 按需加载腾讯视频组件（新版本）
  requestSuperPlayerJs: function () {
    return this.baseScriptRequestPromise('//vm.gtimg.cn/thumbplayer/superplayer/superplayer.js', 'SuperPlayer');
  },
  // 版本-kv(运营推荐位接口)
  requestOperateJson: function () {
    return this.baseRequestPromise('//game.gtimg.cn/images/lol/act/tftzlkauto/json/operateJson/operate.json');
  },
  // 最新攻略-类别列表
  requestTFTGuideAlbum: function () {
    return this.baseScriptRequestPromise('//lol.qq.com/act/AutoCMS/publish/LOLAct/tftGuideAlbum/tftGuideAlbum.js', 'tftGuideAlbum');
  },
  // 最新攻略-类别-'最新'
  requestLatestNews: function () {
    // return this.baseRequestPromise('//apps.game.qq.com/cmc/cross?serviceId=3&tagids=1934&limit=6&source=glzx&typeids=1,2');
    return this.baseRequestPromise('https://apps.game.qq.com/cmc/cross?serviceId=245&limit=6&source=zm&tagids=78387&typeids=1,2');
  },
  // 获取最新攻略-类别-'最新'之外的类别
  requestCollectionContentList: function (collectionId) {
    return this.baseRequestPromise('//apps.game.qq.com/cmc/zmMcnCollectionContentList?collectionid=' + collectionId + '&page=1&num=10&source=glzx');
  },
  // 获取游戏当前版本号
  requestTFTVersion: function () {
    return this.baseRequestPromise('//mlol.qt.qq.com/go/database/versionlist?zone=lol&from=h5&v=' + (Date.now() / 600000 >> 0));
  },
  // 获取游戏当前版本号链接
  requestTFTVersionLink: function () {
    return this.baseRequestPromise('https://apps.game.qq.com/cmc/cross?serviceId=3&tagids=1983&limit=1&source=glzx&typeids=1');
  },
  // 获取单个阵容详情
  requestTFTLineupByLineId: function (lineId, channelId) {
    !channelId && (channel_id = window.TFTChannelId);
    return this.baseRequestPromise('//game.gtimg.cn/images/lol/act/tftzlkauto/json/lineupJson/' + window.CurrentSet + '/' + channelId + '/' + lineId + '.json');
  },
  // 获取单个双人阵容详情
  requestTFTDoubleLineupByLineId: function (lineId, channelId) {
    !channelId && (channel_id = window.TFTChannelId);
    return this.baseRequestPromise('//game.gtimg.cn/images/lol/act/tftzlkauto/json/doubleLineupJson/' + window.CurrentSet + '/' + channelId + '/' + lineId + '.json');
  },
  // 获取单个阵容详情（不需要渠道参数）
  requestLineupByLineId: function (lineId, isRGM) {
    // return this.baseRequestPromise('//game.gtimg.cn/images/lol/act/tftzlkauto/json/lineupJson/total/' + lineId + '.json');
    if (isRGM) return window.requestRGMLineupDetailByLineupId(lineId, true);
    return window.requestLineupDetailByLineupId(lineId, true);
  },
  // 获取玩家账号信息
  requestPlayerInfo: function (area) {
    return this.baseRequestPromise('//lol.ams.game.qq.com/lol/autocms/v1/transit/LOL/LOLWeb/Official/MobilePlayerInfo,PlayerBattleSummary?use=zm,uid,acc&area=' + area, { credentials: 'include', mode: 'cors' });
  },
  // 判断是否是白名单
  requestWhiteAuthorData: function () {
    var urlParamTest = window.vueRouter.currentRoute.query.test;
    var goUrl = '//lol.sw.game.qq.com/lol/lwdcommact/a20201106tft/a20201106tftLineup/verify';
    urlParamTest === '1' && (goUrl += '?test=1');
    return this.baseRequestPromise(goUrl, {
      credentials: 'include'
    });
  },
  /** 主羁绊排行列表 
   * @param period 时间周期 1, 7, 30
   * @param tier 段位 0: 大师以上 1: 黄金至钻石 255: 全部
   * @param raceId 特质id 255: 全部
   * @param jobId 职业id 255: 全部
   */
  getMainEffectRank: function (period, tier, raceId, jobId) {
    var time_type = period || '1';
    var tier_part = tier ? '&tier_part=' + tier : '&tier_part=255';
    var raceId = raceId ? '&raceid=' + raceId : '&raceid=255';
    var jobId = jobId ? '&jobid=' + jobId : '&jobid=255';
    return fetchJsonpScript('//lol.sw.game.qq.com/lol/lwdcommact/a20200629api/A20200629api/mbrank?time_type=' + time_type + tier_part + raceId + jobId + '&callback=TFTBigDataMainEffectRank', 'TFTBigDataMainEffectRank')
  },
  /** 英雄排行列表
   * @param period 时间周期 1, 7, 30
   * @param tier 段位 0: 大师以上 1: 黄金至钻石 255: 全部
   * @param raceId 特质id 255: 全部
   * @param jobId 职业id 255: 全部
   */
  getHeroesRank: function (period, tier, raceId, jobId) {
    var time_type = period || '1';
    var tier_part = tier ? '&tier_part=' + tier : '&tier_part=255';
    var raceId = raceId ? '&raceid=' + raceId : '&raceid=255';
    var jobId = jobId ? '&jobid=' + jobId : '&jobid=255';
    return fetchJsonpScript('//lol.sw.game.qq.com/lol/lwdcommact/a20200629api/A20200629api/herorank?time_type=' + time_type + tier_part + raceId + jobId + '&callback=TFTBigDataHeroesRank', 'TFTBigDataHeroesRank')
  },
  /** 子羁绊组合详情列表
   * @param period 时间周期 1, 7, 30
   * @param effects 羁绊信息 结构: id,等级;id,等级...
   */
  getEffectDetailRank: function (period, effects) {
    var time_type = period || '1';
    return fetchJsonpScript('//lol.sw.game.qq.com/lol/lwdcommact/a20200629api/A20200629api/sbc?time_type=' + time_type + '&main_traits_id=' + effects + '&tier_part=255&callback=TFTBigDataEffectDetailRank', 'TFTBigDataEffectDetailRank')
  },
  /** 主羁绊克制列表
   * @param period 时间周期 1, 7, 30
   * @param effects 羁绊信息 结构: id,等级;id,等级...
   */
  getMainEffectCounterRank: function (period, effects) {
    var time_type = period || '1';
    return fetchJsonpScript('//lol.sw.game.qq.com/lol/lwdcommact/a20200629api/A20200629api/mbrl?time_type=' + time_type + '&main_traits_id=' + effects + '&tier_part=255&callback=TFTBigDataMainEffectCounterRank', 'TFTBigDataMainEffectCounterRank')
  },
  /** 子羁绊克制列表
   * @param period 时间周期 1, 7, 30
   * @param main_effects 羁绊信息 结构: id,等级;id,等级...
   * @param sub_effects 羁绊信息 结构: id,等级|id,等级...
   * @param hero_ids 英雄id列表 结构: id,id...
   */
  getSubEffectCounterRank: function (period, main_effects, sub_effects, hero_ids) {
    var time_type = period || '1';
    return fetchJsonpScript('//lol.sw.game.qq.com/lol/lwdcommact/a20200629api/A20200629api/sbrl?time_type=' + time_type + '&main_traits_id=' + main_effects + '&minor_traits_id=' + sub_effects + '&minor_champion_content_id=' + hero_ids + '&tier_part=255&callback=TFTBigDataSubEffectCounterRank', 'TFTBigDataSubEffectCounterRank')
  },
  // 装备排行
  getEquipRank: function (period, tier) {
    var time_type = period || '1';
    var tier_part = tier ? '&tier_part=' + tier : '&tier_part=255';
    return Promise.all([
      // this.baseRequestPromise('//lol.qq.com/tft/js/data/TFTEquipMap.json?v=' + (Date.now() / 600000 >> 0)),
      fetchJsonpScript('//lol.sw.game.qq.com/lol/lwdcommact/a20210420api/a20210420api/equiprank?callback=TFTBigDataEquipRank&time_type=' + time_type + tier_part, 'TFTBigDataEquipRank')
    ])
  },
  // 获取大区列表
  getLOLArea: function () {
    return this.baseScriptRequestPromise('//lol.qq.com/comm-htdocs/js/game_area/lol_server_select.js', 'LOLServerSelect', 'gbk');
  },
  // 获取大区段位排行
  getAreaTierRank: function (area_id, offset) {
    // 获取sign参数
    var params = "area_id=" + area_id + "&offset=" + offset;
    var key = "qtld^xibt#a*";
    var sign = hex_md5(params + key);
    // body数据
    var withdata = {
      next_offset: "",
      player_list: []
    };
    return this.baseRequestPromise('//qt.qq.com/lua/mlol_battle_info/get_total_tier_rank_list?area_id=' + area_id + '&offset=' + offset + '&sign=' + sign, { 
      credentials: 'include', 
      method: 'POST',
      body: JSON.stringify(withdata)
    });
  },
  // 获取阵容标签列表
  getLineupTagList: function () {
    return this.baseRequestPromise('//game.gtimg.cn/images/lol/act/tftzlkauto/json/tagJson/tag.json?v=' + (Date.now() / 600000 >> 0));
  },
  // 获取阵容特性列表
  getLineupFeatureList: function () {
    return this.baseRequestPromise('//game.gtimg.cn/images/lol/act/tftzlkauto/json/specialityJson/speciality.json?v=' + (Date.now() / 600000 >> 0));
  },
  // 获取阵容模式列表
  getLineupTypeList: function () {
    return this.baseRequestPromise('//game.gtimg.cn/images/lol/act/tftzlkauto/json/lineupTypeJson/lineupType.json?v=' + (Date.now() / 600000 >> 0));
  },
  // 获取羁绊数据
  getBuffData: function() {
    if(window.ApiManager.getBuffData.cache) return window.ApiManager.getBuffData.cache;
    return window.ApiManager.getBuffData.cache = fetchRequest('//lol.qq.com/tft/js/data/buffData.json?v=' + (Date.now() / 600000 >> 0)).then(function(res) {
      return res.json();
    }).catch(function(err) {
      window.ApiManager.getBuffData.cache = null;
      console.error(err);
      return Promise.reject(err);
    });
  },
  // 获取棋子数据
  getChampionData: function() {
    if(window.ApiManager.getChampionData.cache) return window.ApiManager.getChampionData.cache;
    return window.ApiManager.getChampionData.cache = fetchRequest('//lol.qq.com/tft/js/data/heroid_chaid_pieceid.json?v=' + (Date.now() / 600000 >> 0)).then(function(res) {
      return res.json();
    }).catch(function(err) {
      window.ApiManager.getChampionData.cache = null;
      console.error(err);
      return Promise.reject(err);
    });
  },
  // 获取装备映射(20230324不再需要，可直接通过TFTEquipmentData的englishName字段转换装备)
  // getEquipMap: function() {
  //   if(window.ApiManager.getEquipMap.cache) return window.ApiManager.getEquipMap.cache;
  //   return window.ApiManager.getEquipMap.cache = fetchRequest('//lol.qq.com/tft/js/data/TFTEquipMap.json?v=' + (Date.now() / 600000 >> 0)).then(function(res) {
  //     return res.json();
  //   }).catch(function(err) {
  //     window.ApiManager.getEquipMap.cache = null;
  //     console.error(err);
  //     return Promise.reject(err);
  //   });
  // },
  // 获取小小英雄信息
  getLittleHeroInfo: function () {
    if(window.ApiManager.getLittleHeroInfo.cache) return window.ApiManager.getLittleHeroInfo.cache;
    return window.ApiManager.getLittleHeroInfo.cache = fetchRequest('https://mlol.qt.qq.com/go/exploit/get_tiny_hero_list?v=' + (Date.now() / 600000 >> 0)).then(function (res) {
      return res.json();
    }).catch(function (err) {
      window.ApiManager.getLittleHeroInfo.cache = null;
      console.error(err);
      return Promise.reject(err);
    });
  },
  // 获取大神羁绊棋子数据
  getMasterCom: function(date, callbackName, masterId, area) {
    return '//lol.sw.game.qq.com/lol/lwdcommact/a20210906api/a20210906api/mastercom?callback=' + callbackName + '&date=' + date + '&puuid=' + masterId + '&area=' + area + '&v=' + (Date.now() / 600000 >> 0);
  },
  // 获取大神羁绊使用数据
  getMasterRaceJob: function(date, callbackName, masterId, area) {
    return '//lol.sw.game.qq.com/lol/lwdcommact/a20210906api/a20210906api/racejob?callback=' + callbackName + '&date=' + date + '&puuid=' + masterId + '&area=' + area + '&v=' + (Date.now() / 600000 >> 0);
  },
  // 获取大神棋子使用数据
  getMasterHero: function(date, callbackName, masterId, area) {
    return '//lol.sw.game.qq.com/lol/lwdcommact/a20210906api/a20210906api/hero?callback=' + callbackName + '&date=' + date + '&puuid=' + masterId + '&area=' + area + '&v=' + (Date.now() / 600000 >> 0);
  },
  // 获取大神装备使用数据
  getMasterEquip: function(date, callbackName, masterId, area) {
    return '//lol.sw.game.qq.com/lol/lwdcommact/a20210906api/a20210906api/equip?callback=' + callbackName + '&date=' + date + '&puuid=' + masterId + '&area=' + area + '&v=' + (Date.now() / 600000 >> 0);
  },
  // 获取大神生涯数据
  getMasterCareer: function(date, callbackName, masterId, area) {
    return '//lol.sw.game.qq.com/lol/lwdcommact/a20210906api/a20210906api/master?callback=' + callbackName + '&date=' + date + '&puuid=' + masterId + '&area=' + area + '&v=' + (Date.now() / 600000 >> 0);
  },
  // TFT段位排行榜(20230324删除，更换新接口)
  // getTFTTierRanking: function(date, callbackName, worldid) {
  //   return '//lol.sw.game.qq.com/lol/lwdcommact/a20211021tftSet6/a20211021api/ranking?callback=' + callbackName + '&dtstatdate=' + date + '&worldid=' + worldid + '&v=' + (Date.now() / 600000 >> 0);
  // },
  // 实时段位排行榜接口(20230324新增)
  getTierRanking: function (area_id) {
    return this.baseRequestPromise('https://mlol.qt.qq.com/go/exploit/get_tier_rank_1000', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ area_id: +area_id })
    }).then(function (res) {
      return _.get(res, 'result') === 0 ? res : Promise.reject(res.msg);
    });
  },
  // TFT大神信息
  getMasterInfo: function(date, callbackName, puuid, worldid) {
    return '//lol.sw.game.qq.com/lol/lwdcommact/a20211021tftSet6/a20211021api/info?callback=' + callbackName + '&dtstatdate=' + date + '&worldid=' + worldid + '&puuid=' + puuid + '&v=' + (Date.now() / 600000 >> 0);
  },
  // TFT大神战绩列表
  getMasterFightList: function(puuid, areaid, filter, start, limit) {
    if(!puuid || !areaid) return Promise.reject('参数为空');
    filter = filter || 'all';
    start = start || 0;
    limit = limit || 10;

    var link = '//lol.sw.game.qq.com/lol/lwdcommact/a20211021tftSet6/a20211021api/fightlist?puuid=' + puuid + '&areaid=' + areaid + '&filter=' + filter + '&start=' + start + '&limit=' + limit + '&v=' + (Date.now() / 600000 >> 0);
    return fetchVariableDataScript(link, 'LWDFramework_Swoole').then(function (res) {
      if(_.get(res, 'code') !== 0) return Promise.reject(_.get(res, 'msg') + ' code:' + _.get(res, 'code'));
      var rData = _.get(res, 'data.result');
      if(!rData) return Promise.reject('暂无数据');
      rData.masterId = puuid;
      rData.area = areaid;
      return rData;
    }).catch(function (err) {
      console.error(err);
      return Promise.reject(err);
    });
  },
  // TFT大神战绩详情
  getMasterFightDetail: function(gameid, areaid) {
    if(!gameid || !areaid) return Promise.reject('参数为空');
    var link = '//lol.sw.game.qq.com/lol/lwdcommact/a20211021tftSet6/a20211021api/fightdetail?areaid=' + areaid + '&gameid=' + gameid + '&v=' + (Date.now() / 600000 >> 0);
    return fetchVariableDataScript(link, 'LWDFramework_Swoole').then(function (res) {
      if(_.get(res, 'code') !== 0) return Promise.reject(_.get(res, 'msg') + ' code:' + _.get(res, 'code'));
      var rData = _.get(res, 'data.result');
      if(!rData) return Promise.reject('暂无数据');
      rData.gameid = gameid;
      rData.area = areaid;
      return rData;
    }).catch(function (err) {
      console.error(err);
      return Promise.reject(err);
    });
  },
  // 查询我的阵容状态
  showLineUpStatus: function (vueObj, type){
    if (vueObj.$store.state.PlayerOpenId) {
      // type=0 常规模式，type=1 非常规模式
      type === undefined && (type = 0);
      Milo.syncToAME(function() {
        var link = '//lol.sw.game.qq.com/lol/lwdcommact/a20240329tftRecommend/a20240329tftRecommend/getLineUp?type='+type;
        return fetchVariableDataScript(link, 'LWDFramework_Swoole').then(function (res) {
          if(_.get(res, 'code') == 0){
            var rData = _.get(res, 'data');
            let ownLineupData=[];
            if(rData.length >0){
              for (let i = 0; i < rData.length; i++) {
                let item=rData[i];
                ownLineupData.push(item.id.toString());
              }
              vueObj.applyLineupId=ownLineupData;
              //console.log(vueObj.applyLineupId);
            }
          }
        }).catch(function (err) {
          console.error(err);
        });
      });
    }
  },
  //设置我的阵容 20250211: 接口改动不用替换，后台会自动替换最旧那个
  setOwnLineUp: function(slineUpId, vuObj, type) {
    if(!slineUpId){
      vuObj.$store.commit('setDialogMsg', '请选择阵容');
      return false;
    }
    // console.log(slineUpId);
    // console.log(chose_index);
    // type=0 常规模式，type=1 非常规模式
    type === undefined && (type = 0);
    Milo.syncToAME(function() {
      var link = "//lol.sw.game.qq.com/lol/lwdcommact/a20240329tftRecommend/a20240329tftRecommend/setLineUp?slineUpId="+slineUpId+"&type="+type;
      return fetchVariableDataScript(link, 'LWDFramework_Swoole').then(function (res) {
        if(_.get(res, 'code') !== 0) {
          vuObj.$store.commit('setDialogMsg', _.get(res, 'msg'));
        }else{
          //return Promise.reject('设置成功');
          vuObj.$refs.applyLineupComp.showApplyLineupSuccessTooltip();
          window.ApiManager.showLineUpStatus(vuObj, type);
        }
      }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
      });
    });
  },
  /**
   * 游戏说（gicp）交叉搜索
   * @param source 请求来源
   * @param tagids 标签id eg:121986,120921
   * @param typeids 类型id，1:图文; 2:视频; 1,2:图文+视频
   * @param start 起始位置
   * @param limit 搜索条目数
   * @param logic 多个标签拉取关系 or:并集(包含其中之一); and:交集(同时包含)
   * @returns {Promise<never>|Promise<unknown>}
   */
  requestCMCCross: function (source, tagids, typeids, start, limit, logic) {
    if (!source) return Promise.reject('需要参数source');
    if (!tagids) return Promise.reject('需要参数tagids');
    !typeids && (typeids = '1,2');
    !logic && (logic = 'and');
    return this.baseRequestPromise('//apps.game.qq.com/cmc/cross?serviceId=245&source=' + source + '&tagids=' + tagids + '&typeids=' + typeids + '&logic=' + logic + '&start=' + start + '&limit=' + limit);
  },
  requestCMCComplexDetail: function (docId) {
    var ibizNum = 245,
      theKey = 'ztzgw',
      timestamps = parseInt(new Date().getTime() / 1000),
      signKey = theKey + theKey + ibizNum + timestamps,
      sign = hex_md5(signKey).toLowerCase();
    return this.baseRequestPromise('//apps.game.qq.com/cmc/complexDetail?ibiz=' + ibizNum + '&subBiz=0&source=' + theKey + '&sign=' + sign + '&id=' + docId + '&detailFlag=1&t=' + timestamps);
  },
  // 手动执行文章点击量上报
  requestUpdateTotalPlay: function (source, docId) {
    return this.baseRequestPromise('//apps.game.qq.com/wmp/v3.1/?p0=245&p1=updateTotalPlay&p3=2&p5=1&source=' + source + '&docid=' + docId);
  },
  // 胜率阵容
  postWinRateLineup: function (time_type, tier_part, is_rgm) {
    var queue_id = !is_rgm ? window.QtQueueId : window.QtQueueIdRGM;
    return this.baseRequestPromise('https://mlol.qt.qq.com/go/exploit/common_proxy', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        "req_group": [{
          "req_alias": "lineup_group_list",
          "is_return_source": 0,
          "req_params": {
            "queue_id": queue_id,
            "tier_part": tier_part,
            "time_type": time_type
          }
        }]
      })
    }).then(function (res) {
      return _.get(res, 'result') === 0 ? _.get(res, 'data.0.data') : Promise.reject(res.msg);
    });
  },
  // 羁绊排行
  postTraitRank: function (time_type, tier_part, is_rgm) {
    var queue_id = !is_rgm ? window.QtQueueId : window.QtQueueIdRGM;
    return this.baseRequestPromise('https://mlol.qt.qq.com/go/exploit/common_proxy', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        "req_group": [{
          "req_alias": "trait_strength_trend",
          "req_params": {
            "battletype": queue_id,
            "tier_part": tier_part,
            "time_type": time_type
          }
        }]
      })
    }).then(function (res) {
      return _.get(res, 'result') === 0 ? _.get(res, 'data.0.data') : Promise.reject(res.msg);
    });
  },
  // 主羁绊胜率阵容
  postMainTraitLineup: function (time_type, tier_part, traits, is_rgm) {
    var queue_id = !is_rgm ? window.QtQueueId : window.QtQueueIdRGM;
    return this.baseRequestPromise('https://mlol.qt.qq.com/go/exploit/common_proxy_v2', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        "req_group": [{
          "req_alias": "main_trait_lineup",
          "is_return_source": 0,
          "req_params": {
            "queue_id": queue_id,
            "tier_part": tier_part,
            "time_type": time_type,
            "main_traits_id": traits
          }
        }]
      })
    }).then(function (res) {
      return _.get(res, 'result') === 0 ? _.get(res, 'data.0.data') : Promise.reject(res.msg);
    });
  },
  // 弈子排行
  postChessRank: function (time_type, tier_part, is_rgm) {
    var queue_id = !is_rgm ? window.QtQueueId : window.QtQueueIdRGM;
    return this.baseRequestPromise('https://mlol.qt.qq.com/go/exploit/common_proxy', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        "req_group": [{
          "req_alias": "hero_ranking",
          "req_params": {
            "iqueue_id": queue_id,
            "tier_part": tier_part,
            "time_type": time_type,
            "base_price": "255"
          }
        }]
      })
    }).then(function (res) {
      return _.get(res, 'result') === 0 ? _.get(res, 'data.0.data') : Promise.reject(res.msg);
    });
  },
  // 装备排行
  postEquipRank: function (time_type, tier_part, is_rgm) {
    var queue_id = !is_rgm ? window.QtQueueId : window.QtQueueIdRGM;
    return this.baseRequestPromise('https://mlol.qt.qq.com/go/exploit/common_proxy', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        "req_group": [{
          "req_alias": "equip_ranking",
          "req_params": {
            "iqueue_id": queue_id,
            "tier_part": tier_part,
            "time_type": time_type,
            "itemtype": "-1"
          }
        }]
      })
    }).then(function (res) {
      return _.get(res, 'result') === 0 ? _.get(res, 'data.0.data') : Promise.reject(res.msg);
    });
  },
  // getAreaTierRank: function (area_id, offset) {
  //   return this.baseRequestPromise('https://faas-4880.odp.qq.com/faas/4880/995/tft_rank_list', {
  //     mode: 'cors',
  //     credentials: 'include',
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     // body: JSON.stringify(withdata)
  //     body: 'areaid=' + area_id + '&page=' + offset
  //   });
  // }
}/* #t6Hl8#CD9D8BAB292D36880E21BAC9910C9AC9 */