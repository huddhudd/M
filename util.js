window.TFTFuncLib = {};

/** 将赛季字段从2019.S2这种格式,换成s2 start */
window.TFTFuncLib.convertSeasonString = function (season_string) {
  var rs;
  if (typeof (season_string) === 'string') {
    season_string = season_string.match(/[Ss]\d+/);
    _.get(season_string, '0') && (rs = season_string[0].toLowerCase());
  }
  return rs;
};
/** 将赛季字段从2019.S2这种格式,换成s2 end */

/** 转义 start */
window.TFTFuncLib.filterSpecialchars = function (str) {
  if (typeof (str) === 'string') {
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/'/g, '&#039;');
  }
  return str;
};
window.TFTFuncLib.htmlDecodeByRegExp = function (str) {
  var temp = "";
  if (str.length == 0) return "";
  temp = str.replace(/&amp;/g, "&");
  temp = temp.replace(/&lt;/g, "<");
  temp = temp.replace(/&gt;/g, ">");
  temp = temp.replace(/&nbsp;/g, " ");
  temp = temp.replace(/&#39;/g, "\'");
  temp = temp.replace(/&quot;/g, "\"");
  return temp;
};
/** 转义 end */

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 */
window.TFTFuncLib.dateFormat = function (fmt, date) {
  if (typeof date === 'string') {
    return date
  }
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
    'H+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  };
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + '']);
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
};

/**
 * 处理日期格式
 * eg：new Date().format('Y-MM-dd hh:mm:ss');
 * @param fmt
 * @returns {*}
 */
Date.prototype.format = function(fmt) {
  var o = {
    "Y+": this.getFullYear(), //年份
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

/**
 * 处理时间加减少天 start
 * @param timer 时间戳
 * @param pushDay {Number}  添加的天数
 * @returns {*}
 * Date.parse(timeStr.replace(/\-/g, '/')) 时间格式处理 兼容ios下的问题
 */
window.TFTFuncLib.pushDay = function(timer,pushDay) {
  var dateTime = new Date(timer);
  var dateTimer = dateTime.setDate(dateTime.getDate() + pushDay);
  return new Date(dateTimer).format('Y/MM/dd hh:mm:ss');
};

/**
 * 精确小数点
 * @param number 需要转换的数字
 * @param format 要保留几位小数
 * @param zeroFill 是否补零。不需要补零可以不填写此参数
 * @return 数字字符串
 */
window.TFTFuncLib.accurateDecimal = function (number, format, zeroFill) {
  if (isNaN(parseFloat(number))) {
    return number;
  }
  // var n = 1;
  // for (var i = 0; i < format; i++) {
  //   n = n * 10;
  // }
  // //向上取整
  // var str = (Math.ceil(number * n) / n).toString();
  var str = parseFloat(number).toFixed(format).toString();
  //是否补零
  if (zeroFill) {
    var index;
    if (str.indexOf(".") == -1) {
      index = format;
      str += '.';
    } else {
      index = format - ((str.length - 1) - str.indexOf("."));
    }
    for (var i = 0; i < index; i++) {
      str += '0';
    }
  }
  return str;
};

/**
 * 处理单条阵容数据
 * @param lineup_data lineup_detail_total.json原始数据的数组单个对象
 * */
window.TFTFuncLib.handleTFTLibLineupDetail = function (lineup_data) {
  var theChampionData = lineup_data.modeId !== window.RGMModeId ? window.vuex.state.TFTChampionData : window.vuex.state.TFTRGMChampionData;
  var theEquipmentData = lineup_data.modeId !== window.RGMModeId ? window.vuex.state.TFTEquipmentData : window.vuex.state.TFTRGMEquipmentData;
  var handleDetail = function (detail) {
    _.forEach(detail.finalChessList, function (chess) {
      chess.dataChess = _.find(theChampionData, { chessId: _.get(chess, 'dataChess.chessId') });
      // 转换装备配方，注意listCatchEquip被冻结
      chess.listCatchEquip = _.cloneDeep(chess.listCatchEquip);
      _.forEach(chess.listCatchEquip, function (equip) {
        if (_.get(equip, 'formula') && typeof equip.formula === 'string') {
          var formula_data = _.flatMap(equip.formula.split(','), function (id) {
            return _.find(theEquipmentData, { equipId: id });
          });
          equip.formula_data = _.compact(formula_data);
        }
      });
      chess.equipMainAndBackup = {
        main: _.compact(_.map(_.split(_.get(chess, 'origin.equipment_replace.main'), ','), function (equipId) {
          return _.find(window.vuex.state.TFTEquipmentData, { equipId: equipId });
        }.bind(this))),
        backup: _.compact(_.map(_.split(_.get(chess, 'origin.equipment_replace.backup'), ','), function (equipId) {
          return _.find(window.vuex.state.TFTEquipmentData, { equipId: equipId });
        }.bind(this)))
      }
    });
    // 前中期阵容处理
    _.forEach(detail.earlyMapChessList, function (chess) {
      chess.dataChess = _.find(theChampionData, { chessId: _.get(chess, 'dataChess.chessId') });
    });
    _.forEach(detail.metaphaseChessList, function (chess) {
      chess.dataChess = _.find(theChampionData, { chessId: _.get(chess, 'dataChess.chessId') });
    });
    // 前中后期羁绊处理
    var handleContact = function (contactList, stage) {
      _.forEach(contactList, function (contact_item) {
        contact_item.dataTrait = contact_item.detail;
        contact_item.numSum = contact_item.num;
        contact_item.numLevel = contact_item.level;
        contact_item.numColor = contact_item.color;
        contact_item.$typeTrait = contact_item.type;
        // 天选之人（Set10叫赛季之星）羁绊处理
        if (lineup_data.modeId === window.RGMModeId) {
          var vanguardFieldName = '';
          switch (stage) {
            case -1:
              vanguardFieldName = 'recomm_chosen_heros_synergy';
              break;
            case 0:
              vanguardFieldName = 'recomm_chosen_heros_synergy_early';
              break;
            case 1:
              vanguardFieldName = 'recomm_chosen_heros_synergy_middle';
              break;
          }
          if (_.get(contact_item, 'dataTrait.traitId') === _.get(detail[vanguardFieldName], contact_item.$typeTrait)) {
            contact_item.isVanguard = true;
          }
        }
      });
    };
    handleContact(detail.contact, -1);
    handleContact(detail.y21_early_heros_contact, 0);
    handleContact(detail.y21_metaphase_heros_contact, 1);
    // 备选英雄
    var hero_replace_data = [];
    _.forEach(detail.hero_replace, function (item) {
      var originHeros = _.flatMap(item.hero_id.split(','), function (id) {
        return _.find(theChampionData, { chessId: id });
      });
      originHeros = _.compact(originHeros);
      var replaceHeros = _.flatMap(item.replace_heros.split(','), function (id) {
        return _.find(theChampionData, { chessId: id });
      });
      replaceHeros = _.compact(replaceHeros);
      if (originHeros.length > 0) {
        hero_replace_data.push({
          origin: originHeros,
          replace: replaceHeros,
        });
      }
    });
    detail.hero_replace_data = hero_replace_data;
    // 最终站位是否有站位二
    detail.hasLocation2 = _.get(detail.finalMapChess, '0.origin.location_2') ? true : false;
    // 处理主C英雄装备具体数据与原始数据顺序不一致的问题
    var handleCarryHeroEquip = function (key) {
      var carryHeroEquipItem = _.get(detail, 'carry_hero_equip_replace.' + key) && detail.carry_hero_equip_replace[key].split(',');
      var carryHeroEquipDetailItem = _.get(detail, 'carry_hero_equip_replace_detail.' + key);
      var tempData = [];
      if (_.get(carryHeroEquipItem, 'length') > 0 && _.get(carryHeroEquipDetailItem, 'length') > 0) {
        _.forEach(carryHeroEquipItem, function (equipId) {
          var equip = _.find(carryHeroEquipDetailItem, { equipId: equipId });
          equip && tempData.push(equip);
        });
      }
      return tempData;
    };
    var carryHeroEquipMain = handleCarryHeroEquip('main');
    carryHeroEquipMain.length && (detail.carry_hero_equip_replace_detail.main = carryHeroEquipMain);
    var carryHeroEquipBackup = handleCarryHeroEquip('backup');
    carryHeroEquipBackup.length && (detail.carry_hero_equip_replace_detail.backup = carryHeroEquipBackup);
    // 处理强化符文具体数据与原始数据顺序不一致的问题
    var handleHexbuff = function (key) {
      var hexbuffItem = _.get(detail, 'hexbuff.' + key) && detail.hexbuff[key].split(',');
      var hexbuffDetailItem = _.get(detail, 'hexbuff_detail.' + key);
      var tempData = [];
      if (_.get(hexbuffItem, 'length') > 0 && _.get(hexbuffDetailItem, 'length') > 0) {
        _.forEach(hexbuffItem, function (hexId) {
          var hex = _.find(hexbuffDetailItem, { hexId: hexId });
          hex && tempData.push(hex);
        });
      }
      return tempData;
    };
    var hexbuffRecomm = handleHexbuff('recomm');
    hexbuffRecomm.length && (detail.hexbuff_detail.recomm = hexbuffRecomm);
    var hexbuffReplace = handleHexbuff('replace');
    hexbuffReplace.length && (detail.hexbuff_detail.replace = hexbuffReplace);
    // 过滤掉未激活羁绊和‘召唤物’羁绊（TODO:‘召唤物’赛季迭代都要手动修改id）
    var handleFilterContact = function (contactList) {
      return _.filter(contactList, function (item) {
        return item && +item.level > 0 && item.id !== '9018';
      });
    }
    detail.contact = handleFilterContact(detail.contact);
    detail.y21_early_heros_contact = handleFilterContact(detail.y21_early_heros_contact);
    detail.y21_metaphase_heros_contact = handleFilterContact(detail.y21_metaphase_heros_contact);
    // 开局可玩条件
    detail.$playable_conditions = {
      buffs: _.map(_.get(detail, 'playable_conditions.buffids'), function (hexId) {
        return _.find(window.vuex.state.TFTHexData.normalBuff, { hexId: hexId });
      }),
      equips: _.map(_.get(detail, 'playable_conditions.equipids'), function (equipId) {
        return _.find(window.vuex.state.TFTEquipmentData, { equipId: equipId });
      }),
      heros: _.map(_.get(detail, 'playable_conditions.heroids'), function (chessId) {
        return _.find(window.vuex.state.TFTChampionData, { chessId: chessId });
      })
    }
    // 处理天选
    var renderVanguardData = { origin: null, replace: null };
    var renderVanguardEarlyData = { origin: null };
    var renderVanguardMetaphaseData = { origin: null };
    var detailData = detail;
    var recommVanguardHero = _.get(_.find(detailData['finalChessList'], function (o) { return o.dataChess.chessId === detailData.recomm_chosen_heros }), 'dataChess');
    if (recommVanguardHero) {
      var recommVanguardSynergy = _.find(recommVanguardHero.$listTrait, function (o) {
        return o.traitId === (_.get(detailData.recomm_chosen_heros_synergy, 'race') || _.get(detailData.recomm_chosen_heros_synergy, 'job'))
      });
      renderVanguardData.origin = { dataChess: recommVanguardHero, synergy: recommVanguardSynergy };
    }

    var replaceVanguardHero = _.get(_.find(detailData['finalChessList'], function (o) { return o.dataChess.chessId === detailData.replace_chosen_heros }), 'dataChess');
    if (replaceVanguardHero) {
      var replaceVanguardSynergy = _.find(replaceVanguardHero.$listTrait, function (o) {
        return o.traitId === (_.get(detailData.replace_chosen_heros_synergy, 'race') || _.get(detailData.replace_chosen_heros_synergy, 'job'))
      });
      renderVanguardData.replace = { dataChess: replaceVanguardHero, synergy: replaceVanguardSynergy };
    }

    var earlyVanguardHero = _.get(_.find(detailData['earlyChessList'], function (o) { return o.dataChess.chessId === detailData.recomm_chosen_heros_early }), 'dataChess');
    if (earlyVanguardHero) {
      var earlyVanguardSynergy = _.find(earlyVanguardHero.$listTrait, function (o) {
        return o.traitId === (_.get(detailData.recomm_chosen_heros_synergy_early, 'race') || _.get(detailData.recomm_chosen_heros_synergy_early, 'job'))
      });
      renderVanguardEarlyData.origin = { dataChess: earlyVanguardHero, synergy: earlyVanguardSynergy };
    }

    var metaphaseVanguardHero = _.get(_.find(detailData['metaphaseChessList'], function (o) { return o.dataChess.chessId === detailData.recomm_chosen_heros_middle }), 'dataChess');
    if (metaphaseVanguardHero) {
      var metaphaseVanguardSynergy = _.find(metaphaseVanguardHero.$listTrait, function (o) {
        return o.traitId === (_.get(detailData.recomm_chosen_heros_synergy_middle, 'race') || _.get(detailData.recomm_chosen_heros_synergy_middle, 'job'))
      });
      renderVanguardMetaphaseData.origin = { dataChess: metaphaseVanguardHero, synergy: metaphaseVanguardSynergy }
    }
    detail.renderVanguardData = renderVanguardData;
    detail.renderVanguardEarlyData = renderVanguardEarlyData;
    detail.renderVanguardMetaphaseData = renderVanguardMetaphaseData;
    
    return detail;
  };
  lineup_data.detail = handleDetail(lineup_data.detail);
  lineup_data.mode_type + '' === '2' && (lineup_data.detail_2 = handleDetail(lineup_data.detail_2));
  lineup_data.$modeType = lineup_data.mode_type;
  // 1.常规模式， 2.双人模式， 3.轮换模式
  lineup_data.modeId === window.RGMModeId && (lineup_data.$modeType = '3');
  // console.log(JSON.parse(JSON.stringify(lineup_data)))
};
/**
 * 处理阵容列表
 * @param lineup_list lineup_detail_total.json原始数据的数组
 * */
window.TFTFuncLib.handleTFTLibLineupList = function (lineup_list) {
  // lineup_list = _.cloneDeep(lineup_list);
  _.forEach(lineup_list, function (lineup_data) {
    window.TFTFuncLib.handleTFTLibLineupDetail(lineup_data);
    // 选择其中一个渠道用于不同渠道的阵容详情json获取, 作者详情的有些阵容不在推荐阵容内, 需要指定渠道才能正确获取
    lineup_data.oneChannel = _.head(_.split(lineup_data.channel, ','));
  });
  lineup_list = _.orderBy(lineup_list, function(item) {
    return parseInt(item.sortID);
  }, 'desc');
  return lineup_list;
};
// 处理胜率阵容详细数据
window.TFTFuncLib.handleWinRateLineupDetail = function (rDetail, timeType, tierPart, isRGM) {
  var theChampionData = !isRGM ? window.vuex.state.TFTChampionData : window.vuex.state.TFTRGMChampionData;
  var theEquipmentData = !isRGM ? window.vuex.state.TFTEquipmentData : window.vuex.state.TFTRGMEquipmentData;
  var theTraitData = !isRGM ? _.concat(window.vuex.state.TFTRaceData, window.vuex.state.TFTJobData) : _.concat(window.vuex.state.TFTRGMRaceData, window.vuex.state.TFTRGMJobData);
  rDetail.$coreChess = _.compact(_.flatMap(rDetail.core_chess, function (chess_id, i) {
    var cChess = _.find(theChampionData, { TFTID: chess_id });
    if (!cChess) return null;
    var result = { dataChess: cChess, booleanCarry: i === 0 };
    if (i === 0) {
      // 条件1:主辅c英雄1~3费展示3星，条件2:主辅c英雄4~5费展示2星
      if (+cChess.price >= 1 && +cChess.price <= 3) result.numStar = 3;
      if (+cChess.price >= 4 && +cChess.price <= 5) result.numStar = 2;
      result.listCatchEquip = _.compact(_.flatMap(rDetail.main_c_chess_equip, function (tftName) {
        return _.find(theEquipmentData, function (o) { return o.englishName.indexOf(tftName) !== -1 })
      }));
      rDetail.$carryChess = cChess;
    }
    if (chess_id === _.get(rDetail, 'assist_chess.0')) {
      // 条件1:主辅c英雄1~3费展示3星，条件2:主辅c英雄4~5费展示2星
      if (+cChess.price >= 1 && +cChess.price <= 3) result.numStar = 3;
      if (+cChess.price >= 4 && +cChess.price <= 5) result.numStar = 2;
      result.listCatchEquip = _.compact(_.flatMap(rDetail.assist_chess_equip, function (tftName) {
        return _.find(theEquipmentData, function (o) { return o.englishName.indexOf(tftName) !== -1 })
      }))
      rDetail.$assistChess = cChess;
    }
    return result;
  }));
  rDetail.$freeChess = _.compact(_.flatMap(rDetail.free_chess, function (chess_id) {
    var fChess = _.find(theChampionData, { TFTID: chess_id });
    if (!fChess) return null;
    var result = { dataChess: fChess };
    if (chess_id === _.get(rDetail, 'assist_chess.0')) {
      // 条件1:主辅c英雄1~3费展示3星，条件2:主辅c英雄4~5费展示2星
      if (+fChess.price >= 1 && +fChess.price <= 3) result.numStar = 3;
      if (+fChess.price >= 4 && +fChess.price <= 5) result.numStar = 2;
      result.listCatchEquip = _.compact(_.flatMap(rDetail.assist_chess_equip, function (tftName) {
        return _.find(theEquipmentData, function (o) { return o.englishName.indexOf(tftName) !== -1 })
      }));
      rDetail.$assistChess = fChess;
    }
    return result;
  }));
  rDetail.$mainTraitList = _.compact(_.flatMap(rDetail.main_trait_list, function (o) {
    var mTrait = _.find(theTraitData, { traitId: o.trait_id });
    if (!mTrait) return null;
    return { dataTrait: mTrait, chessNum: o.chess_num };
  }));
  var tmpName = ''
  _.forEach(rDetail.$mainTraitList, function (o, i) {
    i !== 0 && (tmpName += ' ');
    tmpName += o.chessNum + _.get(o, 'dataTrait.name')
  });
  tmpName += ' ' + _.get(rDetail, '$coreChess.0.dataChess.displayName');
  rDetail.$lineupName = tmpName;
  rDetail.$avg_rank_diff = parseFloat(window.TFTFuncLib.accurateDecimal(rDetail.avg_rank_diff * 100, 2, true));
  rDetail.$top_1_rate = parseFloat(window.TFTFuncLib.accurateDecimal(rDetail.top_1_rate * 100, 2, true));
  rDetail.$top_1_rate_diff = parseFloat(window.TFTFuncLib.accurateDecimal(rDetail.top_1_rate_diff * 100, 2, true));
  rDetail.$top_4_rate = parseFloat(window.TFTFuncLib.accurateDecimal(rDetail.top_4_rate * 100, 2, true));
  rDetail.$top_4_rate_diff = parseFloat(window.TFTFuncLib.accurateDecimal(rDetail.top_4_rate_diff * 100, 2, true));
  rDetail.$use_rate_diff = parseFloat(window.TFTFuncLib.accurateDecimal(rDetail.use_rate_diff * 100, 2, true));
  // 主c英雄、辅c英雄 IF 最低1费，显示低费快D；IF 最低2费，显示6级D牌；IF 最低3费，显示7级D牌；IF 最低4费，显示8级D牌；IF 有1个5费，显示 稳健运营；(不区分稳健运营和速9，合并一类）
  if (+_.get(rDetail, '$carryChess.price') === 1 || +_.get(rDetail, '$assistChess.price') === 1) {
    rDetail.$lineup_tag = '低费快D'
  } else if (+_.get(rDetail, '$carryChess.price') === 2 || +_.get(rDetail, '$assistChess.price') === 2) {
    rDetail.$lineup_tag = '6级D牌'
  } else if (+_.get(rDetail, '$carryChess.price') === 3 || +_.get(rDetail, '$assistChess.price') === 3) {
    rDetail.$lineup_tag = '7级D牌'
  } else if (+_.get(rDetail, '$carryChess.price') === 4 || +_.get(rDetail, '$assistChess.price') === 4) {
    rDetail.$lineup_tag = '8级D牌'
  } else if (+_.get(rDetail, '$carryChess.price') === 5 || +_.get(rDetail, '$assistChess.price') === 5) {
    rDetail.$lineup_tag = '稳健运营'
  }
  rDetail.$timeType = timeType;
  rDetail.$tierPart = tierPart;
  return rDetail;
};
// 处理胜率阵容详细数据V2
window.TFTFuncLib.handleWinRateLineupDetailV2 = function (rDetail, timeType, tierPart, isRGM) {
  var theChampionData = !isRGM ? window.vuex.state.TFTChampionData : window.vuex.state.TFTRGMChampionData;
  var theEquipmentData = !isRGM ? window.vuex.state.TFTEquipmentData : window.vuex.state.TFTRGMEquipmentData;
  var theTraitData = !isRGM ? _.concat(window.vuex.state.TFTRaceData, window.vuex.state.TFTJobData) : _.concat(window.vuex.state.TFTRGMRaceData, window.vuex.state.TFTRGMJobData);
  rDetail.$coreChess = _.compact(_.flatMap(rDetail.key_chess_group, function (chess_id, i) {
    var cChess = _.find(theChampionData, { TFTID: chess_id });
    if (!cChess) return null;
    var result = { dataChess: cChess, booleanCarry: i === 0 };
    if (i === 0) {
      // 条件1:主辅c英雄1~3费展示3星，条件2:主辅c英雄4~5费展示2星
      if (+cChess.price >= 1 && +cChess.price <= 3) result.numStar = 3;
      if (+cChess.price >= 4 && +cChess.price <= 5) result.numStar = 2;
      result.listCatchEquip = _.compact(_.flatMap(rDetail.main_c_chess_equip_group, function (tftName) {
        return _.find(theEquipmentData, function (o) { return o.englishName.indexOf(tftName) !== -1 })
      }));
      rDetail.$carryChess = cChess;
    }
    if (chess_id === _.get(rDetail, 'assist_c_chess')) {
      // 条件1:主辅c英雄1~3费展示3星，条件2:主辅c英雄4~5费展示2星
      if (+cChess.price >= 1 && +cChess.price <= 3) result.numStar = 3;
      if (+cChess.price >= 4 && +cChess.price <= 5) result.numStar = 2;
      result.listCatchEquip = _.compact(_.flatMap(rDetail.assist_c_chess_equip_group, function (tftName) {
        return _.find(theEquipmentData, function (o) { return o.englishName.indexOf(tftName) !== -1 })
      }))
      rDetail.$assistChess = cChess;
    }
    return result;
  }));
  rDetail.$freeChess = _.compact(_.flatMap(rDetail.free_chess_group, function (chess_id) {
    var fChess = _.find(theChampionData, { TFTID: chess_id });
    if (!fChess) return null;
    var result = { dataChess: fChess };
    if (chess_id === _.get(rDetail, 'assist_c_chess')) {
      // 条件1:主辅c英雄1~3费展示3星，条件2:主辅c英雄4~5费展示2星
      if (+fChess.price >= 1 && +fChess.price <= 3) result.numStar = 3;
      if (+fChess.price >= 4 && +fChess.price <= 5) result.numStar = 2;
      result.listCatchEquip = _.compact(_.flatMap(rDetail.assist_c_chess_equip_group, function (tftName) {
        return _.find(theEquipmentData, function (o) { return o.englishName.indexOf(tftName) !== -1 })
      }));
      rDetail.$assistChess = fChess;
    }
    return result;
  }));
  rDetail.$childTraitList = _.compact(_.flatMap(rDetail.child_trait_group, function (o) {
    var mTrait = _.find(theTraitData, { traitId: o.id });
    if (!mTrait) return null;
    return { dataTrait: mTrait, chessNum: o.num };
  }));
  var tmpName = '+ '
  _.forEach(rDetail.$childTraitList, function (o, i) {
    i !== 0 && (tmpName += ' ');
    tmpName += o.chessNum + _.get(o, 'dataTrait.name')
  });
  rDetail.$lineupName = tmpName;
  rDetail.$avg_rank_diff = parseFloat(window.TFTFuncLib.accurateDecimal(rDetail.avg_rank_diff * 100, 2, true));
  rDetail.$top_1_rate = parseFloat(window.TFTFuncLib.accurateDecimal(rDetail.top_1_rate * 100, 2, true));
  // rDetail.$top_1_rate_diff = parseFloat(window.TFTFuncLib.accurateDecimal(rDetail.top_1_rate_diff * 100, 2, true));
  rDetail.$top_4_rate = parseFloat(window.TFTFuncLib.accurateDecimal(rDetail.top_4_rate * 100, 2, true));
  // rDetail.$top_4_rate_diff = parseFloat(window.TFTFuncLib.accurateDecimal(rDetail.top_4_rate_diff * 100, 2, true));
  // rDetail.$use_rate_diff = parseFloat(window.TFTFuncLib.accurateDecimal(rDetail.use_rate_diff * 100, 2, true));
  // 主c英雄、辅c英雄 IF 最低1费，显示低费快D；IF 最低2费，显示6级D牌；IF 最低3费，显示7级D牌；IF 最低4费，显示8级D牌；IF 有1个5费，显示 稳健运营；(不区分稳健运营和速9，合并一类）
  if (+_.get(rDetail, '$carryChess.price') === 1 || +_.get(rDetail, '$assistChess.price') === 1) {
    rDetail.$lineup_tag = '低费快D'
  } else if (+_.get(rDetail, '$carryChess.price') === 2 || +_.get(rDetail, '$assistChess.price') === 2) {
    rDetail.$lineup_tag = '6级D牌'
  } else if (+_.get(rDetail, '$carryChess.price') === 3 || +_.get(rDetail, '$assistChess.price') === 3) {
    rDetail.$lineup_tag = '7级D牌'
  } else if (+_.get(rDetail, '$carryChess.price') === 4 || +_.get(rDetail, '$assistChess.price') === 4) {
    rDetail.$lineup_tag = '8级D牌'
  } else if (+_.get(rDetail, '$carryChess.price') === 5 || +_.get(rDetail, '$assistChess.price') === 5) {
    rDetail.$lineup_tag = '稳健运营'
  }
  rDetail.$timeType = timeType;
  rDetail.$tierPart = tierPart;
  return rDetail;
}

/** 根据选择器获取template并从dom中移除 start */
window.TFTFuncLib.getTemplateBySelector = function (selector) {
  if (!selector) {
    console.error('selector未传入');
    return '';
  }
  var template = document.querySelector(selector);
  if (!template) {
    console.error('未找到' + selector +',请确认是否在dom内存在');
    return '';
  }
  template.remove && template.remove();
  return template.innerHTML;
};
/** 根据选择器获取template并从dom中移除 end */

/** 操作localstorage key自动增加前缀 start */
window.TFTLocalstorage = { key_name: 'pc_tft_20200618_' };
window.TFTLocalstorage.save = function (data_key, data) {
  if (!data_key) return;
  try {
    typeof (data) !== 'string' && (data = JSON.stringify(data));
  } catch (e) { console.error(e) }
  localStorage && localStorage.setItem(this.key_name + data_key, data);
};
window.TFTLocalstorage.get = function (data_key) {
  if (!data_key) return;
  var value = localStorage.getItem(this.key_name + data_key);
  try {
    value = JSON.parse(value);
  } catch (e) { }
  if (value === 'undefined' || value === 'null') {
    value = null;
  }
  return value;
};
window.TFTLocalstorage.delete = function (data_key) {
  if (!data_key) return;
  localStorage.removeItem(this.key_name + data_key);
};
/** 操作localstorage end */

window.TFTPageTheme = {};
/* 大神详情页echarts颜色配置 */
window.TFTPageTheme.masterDetailOptions = {
  dark: {
    // 胜率图表
    winRateGraph: {
      color: ['#f2b746', '#d95b2e', '#023143'],
      backgroundColor: '#002635', // 标签背景色
      borderColor: '#e0fff0', // 标签边框颜色
      textColor: '#fff' // 标签内文本颜色
    },
    // 近50场排位胜点图表
    rankingPointsGraph: {
      tooltipLineStyleColor: '#c29e54',
      tooltipBackgroundColor: '#002635', // 标签背景色
      tooltipBorderColor: '#e0fff0', // 标签边框颜色
      tooltipTextColor: '#fff', // 标签内文本颜色
      tooltipSquareColor: '#f2b746', // 标签内色标
      xAxisLineStyleColor: '#153a49', // x轴颜色
      yAxisNameTextColor: '#6e9fb2', // y轴标题颜色
      yAxisSplitLineColor: '#153a49', // y轴分割线
      yAxisAxisLineColor: '#153a49', // y轴轴线
      yAxisAxisLabelColor: '#6e9fb2', // y轴刻度
      lineStyleColor: '#6e9fb2', // 曲线颜色
      seriesItemStyleColor: '#f2b746', // 交点颜色
      seriesAreaStyleColor: '255,255,255',
    },
    // 近20场排位排名图表
    rankingDistributeGraph: {
      tooltipBackgroundColor: '#002635', // 标签背景色
      tooltipBorderColor: '#e0fff0', // 标签边框颜色
      tooltipTextColor: '#fff', // 标签内文本颜色
      xAxisSplitLineColor: '#153a49', // x轴分割线
      xAxisLineStyleColor: '#153a49', // x轴颜色
      xAxisAxisLabelColor: '#6e9fb2', // x轴刻度
      yAxisSplitLineColor: '#153a49', // y轴分割线
      yAxisAxisLineColor: '#153a49', // y轴轴线
      yAxisAxisLabelColor: '#6e9fb2', // y轴刻度
      seriesLabelColor: '#6e9fb2', // 每个柱子上的数值
      itemStyleColor: ['#b59758', '#c76b4a', '#c76b4a', '#c76b4a', '#0c3d51', '#0c3d51', '#0c3d51', '#0c3d51'], // 柱子颜色
    }
  },
  white: {
    // 胜率图表
    winRateGraph: {
      color: ['#f2b746', '#d95b2e', '#ebeef6'],
      backgroundColor: '#fff', // 标签背景色
      borderColor: '#8b34de', // 标签边框颜色
      textColor: '#726e84' // 标签内文本颜色
    },
    // 近50场排位胜点图表
    rankingPointsGraph: {
      tooltipLineStyleColor: '#e7a60f',
      tooltipBackgroundColor: '#fff', // 标签背景色
      tooltipBorderColor: '#8b34de', // 标签边框颜色
      tooltipTextColor: '#726e84', // 标签内文本颜色
      tooltipSquareColor: '#e7a60f', // 标签内色标
      xAxisLineStyleColor: '#ebeef6', // x轴颜色
      yAxisNameTextColor: '#5f6389', // y轴标题颜色
      yAxisSplitLineColor: '#ebeef6', // y轴分割线
      yAxisAxisLineColor: '#ebeef6', // y轴轴线
      yAxisAxisLabelColor: '#5f6389', // y轴刻度
      lineStyleColor: '#5f6389', // 曲线颜色
      seriesItemStyleColor: '#e7a60f', // 交点颜色
      seriesAreaStyleColor: '95,99,137',
    },
    // 近20场排位排名图表
    rankingDistributeGraph: {
      tooltipBackgroundColor: '#fff', // 标签背景色
      tooltipBorderColor: '#8b34de', // 标签边框颜色
      tooltipTextColor: '#726e84', // 标签内文本颜色
      xAxisSplitLineColor: '#ebeef6', // x轴分割线
      xAxisLineStyleColor: '#ebeef6', // x轴颜色
      xAxisAxisLabelColor: '#5f6389', // x轴刻度
      yAxisSplitLineColor: '#ebeef6', // y轴分割线
      yAxisAxisLineColor: '#ebeef6', // y轴轴线
      yAxisAxisLabelColor: '#5f6389', // y轴刻度
      seriesLabelColor: '#5f6389', // 每个柱子上的数值
      itemStyleColor: ['#e7a60f', '#c76b4a', '#c76b4a', '#c76b4a', '#5f6389', '#5f6389', '#5f6389', '#5f6389'], // 柱子颜色
    }
  },
};
window.TFTPageTheme.getMasterDetailOption = function (key_name) {
  key_name += '';
  return this.masterDetailOptions[key_name] ? this.masterDetailOptions[key_name] : this.masterDetailOptions.dark;
};

/**
 * 本类在浏览器自带的Fetch基础上,封装的一个具有出错重复请求的类,
 * 如果接口需要轮询,请直接使用fetch,减少内存开销
 * @param url 请求地址
 * @param catchData 请求附带的设置对象
 */
var FetchRequest = /** @class */ (function () {
  function FetchRequest(url, catch_data) {
    var _this = this;
    //重复尝试次数
    this.try_times = 1;
    //重复尝试间隔时间
    this.interval_time = 1000;
    this.try_timeout = undefined;
    //传递结果的Promise
    this.res_promise = undefined;
    this.res_promise_resolve = undefined;
    this.res_promise_reject = undefined;
    //请求地址
    this.url = undefined;
    //附带发送的数据
    this.catch_data = undefined;
    this.url = url;
    this.catch_data = catch_data;
    //实例化一个传递结果的promise,并代理其resolve和reject
    this.res_promise = new Promise(function (resolve, reject) {
      _this.res_promise_resolve = resolve;
      _this.res_promise_reject = reject;
      _this.try_request();
    });
  }
  FetchRequest.prototype.try_request = function () {
    //还有尝试次数
    if (this.try_times > 0) {
      --this.try_times;
      this.request();
    }
    //没有尝试次数了,退出
    else {
      this.request_fail();
    }
  };
  FetchRequest.prototype.request = function () {
    var _this = this;
    fetch(this.url, this.catch_data).then(function (res) {
      if (res.ok) {
        _this.request_success(res);
      }
      else {
        throw new Error("服务器连通,但未正常响应请求");
      }
    })["catch"](function (error) {
      console.warn("请求", _this.url, "发生错误,继续尝试:", error);
      clearTimeout(_this.try_timeout);
      _this.try_timeout = setTimeout(function () {
        _this.try_request();
      }, _this.interval_time);
    });
  };
  /**接口请求成功 */
  FetchRequest.prototype.request_success = function (res) {
    this.res_promise_resolve(res);
    this.clear_memory();
  };
  /**接口请求失败 */
  FetchRequest.prototype.request_fail = function () {
    console.error("请求失败,重试次数耗尽", this.url);
    this.res_promise_reject("请求失败,重试次数耗尽 " + this.url);
    this.clear_memory();
  };
  /**清理内存*/
  FetchRequest.prototype.clear_memory = function () {
    clearTimeout(this.try_timeout);
    this.res_promise_resolve = undefined;
    this.res_promise_reject = undefined;
  };
  return FetchRequest;
}());
function fetchRequest(url, catchData) {
  return new FetchRequest(url, catchData).res_promise;
};
/**
 * 用于请求js文件,带错误重试
 * 放于全局作用域下加载
 * @param url 请求地址
 * @param datakey 该js加载后,会生成的全局变量名称,用来检查js是否正确加载,如js里有多个,写其中一个
 * */
function FetchDataScript(url, datakey, charset) {
  /**重复发起几次请求,直到次数耗尽或请求成功,默认4次 */
  this.tryTimes = 4;
  this.intervalTime = 200;
  this.url = url;
  this.datakey = datakey;
  /**借位的promise对象,代替原生fetch返回的promise响应 */
  this.promise = new Promise(function (resolve, reject) {
    if (window[datakey]) {
      resolve(window[datakey]);
      return;
    }
    var tryFunction = function () {
      --this.tryTimes;
      var jsonpScript = document.createElement('script');
      charset && jsonpScript.setAttribute('charset', charset);
      jsonpScript.setAttribute('src', this.url);
      jsonpScript.onerror = function (error) {
        document.getElementsByTagName('head')[0].removeChild(jsonpScript);
        if (this.tryTimes > 0) {
          console.warn('请求' + this.url + '失败,继续尝试:', error);
          setTimeout(function () {
            tryFunction();
          }.bind(this), this.intervalTime);
        } else {
          reject('请求' + this.url + '次数耗尽,请检查服务情况');
          console.error('请求' + this.url + '次数耗尽,请检查服务情况', error);
        }
      }.bind(this);
      jsonpScript.onload = function () {
        document.getElementsByTagName('head')[0].removeChild(jsonpScript);
        var data = window[datakey];
        if (!data) {
          jsonpScript.onerror();
          return;
        }
        resolve(data);
      }.bind(this);
      document.getElementsByTagName('head')[0].appendChild(jsonpScript);
    }.bind(this);
    tryFunction();
  }.bind(this));
};
function fetchDataScript(url, datakey, charset) {
  return new FetchDataScript(url, datakey, charset).promise;
};

/**
 * jsonp
 * */
function FetchJsonpScript(url, callbackName) {
  /**重复发起几次请求,直到次数耗尽或请求成功,默认2次 */
  this.tryTimes = 2;
  this.intervalTime = 500;
  this.url = url;
  /**借位的promise对象,代替原生fetch返回的promise响应 */
  this.promise = new Promise(function (resolve, reject) {
    var tryFunction = function () {
      --this.tryTimes;
      // 接收jsonp的函数
      window[callbackName] = function (res) {
        resolve(res);
        delete window[callbackName];
        document.getElementsByTagName('head')[0].removeChild(jsonpScript);
      };
      var jsonpScript = document.createElement('script');
      jsonpScript.setAttribute('src', this.url);
      jsonpScript.onerror = function (error) {
        document.getElementsByTagName('head')[0].removeChild(jsonpScript);
        if (this.tryTimes > 0) {
          console.warn('请求' + this.url + '失败,继续尝试:', error);
          setTimeout(function () {
            tryFunction();
          }.bind(this), this.intervalTime);
        } else {
          reject('请求' + this.url + '次数耗尽,请检查服务情况');
          console.error('请求' + this.url + '次数耗尽,请检查服务情况:', error);
        }
      }.bind(this);
      document.getElementsByTagName('head')[0].appendChild(jsonpScript);
    }.bind(this);
    tryFunction();
  }.bind(this));
};
function fetchJsonpScript(url, callbackName) {
  return new FetchJsonpScript(url, callbackName).promise;
};

/**
 * 用于请求返回结果如"var LWDFramework_Swoole = {}"的接口，返回相同的变量名，不做数据缓存，带错误重试
 * 放于全局作用域下加载
 * @param url 请求地址
 * @param datakey 该js加载后,会生成的全局变量名称,用来检查js是否正确加载,如js里有多个,写其中一个
 * */
function FetchVariableDataScript(url, datakey, charset) {
  /**重复发起几次请求,直到次数耗尽或请求成功,默认4次 */
  this.tryTimes = 4;
  this.intervalTime = 200;
  this.url = url;
  this.datakey = datakey;
  /**借位的promise对象,代替原生fetch返回的promise响应 */
  this.promise = new Promise(function (resolve, reject) {
    var tryFunction = function () {
      --this.tryTimes;
      var jsonpScript = document.createElement('script');
      charset && jsonpScript.setAttribute('charset', charset);
      jsonpScript.setAttribute('src', this.url);
      jsonpScript.onerror = function (error) {
        document.getElementsByTagName('head')[0].removeChild(jsonpScript);
        if (this.tryTimes > 0) {
          console.warn('请求' + this.url + '失败,继续尝试:', error);
          setTimeout(function () {
            tryFunction();
          }.bind(this), this.intervalTime);
        } else {
          reject('请求' + this.url + '次数耗尽,请检查服务情况');
          console.error('请求' + this.url + '次数耗尽,请检查服务情况', error);
        }
      }.bind(this);
      jsonpScript.onload = function () {
        var data = window[datakey];
        delete window[datakey];
        if (!data) {
          jsonpScript.onerror();
          return;
        }
        document.getElementsByTagName('head')[0].removeChild(jsonpScript);
        resolve(data);
      }.bind(this);
      document.getElementsByTagName('head')[0].appendChild(jsonpScript);
    }.bind(this);
    tryFunction();
  }.bind(this));
};
function fetchVariableDataScript(url, datakey, charset) {
  return new FetchVariableDataScript(url, datakey, charset).promise;
};

/**
 * 用于请求几天前的数据，如果前一天没有数据，则请求再往前一天的数据，最多请求到5天前
 * @param interface 请求接口
 * @param callbackName jsonp调用方法名称
 * @param masterId 大神puuid
 * @param area 大区id
 */
async function requestDataBeforeDays(interface, callbackName, area, masterId) {
  var date = window.TFTFuncLib.pushDay(new Date(), -1).split(' ')[0];
  backDate = date.replace(new RegExp("/", "g"), '');
  // console.warn(backDate)
  var resData = await window.fetchJsonpScript(masterId ? interface(backDate, callbackName, masterId, area) : interface(backDate, callbackName, area), callbackName);//'LWDFramework_Swoole'
  // console.log(resData)
  if (_.get(resData, 'code') === 0) {
    var tryRequestData = async function (resData, pushDays) {
      var rData = _.get(resData, 'data.result');
      if (!rData || !rData.length) {
        date = window.TFTFuncLib.pushDay(new Date(), pushDays).split(' ')[0];
        backDate = date.replace(new RegExp("/", "g"), '');
        // console.warn(backDate)
        var data = await window.fetchJsonpScript(masterId ? interface(backDate, callbackName, masterId, area) : interface(backDate, callbackName, area), callbackName);
        // console.log(data)
        return data;
      }
      return resData;
    }.bind(this);
    resData = await tryRequestData(resData, -2);
    resData = await tryRequestData(resData, -3);
    resData = await tryRequestData(resData, -4);
    resData = await tryRequestData(resData, -5);
  }
  if (resData && _.get(resData, 'data.result')) {
    resData.updateDate = date;
    masterId && (resData.masterId = masterId);
    area && (resData.area = area);
    return resData;
  } else {
    return Promise.reject('数据为空');
  }
};
/**
 * 接口请求成功则缓存，输出一个返回请求结果副本的函数
 * 请求失败则清空缓存可发起一个新的请求
 * @param interfaceType 请求接口类型
 * @param callbackName jsonp调用方法名称
 * @param masterId 大神puuid
 * @param area 大区id
 */
function requestDataByDays(interfaceType, callbackName, masterId, area) {
  if (!interfaceType) return Promise.reject('请求接口类型为空');
  if (!masterId || !area) return Promise.reject('参数为空');
  window.requestDataByDays[interfaceType] || (window.requestDataByDays[interfaceType] = {});

  var key = masterId + '_' + area;
  if (window.requestDataByDays[interfaceType][key]) return window.requestDataByDays[interfaceType][key];
  return window.requestDataByDays[interfaceType][key] = window.requestDataBeforeDays(window.ApiManager[interfaceType], callbackName, area, masterId).then(function (res) {
    if (!res) return Promise.reject('接口请求失败');
    if (_.get(res, 'code') !== 0) return Promise.reject(_.get(res, 'msg') + ' code:' + _.get(res, 'code'));
    var rData = _.get(res, 'data.result');
    if (!rData || !rData.length) return Promise.reject('暂无数据');
    return function () {
      return _.cloneDeep(res);
    };
  }).catch(function (err) {
    window.requestDataByDays[interfaceType][key] = null;
    console.error(err);
    return Promise.reject(err);
  });
};

/**
 * 接口请求成功则缓存
 * 请求失败则清空缓存可发起一个新的请求
 * @param interfaceType 请求接口类型
 * @param area 大区id
 */
function requestDataByDaysForRanking(interfaceType, callbackName, area) {
  if (!interfaceType) return Promise.reject('请求接口类型为空');
  if (!area) return Promise.reject('参数为空');
  window.requestDataByDaysForRanking[interfaceType] || (window.requestDataByDaysForRanking[interfaceType] = {});

  if (window.requestDataByDaysForRanking[interfaceType][area]) return window.requestDataByDaysForRanking[interfaceType][area];
  return window.requestDataByDaysForRanking[interfaceType][area] = window.requestDataBeforeDays(window.ApiManager[interfaceType], callbackName, area).then(function (res) {
    if (!res) return Promise.reject('接口请求失败');
    if (_.get(res, 'code') !== 0) return Promise.reject(_.get(res, 'msg') + ' code:' + _.get(res, 'code'));
    var rData = _.get(res, 'data.result');
    if (!rData || !rData.length) return Promise.reject('暂无数据');
    return res;
  }).catch(function (err) {
    window.requestDataByDaysForRanking[interfaceType][area] = null;
    console.error(err);
    return Promise.reject(err);
  });
};