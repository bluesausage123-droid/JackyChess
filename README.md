# 觀棋心徑 ─ 線上象棋卜卦

> JackyChess(SunsiChess) 的線上象棋卜卦系統 ─ 支援單卦速問與完整命盤兩種模式,依《佛和》《講義》《命盤解說》三本教材精準排盤。

## 模式

- **單卦**:5 棋十字,32 顆星際棋幣手抽,適合針對單一問題快速問卦
- **命盤**:32 棋一次到位,8 段 × 4 位置,呈現一生主軸 + 七個十年運的格局

每段提供:整體能量、過局影響、工作事業(含賺錢粗估)、情感人際、身體健康、結婚時機、給您的建議。

## 開發 / 部署

### 線上版(網頁)

```bash
# 起本機伺服器
py -m http.server 8765 --directory site
# → http://localhost:8765/
```

### 本地 build(JSX 預編譯 + vendor 抓 CDN)

```bash
npm install
npm run build:web    # icons + vendor CDN + JSX 預編譯
```

### Android APK / AAB

```bash
npx cap sync android        # 把 site/ 拷進 android/app/src/main/assets/public/
.\tools\build_aab.ps1       # 自動鏡射到 ASCII 路徑後 build
# → dist/guanqi-xinjing-<version>.aab
```

> ⚠️ keystore 檔(`android/keystore/`)與 `android/keystore.properties` 不在版控中。
> 需要新環境 build 時,請自行產生(見 `工作日誌.md` 第十三章)。

## 文件

- [工作日誌.md](工作日誌.md) — 從原型到 .aab 上架的完整開發紀錄(14 章 + 開發感想)
- [PLAY_STORE_上架指南.md](PLAY_STORE_上架指南.md) — Google Play 上架流程
- [dist/PLAY_STORE_LISTING.md](dist/PLAY_STORE_LISTING.md) — 商店列表素材

## 授權與素材

程式碼採 MIT 風格授權(可自由 fork 學習)。
*《佛和》《講義》《命盤解說》三本教材內容版權歸原作者所有,不在本倉庫公開。*
