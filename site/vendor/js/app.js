function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState,
  useEffect,
  useRef
} = React;

// ============================================================
// 1. CHESS_DB — 完整棋子資料庫(整理自《佛和》《講義》)
// ============================================================
const CHESS_DB = {
  'r_king': {
    name: '帥',
    color: 'red',
    type: 'king',
    score: 80,
    element: '金',
    virtue: '義',
    emotion: '憂慮悲觀',
    organ: '肺、支氣管、大腸、大腦中樞、神經傳導、氣血運行',
    rep: '一國君王、領袖、霸氣決斷,擁有絕對權力,天生氣度不凡',
    pos: '有見識、深謀遠慮、格局大、強烈企圖心、說話有影響力、雄心壯志、果斷',
    neg: '強烈固執、聽不進別人意見、一意孤行、自我高愛面子、強勢、不服輸、掌控慾強、容易猜忌',
    learnGood: '可整理所學變成自己的東西,學習能力不錯',
    learnBad: '聽自己大腦聲音、用過去執著認知核對、容易解讀錯誤、會挑戰老師',
    loveGood: '王見王伴侶、能降伏自己最了不起,能量平衡時感情極佳',
    loveBad: '各自堅持容易槓起來;女生卦上有將帥情感太強勢不利婚姻',
    careerGood: '能力強、有影響力、領袖力、企圖心強、有發號施令能力',
    careerBad: '不喜親自操作、野心高忽略危機、吹毛求疵、易成暴君',
    money: '有影響力且能掌權,做能發揮特質的行業會有成就;成功在他底下的人,不在他自身',
    centerHint: '處於「帥/將」能量,象徵至高尊貴與格局,重點在整合人事物。'
  },
  'b_king': {
    name: '將',
    color: 'black',
    type: 'king',
    score: 80,
    element: '金',
    virtue: '義',
    emotion: '憂慮悲觀',
    organ: '肺、支氣管、大腸、大腦中樞、神經傳導、氣血運行',
    rep: '一國君王、領袖、掌權者,對局面有絕對掌控力',
    pos: '掌握實權、有原則、說一不二、行動果決',
    neg: '剛過易折的固執、霸氣壓人、容易與人槓上、自我意識強',
    learnGood: '能把學到的內容整理變成自己的東西',
    learnBad: '常以過去執著認知核對所學,容易解讀偏差',
    loveGood: '王見王、勢均力敵的伴侶',
    loveBad: '各有執著,容易爭執槓起來,黑將更顯外在強硬',
    careerGood: '掌握實權、領導群眾、發號施令',
    careerBad: '剛愎自用、不易聽進建議',
    money: '有實權能掌控資源,適合需要果斷決策的行業',
    centerHint: '處於「將」能量,代表掌握實權與原則,但要留意「剛過易折」的固執。'
  },
  'r_guard': {
    name: '仕',
    color: 'red',
    type: 'guard',
    score: 60,
    element: '金',
    virtue: '義',
    emotion: '憂慮悲觀',
    organ: '肺、支氣管、呼吸系統、鼻子過敏、大腸、皮膚',
    rep: '行政院長、輔佐者,士帶文昌,允文允武,讀書人也能帶兵',
    pos: '聰明、有想法、做事有方法、邏輯推理能力強、重義氣、有指揮與發令的氣勢',
    neg: '擇善固執、有時候很龜毛、自以為是、很多自我堅持、面子掛不住',
    learnGood: '學習能力強,善思考,有辯論能力',
    learnBad: '常以過去學到的已知核對老師所說,有錯漏框架',
    loveGood: '士好朋友格(靈魂伴侶)上下最佳,天賜良緣,百年好合',
    loveBad: '左右彼此有想法,口角稍多',
    careerGood: '有方法、組織能力強、整合力,能帶貴人相助',
    careerBad: '不容易跟比他更專業者主管領導,有較多的要慮',
    money: '運籌帷幄能力好,生意可以做比較大,成就大格局事業'
  },
  'b_guard': {
    name: '士',
    color: 'black',
    type: 'guard',
    score: 60,
    element: '金',
    virtue: '義',
    emotion: '憂慮悲觀',
    organ: '肺、支氣管、呼吸系統、鼻子過敏、大腸、皮膚',
    rep: '輔佐者、規劃者,講究規矩與邏輯',
    pos: '滴水不漏、防禦周全、邏輯清晰、執行力強',
    neg: '太過保守、不易跳脫框架、過度謹慎',
    learnGood: '邏輯思考強,適合系統化學習',
    learnBad: '不易接受新方法',
    loveGood: '士好朋友格(靈魂伴侶),上下最佳',
    loveBad: '左右口角稍多',
    careerGood: '組織嚴謹、計劃周詳',
    careerBad: '過度規矩可能錯失機會',
    money: '穩定但保守,適合有制度的事業'
  },
  'r_minister': {
    name: '相',
    color: 'red',
    type: 'minister',
    score: 40,
    element: '火',
    virtue: '禮',
    emotion: '情緒起伏',
    organ: '心臟、心血管、血壓、心悸、心跳、小腸、舌頭、火氣躁',
    rep: '宰相、慈悲帶福之人,內政部長',
    pos: '舉止穩重、體貼、善察覺別人的需求、愛照顧別人、包容心、慈悲心、溫和',
    neg: '走路比較慢、被動不積極、容易有惰性、喜歡坐而言勝過起而行、情緒起伏大',
    learnGood: '學習能力也挺好的、足智多謀',
    learnBad: '學習積極度不夠、懶惰被動、需要共修夥伴',
    loveGood: '上下左右配對皆佳,如同學或修行夥伴',
    loveBad: '感情上有情緒起伏',
    careerGood: '工作能力不錯、可名利雙收、適合不動產或公務',
    careerBad: '行動力相對較弱、被動、積極度不夠',
    money: '比較不積極,但運氣帶來的收穫不錯,適合穩定收入或不動產'
  },
  'b_minister': {
    name: '象',
    color: 'black',
    type: 'minister',
    score: 40,
    element: '火',
    virtue: '禮',
    emotion: '情緒起伏',
    organ: '心臟、心血管、血壓、心悸、小腸、舌頭',
    rep: '修行人、內在探索者',
    pos: '注重內在修行、平靜、心地寬厚',
    neg: '對世俗較無感、行動較慢',
    learnGood: '修行緣分深,適合靜心學習',
    learnBad: '對外界事務較被動',
    loveGood: '修行伴侶,有共同心靈追求',
    loveBad: '世俗互動較少',
    careerGood: '適合修行類、文化類事業',
    careerBad: '對競爭性事業較無興趣',
    money: '靜心可帶來財富,不為錢而忙'
  },
  'r_rook': {
    name: '俥',
    color: 'red',
    type: 'rook',
    score: 30,
    element: '木',
    virtue: '仁',
    emotion: '壓抑、浮躁、憤怒',
    organ: '肝(免疫系統)、膽(消化系統)、筋、目(眼睛)',
    rep: '人格上格、高階主管、群裡聲音最大',
    pos: '積極、行動力強、敢衝敢冒險、有主見、肯奮鬥、膽識過人、直來直往、領導力',
    neg: '我執重、急性子沒耐心、自我主觀、龜毛挑剔、相處要以柔克剛、口快易傷人',
    learnGood: '學習主動、可整合所學變自己的',
    learnBad: '自我意識強,只用自己主觀想法學習,較不易變通',
    loveGood: '車好朋友格:歡喜冤家伴侶',
    loveBad: '個性比較直接,口角辨來辨去',
    careerGood: '執行力強、敢衝敢冒險、有領導力,適合帶領團隊或自己經營',
    careerBad: '不喜被約束,自己經營比合夥佳',
    money: '帶頭衝鋒,經營能力佳,但要注意大好大壞'
  },
  'b_rook': {
    name: '車',
    color: 'black',
    type: 'rook',
    score: 30,
    element: '木',
    virtue: '仁',
    emotion: '壓抑、浮躁、憤怒',
    organ: '肝、膽、筋、目',
    rep: '效率派、講求結果、人裡聲音大',
    pos: '速度快、解決問題能力強、實事求是',
    neg: '心直口快易傷人、不耐繁瑣',
    learnGood: '學什麼都快',
    learnBad: '不夠細緻',
    loveGood: '車好朋友格,歡喜冤家',
    loveBad: '常因直率傷及對方',
    careerGood: '高效執行、解決問題能力強',
    careerBad: '不適合需要慢工出細活的事業',
    money: '速度與效率帶來收益'
  },
  'r_knight': {
    name: '傌',
    color: 'red',
    type: 'knight',
    score: 20,
    element: '木',
    virtue: '仁',
    emotion: '壓抑、浮躁、憤怒',
    organ: '怒傷肝、關節筋絡、骨折、跌倒、輪椅、癱瘓',
    rep: '中階主管、業務、遊走人群,巡迴各地',
    pos: '聰明善巧多、靈巧、口才不錯、能言善道、表達力強、會察言觀色、看人說人話',
    neg: '做事容易沒效率、暗忙、事倍功半、想做有所作為但容易好管閒事(在位置1)',
    learnGood: '學習興趣高、學習能力比較弱、效率失佳',
    learnBad: '靠自己學習效率率會不好',
    loveGood: '馬好朋友格(情人伴侶):看到對方會想要去吃,心頓浪漫的晚餐到處走走',
    loveBad: '兩邊分隔,適合談戀愛不適合結婚',
    careerGood: '靠自己的能力做事不太好,要靠人脈資源整合,人脈轉換脈',
    careerBad: '在位置1(中間)難以得到有效擴展',
    money: '馬走四方,要跑才會有錢賺,不動則停滯,業務性質口才相關工作'
  },
  'b_knight': {
    name: '馬',
    color: 'black',
    type: 'knight',
    score: 20,
    element: '木',
    virtue: '仁',
    emotion: '壓抑、浮躁、憤怒',
    organ: '關節、骨折、肝',
    rep: '為了目標奔波、業務、需四處走動',
    pos: '靈活、適應力強、人脈廣',
    neg: '心軟猶豫、容易做爛好人',
    learnGood: '學興趣廣',
    learnBad: '不夠專精',
    loveGood: '馬好朋友格,情人伴侶',
    loveBad: '心軟易陷入情感糾葛',
    careerGood: '人脈整合、業務能力強',
    careerBad: '在中間難以發揮、易做沒效率的事',
    money: '奔波見財,業務性質工作'
  },
  'r_cannon': {
    name: '炮',
    color: 'red',
    type: 'cannon',
    score: 15,
    element: '水',
    virtue: '智',
    emotion: '恐懼、疑慮',
    organ: '腎臟、婦科、內分泌、膀胱、攝護腺、乳房、卵巢、泌尿系統、甲狀腺、牙齒、聽覺',
    rep: '顏值高、有自己的氣質和魅力,帥哥美女',
    pos: '人緣佳、男的帥女的美、頭腦靈活、敏感度高、創意點子小聰明多、有善巧有智慧、直覺強',
    neg: '很想突破想想做、很想翻身、一步登天、容易好高騖遠、容易投機、白日夢愛幻想、不踏實',
    learnGood: '對學習有想望、很喜歡學習、學習想有所成就',
    learnBad: '能力比較低不好之上、學以致用的能力比較弱',
    loveGood: '炮好朋友格:情慾伴侶(很想要帶他去開房間),隔山為正桃花',
    loveBad: '左右斜對為偏桃花,情慾能量強',
    careerGood: '聰明、鬼點子多、創意、變通、突破、擴展',
    careerBad: '不容易腳踏實地,容易好高騖遠、眼高手低',
    money: '不是靠苦勞與努力,是運用智慧聰明善巧;適合流動性與時機性的事業'
  },
  'b_cannon': {
    name: '包',
    color: 'black',
    type: 'cannon',
    score: 15,
    element: '水',
    virtue: '智',
    emotion: '恐懼、疑慮',
    organ: '腎臟、膀胱、婦科、攝護腺、骨頭、耳、內分泌系統',
    rep: '渴望被關注、創意豐富、情緒起伏',
    pos: '創意十足、善於變通、敏感',
    neg: '空想、沒安全感、情緒不穩',
    learnGood: '腦袋靈活',
    learnBad: '不夠紮實',
    loveGood: '包好朋友格,情慾伴侶',
    loveBad: '情緒能量強,左右斜對偏桃花',
    careerGood: '創意、突破',
    careerBad: '在中間難以發揮、易好高騖遠',
    money: '靠頭腦賺錢,流動性與時機性事業'
  },
  'r_pawn': {
    name: '兵',
    color: 'red',
    type: 'pawn',
    score: 10,
    element: '土',
    virtue: '信',
    emotion: '思慮、在意、緊張',
    organ: '脾(免疫系統)、胃(消化系統)、腸胃道、口腔、肌肉',
    rep: '阿兵哥、踏實感與安全感最重要、一步一腳印往前走、團結力量大',
    pos: '落地踏實、腳踏實地、務實、穩健、注重落地執行、勇往直前、團結力量大、安全感重、累積經驗、不愛投機',
    neg: '安於現狀、不喜歡挑戰、比較保守、謹慎、對人事物容易在意、容易胡思亂想',
    learnGood: '腳踏實地有效學習、一步一腳印、好學生,可有效學習老師或課本所教的',
    learnBad: '一個口令一個動作,缺乏彈性不易變通',
    loveGood: '兵好朋友格:老夫老妻,感情踏實穩定不易變心',
    loveBad: '浪漫激情比較少',
    careerGood: '腳踏實地、落地執行一步一腳印、有條有理、務實、穩健保守',
    careerBad: '缺乏企圖心、重守業、安於現狀',
    money: '兵卒屬於現金財庫,有理想不投機,一步一腳印去累積財富,一借錢或貨款劇情就來'
  },
  'b_pawn': {
    name: '卒',
    color: 'black',
    type: 'pawn',
    score: 10,
    element: '土',
    virtue: '信',
    emotion: '思慮、在意、緊張',
    organ: '脾、胃、腸胃道、口腔、肌肉',
    rep: '保守踏實的小兵',
    pos: '穩健、不冒險、安全感',
    neg: '較被動、易陷入安於現狀',
    learnGood: '紮實學習',
    learnBad: '欠缺主動',
    loveGood: '卒好朋友格,老夫老妻',
    loveBad: '激情少',
    careerGood: '穩紮穩打、守住成果',
    careerBad: '缺乏突破力',
    money: '穩定累積,長期才見效益'
  }
};

// 同字異色對應
const FRIEND_MAP = {
  '帥': '將',
  '將': '帥',
  '仕': '士',
  '士': '仕',
  '相': '象',
  '象': '相',
  '俥': '車',
  '車': '俥',
  '傌': '馬',
  '馬': '傌',
  '炮': '包',
  '包': '炮',
  '兵': '卒',
  '卒': '兵'
};

// ============================================================
// 2. 位置語意
//    單卦:不問婚姻,只用性別區分左右(伴侶+同性平輩混合敘述)
//    命盤:性別 × 婚姻 4 種變體(更精細)
// ============================================================
const POSITION_DEFS_SINGLE = {
  male: {
    center: '您自己',
    left: '妻子/女朋友/女性平輩朋友/女同事',
    right: '兄弟/男性平輩朋友/男同事',
    up: '父母/長輩/上司長官',
    down: '兒女/晚輩/下屬'
  },
  female: {
    center: '您自己',
    left: '姊妹/女性平輩朋友/女同事',
    right: '丈夫/男朋友/男性平輩朋友/男同事',
    up: '父母/長輩/上司長官',
    down: '兒女/晚輩/下屬'
  }
};
const POSITION_DEFS_CHART = {
  male_single: {
    center: '您自己',
    left: '姊妹/女性平輩朋友/同事',
    right: '兄弟/男性平輩朋友/同事',
    up: '父母/長輩/上司長官',
    down: '兒女/晚輩/下屬'
  },
  male_married: {
    center: '您自己',
    left: '妻子/女性平輩朋友/同事',
    right: '兄弟/男性平輩朋友/同事',
    up: '父母/長輩/上司長官',
    down: '兒女/晚輩/下屬'
  },
  female_single: {
    center: '您自己',
    left: '姊妹/女性平輩朋友/同事',
    right: '男友/男性平輩朋友/同事',
    up: '父母/長輩/上司長官',
    down: '兒女/晚輩/下屬'
  },
  female_married: {
    center: '您自己',
    left: '姊妹/女性平輩朋友/同事',
    right: '丈夫/男性平輩朋友/同事',
    up: '公婆/長輩/上司長官',
    down: '兒女/晚輩/下屬'
  }
};
// 兼容舊代碼(已被 single 與 chart 兩套取代)
const POSITION_DEFS = POSITION_DEFS_CHART;

// 卦位簡稱(顯示在棋子下方)
const POSITION_LABELS = {
  center: '本卦',
  left: '左輔',
  right: '右弼',
  up: '天時',
  down: '地利'
};

// ============================================================
// 3. COMBAT — 走法、可吃、保護、牽制、收穫付出
// ============================================================
const ADJACENT = {
  center: ['left', 'right', 'up', 'down'],
  left: ['center'],
  right: ['center'],
  up: ['center'],
  down: ['center']
};
const OPPOSITE = {
  left: 'right',
  right: 'left',
  up: 'down',
  down: 'up',
  center: null
};

// 相鄰象限(LU/LD/RU/RD)— 5 棋十字版的「斜對」定義
const ADJACENT_QUADRANTS = [['left', 'up'], ['left', 'down'], ['right', 'up'], ['right', 'down']];

// attacker (在 fromPos) 是否可以吃 target (在 toPos)
const canAttack = (fromPos, toPos, attacker, all) => {
  if (fromPos === toPos) return false;
  const target = all[toPos];
  // 空棋位不能攻擊也不能被攻擊(命盤的「下」位佔位)
  if (!attacker || !target || attacker.color === '_empty' || target.color === '_empty') return false;

  // 仕士不能吃帥將
  if (attacker.type === 'guard' && target.type === 'king') return false;
  // 相象不能吃帥將/仕士
  if (attacker.type === 'minister' && (target.type === 'king' || target.type === 'guard')) return false;
  switch (attacker.type) {
    case 'knight':
      // 馬傌走斜
      if (fromPos === 'center') {
        // 馬在中間吃不到任何棋子(《講義》原文,2026-05-05 用戶澄清)
        return false;
      }
      if (toPos === 'center') return true;
      return ADJACENT_QUADRANTS.some(([a, b]) => a === fromPos && b === toPos || b === fromPos && a === toPos);
    case 'cannon':
      // 炮包隔山
      if (fromPos === 'center') return false; // 炮在中間沒有山可打
      return toPos === OPPOSITE[fromPos];
    // 隔中央打到對面
    case 'pawn':
      // 兵卒只進不退:可往「上 / 左 / 右」,不可往下
      if (fromPos === 'center') {
        // 中央可吃上/左/右,不可吃下(往下=退)
        return ['left', 'right', 'up'].includes(toPos);
      }
      if (fromPos === 'up') {
        // 上方棋若要吃中央=往下=退,禁止
        return false;
      }
      // 左/右/下 棋子吃中央(往右/左/上=進),允許
      return toPos === 'center';
    default:
      // 帥將/仕士/相象/俥車:上下左右
      return ADJACENT[fromPos]?.includes(toPos) ?? false;
  }
};

// 是否有同色友軍鄰接保護
const hasProtector = (pos, all) => {
  const piece = all[pos];
  const neighbors = ADJACENT[pos] || [];
  return neighbors.some(n => {
    const ally = all[n];
    return ally && ally.color === piece.color && n !== pos;
  });
};

// 牽制:攻擊方若會被反吃同色棋
const isPinned = (attackerPos, all) => {
  const attacker = all[attackerPos];
  for (const [pos, piece] of Object.entries(all)) {
    if (piece.color === attacker.color) continue;
    if (canAttack(pos, attackerPos, piece, all)) return true;
  }
  return false;
};

// 計算收穫 / 付出
const computeScores = pieces => {
  const myColor = pieces.center?.color;
  let harvest = 0,
    sacrifice = 0;
  const harvestDetail = [],
    sacrificeDetail = [];
  for (const [fromPos, attacker] of Object.entries(pieces)) {
    if (!attacker || attacker.color === '_empty') continue;
    for (const [toPos, target] of Object.entries(pieces)) {
      if (fromPos === toPos) continue;
      if (!target || target.color === '_empty') continue;
      if (attacker.color === target.color) continue;
      if (!canAttack(fromPos, toPos, attacker, pieces)) continue;
      const protected_ = hasProtector(toPos, pieces);
      const pinned_ = isPinned(fromPos, pieces);
      const halfOnly = protected_ || pinned_;
      const score = target.score * (halfOnly ? 0.5 : 1);
      const detail = {
        from: fromPos,
        to: toPos,
        attacker: attacker.name,
        target: target.name,
        score,
        half: halfOnly,
        reason: protected_ ? '對方有保護' : pinned_ ? '我方有牽制' : ''
      };
      if (attacker.color === myColor) {
        harvest += score;
        harvestDetail.push(detail);
      } else {
        sacrifice += score;
        sacrificeDetail.push(detail);
      }
    }
  }
  return {
    harvest,
    sacrifice,
    harvestDetail,
    sacrificeDetail
  };
};

// ============================================================
// 4. PATTERNS — 23 個格局
// ============================================================
const PATTERNS = [{
  id: 'good_friend',
  name: '好朋友格',
  detect(p) {
    const c = p.center;
    const friendName = FRIEND_MAP[c.name];
    if (!friendName) return null;
    let count = 0;
    // 中央 vs 外圍同字異色
    if (c.type === 'knight') {
      // 馬傌需斜對 → 在十字版以「相鄰象限」對位代替
      for (const [a, b] of ADJACENT_QUADRANTS) {
        const A = p[a],
          B = p[b];
        if (A.name === '馬' && B.name === '傌') count++;else if (A.name === '傌' && B.name === '馬') count++;
      }
    } else if (c.type === 'cannon') {
      // 包炮需相隔(對面)
      if (p.up.name === FRIEND_MAP[p.down.name] && p.up.color !== p.down.color && p.up.type === 'cannon') count++;
      if (p.left.name === FRIEND_MAP[p.right.name] && p.left.color !== p.right.color && p.left.type === 'cannon') count++;
    } else {
      for (const dir of ['left', 'right', 'up', 'down']) {
        if (p[dir].name === friendName && p[dir].color !== c.color) count++;
      }
    }
    return count > 0 ? {
      count
    } : null;
  },
  narrate(m, p) {
    const c = p.center;
    const adj = c.type === 'guard' ? '士仕為最佳的好朋友(靈魂伴侶)' : c.type === 'minister' ? '象相為次佳的好朋友(修行夥伴)' : c.type === 'rook' ? '車俥相見容易各持己見,但情誼深厚' : c.type === 'pawn' ? '兵卒踏實的好朋友,如老夫老妻' : c.type === 'knight' ? '馬傌斜對,多了美麗與浪漫的情感' : c.type === 'cannon' ? '包炮相隔,多了渴望與情慾的能量' : c.type === 'king' ? '帥將王見王,勢均力敵' : '同字異色的好朋友';
    return `※ 好朋友格:${adj}。\n擁有好朋友格代表您不會被全部吃光、也不會通吃別人,能互得好處。重點在於「收穫大於付出」還是「付出大於收穫」— 看分數即知。`;
  }
}, {
  id: 'good_relations',
  name: '好人緣格',
  detect(p) {
    for (const [a, b] of ADJACENT_QUADRANTS) {
      const A = p[a],
        B = p[b];
      if (A.name === '馬' && B.name === '傌' || A.name === '傌' && B.name === '馬') {
        return {
          positions: [a, b]
        };
      }
    }
    return null;
  },
  narrate(m, p) {
    return `※ 好人緣格:相鄰象限位置出現馬傌組合。代表您的人脈格不錯,有緣份在外的助力,善用社交手腕,機會藏在人群的流動中。`;
  }
}, {
  id: 'mutual_admire',
  name: '互相欣賞格',
  detect(p) {
    const all = Object.values(p);
    const has = (n, c) => all.some(x => x.name === n && x.color === c);
    if (has('士', 'black') && has('俥', 'red') || has('仕', 'red') && has('車', 'black')) {
      return {};
    }
    return null;
  },
  narrate() {
    return `※ 互相欣賞格(特殊關係親密格):卦象出現黑士配紅俥,或紅仕配黑車的組合。代表您與對方相互欣賞、能量共振,但仍可能有意見上的互吃。`;
  }
}, {
  id: 'drain',
  name: '消耗格',
  detect(p) {
    const map = {};
    Object.values(p).forEach(x => {
      const k = `${x.name}_${x.color}`;
      map[k] = (map[k] || 0) + 1;
    });
    const drained = Object.entries(map).filter(([_, n]) => n >= 2).map(([k]) => k.split('_')[0]);
    return drained.length ? {
      pieces: drained
    } : null;
  },
  narrate(m, p) {
    const c = p.center;
    const drains = m.pieces.map(name => {
      const sample = Object.values(p).find(x => x.name === name);
      const sameColor = sample.color === c.color;
      return `【${name}】(${sameColor ? '與您同色 → 自己消耗' : '與您不同色 → 別人消耗'})`;
    }).join('、');
    return `※ 消耗格:${drains}。\n與中間同色的消耗代表自己內耗;與中間不同色的消耗代表外人消耗您。能量場中存在內耗或拖累。`;
  }
}, {
  id: 'destroy',
  name: '破壞格',
  detect(p) {
    const map = {};
    Object.values(p).forEach(x => {
      map[x.name] = map[x.name] || {
        red: 0,
        black: 0
      };
      map[x.name][x.color]++;
    });
    for (const name in map) {
      const {
        red,
        black
      } = map[name];
      if (red === 1 && black === 2 || red === 2 && black === 1) {
        return {
          piece: name,
          redCount: red,
          blackCount: black
        };
      }
    }
    return null;
  },
  narrate(m) {
    return `※ 破壞格:同字一黑兩紅(或一紅兩黑)的組合,本來是一對好朋友,卻因消耗而造成破壞。\n與您同色的消耗 → 因自己消耗造成的破壞格;與您不同色的消耗 → 因他人消耗造成的破壞格。`;
  }
}, {
  id: 'devour_all',
  name: '通吃格',
  detect(p) {
    // 陰陽不協調(4:1 / 1:4)時不視為通吃,以陰陽不協調的解讀為主
    const reds = Object.values(p).filter(x => x.color === 'red').length;
    if (reds === 1 || reds === 4) return null;
    const myColor = p.center.color;
    const others = ['left', 'right', 'up', 'down'].filter(d => p[d] && p[d].color !== '_empty' && p[d].color !== myColor);
    if (others.length === 0) return null;
    const myPositions = Object.entries(p).filter(([_, x]) => x.color === myColor).map(([k]) => k);
    const allDevoured = others.every(t => {
      return myPositions.some(fp => {
        if (!canAttack(fp, t, p[fp], p)) return false;
        if (hasProtector(t, p)) return false;
        if (isPinned(fp, p)) return false;
        return true;
      });
    });
    return allDevoured ? {
      count: others.length
    } : null;
  },
  narrate() {
    return `※ 通吃格:對方所有外圍棋子都沒有保護或牽制,我們可以全部吃光。\n※ 注意:通吃別人 — 一開始會不錯,但最後容易歸零、又得重來。`;
  }
}, {
  id: 'devoured',
  name: '被通吃格',
  detect(p) {
    // 陰陽不協調時不視為被通吃
    const reds = Object.values(p).filter(x => x.color === 'red').length;
    if (reds === 1 || reds === 4) return null;
    const myColor = p.center.color;
    for (const [fp, atk] of Object.entries(p)) {
      if (atk.color === myColor) continue;
      if (canAttack(fp, 'center', atk, p) && !hasProtector('center', p) && !isPinned(fp, p)) {
        return {
          byPos: fp,
          byPiece: atk.name
        };
      }
    }
    return null;
  },
  narrate(m) {
    return `※ 被通吃格:中間自己沒有保護,被對方完整吃掉。\n代表外在不可控的因素或人事物,讓努力歸零、白費,甚至負債。需特別留意身邊的人事環境。`;
  }
}, {
  id: 'career',
  name: '事業格',
  detect(p) {
    const names = Object.values(p).map(x => x.name);
    const has = (...arr) => arr.some(n => names.includes(n));
    if (has('車', '俥') && has('馬', '傌') && has('炮', '包')) return {};
    return null;
  },
  narrate() {
    return `※ 事業格:卦中同時出現車、馬、包(不論顏色)。\n代表您具備認真做事業的態度與行動力,雖較忙碌但這是充實且具開創性的時期。但不利於感情卦(因認真導向會壓過浪漫)。`;
  }
}, {
  id: 'wealth',
  name: '富貴格',
  detect(p) {
    const names = Object.values(p).map(x => x.name);
    const has = (...arr) => arr.some(n => names.includes(n));
    if (has('帥', '將') && has('仕', '士') && has('相', '象')) return {};
    return null;
  },
  narrate() {
    return `※ 富貴格:卦中同時出現將、士、象(不論顏色)。\n代表貴人運極佳,有人會幫您做事,是天生好命的格局。但有時會因此自己行動力較弱,需主動發揮。`;
  }
}, {
  id: 'dilemma',
  name: '困擾格',
  detect(p) {
    const map = {};
    Object.values(p).forEach(x => {
      map[x.name] = map[x.name] || {
        red: 0,
        black: 0
      };
      map[x.name][x.color]++;
    });
    let pairs = 0;
    for (const k in map) {
      if (map[k].red >= 1 && map[k].black >= 1) pairs++;
      // 友軍對(兵+卒, 馬+傌, 包+炮 等)
      const friend = FRIEND_MAP[k];
      if (friend && map[friend]) {
        // 計入對應(避免重複計)
        // 不需要,因為 FRIEND_MAP 鏡射時會被當不同名字
      }
    }
    return pairs >= 2 ? {
      pairs
    } : null;
  },
  narrate() {
    return `※ 困擾格:出現兩對好朋友。代表您可能會因人情考量或其他因素而造成決定上的困擾,容易在多個選項間搖擺。`;
  }
}, {
  id: 'three_united',
  name: '三人同心格',
  detect(p) {
    const names = Object.values(p).map(x => x.name);
    const reds = names.filter(n => n === '兵').length;
    const blacks = names.filter(n => n === '卒').length;
    if (reds >= 3) return {
      kind: '兵',
      count: reds
    };
    if (blacks >= 3) return {
      kind: '卒',
      count: blacks
    };
    return null;
  },
  narrate(m) {
    return `※ 三人同心格:出現${m.count}支【${m.kind}】。代表您已準備好,可以把一件事情做得很好,能力如同一支車/俥,信手拈來。`;
  }
}, {
  id: 'cross_help',
  name: '十字天助格',
  detect(p) {
    const c = p.center.color;
    if (p.left.color === c && p.right.color === c) return {
      axis: 'horizontal'
    };
    if (p.up.color === c && p.down.color === c) return {
      axis: 'vertical'
    };
    return null;
  },
  narrate(m) {
    return `※ 十字天助格:中央與其${m.axis === 'horizontal' ? '左右(123 同色)' : '上下(145 同色)'}同色。代表會有天助的能量,逢凶能化吉。`;
  }
}, {
  id: 'umbrella',
  name: '雨傘格',
  detect(p) {
    const c = p.center.color;
    // 234 同色:中(1)+左(2)+右(3)+上(4) 同色,下(5)不同
    if (c === p.left.color && c === p.right.color && c === p.up.color && c !== p.down.color) {
      return {
        variant: '234同色'
      };
    }
    return null;
  },
  narrate() {
    return `※ 雨傘格(234 同色):像雨傘的形狀,有天助。如同在父母的照顧下安定但有時受限 — 雨傘可遮陽避雨,但看不到天空,心情有時會悶。`;
  }
}, {
  id: 'victory',
  name: '勝利格',
  detect(p) {
    const c = p.center.color;
    // 235 同色:中(1)+左(2)+右(3) 同色,上下不同色
    if (c === p.left.color && c === p.right.color && c !== p.up.color && c !== p.down.color) {
      return {
        variant: '235同色'
      };
    }
    return null;
  },
  narrate() {
    return `※ 勝利格(235 同色):像勝利的 V 字。代表您想做的事較容易成局,是因自己的因素或能力 → 容易成局。`;
  }
}, {
  // 修行緣分格(2026-05-05 依《命盤解說》與用戶澄清新增)
  // 條件:用戶自己的(同中央色)馬/傌/炮/包,成功吃到對方(異中央色)棋子
  //       「成功吃」= canAttack 且目標無保護、攻擊方無牽制
  // 意義:用戶自身具備靈動/突擊的能量並對外發揮,與佛法修行的「精進」有同義
  id: 'spiritual_affinity',
  name: '修行緣分格',
  detect(p) {
    const myColor = p.center?.color;
    if (!myColor || myColor === '_empty') return null;
    const matches = [];
    for (const fromPos of ['left', 'right', 'up', 'down']) {
      const piece = p[fromPos];
      if (!piece || piece.color === '_empty') continue;
      if (piece.color !== myColor) continue; // 必須是自己
      if (!['knight', 'cannon'].includes(piece.type)) continue;
      // 檢查是否能吃任何對方棋子
      for (const toPos of Object.keys(p)) {
        if (toPos === fromPos) continue;
        const target = p[toPos];
        if (!target || target.color === '_empty') continue;
        if (target.color === myColor) continue; // 同色不算對方
        if (!canAttack(fromPos, toPos, piece, p)) continue;
        if (hasProtector(toPos, p)) continue;
        if (isPinned(fromPos, p)) continue;
        matches.push({
          from: fromPos,
          attacker: piece.name,
          target: target.name
        });
      }
    }
    return matches.length ? {
      matches
    } : null;
  },
  narrate(m) {
    const list = m.matches.slice(0, 2).map(x => `${x.attacker}吃${x.target}`).join('、');
    return `※ 修行緣分格:您自身的【${list}】成功擊中對方。\n馬/傌、炮/包是靈動且能跨越的能量,代表您具備「精進心」與「跨越障礙」的本質 ─ 修行緣分深、適合靜心學習。\n收穫不必貪多,專注於有興趣的修行領域,深耕即是。`;
  }
}, {
  id: 'romance',
  name: '桃花格',
  detect(p) {
    // 正桃花:2&3 或 4&5 為「包&炮」「包+帥」「炮+將」組合
    const checkPair = (a, b) => {
      const ns = [a.name, b.name];
      const pos = ns.includes('包') && ns.includes('炮');
      const pa = ns.includes('包') && ns.includes('帥');
      const cw = ns.includes('炮') && ns.includes('將');
      return pos || pa || cw;
    };
    if (checkPair(p.left, p.right)) return {
      type: '正',
      axis: '左右'
    };
    if (checkPair(p.up, p.down)) return {
      type: '正',
      axis: '上下'
    };
    // 偏桃花:其他位置出現包/炮(且非中央)
    const outers = ['left', 'right', 'up', 'down'].map(d => p[d]);
    const hasC = outers.some(x => x.name === '炮');
    const hasB = outers.some(x => x.name === '包');
    if (hasC || hasB) return {
      type: '偏'
    };
    return null;
  },
  narrate(m) {
    if (m.type === '正') {
      return `※ 桃花格(正桃花):在${m.axis}出現包炮、包帥、炮將的組合。代表正緣、正桃花,容易遇到合適的對象。`;
    }
    return `※ 桃花格(偏桃花):卦中出現包/炮但非正位。屬偏桃花,有桃花機運但需留意性慾與情感的平衡,可能來得快去得也快。`;
  }
}, {
  id: 'separation',
  name: '分離格',
  detect(p) {
    // 同字異色,左右或上下分開(包炮除外)
    const check = (a, b, axis) => {
      if (a.type === 'cannon' || b.type === 'cannon') return null;
      if (a.color === b.color) return null;
      if (a.name === b.name) return {
        axis,
        name: a.name
      };
      if (FRIEND_MAP[a.name] === b.name) return {
        axis,
        name: `${a.name}+${b.name}`
      };
      return null;
    };
    return check(p.left, p.right, '左右') || check(p.up, p.down, '上下');
  },
  narrate(m) {
    return `※ 分離格:同字異色的好朋友,在${m.axis}分開出現(${m.name})。代表您與對方在價值觀、做事道理上會有不同,期待跟結果容易有落差,有事與願違的可能。`;
  }
}, {
  id: 'depressed_or_starsmoon',
  name: '鬱卒/眾星拱月格',
  detect(p) {
    const c = p.center.color;
    const outers = ['left', 'right', 'up', 'down'].map(d => p[d].color);
    if (outers.every(x => x !== c)) return {
      centerColor: c
    };
    return null;
  },
  narrate(m, p, ctx) {
    if (ctx.harvest > ctx.sacrifice) {
      const view = m.centerColor === 'red' ? '外人很看好' : '外人不看好';
      return `※ 眾星拱月格:中間是唯一不同色,且收穫大於付出。${view}您的狀態,運勢順利、收穫大,但仍可能有心情鬱悶的狀況需自我調適。`;
    }
    return `※ 鬱卒格:中間是唯一不同色,且收穫小於付出。表示外人看不出您的狀況,但內心其實很鬱悶,壓力很大。`;
  }
}, {
  id: 'lone_flower',
  name: '一枝獨秀格',
  detect(p) {
    const c = p.center;
    const outers = ['left', 'right', 'up', 'down'].filter(d => p[d] && p[d].color !== '_empty');
    const diff = outers.filter(d => p[d].color !== c.color);
    if (diff.length === 1) return {
      dir: diff[0],
      piece: p[diff[0]]
    };
    return null;
  },
  narrate(m) {
    const dirName = {
      left: '左',
      right: '右',
      up: '上',
      down: '下'
    }[m.dir];
    const piece = m.piece;
    let extra = '';
    if (piece.type === 'cannon' || piece.type === 'knight') {
      extra = `\n※ 唯一不同色棋是【${piece.name}】(包炮馬傌),代表我們自己一定會被吃。`;
    }
    let posHint = '';
    if (m.dir === 'up') posHint = '可探討是否有長輩或祖先的問題';else if (m.dir === 'down') posHint = '可探討是否有晚輩或嬰靈的問題';else posHint = '可探討是否有無緣未出生或往生平輩的問題';
    return `※ 一枝獨秀格:唯一不同色棋子(【${piece.name}】)在${dirName}方位。\n※ 代表會犯小人、容易交流到外來的負能量或靈體(容易卡陰)。${extra}\n${posHint}\n※ 小人並不一定是有用心的壞人,而是因他們而有所損失。`;
  }
}, {
  id: 'all_same_color',
  name: '全黑/全紅格(悔恨格)',
  detect(p) {
    const colors = Object.values(p).filter(x => x && x.color !== '_empty').map(x => x.color);
    if (colors.length === 0) return null;
    if (colors.every(c => c === 'red')) return {
      color: 'red'
    };
    if (colors.every(c => c === 'black')) return {
      color: 'black'
    };
    return null;
  },
  narrate(m) {
    return `※ ${m.color === 'red' ? '全紅' : '全黑'}格(悔恨格):五支同色。\n有三種可能:\n  1. 各方面得到的結果都不如內在想要的(預期與結果落差)\n  2. 不會做或不會成 → 不論好壞\n  3. 未連結到指導靈 → 可再卜一卦\n意識顯化動能不足,所以就算有福報也不易示現。建議療癒淨化,讓意識顯化動能補足。`;
  }
}, {
  id: 'wise_ruler',
  name: '明君格',
  detect(p) {
    const c = p.center;
    if (c.type !== 'king') return null;
    const pawnNeeded = c.name === '帥' ? '卒' : '兵';
    const found = ['left', 'right', 'up', 'down'].filter(d => p[d].name === pawnNeeded);
    return found.length ? {
      positions: found
    } : null;
  },
  narrate() {
    return `※ 明君格:中央是帥/將,周圍有異色的卒/兵(王見明君)。\n代表您現在情緒安定,願意傾聽他人聲音,人和能量極佳,可以把事情做得很好。`;
  }
}, {
  id: 'tyrant',
  name: '暴君格',
  detect(p) {
    const c = p.center;
    if (c.type !== 'king') return null;
    const pawnNeeded = c.name === '帥' ? '卒' : '兵';
    const others = ['left', 'right', 'up', 'down'].filter(d => p[d] && p[d].color !== '_empty');
    const noPawn = !others.some(d => p[d].name === pawnNeeded);
    const noAlly = !others.some(d => p[d].color === c.color);
    return noPawn && noAlly ? {} : null;
  },
  narrate() {
    return `※ 暴君格:中央是帥/將,但沒有異色卒/兵相伴,且周圍沒有同色友軍。\n身為領袖若感到孤立無援,容易做出偏執決定,情緒起伏大。請務必保持冷靜,不要衝動。`;
  }
}, {
  id: 'yin_yang_imbalance',
  name: '陰陽不協調',
  detect(p) {
    const real = Object.values(p).filter(x => x && x.color !== '_empty');
    const total = real.length;
    const reds = real.filter(x => x.color === 'red').length;
    const blacks = total - reds;
    // 5 位置(單卦):4:1 / 1:4 算不協調
    // 4 位置(命盤每段):3:1 / 1:3 算不協調
    if (total === 5 && (reds === 4 && blacks === 1 || reds === 1 && blacks === 4)) {
      return {
        ratio: reds === 4 ? '4紅1黑' : '1紅4黑'
      };
    }
    if (total === 4 && (reds === 3 && blacks === 1 || reds === 1 && blacks === 3)) {
      return {
        ratio: reds === 3 ? '3紅1黑' : '1紅3黑'
      };
    }
    return null;
  },
  narrate(m) {
    const advice = m.ratio.startsWith('4紅') ? '多踩泥土、草地(釋放陽能量),靜心冥想、抄經' : '多曬太陽(出日落前後 15 分鐘是黃金時段),戶外活動接觸人群';
    return `※ 陰陽不協調(${m.ratio}):意識顯化動能不足,情緒波動較大。\n建議:${advice}。`;
  }
}, {
  id: 'no_pawn',
  name: '缺地格(無兵卒)',
  detect(p) {
    const hasPawn = Object.values(p).some(x => x.type === 'pawn');
    return !hasPawn ? {} : null;
  },
  narrate() {
    return `※ 缺地格:卦中沒有任何兵卒。代表年運/事業比較像空想不踏實,缺乏踏實感與落地執行力,現金較留不住。建議多做能落地的事情。`;
  }
}];

// ============================================================
// 4.5. 命盤產生器 ─ 根據出生日期作為 seed 確定性洗牌
//      同一個人每次卜出來的命盤都一致
// ============================================================
function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = s + 0x6D2B79F5 >>> 0;
    let t = s;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function seededShuffle(arr, seed) {
  const rng = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function birthSeed(year, month, day, hour) {
  // 把出生日期 + 時間打成單一 seed,範圍小但足夠
  return (Number(year) * 10000 + Number(month) * 100 + Number(day)) * 100 + Number(hour || 0);
}

// 命盤的 8 個區段(本命總格 + 7 個十年運)
const CHART_PERIODS = [{
  id: 'main',
  label: '本命總格',
  hint: '一生的主軸',
  category: 'general'
}, {
  id: 'study',
  label: '學習格 11~20歲',
  hint: '學業、修行',
  category: 'general'
}, {
  id: 'love',
  label: '情感格 21~30歲',
  hint: '感情、人際',
  category: 'love'
}, {
  id: 'career',
  label: '事業格 31~40歲',
  hint: '工作、事業',
  category: 'career'
}, {
  id: '41-50',
  label: '41~50 歲',
  hint: '中壯年',
  category: 'general'
}, {
  id: '51-60',
  label: '51~60 歲',
  hint: '事業熟成',
  category: 'general'
}, {
  id: '61-70',
  label: '61~70 歲',
  hint: '收斂期',
  category: 'general'
}, {
  id: '71-80',
  label: '71~80 歲',
  hint: '晚年',
  category: 'general'
}];

// 命盤排版(依教材):
//   ★ 每段視覺都是 5 棋十字(71-80 為 4 棋)
//   ★ 「上一段的下」== 「下一段的上」(共用同一顆棋)
//   ★ 7 個共用 + 5(總格)+ 6×4(學習-61-70 各加 4 新)+ 3(71-80 加 3 新) = 32 顆,正好等於牌庫
// 各段「使用者需填的唯一棋位」(總格 5 個,中段各 4 個,71-80 只 3 個)
const PERIOD_UNIQUE_SLOTS = {
  'main': ['center', 'left', 'right', 'up', 'down'],
  'study': ['left', 'center', 'right', 'down'],
  'love': ['left', 'center', 'right', 'down'],
  'career': ['left', 'center', 'right', 'down'],
  '41-50': ['left', 'center', 'right', 'down'],
  '51-60': ['left', 'center', 'right', 'down'],
  '61-70': ['left', 'center', 'right', 'down'],
  '71-80': ['left', 'center', 'right']
};
const PERIOD_ORDER = ['main', 'study', 'love', 'career', '41-50', '51-60', '61-70', '71-80'];

// 取得上一段的 down 棋子(用以填充下一段的 up)
const getInheritedUp = (periodId, fullCrosses) => {
  const idx = PERIOD_ORDER.indexOf(periodId);
  if (idx <= 0) return null;
  const prev = fullCrosses[PERIOD_ORDER[idx - 1]];
  return prev && prev.down;
};

// 命盤手抽序列(共 32 張,對應 32 個唯一棋位)
// 順序遵循:總格(中→左→右→上→下)、各十年運(左→中→右→下)、71-80(左→中→右)
const CHART_DRAW_SEQUENCE = (() => {
  const seq = [];
  PERIOD_ORDER.forEach(periodId => {
    PERIOD_UNIQUE_SLOTS[periodId].forEach(pos => {
      seq.push([periodId, pos]);
    });
  });
  return seq;
})();

// 空棋子佔位 ─ 命盤的「下」位永遠用此佔位,讓既有的 5 位置 PATTERNS 可繼續運作
const EMPTY_PIECE = {
  name: '',
  color: '_empty',
  type: '_empty',
  score: 0,
  element: '',
  virtue: '',
  emotion: '',
  organ: '',
  rep: '',
  pos: '',
  neg: '',
  learnGood: '',
  learnBad: '',
  loveGood: '',
  loveBad: '',
  careerGood: '',
  careerBad: '',
  money: ''
};

// 棋子類型對應的牌庫上限(deck count)
const DECK_LIMITS = {
  '帥': 1,
  '將': 1,
  '仕': 2,
  '士': 2,
  '相': 2,
  '象': 2,
  '俥': 2,
  '車': 2,
  '傌': 2,
  '馬': 2,
  '炮': 2,
  '包': 2,
  '兵': 5,
  '卒': 5
};

// 一次洗牌,依教材排版填入 32 個位置:
//   總格 5 個全填、學習~61-70 各填 4 個(上承前段的下)、71-80 填 3 個
//   71-80 的下位 = 總格中央(命盤循環:結束即起點)
const generateChartCrosses = (deck, seed) => {
  const shuffled = seededShuffle(deck, seed);
  const result = {};
  let i = 0;
  PERIOD_ORDER.forEach((periodId, idx) => {
    const cross = {};
    if (idx > 0) {
      cross.up = result[PERIOD_ORDER[idx - 1]].down;
    }
    PERIOD_UNIQUE_SLOTS[periodId].forEach(slot => {
      cross[slot] = shuffled[i++];
    });
    if (periodId === '71-80') {
      cross.down = result.main.up; // 命盤循環:71-80下位 = 總格上位 (位置4)
    }
    result[periodId] = cross;
  });
  return result;
};

// ============================================================
// 5. NARRATIVE COMPOSER ─ 自然敘事(隱藏分數與格局名稱)
//    內部仍以分數與格局做判斷,但對使用者只呈現「定心 + 指路」的話語。
// ============================================================

// 將格局轉化為柔軟的自然語句(完全不出現格局名稱)
const buildInsights = (ids, trend, c) => {
  const has = id => ids.includes(id);
  const out = []; // {kind: 'pos'|'mid'|'neg', text}

  // ── 助力類 ──
  if (has('wealth')) out.push({
    kind: 'pos',
    text: `身邊正流動著貴人的能量 ─ 有人會在關鍵時刻主動相助,您不需要事事親力親為。`
  });
  if (has('career')) out.push({
    kind: 'pos',
    text: `卦中帶著「認真做事」的氣場,您具備行動力與承擔的能量,這是您此刻最重要的底氣。`
  });
  if (has('good_friend')) out.push({
    kind: 'pos',
    text: `身邊有「同道之人」的支持,這份連結讓您不會孤單前行,也不會被全然吃光。`
  });
  if (has('good_relations')) out.push({
    kind: 'pos',
    text: `您的人脈與緣分正在流動,願意走出去、與人接觸,機會就藏在人群裡。`
  });
  if (has('mutual_admire')) out.push({
    kind: 'pos',
    text: `您與身邊某位夥伴有著相互欣賞的能量,這份共振是難得的禮物。`
  });
  if (has('three_united')) out.push({
    kind: 'pos',
    text: `您已經準備好了 ─ 內在的底氣、外在的時機都到位,可以放心啟動醞釀已久的計畫。`
  });
  if (has('cross_help')) out.push({
    kind: 'pos',
    text: `卦象帶有天助的能量,逢凶可化吉,有看不見的力量在支持著您。`
  });
  if (has('umbrella')) out.push({
    kind: 'pos',
    text: `如同在父母或長輩的傘下,有照拂、有安定;但也提醒您,別讓這份庇護限制了您看天空的視野。`
  });
  if (has('victory')) out.push({
    kind: 'pos',
    text: `您想做的事相對容易成局,行動是這次的關鍵。`
  });
  if (has('wise_ruler')) out.push({
    kind: 'pos',
    text: `您此刻情緒安定、願意傾聽,這份「人和」的能量會帶來意想不到的助力。`
  });
  if (has('spiritual_affinity')) out.push({
    kind: 'pos',
    text: `您本身帶著靈動、能跨越障礙的能量,且這份能量正向外發揮 ─ 是修行緣分深、適合靜心學習的時節,功課與修行能事半功倍。`
  });

  // ── 中性/主題類 ──
  if (has('romance')) out.push({
    kind: 'mid',
    text: `卦中帶有桃花的能量,情感會有強烈的吸引;只是要記得分清正緣與偏緣,別讓激情主導長期的方向。`
  });
  if (has('depressed_or_starsmoon') && trend === 'sowing') out.push({
    kind: 'mid',
    text: `外人不一定看得出您的鬱悶 ─ 主動找信任的人聊聊,別獨自撐著。`
  });
  if (has('depressed_or_starsmoon') && trend !== 'sowing') out.push({
    kind: 'mid',
    text: `外人很看好您的狀態,但內心仍可能有些壓力,記得給自己留下喘息的空間。`
  });
  if (has('devour_all')) out.push({
    kind: 'mid',
    text: `您現在能掌控全局,但「全部拿下」的局面在最後容易歸零;留些餘地給對方,反而能走得更長遠。`
  });

  // ── 留意類 ──
  if (has('drain')) out.push({
    kind: 'neg',
    text: `能量場中有些「消耗」的痕跡,先辨認消耗從何而來 ─ 是內在的自我懷疑,還是外人的拖累 ─ 看見它,才能轉化它。`
  });
  if (has('destroy')) out.push({
    kind: 'neg',
    text: `原本應是助力的能量被消耗破壞了,您可能需要主動修復某段關係,或調整自己的內耗模式。`
  });
  if (has('devoured')) out.push({
    kind: 'neg',
    text: `外在的力量比較強,您此刻需要先設好防線、降低暴露面,再做下一步決定 ─ 別硬碰硬。`
  });
  if (has('separation')) out.push({
    kind: 'neg',
    text: `您與身邊某位的價值觀有些分歧,先溝通、先對齊期待,再談下一步。`
  });
  if (has('dilemma')) out.push({
    kind: 'neg',
    text: `您正站在搖擺的人生路口 ─ 別在資訊不全時硬選,先沉澱、再做決定。`
  });
  if (has('lone_flower')) out.push({
    kind: 'neg',
    text: `近期請留意人際邊界,可能會遇到讓您損失的人事物;也記得照顧好自己的能量,適度淨化或減少不必要的接觸。`
  });
  if (has('all_same_color')) out.push({
    kind: 'neg',
    text: `卦象呈現得有些單一,可能是您此刻的意識顯化動能不足。可以先做一些自我療癒,稍後再卜也是好的。`
  });
  if (has('tyrant')) out.push({
    kind: 'neg',
    text: `提醒您警覺自己是否陷入了「孤君」的狀態 ─ 主動聆聽外界的聲音,別硬撐到底。`
  });
  if (has('yin_yang_imbalance')) out.push({
    kind: 'neg',
    text: `您此刻的陰陽能量稍微失衡,情緒波動會比較大;先做能量平衡(曬曬太陽,或踩踩泥土草地),再面對眼前的問題會更輕鬆。`
  });
  if (has('no_pawn')) out.push({
    kind: 'neg',
    text: `卦中缺少踏實的能量,提醒您先做一兩件可以落地的小事,把腳步踩穩,再談大方向。`
  });
  return out;
};

// 三句指路(本質 × 格局 × 趨勢)
const composeDirections = (c, ids, category, trend) => {
  const has = id => ids.includes(id);
  const out = [];

  // 第一句:本質 × 類別
  if (category === 'career') {
    const good = (c.careerGood || c.pos).split('、').slice(0, 2).join('與');
    const bad = (c.careerBad || c.neg).split('、')[0];
    out.push(`您事業上的本錢是${good},發揮這份能量;但也別忽視「${bad}」的提醒。`);
  } else if (category === 'love') {
    const good = c.loveGood || '先讓自己的心安定下來';
    const bad = c.loveBad || '保持彼此的呼吸空間';
    out.push(`感情上請記得:${good};也別忘了 ─ ${bad}。`);
  } else if (category === 'wealth') {
    const money = (c.money || '一分耕耘一分收穫,財運穩健即是富').split(';')[0];
    out.push(`${money}。`);
  } else {
    const pos = c.pos.split('、').slice(0, 2).join('、');
    out.push(`保持您${pos}的本色,這是您此刻最大的本錢。`);
  }

  // 第二句:由 pattern 推導(只挑最相關的一條)
  if (has('wealth') || has('career')) {
    out.push('善用身邊正在發生的支持,別客氣 ─ 該借力的時候不必獨撐。');
  } else if (has('drain') || has('destroy') || has('devoured')) {
    out.push('這個階段最重要的功課,是辨認出「正在消耗您的人事物」 ─ 看見它,才有轉化的可能。');
  } else if (has('lone_flower') || has('all_same_color')) {
    out.push('近期把自己照顧好,守住能量,別輕易被外境牽動;有需要時,做一些適度的淨化。');
  } else if (has('separation') || has('dilemma')) {
    out.push('不急著做決定 ─ 先把情況看清,把對方的位置聽明白,清楚之後再行動。');
  } else if (has('good_friend') || has('mutual_admire') || has('good_relations')) {
    out.push('珍惜身邊的好朋友與相知者 ─ 這份連結是您此刻最重要的支撐。');
  } else if (has('three_united') || has('victory') || has('cross_help')) {
    out.push('時機已經對齊了,放心向前 ─ 不必再猶豫。');
  } else if (has('tyrant')) {
    out.push('放下「我說了算」的執著,讓身邊的人有機會幫您分擔 ─ 您不必獨自承擔一切。');
  } else if (has('yin_yang_imbalance')) {
    out.push('在做決定前,先讓身體做一些能量平衡的事 ─ 曬太陽、踩泥土、或靜心冥想。');
  } else {
    out.push('保持覺察,順勢而為。不強求,也不退縮 ─ 您本身的節奏,就是最好的節奏。');
  }

  // 第三句:由能量趨勢
  if (trend === 'harvest') {
    out.push('能量在順風,把心中想做的事化成具體行動,效益會被放大。');
  } else if (trend === 'sowing') {
    out.push('當下感受不到收穫沒關係 ─ 種子已經下了,您要做的,只是繼續溫柔地耕耘。');
  } else {
    out.push('既不冒進,也不退守,維持您現在的節奏,穩穩前行就好。');
  }
  return out;
};

// 由位置語意挑出與類別最相關的一個提示(用具體的人物角色)
const pickPositionHint = (pieces, posDef, category, c) => {
  const colorMatch = p => p.color === c.color;
  if (category === 'love') {
    let dir = null;
    if (posDef.right.includes('夫') || posDef.right.includes('男友')) dir = 'right';else if (posDef.left.includes('妻') || posDef.left.includes('女友')) dir = 'left';
    if (dir) {
      const p = pieces[dir];
      const role = posDef[dir].split('/')[0];
      if (colorMatch(p)) return `卦中代表「${role}」的位置,出現的能量與您共振 ─ 這份關係此刻是您可以信任的支撐。`;
      return `卦中代表「${role}」的位置,出現的能量與您不同色 ─ 提醒您留意對方的視角差異,溝通會是這段關係的關鍵。`;
    }
  } else if (category === 'career') {
    const up = pieces.up;
    const role = posDef.up.split('/')[0];
    if (colorMatch(up)) return `代表「${role}」的位置,能量與您同色 ─ 上層的氣場是您事業上的助力。`;
    return `代表「${role}」的位置,能量與您不同色 ─ 留意上層的態度與互動模式,別硬碰硬。`;
  } else if (category === 'wealth') {
    const down = pieces.down;
    if (down.type === 'pawn') {
      return `卦中下方出現踏實的兵卒能量,代表您的財根穩固 ─ 適合穩定累積,別急著炒短。`;
    }
  }
  return null;
};

// ============================================================
// 5b-pre. 過局往上吃 — 偵測本段棋子是否能跨越段落界線影響上一段
//         依《命盤解說》:中①必完整吃當段上方④才能繼續往上吃;下⑤吃中①=生死關
// ============================================================
const detectCrossPeriodInfluence = (periodId, allCrosses) => {
  const out = {
    upward: [],
    lifeAndDeath: null
  };
  if (!allCrosses || !periodId) return out;
  const idx = PERIOD_ORDER.indexOf(periodId);
  const cur = allCrosses[periodId];
  // 命盤循環:main 往上看 71-80(因為 71-80.down = main.up)
  const prevId = idx > 0 ? PERIOD_ORDER[idx - 1] : '71-80';
  const prev = allCrosses[prevId];
  if (!cur || !prev) return out;
  const c = cur.center;
  if (!c || c.color === '_empty') return out;

  // ── 中① 完整吃當段上方④ → 繼續往上吃 prev.center ──
  const upPiece = cur.up;
  if (upPiece && upPiece.color !== '_empty' && upPiece.color !== c.color && canAttack('center', 'up', c, cur) && !hasProtector('up', cur) && !isPinned('center', cur)) {
    // 中已能完整吃上;依棋子類型判斷能否繼續觸及 prev.center
    const reach = (() => {
      if (c.type === 'rook') return true; // 俥/車 直線隔空
      if (c.type === 'cannon') return true; // 炮/包 隔山(上④即山)
      if (c.type === 'knight') return true; // 傌/馬 完整吃過
      if (c.type === 'pawn') return true; // 兵/卒 只進不退,可繼續往上
      if (c.type === 'king' || c.type === 'guard' || c.type === 'minister') return false;
      return false;
    })();
    const tgt = prev.center;
    if (reach && tgt && tgt.color !== '_empty' && tgt.color !== c.color) {
      out.upward.push({
        attacker: c.name,
        attackerType: c.type,
        via: upPiece.name,
        target: tgt.name,
        prevId,
        prevLabel: (CHART_PERIODS.find(p => p.id === prevId) || {}).label || prevId
      });
    }
  }

  // ── 側位 包/炮 過局往上吃 ──
  // 用戶澄清(2026-05-05):「炮包在兩側一樣往上格一支就能吃」
  // 幾何:左/右的炮包 隔山(山 = cur.up)→ 對應上一段 prev.center
  // 條件:
  //   1. 側位是炮/包 且 同中央色(用戶自己的)
  //   2. cur.up 存在(作為山)
  //   3. prev.center 異色於中央(對方目標)且 prev cross 中無保護
  //   4. 側位炮/包 在 cur 中不被牽制
  for (const sidePos of ['left', 'right']) {
    const sideP = cur[sidePos];
    if (!sideP || sideP.color === '_empty') continue;
    if (sideP.type !== 'cannon') continue;
    if (sideP.color !== c.color) continue; // 必須是用戶自己的
    if (!upPiece || upPiece.color === '_empty') continue; // 需要山
    const tgt = prev.center;
    if (!tgt || tgt.color === '_empty') continue;
    if (tgt.color === c.color) continue; // 對方才能吃
    if (hasProtector('center', prev)) continue; // 對方無保護才能吃
    if (isPinned(sidePos, cur)) continue; // 自己側位無牽制
    out.upward.push({
      attacker: sideP.name,
      attackerType: 'cannon-side',
      via: upPiece.name,
      target: tgt.name,
      prevId,
      prevLabel: (CHART_PERIODS.find(p => p.id === prevId) || {}).label || prevId,
      sourcePos: sidePos
    });
  }

  // ── 下⑤吃中① = 生死關 ──
  // 即「上一段的下」(== 本段的 up,在 cur 中為 cur.up)從上方吃 cur.center
  // 條件:cur.up 異色、能吃中、無保護、無牽制
  if (upPiece && upPiece.color !== '_empty' && upPiece.color !== c.color && canAttack('up', 'center', upPiece, cur) && !hasProtector('center', cur) && !isPinned('up', cur)) {
    out.lifeAndDeath = {
      by: upPiece.name,
      target: c.name,
      prevLabel: (CHART_PERIODS.find(p => p.id === prevId) || {}).label || prevId
    };
  }
  return out;
};

// ============================================================
// 5b. 命盤專用詳細敘事(覆蓋 整體/工作/情感/健康/建議 五軸)
//     參考《佛和》《講義》的工作事業格局講解、人際情感格局講解、
//     棋子吃與被吃的字義延伸、健康器官對應等內容綜合而成。
// ============================================================
const composeChartFullNarrative = (pieces, opts) => {
  const {
    posDef,
    periodLabel,
    isMain,
    periodId,
    allCrosses
  } = opts;
  const c = pieces.center;
  const scoreCtx = computeScores(pieces);
  const matched = [];
  for (const def of PATTERNS) {
    const m = def.detect(pieces);
    if (m) matched.push({
      def,
      m
    });
  }
  const ids = matched.map(x => x.def.id);
  const has = id => ids.includes(id);

  // PDF 講義的收穫修正係數
  let harvestMultiplier = 1.0;
  const harvestModifierReasons = [];
  if (has('all_same_color')) {
    harvestMultiplier *= 0.20;
    harvestModifierReasons.push('全紅/全黑悔恨格 ─ 孤陰不生獨陽不長,收穫僅 20%');
  } else if (has('depressed_or_starsmoon') || has('lone_flower')) {
    harvestMultiplier *= 0.50;
    harvestModifierReasons.push('一枝獨秀/眾星拱月格(4:1) ─ 陰陽不協調,收穫僅 50%');
  }
  if (has('devour_all') || has('devoured')) {
    harvestMultiplier *= 0.20;
    harvestModifierReasons.push('通吃/被通吃格 ─ 一開始不錯,最後易歸零,收穫僅 20%');
  }
  const adjHarvest = scoreCtx.harvest * harvestMultiplier;
  const ratio = adjHarvest - scoreCtx.sacrifice;
  const trend = ratio > scoreCtx.sacrifice * 0.3 ? 'harvest' : ratio < -scoreCtx.harvest * 0.3 ? 'sowing' : 'balanced';
  let text = '';

  // ────── [1] 整體能量 ──────
  text += `【整體能量】\n`;
  text += `${isMain ? '您一生的本質' : '這段時期的能量'}定錨在【${c.name}】 ─ ${c.rep.split(/[,，]/)[0]}。\n`;
  text += `主要呈現${c.pos.split('、').slice(0, 2).join('與')}的特質;同時容易出現「${c.neg.split('、')[0]}」的傾向。\n`;
  // 中央是 將/帥/士/車 的執著提醒(本命才講)
  if (isMain && ['king', 'guard', 'rook'].includes(c.type) && ['將', '帥', '士', '車'].includes(c.name)) {
    text += `※ 本質帶有許多「應該怎樣」的執著與做人做事道理 ─ 建議透過清理放下這些堅持。\n`;
  }
  // 中央是 馬/包 的擴展不易
  if (['knight', 'cannon'].includes(c.type)) {
    text += `※ 中央是${c.name},想擴展突破但出不去,各方面(情感/事業/財富)不易得到想要的擴展。\n`;
  }
  if (trend === 'harvest') {
    text += `※ 整體傾向「收穫」── 行動效益會被放大。\n`;
  } else if (trend === 'sowing') {
    text += `※ 整體傾向「耕耘」── 適合種子,別急著要立即結果。\n`;
  } else {
    text += `※ 整體能量平衡 ── 維持節奏穩步前行即可。\n`;
  }
  if (harvestModifierReasons.length) {
    harvestModifierReasons.forEach(r => {
      text += `※ ${r}\n`;
    });
  }
  if (has('spiritual_affinity')) {
    const sa = matched.find(x => x.def.id === 'spiritual_affinity');
    const list = sa?.m?.matches?.slice(0, 2).map(x => `${x.attacker}吃${x.target}`).join('、') || '靈動的吃子';
    text += `※ 修行緣分格:您自身的【${list}】成功對外發揮 ─ ${isMain ? '一生' : '這段時期'}修行緣分深,功課/學習/靜心容易事半功倍。\n`;
  }
  text += `\n`;

  // ────── [過局影響] 跨段落能量(中①完整吃上④繼續往上;下⑤吃中=生死關)──────
  const cpInfluence = detectCrossPeriodInfluence(periodId, allCrosses);
  if (cpInfluence.upward.length || cpInfluence.lifeAndDeath) {
    text += `【過局影響】\n`;
    cpInfluence.upward.forEach(u => {
      if (u.attackerType === 'cannon-side') {
        const sideStr = u.sourcePos === 'left' ? '左位' : '右位';
        text += `※ ${sideStr}【${u.attacker}】隔山(以本段上位【${u.via}】為山)往上吃到【${u.prevLabel}】的中央【${u.target}】 ─ 您自己的「跨越能量」回頭觸及上一段的核心,代表這個十年的某些行動會回頭翻案上一段的議題。\n`;
        return;
      }
      const verb = u.attackerType === 'rook' ? '直線隔空往上' : u.attackerType === 'cannon' ? '隔山往上' : u.attackerType === 'knight' ? '完整吃過' : u.attackerType === 'pawn' ? '步步往上' : '繼續往上';
      text += `※ 中央【${u.attacker}】完整吃過上位【${u.via}】後,${verb}觸及【${u.prevLabel}】的中央【${u.target}】 ─ 本段的力量會回頭影響上一段的核心,代表這個十年的決策會「翻案」上一段未盡的議題。\n`;
    });
    if (cpInfluence.lifeAndDeath) {
      const ld = cpInfluence.lifeAndDeath;
      text += `※ 【生死關】 上一段【${ld.prevLabel}】的下位【${ld.by}】完整吃到本段中央【${ld.target}】,且中央無保護無牽制 ─ 這是命盤上最需要謹慎的關卡,代表上一段未化解的因素會在這個十年集中發作。建議:把上一段的議題收尾乾淨,別帶到這段。\n`;
    }
    text += `\n`;
  }

  // ────── [本命專屬] 缺天人地 / 大師格 / 皇帝格 ──────
  if (isMain) {
    const real = Object.values(pieces).filter(x => x && x.color !== '_empty');
    const tiers = new Set(real.map(p => {
      if (['king', 'guard', 'minister'].includes(p.type)) return '天';
      if (['rook', 'knight', 'cannon'].includes(p.type)) return '人';
      if (p.type === 'pawn') return '地';
      return '';
    }));
    const lacks = [];
    if (!tiers.has('天')) lacks.push({
      k: '天',
      text: '缺天 ─ 較鐵齒,相信「人定勝天」,眼見為憑,不易仰賴更大的力量'
    });
    if (!tiers.has('人')) lacks.push({
      k: '人',
      text: '缺人 ─ 人和方面較弱,不易交到知心朋友,需在人際關係多用心'
    });
    if (!tiers.has('地')) lacks.push({
      k: '地',
      text: '缺地 ─ 缺踏實感,人生易感迷惘,錢財較留不住,需主動落地'
    });
    if (lacks.length) {
      text += `【天人地補充】\n`;
      lacks.forEach(l => {
        text += `・ ${l.text}\n`;
      });
      text += `\n`;
    }

    // 大師格:位置 2345 為兵卒(同色或混色)
    const outers = ['left', 'right', 'up', 'down'].map(d => pieces[d]).filter(x => x && x.color !== '_empty');
    const allPawn = outers.length >= 4 && outers.every(p => p.type === 'pawn');
    const allFiveAllPawn = real.length >= 5 && real.every(p => p.type === 'pawn');
    if (allPawn && !allFiveAllPawn) {
      const masterDetail = {
        king: {
          line: '帥/將 → 做任何行業都適合,放手嘗試都能開花',
          why: '本質為天格之王,周圍踏實兵卒承載 ─ 想做什麼,落地都會有成果'
        },
        guard: {
          line: '仕/士 → 適合從政、掌權、處理複雜人事',
          why: '仕士本質為策畫與輔佐,踏實兵卒帶來執行力 ─ 善用人脈與制度,影響力會放大'
        },
        minister: {
          line: '相/象 → 為一代宗師,適合教學、傳承、文化專業',
          why: '相象本質為智慧與沉澱,周圍兵卒落地 ─ 越專注於專業,越能成大師'
        },
        rook: {
          line: '俥/車 → 適合領導一群人做事,擅長執行型事業',
          why: '俥車本質為衝鋒,周圍兵卒呼應 ─ 帶兵打仗最自在,當掌舵者最發揮'
        },
        knight: {
          line: '傌/馬 → 會有一群人跟他到處奔波,適合業務、外交、開疆拓土',
          why: '傌馬本質為跳躍與遠行,兵卒護持 ─ 越走動越旺,別固守一地'
        },
        cannon: {
          line: '炮/包 → 因男的帥女的美,適合當偶像明星、表演、形象工作',
          why: '炮包本質為爆發與吸引,踏實兵卒承載光環 ─ 鏡頭前後都自帶氣場'
        },
        pawn: {
          line: '兵/卒 → 五位皆地,即「皇帝格」,只往上不會往下',
          why: '已是皇帝格,見下方說明'
        }
      };
      const md = masterDetail[c.type];
      text += `【大師格】\n`;
      text += `周圍 4 位皆為兵/卒,中央【${c.name}】獲得四方踏實能量的承載 ─ ${md.line}\n`;
      text += `※ 為什麼適合:${md.why}。\n`;
      text += `※ 做事天分極高,但也提醒您 ─ 當老大時付出會大於收穫,真正的回報是「享受成就感」與「被需要的價值感」,而不是金錢直接收益。\n`;
      text += `※ 給您的建議:選擇您真正享受被仰望的領域;若只為錢,大師格的能量會悶得發慌。\n\n`;
    }
    // 皇帝格:5 支皆地格
    if (allFiveAllPawn) {
      text += `【皇帝格】\n`;
      text += `五位皆為地格(兵卒),全盤腳踏實地、只進不退 ─ 不論做什麼事,只會往上、不會往下。\n`;
      text += `※ 「皇帝」的真意:不是天生顯貴,而是任何起點都能持續累積、不會跌回原點。從零開始也好,中年轉行也好,每一步都會踏實接住。\n`;
      text += `※ 提醒:皇帝格的能量在「持續性」,所以選擇要做的事,問自己「這件事我願意做十年嗎」 ─ 答 yes,就放心向前。\n`;
      text += `※ 提醒二:皇帝格的人較少需要靠貴人,因為自己就是地基;但也容易因此忽略合作的價值,記得保留人際的溫度。\n\n`;
    }
  }

  // ────── [2] 工作事業 ──────
  text += `【工作事業】\n`;
  const careerLines = [];
  if (has('career')) careerLines.push(`卦中具備車馬包的事業能量,認真做事的態度與行動力到位 ─ 適合開創、執行型的事業節奏。`);
  if (has('wealth')) careerLines.push(`身邊有貴人能量(將、士、象齊聚),適度委託與借力,事情的成就會在合作中放大。`);
  if (has('three_united')) careerLines.push(`已準備好,內外條件齊備,可以放心啟動醞釀已久的事業計畫。`);
  if (has('drain') || has('destroy')) careerLines.push(`存在消耗或破壞的能量,需先辨認消耗的來源 ─ 是內在自我懷疑,還是外人的拖累 ─ 再談前進。`);
  if (has('devoured')) careerLines.push(`外在環境侵蝕力強,需先設好防線,降低暴露面再做下一步事業決定。`);
  if (has('tyrant')) careerLines.push(`身為主導者容易陷入孤君狀態,主動聆聽團隊聲音,事業才能走得長遠。`);
  if (has('no_pawn')) careerLines.push(`卦中無兵卒(現金財庫),提醒這段時期事業偏空想,要主動把腳步落地,別過度投機。`);
  if (c.careerGood) careerLines.push(`您本質上的事業正向能量:${c.careerGood.split('、').slice(0, 3).join('、')}。`);
  if (c.careerBad) careerLines.push(`需留意的事業負向傾向:${c.careerBad.split('、').slice(0, 2).join('、')}。`);
  if (c.money) careerLines.push(`財運主軸:${c.money.split(/[;]/)[0]}。`);

  // 賺錢粗估(《命盤解說》:40 分 ≈ 1000 萬,即 1 分 ≈ 25 萬)
  // 僅在本命總格、事業格(31~40)、41~50、51~60 段呈現,並標註「因人而異」
  const isCareerEstSeg = isMain || periodId === 'career' || periodId === '41-50' || periodId === '51-60';
  if (isCareerEstSeg && adjHarvest > 0) {
    const wan = Math.round(adjHarvest * 25);
    const estStr = wan >= 10000 ? `約 ${(wan / 10000).toFixed(1)} 億` : wan >= 1000 ? `約 ${(wan / 1000).toFixed(1)} 千萬` : `約 ${wan} 萬`;
    const scope = isMain ? '一生' : periodId === 'career' ? '31~40 歲事業期' : periodId === '41-50' ? '41~50 歲' : '51~60 歲';
    careerLines.push(`${scope}賺錢粗估 ─ ${estStr} 元(收穫分數 ${adjHarvest.toFixed(1)} × 約 25 萬/分)。\n  此為《命盤解說》教材的概略尺度,實際金額因人因業而異;倍數差距因「行業選對與否」、「努力強度」、「合作關係」而調整,別把數字看死。`);
  }
  text += careerLines.length ? careerLines.map(l => '・ ' + l).join('\n') : '・ 事業能量處於平和階段,無特別劇烈的格局,依常理發展即可。';
  text += `\n\n`;

  // ────── [結婚時機提示] (僅情感段/事業段) ──────
  if (!isMain && (periodLabel?.includes('情感') || periodLabel?.includes('事業'))) {
    const marriageSignals = [];
    if (has('good_friend')) marriageSignals.push('好朋友格');
    if (has('mutual_admire')) marriageSignals.push('相鄰互相欣賞格');
    if (has('wise_ruler')) marriageSignals.push('相鄰明君格');
    if (has('romance')) marriageSignals.push('桃花格');
    if (marriageSignals.length) {
      const ageRange = periodLabel.includes('21~30') ? '21~30 歲' : periodLabel.includes('31~40') ? '31~40 歲' : '此段';
      text += `【💍 婚姻時機提示】\n`;
      text += `卦中出現「${marriageSignals.join('、')}」 ─ 這代表${ageRange}內可能有結婚的因緣(認識或交往時間需另卜單卦)。\n\n`;
    }
  }

  // ────── [3] 情感人際 ──────
  text += `【情感人際】\n`;
  const loveLines = [];
  if (has('good_friend')) loveLines.push(`身邊有「同道之人」的支持,這份連結讓您不會孤單前行。`);
  if (has('good_relations')) loveLines.push(`您的人脈與緣分正在流動,願意走出去,機會就在人群之中。`);
  if (has('mutual_admire')) loveLines.push(`與某位夥伴有相互欣賞的能量,這份共振是難得的禮物。`);
  if (has('romance')) loveLines.push(`卦中帶有桃花能量,情感會有強烈的吸引;留意正緣與偏緣的分別,別讓激情主導長期方向。`);
  if (has('separation')) loveLines.push(`與身邊某位的價值觀有分歧,先溝通對齊期待,別硬推進度。`);
  if (has('lone_flower')) loveLines.push(`人際邊界要留意,可能會遇到讓您損失的人事物;適度淨化,減少不必要的接觸。`);
  // 中央色 vs 周圍色綜合判讀
  const myColor = c.color;
  const sameColorOuter = ['left', 'right', 'up', 'down'].filter(d => pieces[d].color === myColor).length;
  if (sameColorOuter >= 3) {
    loveLines.push(`周圍多為與您同色的能量,人際關係上容易與相似價值觀的人共振。`);
  } else if (sameColorOuter <= 1) {
    loveLines.push(`周圍多為與您不同色的能量,人際關係上會接觸到很多異質的觀點與互動,要做好溝通校準。`);
  }
  // 桃花特殊:包炮位置
  const cannonPositions = ['left', 'right', 'up', 'down'].filter(d => pieces[d].type === 'cannon');
  if (cannonPositions.length) {
    const isProperRomance = pieces.left.type === 'cannon' && pieces.right.type === 'cannon' || pieces.up.type === 'cannon' && pieces.down.type === 'cannon';
    loveLines.push(isProperRomance ? `卦中包炮在對位,屬正桃花能量 ─ 容易遇到合適的對象。` : `卦中有包/炮但不在正位,屬偏桃花 ─ 情慾能量強,需理性對待。`);
  }
  if (c.loveGood) loveLines.push(`感情正向能量:${c.loveGood.split(/[;,]/)[0]}。`);
  if (c.loveBad) loveLines.push(`感情留意:${c.loveBad.split(/[;,]/)[0]}。`);
  text += loveLines.length ? loveLines.map(l => '・ ' + l).join('\n') : '・ 情感能量平和,沒有特別劇烈的起伏。依您本質的特質互動即可。';
  text += `\n\n`;

  // ────── [4] 身體健康 ──────
  text += `【身體健康】\n`;
  const healthLines = [];
  healthLines.push(`本質為${c.element}的氣場 ─ 對應${c.organ.split('、').slice(0, 3).join('、')}等系統。`);
  healthLines.push(`情緒上多顯為${c.emotion}。`);

  // 健康警示順序:受威脅 > 消耗 > 暴動 > 陰陽不協調 > 五行所缺 > 五行過多
  // 1. 受威脅:中央被外圍能吃
  const myCenterAttacked = ['left', 'right', 'up', 'down'].some(d => {
    const atk = pieces[d];
    if (atk.color === c.color) return false;
    return canAttack(d, 'center', atk, pieces);
  });
  if (myCenterAttacked) {
    healthLines.push(`※ 中央受到威脅 ─ ${c.organ.split('、').slice(0, 2).join('、')}是這段時期最需要保養的部位。`);
  }
  // 2. 消耗
  if (has('drain')) {
    healthLines.push(`※ 消耗格出現,身心容易疲憊,要留意休息與情緒釋放。`);
  }
  // 3. 暴動格(同字異色多隻並列)
  if (has('destroy')) {
    healthLines.push(`※ 破壞格,情緒劇烈起伏會耗損元氣,做好情緒平衡。`);
  }
  // 4. 陰陽不協調
  if (has('yin_yang_imbalance')) {
    const reds = Object.values(pieces).filter(x => x.color === 'red').length;
    healthLines.push(reds >= 4 ? `※ 陰陽不協調(陽過盛):多踩泥土草地、靜心冥想、抄經以收陽氣。` : `※ 陰陽不協調(陰過盛):多曬太陽、出門接觸人群以補陽。`);
  }
  // 5. 五行所缺
  const elements = Object.values(pieces).map(p => p.element);
  const allElems = ['金', '木', '水', '火', '土'];
  const missing = allElems.filter(e => !elements.includes(e));
  if (missing.length) {
    const elemOrgan = {
      '金': '肺、大腸、皮膚、呼吸系統',
      '木': '肝、膽、筋、目',
      '水': '腎、膀胱、骨、耳、內分泌',
      '火': '心、小腸、血管',
      '土': '脾、胃、肌肉、消化'
    };
    healthLines.push(`※ 五行${missing.join('、')}缺,對應${missing.map(e => elemOrgan[e].split('、')[0]).join('、')}的系統較弱,需主動養護。`);
  }
  // 6. 五行過多
  const elemCount = {};
  elements.forEach(e => {
    elemCount[e] = (elemCount[e] || 0) + 1;
  });
  for (const [e, n] of Object.entries(elemCount)) {
    if (n >= 3) {
      healthLines.push(`※ 五行${e}過多(${n}隻),對應系統容易過度活躍或失衡,需平衡其他元素。`);
    }
  }
  text += healthLines.map(l => '・ ' + l).join('\n');
  text += `\n\n`;

  // ────── [5] 給您的建議(本命才有,十年運可省略) ──────
  if (isMain) {
    text += `【給您的建議】\n`;
    const directions = composeDirections(c, ids, 'general', trend);
    directions.forEach((d, i) => {
      text += `  ${'一二三'.charAt(i)}、${d}\n`;
    });
    text += `\n`;
    text += `卦象始終只是一面鏡子 ─ 真正握著方向盤的,始終是您自己的心。\n`;
    text += `境遇無常,但心可以恆常自在。願您安心前行。`;
  }

  // ────── [尾段] 71~80 之後的循環提醒 ──────
  if (periodId === '71-80') {
    text += `\n\n【81 歲以後的循環看法】\n`;
    text += `《命盤解說》教材說明:命盤共 8 段以 71~80 歲為止,之後不再新發棋,而是「回看」前段的能量。\n`;
    text += `・ 81~90 歲 ─ 回看【本命總格】這段。即您一生的主軸再次顯化,把根本的特質與功課重新走一遍,通常會比年輕時更通透。\n`;
    text += `・ 91~100 歲 ─ 回看【學習格 11~20 歲】這段。少年時期養成的學習能量會在這個年紀回流,代表晚年仍適合繼續學習新事物、保持好奇。\n`;
    text += `・ 101 歲以上 ─ 不論。教材原文「不論」,意指此後生命已超越棋盤格局的計算,進入純然的存在狀態。\n`;
    text += `※ 提醒:71~80 段的下位即本命總格的上位(命盤循環),所以 71~80 結束就直接接回起點 ─ 命盤本身已含「無始無終」之意。\n`;
  }
  return text;
};
const composeNarrative = (pieces, opts) => {
  const {
    category,
    posDef,
    question,
    periodLabel,
    briefMode
  } = opts;
  const c = pieces.center;
  const catName = {
    career: '事業工作',
    wealth: '金錢財運',
    love: '感情婚姻',
    general: '整體運勢'
  }[category] || '整體運勢';

  // ─── 內部運算(不曝露給使用者) ───
  const scoreCtx = computeScores(pieces);
  const matched = [];
  for (const def of PATTERNS) {
    const m = def.detect(pieces);
    if (m) matched.push({
      def,
      m
    });
  }
  const ids = matched.map(x => x.def.id);
  const ratio = scoreCtx.harvest - scoreCtx.sacrifice;
  const trend = ratio > scoreCtx.sacrifice * 0.3 ? 'harvest' : ratio < -scoreCtx.harvest * 0.3 ? 'sowing' : 'balanced';

  // ─── 簡述模式(命盤十年運用) ───
  if (briefMode) {
    const insights = buildInsights(ids, trend, c);
    const positives = insights.filter(x => x.kind === 'pos');
    const cautions = insights.filter(x => x.kind === 'neg');
    const top = [];
    if (positives.length) top.push(positives[0]);
    if (cautions.length) top.push(cautions[0]);
    let bt = `這段時期的能量定錨在【${c.name}】,${c.rep.split(/[,，]/)[0]}。\n`;
    bt += `主要呈現${c.pos.split('、').slice(0, 2).join('與')}的特質,需留意「${c.neg.split('、')[0]}」的傾向。\n\n`;
    if (top.length) {
      bt += top.map(x => '・ ' + x.text).join('\n\n') + '\n\n';
    }
    if (trend === 'harvest') {
      bt += `※ 整體傾向收穫 ─ 這段時期的行動會被放大,適合積極作為。`;
    } else if (trend === 'sowing') {
      bt += `※ 整體傾向耕耘 ─ 這段時期適合種子,別急著要立即結果。`;
    } else {
      bt += `※ 整體傾向平衡 ─ 維持節奏穩步前行即可。`;
    }
    return bt;
  }

  // ─── 開場(完整模式) ───
  let text = `親愛的朋友:\n\n`;
  if (periodLabel) {
    text += `這是您【${periodLabel}】的解析 ─\n\n`;
  } else {
    text += `關於您詢問的【${catName}】 ─\n「${question.trim()}」\n\n`;
  }
  text += `卦象已經為您靜靜揭曉。\n\n`;

  // ─── 本質(中央棋) ───
  const posKey = c.pos.split('、').slice(0, 2).join('與');
  const negKey = c.neg.split('、').slice(0, 1).join('');
  text += `您此刻的能量,定錨在中央的【${c.name}】這個位置。\n`;
  text += `${c.rep.split(/[,，]/)[0]}。\n`;
  text += `這意味著您現在的內在,以${posKey}為主要的底色;同時也容易出現「${negKey}」的傾向 ─ 這是此刻需要對自己溫柔提醒的地方。\n\n`;

  // ─── 位置提示(類別相關) ───
  const posHint = pickPositionHint(pieces, posDef, category, c);
  if (posHint) text += posHint + '\n\n';

  // ─── 由格局合成的自然敘述(取最重要 2-3 句,不指名) ───
  const insights = buildInsights(ids, trend, c);
  const positives = insights.filter(x => x.kind === 'pos');
  const cautions = insights.filter(x => x.kind === 'neg');
  const middles = insights.filter(x => x.kind === 'mid');
  const lines = [];
  if (positives.length) lines.push(positives[0].text);
  if (cautions.length) lines.push(cautions[0].text);
  if (middles.length && lines.length < 3) lines.push(middles[0].text);
  if (cautions.length >= 2 && lines.length < 3) lines.push(cautions[1].text);
  if (lines.length) {
    text += lines.join('\n\n') + '\n\n';
  } else {
    text += `卦象沒有出現特別激烈的格局,代表您此刻的能量場相對平和,事情依常理發展,一分耕耘一分收穫。\n\n`;
  }

  // ─── 整體趨勢(融入文字,不打分數) ───
  if (trend === 'harvest') {
    text += `整體來看,您現在處於「收穫」的時節 ─ 當下的具體行動會被放大,這是適合把心中所想化為實踐的階段。\n\n`;
  } else if (trend === 'sowing') {
    text += `整體來看,您現在處於「耕耘種子」的階段 ─ 當下可能感受不到立即的回饋,但種下的東西不會白費,只是回收的時候還沒到。請別因一時的「沒感覺」而懷疑自己。\n\n`;
  } else {
    text += `整體來看,您現在的能量處於平衡之間 ─ 既無大進,也無大退,維持原本的節奏穩穩前行就好。\n\n`;
  }

  // ─── 三句指路 ───
  text += `針對【${catName}】這件事,我想送您三句話:\n\n`;
  const directions = composeDirections(c, ids, category, trend);
  directions.forEach((d, i) => {
    text += `  ${'一二三'.charAt(i)}、${d}\n\n`;
  });

  // ─── 結尾(柔和、不機械) ───
  text += `卦象始終只是一面鏡子,照見此刻的氣候,提醒您備好晴傘或蓑衣。\n它從不替您決定路怎麼走 ─ 真正握著方向盤的,始終是您自己的心。\n\n`;
  text += `境遇無常,但心可以恆常自在。這正是「相由心生、境隨心轉」的真意。\n\n`;
  text += `願您安心前行。\n\n`;
  text += `─────────────────\n`;
  text += `若想針對這卦結合具體現況進行更深度的探討,歡迎預約個人諮詢。\n願這份訊息為您的迷霧帶來一絲微光。`;
  return text;
};

// ============================================================
// 7. UI Components
// ============================================================
// 命盤全景上的小棋位(可點選空格 / 已填棋子)
const MiniPieceSlot = ({
  piece,
  onClick,
  isCenter,
  position
}) => {
  const POS_LABEL = {
    center: '中',
    left: '左',
    right: '右',
    up: '上',
    down: '下'
  };
  // 鍵盤啟動:Enter / Space 等同點擊(僅在可點擊時加)
  const onKeyDown = onClick ? e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  } : undefined;
  const role = onClick ? 'button' : undefined;
  const tabIndex = onClick ? 0 : undefined;
  if (!piece) {
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClick,
      onKeyDown: onKeyDown,
      role: role,
      tabIndex: tabIndex,
      "aria-label": onClick ? `${POS_LABEL[position]} 位 - 點選棋子` : `${POS_LABEL[position]} 位 - 繼承自上一段`,
      className: `mini-piece empty ${isCenter ? 'mini-piece-center' : ''}`
    }, POS_LABEL[position]);
  }
  const colorClass = piece.color === 'red' ? 'red' : 'black';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onKeyDown: onKeyDown,
    role: role,
    tabIndex: tabIndex,
    "aria-label": onClick ? `${POS_LABEL[position]} 位:${piece.name}(點擊更換)` : `${POS_LABEL[position]} 位:${piece.name}`,
    className: `mini-piece ${colorClass} ${isCenter ? 'mini-piece-center' : ''}`
  }, piece.name);
};
const ChessPiece = ({
  piece,
  label,
  x,
  y,
  isCenter,
  isShuffling
}) => {
  const colorClass = piece.color === 'red' ? 'text-red-700 border-red-700' : 'text-stone-900 border-stone-900';
  const bgClass = isCenter ? 'bg-[#fffdf5] ring-4 ring-red-100/50' : 'bg-[#fcfaf7]';
  if (isShuffling) {
    return /*#__PURE__*/React.createElement("div", {
      className: `chess-piece shuffling-piece ${colorClass} bg-[#fffdf5]`
    }, /*#__PURE__*/React.createElement("span", {
      className: "drop-shadow-sm mt-[-2px]"
    }, piece.name));
  }
  const style = {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    transform: 'translate(-50%, -50%)',
    animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "absolute flex flex-col items-center group",
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: `chess-piece ${colorClass} ${bgClass}`,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "drop-shadow-sm mt-[-2px]"
  }, piece.name)), label && /*#__PURE__*/React.createElement("span", {
    className: `absolute top-[80px] sm:top-[94px] text-[11px] font-bold tracking-widest px-3 py-0.5 rounded-full whitespace-nowrap shadow-sm ${isCenter ? 'text-red-800 bg-red-50 border border-red-200' : 'text-stone-500 bg-white/85 border border-stone-200'}`
  }, label));
};
const FortuneTeller = () => {
  // ─── 共用 ───
  const [mode, setMode] = useState('single'); // 'single' | 'chart'
  const [stage, setStage] = useState('input');
  const [gender, setGender] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [aiText, setAiText] = useState('');
  const [showDonate, setShowDonate] = useState(false);

  // ─── 單卦專用 ───
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState(null);
  const [drawnPieces, setDrawnPieces] = useState(null);
  const [shuffledDeck, setShuffledDeck] = useState([]); // 32 張預先洗好的牌
  const [selections, setSelections] = useState([]); // 已選的卡片 index
  const [visiblePieces, setVisiblePieces] = useState([]);

  // ─── 命盤專用 ───
  const [marital, setMarital] = useState(null);
  const [chartInputMethod, setChartInputMethod] = useState('draw'); // 'auto' | 'draw' | 'manual'
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [manualPieces, setManualPieces] = useState({}); // { main: { center: 'r_king', left:..., }, study: {...}, ... }
  const [chartCrosses, setChartCrosses] = useState(null); // 最終解盤資料
  const [chartFromManual, setChartFromManual] = useState(false); // 標記命盤是「自行輸入/手抽」還是「推算」
  const [activePeriod, setActivePeriod] = useState('main');
  // 命盤手抽:預先洗牌的 32 棋(背面顯示)+ 已抽序列
  const [chartDrawDeck, setChartDrawDeck] = useState([]);
  const [chartDrawPicks, setChartDrawPicks] = useState([]);
  // 棋子選取 modal: { periodId, position } | null
  const [pickerSlot, setPickerSlot] = useState(null);
  const typeIntervalRef = useRef(null);
  const isMountedRef = useRef(true);

  // ─── IAP 隨喜 (Google Play Billing 透過 cordova-plugin-purchase) ───
  const [donateModal, setDonateModal] = useState(false);
  const [donateMsg, setDonateMsg] = useState(''); // '' | '處理中…' | '🙏 感謝您的隨喜!' | '購買失敗:…'
  const [iapProducts, setIapProducts] = useState({}); // { donate_30: { price: 'NT$30' }, ... }
  const [iapReady, setIapReady] = useState(false);
  const [isNative, setIsNative] = useState(false); // 是否在 Capacitor APK 內(才能跑 IAP)

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
    };
  }, []);

  // ─── IAP 初始化:Capacitor APK 環境才註冊;Web 環境忽略 ───
  useEffect(() => {
    const setupIap = () => {
      if (!window.CdvPurchase) return; // 純 web 沒有此物件
      setIsNative(true);
      const {
        store,
        ProductType,
        Platform,
        LogLevel
      } = window.CdvPurchase;
      store.verbosity = LogLevel.WARNING;
      store.register([{
        id: 'donate_30',
        type: ProductType.CONSUMABLE,
        platform: Platform.GOOGLE_PLAY
      }, {
        id: 'donate_100',
        type: ProductType.CONSUMABLE,
        platform: Platform.GOOGLE_PLAY
      }, {
        id: 'donate_300',
        type: ProductType.CONSUMABLE,
        platform: Platform.GOOGLE_PLAY
      }]);
      store.when().productUpdated(p => {
        if (!isMountedRef.current) return;
        setIapProducts(prev => ({
          ...prev,
          [p.id]: {
            price: p.pricing && p.pricing.price || ''
          }
        }));
      }).approved(t => {
        t.finish();
      }).finished(() => {
        if (!isMountedRef.current) return;
        setDonateMsg('🙏 感謝您的隨喜!');
      }).receiptUpdated(() => {}).receiptsReady(() => {});
      store.error(err => {
        if (!isMountedRef.current) return;
        // 6500 / 6504 系列大多是「使用者取消」,不顯示為失敗
        const code = err && err.code;
        if (code === 6500 || code === 6504 || code === 6505) {
          setDonateMsg('');
          return;
        }
        setDonateMsg(`購買失敗:${err && err.message || '未知錯誤'}`);
      });
      store.initialize([Platform.GOOGLE_PLAY]).then(() => {
        if (isMountedRef.current) setIapReady(true);
      }).catch(e => console.warn('[IAP] init failed', e));
    };

    // Capacitor 提供 cordova.js,deviceready 後 plugin 才掛上
    if (window.cordova) {
      document.addEventListener('deviceready', setupIap, {
        once: true
      });
    } else if (window.CdvPurchase) {
      setupIap();
    }
  }, []);
  const handleDonate = tier => {
    if (!isNative) {
      setDonateMsg('需在 Google Play 安裝的 App 中才能隨喜。');
      return;
    }
    if (!iapReady) {
      setDonateMsg('IAP 尚未就緒,請稍後再試。');
      return;
    }
    const {
      store
    } = window.CdvPurchase;
    const product = store.get(`donate_${tier}`);
    if (!product) {
      setDonateMsg('找不到此商品(請更新 App 至最新版)。');
      return;
    }
    const offer = product.getOffer();
    if (!offer) {
      setDonateMsg('此商品暫時無法購買。');
      return;
    }
    setDonateMsg('處理中…');
    offer.order().catch(err => {
      if (!isMountedRef.current) return;
      setDonateMsg(`購買失敗:${err && err.message || '取消'}`);
    });
  };

  // a11y:Esc 關閉任一開啟中的 Modal(優先順序:picker → contact → donate)
  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Escape') return;
      if (pickerSlot) {
        setPickerSlot(null);
        return;
      }
      if (showContactModal) {
        setShowContactModal(false);
        return;
      }
      if (donateModal) {
        setDonateModal(false);
        setDonateMsg('');
        return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pickerSlot, showContactModal, donateModal]);
  const getDeck = () => {
    const deck = [];
    const counts = {
      r_king: 1,
      b_king: 1,
      r_guard: 2,
      b_guard: 2,
      r_minister: 2,
      b_minister: 2,
      r_rook: 2,
      b_rook: 2,
      r_knight: 2,
      b_knight: 2,
      r_cannon: 2,
      b_cannon: 2,
      r_pawn: 5,
      b_pawn: 5
    };
    Object.keys(counts).forEach(key => {
      for (let i = 0; i < counts[key]; i++) deck.push({
        ...CHESS_DB[key],
        uid: `${key}_${i}`
      });
    });
    return deck;
  };

  // 各類別預設範例題,選擇類別時自動填入
  const CATEGORY_EXAMPLES = {
    career: '我下個月如果轉職去做業務,發展會順利嗎?',
    wealth: '我今年下半年投資股市,會有獲利嗎?',
    love: '我接下來三個月會遇到正緣對象嗎?',
    general: '我未來半年的整體運勢會如何發展?'
  };
  const ALL_EXAMPLE_TEXTS = Object.values(CATEGORY_EXAMPLES);
  const handleCategoryChange = cat => {
    setCategory(cat);
    // 只在欄位空白或內容仍是某個範例時自動覆寫,
    // 已輸入自己問題的使用者不會被打斷
    const trimmed = question.trim();
    if (!trimmed || ALL_EXAMPLE_TEXTS.includes(trimmed)) {
      setQuestion(CATEGORY_EXAMPLES[cat]);
    }
  };
  const mentionsOtherPerson = text => {
    const cleaned = text.replace(/其他/g, '').replace(/吉他/g, '').replace(/他山之石/g, '').replace(/他鄉/g, '').replace(/她鄉/g, '');
    return cleaned.includes('他') || cleaned.includes('她');
  };

  // preserveBasics=true 時保留 gender / marital(供「單卦↔命盤」模式切換用,
  // 避免使用者反覆勾選);false 為完整重置(供「再卜一卦」按鈕用)。
  const handleReset = (preserveBasics = false) => {
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
    setStage('input');
    setShowContactModal(false);
    setAiText('');
    setShowDonate(false);
    if (!preserveBasics) {
      setGender(null);
      setMarital(null);
    }
    // 單卦
    setQuestion('');
    setCategory(null);
    setDrawnPieces(null);
    setShuffledDeck([]);
    setSelections([]);
    setVisiblePieces([]);
    // 命盤
    setChartInputMethod('draw');
    setChartDrawDeck([]);
    setChartDrawPicks([]);
    setBirthYear('');
    setBirthMonth('');
    setBirthDay('');
    setManualPieces({});
    setChartCrosses(null);
    setChartFromManual(false);
    setActivePeriod('main');
  };

  // === 第 1 步:輸入完成 → 凝神過場 → 進入抽牌階段(單卦) ===
  const handleStart = async () => {
    if (!gender) {
      alert("⚠️ 請先選擇您的性別");
      return;
    }
    if (!category) {
      alert("⚠️ 請先選擇問題類別");
      return;
    }
    if (!question.trim()) {
      alert("⚠️ 請輸入您的問題");
      return;
    }
    if (question.length < 5) {
      alert("⚠️ 問題太短,請包含具體事項與時間");
      return;
    }
    if (mentionsOtherPerson(question)) {
      if (!confirm("⚠️ 溫馨提醒:卦象反映的是『您自己』的能量狀態,請將自己放在第一順位。")) return;
    }

    // 預先洗牌(使用者看不到,等他點選時才對應到位)
    const deck = getDeck();
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setShuffledDeck(shuffled);
    setSelections([]);
    setVisiblePieces([]);

    // 2 秒凝神過場
    setStage('ritual');
    await new Promise(r => setTimeout(r, 2000));
    if (!isMountedRef.current) return;
    setStage('picking');
  };

  // === 第 2 步:使用者依序選 5 張牌 ===
  const handlePickCard = async cardIdx => {
    // 一旦選了,不能再點選同一張或繼續點(避免反悔)
    if (selections.includes(cardIdx)) return;
    if (selections.length >= 5) return;
    const newSels = [...selections, cardIdx];
    setSelections(newSels);
    if (newSels.length < 5) return;

    // 第 5 張選完 → 緩衝 → 揭曉 → 解卦
    await new Promise(r => setTimeout(r, 700));
    if (!isMountedRef.current) return;
    setStage('result');
    const positions = ['center', 'left', 'right', 'up', 'down'];
    const res = {};
    newSels.forEach((idx, i) => {
      res[positions[i]] = shuffledDeck[idx];
    });
    setDrawnPieces(res);
    for (const key of positions) {
      await new Promise(r => setTimeout(r, 650));
      if (!isMountedRef.current) return;
      setVisiblePieces(prev => [...prev, key]);
    }
    await new Promise(r => setTimeout(r, 500));
    if (!isMountedRef.current) return;
    const posDef = POSITION_DEFS_SINGLE[gender] || POSITION_DEFS_SINGLE.male;
    const fullText = composeNarrative(res, {
      category,
      posDef,
      question
    });
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    let i = 0;
    typeIntervalRef.current = setInterval(() => {
      if (!isMountedRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
        return;
      }
      setAiText(fullText.slice(0, i));
      i += 2;
      if (i > fullText.length) {
        setAiText(fullText);
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
        setShowDonate(true);
      }
    }, 12);
  };

  // === 命盤(出生日期推算):輸入完成 → 排盤過場 → 結果 ===
  const handleGenerateChart = async () => {
    if (!gender) {
      alert("⚠️ 請先選擇您的性別");
      return;
    }
    if (!marital) {
      alert("⚠️ 請選擇婚姻狀態");
      return;
    }
    const y = parseInt(birthYear, 10);
    const m = parseInt(birthMonth, 10);
    const d = parseInt(birthDay, 10);
    if (!y || y < 1900 || y > 2100) {
      alert("⚠️ 請輸入正確的西元出生年份");
      return;
    }
    if (!m || m < 1 || m > 12) {
      alert("⚠️ 請輸入正確的月份(1-12)");
      return;
    }
    if (!d || d < 1 || d > 31) {
      alert("⚠️ 請輸入正確的日期(1-31)");
      return;
    }
    setStage('ritual');
    await new Promise(r => setTimeout(r, 2000));
    if (!isMountedRef.current) return;

    // 用出生日期作為 deterministic seed,生成 8 個十字
    const deck = getDeck();
    const seed = birthSeed(y, m, d, 0);
    const crosses = generateChartCrosses(deck, seed);
    setChartCrosses(crosses);
    setChartFromManual(false);
    setActivePeriod('main');
    setStage('result');
  };

  // === 命盤(手抽 32 棋):依序排入 32 個唯一棋位 ===
  const handleStartChartDraw = async () => {
    if (!gender) {
      alert("⚠️ 請先選擇您的性別");
      return;
    }
    if (!marital) {
      alert("⚠️ 請選擇婚姻狀態");
      return;
    }

    // 預先洗牌(使用者看不到)
    const deck = getDeck();
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setChartDrawDeck(shuffled);
    setChartDrawPicks([]);
    setStage('ritual');
    await new Promise(r => setTimeout(r, 2000));
    if (!isMountedRef.current) return;
    setStage('chart_picking');
  };
  const handleChartDrawPick = async cardIdx => {
    if (chartDrawPicks.includes(cardIdx)) return;
    if (chartDrawPicks.length >= 32) return;
    const newPicks = [...chartDrawPicks, cardIdx];
    setChartDrawPicks(newPicks);
    if (newPicks.length < 32) return;

    // 全部抽完 → 短暫緩衝 → 構建命盤 → 結果
    await new Promise(r => setTimeout(r, 700));
    if (!isMountedRef.current) return;

    // 先把 picks 依 (periodId, pos) 索引,再單一輪建構 cross,
    // 確保前段的 down 已填入後,下一段的 up 才繼承
    const piecesByPos = {};
    newPicks.forEach((deckIdx, seqIdx) => {
      const [periodId, pos] = CHART_DRAW_SEQUENCE[seqIdx];
      if (!piecesByPos[periodId]) piecesByPos[periodId] = {};
      piecesByPos[periodId][pos] = chartDrawDeck[deckIdx];
    });
    const crosses = {};
    PERIOD_ORDER.forEach((periodId, idx) => {
      const cross = idx > 0 ? {
        up: crosses[PERIOD_ORDER[idx - 1]].down
      } : {};
      Object.assign(cross, piecesByPos[periodId] || {});
      crosses[periodId] = cross;
    });
    // 71-80 下位 = 總格上位(命盤循環)
    crosses['71-80'].down = crosses.main.up;
    setChartCrosses(crosses);
    setChartFromManual(true);
    setActivePeriod('main');
    setStage('result');
  };

  // === 命盤(自行輸入):驗證 → 過場 → 結果 ===
  // 計算目前已用的棋子(以名稱統計,例如已選了 2 顆「俥」)
  const computeUsage = (manualMap, excludePeriod, excludePos) => {
    const usage = {};
    for (const periodId in manualMap) {
      for (const pos in manualMap[periodId]) {
        if (periodId === excludePeriod && pos === excludePos) continue;
        const k = manualMap[periodId][pos];
        if (!k) continue;
        const name = CHESS_DB[k]?.name;
        if (name) usage[name] = (usage[name] || 0) + 1;
      }
    }
    return usage;
  };
  const updateManualPiece = (periodId, position, key) => {
    if (key) {
      // 防呆:檢查該棋子類型是否已達牌庫上限
      const usage = computeUsage(manualPieces, periodId, position);
      const targetName = CHESS_DB[key]?.name;
      const limit = DECK_LIMITS[targetName] || 0;
      if ((usage[targetName] || 0) >= limit) {
        alert(`⚠️ 「${targetName}」在牌庫中只有 ${limit} 顆,已用完。請選擇其他棋子。`);
        return;
      }
    }
    setManualPieces(prev => ({
      ...prev,
      [periodId]: {
        ...(prev[periodId] || {}),
        [position]: key
      }
    }));
  };
  const handleSubmitManualChart = async () => {
    if (!gender) {
      alert("⚠️ 請先選擇您的性別");
      return;
    }
    if (!marital) {
      alert("⚠️ 請選擇婚姻狀態");
      return;
    }

    // 驗證每段唯一位都有填(總格 5 + 6×4 + 3 = 32 個位置)
    const POS_LABEL = {
      center: '中',
      left: '左',
      right: '右',
      up: '上',
      down: '下'
    };
    for (const period of CHART_PERIODS) {
      const slots = PERIOD_UNIQUE_SLOTS[period.id];
      for (const pos of slots) {
        if (!manualPieces[period.id]?.[pos]) {
          alert(`⚠️ 請填完【${period.label}】的「${POS_LABEL[pos]}」位置`);
          return;
        }
      }
    }
    setStage('ritual');
    await new Promise(r => setTimeout(r, 1500));
    if (!isMountedRef.current) return;

    // 把使用者填的 key 轉成完整棋子物件;構建出帶共用上位的完整 crosses
    const crosses = {};
    PERIOD_ORDER.forEach((periodId, idx) => {
      const cross = {};
      if (idx > 0) {
        cross.up = crosses[PERIOD_ORDER[idx - 1]].down; // 共用前段的下位棋子
      }
      for (const pos of PERIOD_UNIQUE_SLOTS[periodId]) {
        const key = manualPieces[periodId][pos];
        cross[pos] = {
          ...CHESS_DB[key],
          uid: `${periodId}_${pos}_${key}`
        };
      }
      if (periodId === '71-80') {
        cross.down = crosses.main.up; // 命盤循環:71-80下位 = 總格上位
      }
      crosses[periodId] = cross;
    });
    setChartCrosses(crosses);
    setChartFromManual(true);
    setActivePeriod('main');
    setStage('result');
  };
  const handleConsult = () => setShowContactModal(true);
  const handleIG = () => window.open('https://www.instagram.com/jacky.talk?igsh=NDA0bms5NzBiY2Q0', '_blank');
  const getPosition = pos => {
    const spacing = 90;
    switch (pos) {
      case 'center':
        return {
          x: 0,
          y: 0
        };
      case 'left':
        return {
          x: -spacing,
          y: 0
        };
      case 'right':
        return {
          x: spacing,
          y: 0
        };
      case 'up':
        return {
          x: 0,
          y: -spacing
        };
      case 'down':
        return {
          x: 0,
          y: spacing
        };
      default:
        return {
          x: 0,
          y: 0
        };
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col items-center justify-center p-4 overflow-y-auto relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-4 z-10"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-4xl font-black text-stone-800 border-b-4 border-red-900 pb-2 inline-block tracking-widest"
  }, "\u89C0\u68CB\u5FC3\u5F91"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-stone-500 mt-2 font-bold"
  }, "JackyChess \u7DDA\u4E0A\u8C61\u68CB\u535C\u5366\u7CFB\u7D71")), stage === 'input' && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-5 z-20 bg-white/80 p-1 rounded-full shadow-md border border-stone-200"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (mode !== 'single') {
        handleReset(true);
        setMode('single');
      }
    },
    className: `px-6 py-2 rounded-full font-black text-sm transition-all ${mode === 'single' ? 'bg-red-900 text-white shadow-md' : 'text-stone-500 hover:text-stone-700'}`
  }, "\u55AE\u5366"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (mode !== 'chart') {
        handleReset(true);
        setMode('chart');
      }
    },
    className: `px-6 py-2 rounded-full font-black text-sm transition-all ${mode === 'chart' ? 'bg-red-900 text-white shadow-md' : 'text-stone-500 hover:text-stone-700'}`
  }, "\u547D\u76E4")), stage === 'input' && mode === 'single' && /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md animate-pop bg-white/90 p-6 rounded-xl shadow-xl z-50"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mb-2 text-stone-800 font-black text-base"
  }, "1. \u60A8\u7684\u6027\u5225:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 mb-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setGender('male'),
    className: `cat-btn py-2 rounded-lg font-bold ${gender === 'male' ? 'active text-red-900' : 'bg-stone-50 text-stone-600'}`
  }, "\u2642 \u7537\u751F"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setGender('female'),
    className: `cat-btn py-2 rounded-lg font-bold ${gender === 'female' ? 'active text-red-900' : 'bg-stone-50 text-stone-600'}`
  }, "\u2640 \u5973\u751F")), /*#__PURE__*/React.createElement("p", {
    className: "mb-2 text-stone-800 font-black text-base"
  }, "2. \u554F\u984C\u985E\u5225:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 mb-5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleCategoryChange('career'),
    className: `cat-btn py-3 rounded-lg font-bold ${category === 'career' ? 'active text-red-900' : 'bg-stone-50 text-stone-600'}`
  }, "\uD83D\uDCBC \u4E8B\u696D\u5DE5\u4F5C"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleCategoryChange('wealth'),
    className: `cat-btn py-3 rounded-lg font-bold ${category === 'wealth' ? 'active text-red-900' : 'bg-stone-50 text-stone-600'}`
  }, "\uD83D\uDCB0 \u91D1\u9322\u8CA1\u904B"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleCategoryChange('love'),
    className: `cat-btn py-3 rounded-lg font-bold ${category === 'love' ? 'active text-red-900' : 'bg-stone-50 text-stone-600'}`
  }, "\u2764\uFE0F \u611F\u60C5\u5A5A\u59FB"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleCategoryChange('general'),
    className: `cat-btn py-3 rounded-lg font-bold ${category === 'general' ? 'active text-red-900' : 'bg-stone-50 text-stone-600'}`
  }, "\uD83D\uDD2E \u6574\u9AD4\u904B\u52E2")), /*#__PURE__*/React.createElement("p", {
    className: "mb-2 text-stone-800 font-black text-base"
  }, "3. \u5FC3\u4E2D\u7591\u60D1 ", /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-stone-500 font-normal"
  }, "(\u5DF2\u81EA\u52D5\u5E36\u5165\u7BC4\u4F8B,\u53EF\u81EA\u884C\u4FEE\u6539)"), ":"), /*#__PURE__*/React.createElement("div", {
    className: "bg-red-50 border-l-4 border-red-500 p-3 mb-3 text-xs text-red-700 leading-relaxed font-bold"
  }, "\u26A0\uFE0F \u63D0\u554F\u898F\u5247:", /*#__PURE__*/React.createElement("br", null), "1. \u53EA\u80FD\u554F\u300C\u60A8\u81EA\u5DF1\u300D\u7684\u4E8B(\u76F4\u7CFB\u8840\u89AA\u9664\u5916)\u3002", /*#__PURE__*/React.createElement("br", null), "2. \u8ACB\u5305\u542B\u5177\u9AD4\u7684\u300C\u4E8B\u4EF6\u300D\u8207\u300C\u6642\u9593\u300D\u3002", /*#__PURE__*/React.createElement("br", null), "3. \u5366\u8C61\u53EA\u7D66\u65B9\u5411\u4E0D\u7D66\u7D55\u5C0D\u7B54\u6848\u3002"), /*#__PURE__*/React.createElement("textarea", {
    className: "w-full p-3 border-2 border-stone-300 rounded-lg mb-1 h-28 focus:border-red-800 outline-none text-stone-700 bg-white",
    placeholder: "\u8ACB\u9078\u64C7\u4E0A\u65B9\u985E\u5225,\u7CFB\u7D71\u6703\u81EA\u52D5\u5E36\u5165\u8A72\u985E\u5225\u7684\u7BC4\u4F8B\u554F\u984C;\u60A8\u4E5F\u53EF\u4EE5\u81EA\u884C\u66FF\u63DB\u6210\u81EA\u5DF1\u7684\u554F\u984C\u3002",
    maxLength: 150,
    value: question,
    onChange: e => setQuestion(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: `text-right text-xs mb-3 font-bold ${question.length >= 150 ? 'text-red-700' : question.length >= 130 ? 'text-amber-600' : 'text-stone-400'}`
  }, question.length, " / 150 \u5B57"), /*#__PURE__*/React.createElement("button", {
    onClick: handleStart,
    className: "w-full py-4 bg-red-900 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-red-800 active:scale-95 transition-all"
  }, "\u958B\u59CB\u6D17\u724C")), stage === 'input' && mode === 'chart' && /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md animate-pop bg-white/90 p-6 rounded-xl shadow-xl z-50"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-500 mb-4 leading-relaxed"
  }, "\u547D\u76E4\u5448\u73FE\u60A8\u4E00\u751F\u7684\u683C\u5C40,\u8B93\u6211\u5011\u5728\u6BCF\u500B\u8F49\u6298\u6642\u523B,\u90FD\u80FD\u6709\u65B9\u5411\u3001\u6709\u6E96\u5099\u3002", /*#__PURE__*/React.createElement("br", null), "\u4E00\u65E6\u63A8\u7B97\u4FBF\u5982\u5875\u57C3\u843D\u5B9A,", /*#__PURE__*/React.createElement("span", {
    className: "text-red-700 font-bold"
  }, "\u4E0D\u53EF\u518D\u91CD\u62BD"), " \u2500 \u8ACB\u61F7\u8457\u614E\u91CD\u7684\u5FC3,\u5982\u5BE6\u8F38\u5165\u60A8\u7684\u51FA\u751F\u8CC7\u6599\u3002"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-1 mb-5 p-1 bg-stone-100 rounded-full"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setChartInputMethod('draw'),
    className: `px-3 py-2 rounded-full text-sm font-bold transition-all ${chartInputMethod === 'draw' ? 'bg-red-900 text-white shadow' : 'text-stone-500 hover:text-stone-700'}`
  }, "\uD83C\uDFB4 \u624B\u62BD 32 \u68CB"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setChartInputMethod('manual'),
    className: `px-3 py-2 rounded-full text-sm font-bold transition-all ${chartInputMethod === 'manual' ? 'bg-red-900 text-white shadow' : 'text-stone-500 hover:text-stone-700'}`
  }, "\u270D\uFE0F \u81EA\u884C\u8F38\u5165\u547D\u76E4")), chartInputMethod === 'draw' && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-500 bg-stone-50 border-l-4 border-red-300 p-3 mb-4 leading-relaxed"
  }, "\u51DD\u795E\u4E4B\u5F8C,\u4F9D\u5E8F\u62BD 32 \u5F35\u68CB,\u7CFB\u7D71\u6703\u81EA\u52D5\u4F9D\u300C\u7E3D\u683C\u2192\u5341\u5E74\u904B\u300D\u9806\u5E8F\u6392\u5165\u547D\u76E4\u3002"), chartInputMethod === 'manual' && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-500 bg-stone-50 border-l-4 border-stone-300 p-3 mb-4 leading-relaxed"
  }, "\u82E5\u60A8\u5DF2\u5F9E\u8001\u5E2B\u8655\u53D6\u5F97\u547D\u76E4,\u53EF\u5728\u6B64\u81EA\u884C\u8F38\u5165(\u5171 32 \u500B\u552F\u4E00\u68CB\u4F4D),\u770B\u672C\u7CFB\u7D71\u5982\u4F55\u89E3\u76E4\u3002"), /*#__PURE__*/React.createElement("p", {
    className: "mb-2 text-stone-800 font-black text-base"
  }, "1. \u60A8\u7684\u6027\u5225:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 mb-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setGender('male'),
    className: `cat-btn py-2 rounded-lg font-bold ${gender === 'male' ? 'active text-red-900' : 'bg-stone-50 text-stone-600'}`
  }, "\u2642 \u7537\u751F"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setGender('female'),
    className: `cat-btn py-2 rounded-lg font-bold ${gender === 'female' ? 'active text-red-900' : 'bg-stone-50 text-stone-600'}`
  }, "\u2640 \u5973\u751F")), /*#__PURE__*/React.createElement("p", {
    className: "mb-2 text-stone-800 font-black text-base"
  }, "2. \u5A5A\u59FB\u72C0\u614B:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 mb-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMarital('single'),
    className: `cat-btn py-2 rounded-lg font-bold ${marital === 'single' ? 'active text-red-900' : 'bg-stone-50 text-stone-600'}`
  }, "\u672A\u5A5A"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMarital('married'),
    className: `cat-btn py-2 rounded-lg font-bold ${marital === 'married' ? 'active text-red-900' : 'bg-stone-50 text-stone-600'}`
  }, "\u5DF2\u5A5A")), chartInputMethod === 'draw' && /*#__PURE__*/React.createElement("button", {
    onClick: handleStartChartDraw,
    className: "w-full py-4 bg-red-900 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-red-800 active:scale-95 transition-all"
  }, "\u958B\u59CB\u62BD\u68CB"), chartInputMethod === 'manual' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "mb-2 text-stone-800 font-black text-base"
  }, "3. \u4F9D\u6559\u6750\u6392\u7248\u8F38\u5165\u60A8\u7684\u547D\u76E4:"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-500 mb-3 leading-relaxed"
  }, "\u2713 \u9EDE\u9078\u4EFB\u4E00\u7A7A\u767D\u5713\u5708\u5373\u53EF\u9078\u64C7\u68CB\u5B50", /*#__PURE__*/React.createElement("br", null), "\u2713 \u5DF2\u586B\u7684\u5713\u5708\u518D\u6B21\u9EDE\u9078\u53EF\u66F4\u63DB", /*#__PURE__*/React.createElement("br", null), "\u2713 \u68CB\u5B50\u984F\u8272\u5167\u5EFA(\u5E25\u4ED5\u76F8\u4FE5\u508C\u70AE\u5175=\u7D05,\u5C07\u58EB\u8C61\u8ECA\u99AC\u5305\u5352=\u9ED1)"), /*#__PURE__*/React.createElement("div", {
    className: "input-period-list mb-5"
  }, CHART_PERIODS.map((period, pidx) => {
    const slots = PERIOD_UNIQUE_SLOTS[period.id];
    const filled = slots.filter(p => manualPieces[period.id]?.[p]).length;
    const need = slots.length;
    // 推導上位:總格用自己的 up,其他段用前段的 down
    const prevId = pidx > 0 ? PERIOD_ORDER[pidx - 1] : null;
    const inheritedUpKey = prevId ? manualPieces[prevId]?.down : null;
    const ownUpKey = manualPieces[period.id]?.up;
    const upPiece = period.id === 'main' ? ownUpKey ? CHESS_DB[ownUpKey] : null : inheritedUpKey ? CHESS_DB[inheritedUpKey] : null;
    // 71-80 段的 down 位 = 總格 main.up(命盤循環),不可手動點選,直接顯示繼承棋子
    const downPiece = period.id === '71-80' ? manualPieces.main?.up ? CHESS_DB[manualPieces.main.up] : null : manualPieces[period.id]?.down ? CHESS_DB[manualPieces[period.id].down] : null;
    return /*#__PURE__*/React.createElement("div", {
      key: period.id,
      className: "input-period-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row-title"
    }, pidx === 0 ? '★ ' : `${pidx}. `, period.label), /*#__PURE__*/React.createElement("div", {
      className: "row-hint"
    }, period.hint), /*#__PURE__*/React.createElement("div", {
      className: `row-progress ${filled === need ? 'done' : 'todo'}`
    }, filled === need ? '✓ 已填完' : `已填 ${filled} / ${need}`), pidx > 0 && /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-stone-400 mt-0.5"
    }, "\u4E0A\u4F4D = \u524D\u6BB5\u7684\u4E0B\u4F4D(\u81EA\u52D5\u5E36\u5165)"), period.id === '71-80' && /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-red-400 mt-0.5"
    }, "\u4E0B\u4F4D = \u7E3D\u683C\u4E0A\u4F4D(\u547D\u76E4\u5FAA\u74B0)")), /*#__PURE__*/React.createElement("div", {
      className: "cross-mini"
    }, /*#__PURE__*/React.createElement("div", null), period.id === 'main' ? /*#__PURE__*/React.createElement(MiniPieceSlot, {
      piece: upPiece,
      position: "up",
      onClick: () => setPickerSlot({
        periodId: period.id,
        position: 'up'
      })
    }) : /*#__PURE__*/React.createElement(MiniPieceSlot, {
      piece: upPiece,
      position: "up"
    }), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement(MiniPieceSlot, {
      piece: manualPieces[period.id]?.left && CHESS_DB[manualPieces[period.id].left],
      position: "left",
      onClick: () => setPickerSlot({
        periodId: period.id,
        position: 'left'
      })
    }), /*#__PURE__*/React.createElement(MiniPieceSlot, {
      piece: manualPieces[period.id]?.center && CHESS_DB[manualPieces[period.id].center],
      position: "center",
      isCenter: true,
      onClick: () => setPickerSlot({
        periodId: period.id,
        position: 'center'
      })
    }), /*#__PURE__*/React.createElement(MiniPieceSlot, {
      piece: manualPieces[period.id]?.right && CHESS_DB[manualPieces[period.id].right],
      position: "right",
      onClick: () => setPickerSlot({
        periodId: period.id,
        position: 'right'
      })
    }), /*#__PURE__*/React.createElement("div", null), period.id === '71-80' ? /*#__PURE__*/React.createElement(MiniPieceSlot, {
      piece: downPiece,
      position: "down"
    }) : /*#__PURE__*/React.createElement(MiniPieceSlot, {
      piece: downPiece,
      position: "down",
      onClick: () => setPickerSlot({
        periodId: period.id,
        position: 'down'
      })
    }), /*#__PURE__*/React.createElement("div", null)));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleSubmitManualChart,
    className: "w-full py-4 bg-red-900 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-red-800 active:scale-95 transition-all"
  }, "\u958B\u59CB\u89E3\u76E4"))), stage === 'ritual' && /*#__PURE__*/React.createElement("div", {
    className: "relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center mb-8 z-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mystic-aura"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mystic-aura inner"
  }), /*#__PURE__*/React.createElement("div", {
    className: "center-glow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ritual-text px-4"
  }, mode === 'single' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "text-stone-700 font-black text-lg sm:text-xl mb-3 tracking-widest"
  }, "\u51DD\u795E\u4E2D"), /*#__PURE__*/React.createElement("p", {
    className: "text-stone-500 text-xs sm:text-sm leading-relaxed"
  }, "\u8ACB\u5728\u5FC3\u4E2D\u9ED8\u5FF5", /*#__PURE__*/React.createElement("span", {
    className: "dot-1"
  }, "."), /*#__PURE__*/React.createElement("span", {
    className: "dot-2"
  }, "."), /*#__PURE__*/React.createElement("span", {
    className: "dot-3"
  }, "."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "text-stone-600 font-bold"
  }, "\u300C\u6211\u60F3\u77E5\u9053 ", question.length > 0 ? question.trim().slice(0, 12) + (question.length > 12 ? '…' : '') : '___', "\u300D"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "text-stone-400"
  }, "\u606D\u8ACB\u6307\u5C0E\u9748\u7D66\u4E88\u6307\u793A"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "text-stone-700 font-black text-lg sm:text-xl mb-3 tracking-widest"
  }, "\u6392\u76E4\u4E2D"), /*#__PURE__*/React.createElement("p", {
    className: "text-stone-500 text-xs sm:text-sm leading-relaxed"
  }, "\u6B63\u5728\u4F9D\u60A8\u7684\u51FA\u751F\u6642\u8FB0", /*#__PURE__*/React.createElement("br", null), "\u63A8\u7B97\u9019\u4E00\u751F\u7684\u80FD\u91CF\u5730\u5716", /*#__PURE__*/React.createElement("span", {
    className: "dot-1"
  }, "."), /*#__PURE__*/React.createElement("span", {
    className: "dot-2"
  }, "."), /*#__PURE__*/React.createElement("span", {
    className: "dot-3"
  }, "."))))), stage === 'chart_picking' && (() => {
    const pickedCount = chartDrawPicks.length;
    const POS_LABEL = {
      center: '中',
      left: '左',
      right: '右',
      up: '上',
      down: '下'
    };
    const nextSlot = pickedCount < 32 ? CHART_DRAW_SEQUENCE[pickedCount] : null;
    const nextPeriodDef = nextSlot ? CHART_PERIODS.find(p => p.id === nextSlot[0]) : null;
    return /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-md flex flex-col items-center mb-8 z-10 px-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center mb-4"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-stone-700 font-bold text-base mb-1"
    }, "\u8ACB\u4F9D\u5E8F\u62BD ", /*#__PURE__*/React.createElement("span", {
      className: "text-red-800"
    }, "32 \u5F35"), " \u68CB"), nextSlot ? /*#__PURE__*/React.createElement("p", {
      className: "text-red-700 text-sm font-bold"
    }, "\u7B2C ", /*#__PURE__*/React.createElement("span", {
      className: "text-2xl mx-1"
    }, pickedCount + 1), " \u5F35 \u2192 \u3010", nextPeriodDef?.label, "\u3011\u300C", POS_LABEL[nextSlot[1]], "\u300D\u4F4D") : /*#__PURE__*/React.createElement("p", {
      className: "text-stone-500 text-sm font-bold"
    }, "32 \u5F35\u5DF2\u62BD\u5B8C,\u5373\u5C07\u63ED\u66C9", /*#__PURE__*/React.createElement("span", {
      className: "dot-1"
    }, "."), /*#__PURE__*/React.createElement("span", {
      className: "dot-2"
    }, "."), /*#__PURE__*/React.createElement("span", {
      className: "dot-3"
    }, ".")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-400 mt-1"
    }, "\u26A0\uFE0F \u4E00\u65E6\u9078\u5B9A,\u4E0D\u53EF\u53CD\u6094")), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-8 gap-1.5 sm:gap-2 mb-3"
    }, Array.from({
      length: 32
    }, (_, i) => {
      const order = chartDrawPicks.indexOf(i);
      const selected = order >= 0;
      const locked = !selected && pickedCount >= 32;
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: () => handleChartDrawPick(i),
        disabled: selected || pickedCount >= 32,
        className: `pickable-card ${selected ? 'selected' : ''} ${locked ? 'locked' : ''}`
      }, selected && /*#__PURE__*/React.createElement("span", {
        className: "text-xs sm:text-base font-black"
      }, order + 1));
    })), /*#__PURE__*/React.createElement("p", {
      className: "text-stone-400 text-xs"
    }, "\u5DF2\u62BD ", pickedCount, " / 32"));
  })(), stage === 'picking' && /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md flex flex-col items-center mb-8 z-10 px-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-stone-700 font-bold text-base mb-1"
  }, "\u8ACB\u4F9D\u60A8\u7684\u5FC3\u5FF5,\u4F9D\u5E8F\u9078\u64C7 ", /*#__PURE__*/React.createElement("span", {
    className: "text-red-800"
  }, "5 \u5F35"), " \u68CB\u724C"), selections.length < 5 ? /*#__PURE__*/React.createElement("p", {
    className: "text-red-700 text-sm font-bold"
  }, "\u6B63\u5728\u9078\u7B2C ", /*#__PURE__*/React.createElement("span", {
    className: "text-2xl mx-1"
  }, selections.length + 1), " \u5F35(\u5171 5 \u5F35)") : /*#__PURE__*/React.createElement("p", {
    className: "text-stone-500 text-sm font-bold"
  }, "\u5DF2\u9078\u6EFF,\u5373\u5C07\u63ED\u66C9", /*#__PURE__*/React.createElement("span", {
    className: "dot-1"
  }, "."), /*#__PURE__*/React.createElement("span", {
    className: "dot-2"
  }, "."), /*#__PURE__*/React.createElement("span", {
    className: "dot-3"
  }, ".")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-400 mt-1"
  }, "\u26A0\uFE0F \u4E00\u65E6\u9078\u5B9A,\u4E0D\u53EF\u53CD\u6094")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-8 gap-1.5 sm:gap-2 mb-3"
  }, Array.from({
    length: 32
  }, (_, i) => {
    const order = selections.indexOf(i);
    const selected = order >= 0;
    const orderChar = '①②③④⑤'.charAt(order);
    const locked = !selected && selections.length >= 5;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => handlePickCard(i),
      disabled: selected || selections.length >= 5,
      className: `pickable-card ${selected ? 'selected' : ''} ${locked ? 'locked' : ''}`,
      "aria-label": selected ? `第 ${order + 1} 張` : `卡片 ${i + 1}`
    }, selected && /*#__PURE__*/React.createElement("span", {
      className: "text-2xl sm:text-3xl"
    }, orderChar));
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-stone-400 text-xs"
  }, "\u5DF2\u9078 ", selections.length, " / 5")), stage === 'result' && mode === 'single' && /*#__PURE__*/React.createElement("div", {
    className: "relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center mb-8 z-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 border-2 border-dashed border-stone-300 rounded-full opacity-50"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-8 border border-dashed border-stone-200 rounded-full opacity-60"
  }), visiblePieces.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "cross-line h"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cross-line v"
  })), drawnPieces && /*#__PURE__*/React.createElement(React.Fragment, null, visiblePieces.includes('center') && /*#__PURE__*/React.createElement(ChessPiece, _extends({
    piece: drawnPieces.center
  }, getPosition('center'), {
    isCenter: true
  })), visiblePieces.includes('left') && /*#__PURE__*/React.createElement(ChessPiece, _extends({
    piece: drawnPieces.left
  }, getPosition('left'))), visiblePieces.includes('right') && /*#__PURE__*/React.createElement(ChessPiece, _extends({
    piece: drawnPieces.right
  }, getPosition('right'))), visiblePieces.includes('up') && /*#__PURE__*/React.createElement(ChessPiece, _extends({
    piece: drawnPieces.up
  }, getPosition('up'))), visiblePieces.includes('down') && /*#__PURE__*/React.createElement(ChessPiece, _extends({
    piece: drawnPieces.down
  }, getPosition('down'))))), stage === 'result' && mode === 'single' && aiText && /*#__PURE__*/React.createElement("div", {
    className: "max-w-2xl w-full bg-white/95 p-6 rounded-xl shadow-2xl border-t-4 border-red-900 animate-pop mb-12 z-20"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-black text-stone-800 mb-4 flex items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-6 bg-red-900 mr-2 rounded"
  }), "\u5366\u8C61\u89E3\u6790"), /*#__PURE__*/React.createElement("div", {
    className: "whitespace-pre-line text-stone-800 leading-relaxed font-medium min-h-[100px] text-justify text-sm sm:text-base"
  }, aiText), showDonate && /*#__PURE__*/React.createElement("div", {
    className: "mt-8 animate-pop"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => window.open('https://portaly.cc/Jackychess', '_blank'),
    className: "w-full mb-3 py-3 border-2 border-stone-200 text-stone-600 bg-stone-50 rounded-xl font-bold shadow-sm hover:bg-stone-100 hover:border-stone-300 hover:text-stone-800 transition active:scale-95 flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "16",
    x2: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12.01",
    y2: "8"
  })), "\u95DC\u65BC Jacky"), /*#__PURE__*/React.createElement("button", {
    onClick: handleConsult,
    className: "w-full mb-3 py-3 bg-[#06c755] text-white rounded-full font-bold shadow-lg hover:scale-105 transition active:scale-95 flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 10.5C22 5.25 17.5 1 12 1S2 5.25 2 10.5c0 4.7 3.65 8.6 8.53 9.3-.12.87-.45 2.26-1.12 3.1 0 0 4.12-.35 7.6-3.8A9.3 9.3 0 0 0 22 10.5z"
  })), "\u9810\u7D04\u8AEE\u8A62"), isNative && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDonateMsg('');
      setDonateModal(true);
    },
    className: "w-full mb-3 py-3 border-2 border-amber-300 bg-amber-50 text-amber-800 rounded-xl font-bold hover:bg-amber-100 transition active:scale-95 flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDE4F"), " \u96A8\u559C\u652F\u6301"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleReset(false),
    className: "w-full py-3 border-2 border-dashed border-stone-300 text-stone-400 rounded-xl font-bold hover:bg-stone-50 hover:text-stone-600 transition active:scale-95"
  }, "\u21BA \u518D\u535C\u4E00\u5366"))), stage === 'result' && mode === 'chart' && chartCrosses && (() => {
    const chartPosDef = POSITION_DEFS_CHART[`${gender}_${marital}`] || POSITION_DEFS_CHART.male_single;
    // 構建 17 行可視化資料(以教材排版)
    // 每段:第一段渲染上+中+下,後續段只渲染中+下(上承上一段)
    const chainRows = [];
    PERIOD_ORDER.forEach((id, idx) => {
      const cross = chartCrosses[id];
      const def = CHART_PERIODS.find(p => p.id === id);
      if (idx === 0) {
        chainRows.push({
          kind: 'single',
          piece: cross.up,
          primary: id,
          label: def.label,
          isLabel: true
        });
      }
      chainRows.push({
        kind: 'triple',
        pieces: [cross.left, cross.center, cross.right],
        primary: id,
        label: def.label,
        isLabel: idx > 0
      });
      // 渲染下位:71-80 的下=主上,但仍渲染最後一行(代表循環)
      chainRows.push({
        kind: 'single',
        piece: cross.down,
        primary: id,
        secondary: PERIOD_ORDER[idx + 1] || null
      });
    });
    const activeDef = CHART_PERIODS.find(p => p.id === activePeriod) || CHART_PERIODS[0];
    const activeCross = chartCrosses[activePeriod];
    const activeNarrative = composeChartFullNarrative(activeCross, {
      posDef: chartPosDef,
      periodLabel: activeDef.label,
      isMain: activePeriod === 'main',
      periodId: activePeriod,
      allCrosses: chartCrosses
    });

    // 取得列高亮類型:active(主段中央) / active-edge(被分享之邊界行)
    const getRowHL = row => {
      if (row.primary === activePeriod) return 'active';
      if (row.secondary === activePeriod) return 'active-edge';
      return '';
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-3xl flex flex-col items-center z-20"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center mb-3 text-xs text-stone-500"
    }, gender === 'male' ? '♂ 男' : '♀ 女', " \u30FB ", marital === 'married' ? '已婚' : '未婚'), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 text-center mb-3"
    }, "\u9EDE\u9078\u4EFB\u4E00\u6BB5\u67E5\u770B\u8A73\u7D30\u89E3\u6790 \u2500 \u4E0A\u4E00\u6BB5\u7684\u4E0B\u4F4D\u5373\u4E0B\u4E00\u6BB5\u7684\u4E0A\u4F4D(\u5171\u7528\u540C\u4E00\u68CB)"), /*#__PURE__*/React.createElement("div", {
      className: "w-full flex flex-col lg:flex-row gap-4 mb-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "lg:w-2/5 flex-shrink-0 bg-white/85 rounded-xl shadow-lg p-3 relative"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold text-stone-500 text-center mb-2 tracking-wider"
    }, "\u2500 \u547D\u76E4(\u6559\u6750\u6392\u6CD5)\u2500"), /*#__PURE__*/React.createElement("div", {
      className: "chart-chain-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "chart-chain"
    }, chainRows.map((row, ri) => {
      const hl = getRowHL(row);
      const onClick = () => setActivePeriod(row.primary);
      if (row.kind === 'single') {
        const piece = row.piece;
        const colorClass = piece?.color === 'red' ? 'red' : 'black';
        return /*#__PURE__*/React.createElement("div", {
          key: ri,
          className: `chain-row ${hl}`,
          onClick: onClick
        }, /*#__PURE__*/React.createElement("div", {
          className: `chain-piece ${colorClass}`
        }, piece?.name));
      }
      return /*#__PURE__*/React.createElement("div", {
        key: ri,
        className: `chain-row ${hl}`,
        onClick: onClick
      }, row.pieces.map((p, pi) => {
        const cc = p?.color === 'red' ? 'red' : 'black';
        return /*#__PURE__*/React.createElement("div", {
          key: pi,
          className: `chain-piece ${cc}`
        }, p?.name);
      }));
    })), /*#__PURE__*/React.createElement("p", {
      className: "chain-cycle-hint"
    }, "\u21BB \u6700\u5F8C\u4E00\u68CB\u63A5\u56DE\u6700\u4E0A\u65B9\u7B2C\u4E00\u68CB(\u547D\u76E4\u5FAA\u74B0)")), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 pt-3 border-t border-stone-200"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-stone-400 text-center mb-2"
    }, "\u2500 \u6BB5\u843D\u5FEB\u9078 \u2500"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-1"
    }, CHART_PERIODS.map(p => /*#__PURE__*/React.createElement("button", {
      key: p.id,
      onClick: () => setActivePeriod(p.id),
      className: `text-xs py-1 px-2 rounded font-bold transition-all ${activePeriod === p.id ? 'bg-red-900 text-white' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'}`
    }, p.label))))), /*#__PURE__*/React.createElement("div", {
      className: "lg:flex-1 bg-white/95 p-5 rounded-xl shadow-2xl border-t-4 border-red-900 animate-pop"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "text-xl font-black text-stone-800 inline-block border-b-2 border-red-900 pb-1"
    }, activeDef.label), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 mt-1"
    }, activeDef.hint)), /*#__PURE__*/React.createElement("div", {
      className: "whitespace-pre-line text-stone-800 leading-relaxed font-medium text-justify text-sm sm:text-base"
    }, activeNarrative))), /*#__PURE__*/React.createElement("div", {
      className: "w-full max-w-2xl mb-12"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => window.open('https://portaly.cc/Jackychess', '_blank'),
      className: "w-full mb-3 py-3 border-2 border-stone-200 text-stone-600 bg-stone-50 rounded-xl font-bold shadow-sm hover:bg-stone-100 hover:border-stone-300 hover:text-stone-800 transition active:scale-95 flex items-center justify-center gap-2"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12.01",
      y2: "8"
    })), "\u95DC\u65BC Jacky"), /*#__PURE__*/React.createElement("button", {
      onClick: handleConsult,
      className: "w-full mb-3 py-3 bg-[#06c755] text-white rounded-full font-bold shadow-lg hover:scale-105 transition active:scale-95 flex items-center justify-center gap-2"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M22 10.5C22 5.25 17.5 1 12 1S2 5.25 2 10.5c0 4.7 3.65 8.6 8.53 9.3-.12.87-.45 2.26-1.12 3.1 0 0 4.12-.35 7.6-3.8A9.3 9.3 0 0 0 22 10.5z"
    })), "\u9810\u7D04\u8AEE\u8A62"), isNative && /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setDonateMsg('');
        setDonateModal(true);
      },
      className: "w-full py-3 border-2 border-amber-300 bg-amber-50 text-amber-800 rounded-xl font-bold hover:bg-amber-100 transition active:scale-95 flex items-center justify-center gap-2"
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDE4F"), " \u96A8\u559C\u652F\u6301"), /*#__PURE__*/React.createElement("p", {
      className: "text-center text-xs text-stone-400 mt-4 italic"
    }, "\u547D\u76E4\u662F\u4E00\u751F\u7684\u683C\u5C40 \u2500 \u63A8\u7B97\u5F8C\u4FBF\u4E0D\u518D\u91CD\u62BD\u3002", /*#__PURE__*/React.createElement("br", null), "\u6B61\u8FCE\u5207\u56DE\u4E0A\u65B9\u7684\u3010\u55AE\u5366\u3011,\u91DD\u5C0D\u5177\u9AD4\u4E8B\u9805\u53E6\u884C\u535C\u554F\u3002")));
  })(), pickerSlot && (() => {
    const periodDef = CHART_PERIODS.find(p => p.id === pickerSlot.periodId);
    const POS_LABEL = {
      center: '中',
      left: '左',
      right: '右',
      up: '上'
    };
    // 計算除了當前 slot 外其他位置已用了多少同名棋子
    const usage = computeUsage(manualPieces, pickerSlot.periodId, pickerSlot.position);
    const renderRow = (keys, colorClass) => /*#__PURE__*/React.createElement("div", {
      className: "picker-grid mb-2"
    }, keys.map(key => {
      const p = CHESS_DB[key];
      const used = usage[p.name] || 0;
      const limit = DECK_LIMITS[p.name];
      const remaining = limit - used;
      const disabled = remaining <= 0;
      const handlePick = disabled ? undefined : () => {
        updateManualPiece(pickerSlot.periodId, pickerSlot.position, key);
        setPickerSlot(null);
      };
      return /*#__PURE__*/React.createElement("div", {
        key: key,
        role: "button",
        tabIndex: disabled ? -1 : 0,
        "aria-disabled": disabled,
        "aria-label": `${p.name},牌庫剩 ${remaining} 顆,共 ${limit} 顆${disabled ? ',已用完' : ''}`,
        onClick: handlePick,
        onKeyDown: handlePick ? e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePick();
          }
        } : undefined,
        title: `${p.name} ─ 牌庫 ${limit} 顆 / 剩 ${remaining}`,
        className: `picker-piece ${colorClass} ${disabled ? 'disabled' : ''}`
      }, /*#__PURE__*/React.createElement("span", {
        className: "picker-piece-name"
      }, p.name), /*#__PURE__*/React.createElement("span", {
        className: "picker-piece-count"
      }, remaining, "/", limit));
    }));
    return /*#__PURE__*/React.createElement("div", {
      className: "modal-overlay",
      onClick: () => setPickerSlot(null)
    }, /*#__PURE__*/React.createElement("div", {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "\u9078\u64C7\u68CB\u5B50",
      className: "bg-white p-5 rounded-xl shadow-2xl max-w-md w-11/12 relative animate-pop",
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("button", {
      "aria-label": "\u95DC\u9589",
      className: "absolute top-2 right-3 text-3xl text-stone-400 hover:text-stone-600",
      onClick: () => setPickerSlot(null)
    }, "\xD7"), /*#__PURE__*/React.createElement("h3", {
      className: "text-base font-black text-stone-800 mb-1 text-center"
    }, "\u9078\u64C7\u68CB\u5B50"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-stone-500 text-center mb-3"
    }, "\u3010", periodDef?.label, "\u3011 / \u300C", POS_LABEL[pickerSlot.position], "\u300D\u4F4D"), /*#__PURE__*/React.createElement("p", {
      className: "text-[10px] text-stone-400 text-center mb-3"
    }, "\u6BCF\u9846\u68CB\u5B50\u4E0B\u65B9\u986F\u793A\u300C\u5269\u9918 / \u724C\u5EAB\u7E3D\u6578\u300D \u2500 \u7528\u5B8C\u5373\u7121\u6CD5\u518D\u9078"), renderRow(['r_king', 'r_guard', 'r_minister', 'r_rook', 'r_knight', 'r_cannon', 'r_pawn'], 'red'), renderRow(['b_king', 'b_guard', 'b_minister', 'b_rook', 'b_knight', 'b_cannon', 'b_pawn'], 'black')));
  })(), donateModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => {
      setDonateModal(false);
      setDonateMsg('');
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-10/12 relative animate-pop",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "absolute top-2 right-3 text-3xl text-stone-400 hover:text-stone-600",
    onClick: () => {
      setDonateModal(false);
      setDonateMsg('');
    },
    "aria-label": "\u95DC\u9589"
  }, "\xD7"), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-black text-stone-800 mb-1"
  }, "\uD83D\uDE4F \u96A8\u559C\u652F\u6301"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-500 mb-5"
  }, "\u5982\u679C\u9019\u6B21\u89E3\u5366\u5C0D\u60A8\u6709\u5E6B\u52A9,\u6B61\u8FCE\u96A8\u610F\u652F\u6301(\u5B8C\u5168\u81EA\u7531,\u4E0D\u5F71\u97FF\u5366\u8C61)"), !isNative && /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4"
  }, "\u9700\u5728 Google Play \u5B89\u88DD\u7684 App \u4E2D\u624D\u80FD\u96A8\u559C\u3002\u7DB2\u9801\u7248\u8ACB\u6539\u9EDE [\u95DC\u65BC Jacky] \u6216 [\u9810\u7D04\u8AEE\u8A62]\u3002"), isNative && /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 mb-3"
  }, [{
    tier: 30,
    label: '一杯飲料',
    emoji: '☕'
  }, {
    tier: 100,
    label: '一頓便當',
    emoji: '🍱'
  }, {
    tier: 300,
    label: '一份心意',
    emoji: '🌹'
  }].map(({
    tier,
    label,
    emoji
  }) => {
    const product = iapProducts[`donate_${tier}`];
    const priceStr = product && product.price || `NT$${tier}`;
    const disabled = !iapReady || donateMsg === '處理中…';
    return /*#__PURE__*/React.createElement("button", {
      key: tier,
      onClick: () => handleDonate(tier),
      disabled: disabled,
      className: "w-full py-3 px-4 border-2 border-stone-200 hover:border-amber-400 rounded-xl flex items-center justify-between transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-medium text-stone-700"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mr-2 text-lg"
    }, emoji), label), /*#__PURE__*/React.createElement("span", {
      className: "font-black text-amber-700"
    }, priceStr));
  })), donateMsg && /*#__PURE__*/React.createElement("p", {
    className: `text-center text-sm py-2 px-3 rounded mt-3 ${donateMsg.indexOf('🙏') === 0 ? 'bg-green-50 text-green-700 font-bold' : donateMsg.indexOf('失敗') >= 0 ? 'bg-red-50 text-red-700' : 'bg-stone-50 text-stone-600'}`
  }, donateMsg), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-stone-400 text-center mt-4 leading-relaxed"
  }, "\u900F\u904E Google Play \u5B89\u5168\u4ED8\u6B3E \u30FB \u96A8\u559C 100% \u7528\u65BC\u7CFB\u7D71\u7DAD\u904B\u8207\u5275\u4F5C"))), showContactModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setShowContactModal(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-xl shadow-2xl max-w-sm w-10/12 text-center relative animate-pop",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("button", {
    className: "absolute top-2 right-3 text-3xl text-stone-400 hover:text-stone-600",
    onClick: () => setShowContactModal(false)
  }, "\xD7"), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-black text-stone-800 mb-4 border-b pb-2"
  }, "\u9810\u7D04\u6DF1\u5EA6\u8AEE\u8A62"), /*#__PURE__*/React.createElement("div", {
    className: "bg-stone-50 p-2 border border-stone-200 rounded-lg inline-block mb-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://qr-official.line.me/gs/M_587wduxm_GW.png?oat_content=qr",
    alt: "Line QR",
    className: "w-40 h-40 object-contain"
  })), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-stone-500 mb-4"
  }, "\u6383\u63CF\u6216\u9EDE\u64CA\u4E0B\u65B9\u6309\u9215\u52A0\u5165\u5B98\u65B9 LINE"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => window.open('https://line.me/R/ti/p/%40587wduxm', '_blank'),
    className: "w-full py-3 bg-[#06c755] text-white rounded-lg font-bold shadow hover:bg-[#05b34c] transition flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "LINE"), " \u52A0\u5165\u597D\u53CB\u9810\u7D04"), /*#__PURE__*/React.createElement("button", {
    onClick: handleIG,
    className: "w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-bold shadow hover:opacity-90 transition flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
  })), "\u8FFD\u8E64 Instagram")))));
};

// Error Boundary:捕捉任何 render / 生命週期錯誤,避免整頁白屏。
// 顯示錯誤訊息 + 重新整理按鈕,而非無聲死亡。
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      msg: ''
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      msg: error && error.message ? error.message : String(error)
    };
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '40px 20px',
          textAlign: 'center',
          fontFamily: "'Noto Serif TC', serif",
          color: '#7f1d1d',
          lineHeight: 1.7,
          maxWidth: '480px',
          margin: '40px auto'
        }
      }, /*#__PURE__*/React.createElement("h2", {
        style: {
          fontSize: '20px',
          marginBottom: '12px',
          fontWeight: 900
        }
      }, "\u9801\u9762\u9047\u5230\u932F\u8AA4"), /*#__PURE__*/React.createElement("p", {
        style: {
          color: '#78716c',
          fontSize: '13px',
          marginBottom: '8px'
        }
      }, "\u8ACB\u91CD\u65B0\u6574\u7406\u9801\u9762\u518D\u8A66\u4E00\u6B21\u3002"), /*#__PURE__*/React.createElement("p", {
        style: {
          color: '#a8a29e',
          fontSize: '11px',
          marginBottom: '20px',
          wordBreak: 'break-word'
        }
      }, this.state.msg), /*#__PURE__*/React.createElement("button", {
        onClick: () => window.location.reload(),
        style: {
          padding: '10px 28px',
          background: '#7f1d1d',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '14px'
        }
      }, "\u21BB \u91CD\u65B0\u6574\u7406"));
    }
    return this.props.children;
  }
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(FortuneTeller, null)));
