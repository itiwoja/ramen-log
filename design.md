# 麺帳 — デザイン方針（Material Design 3 / 公式トークン準拠）

## 路線：Material Design 3（M3 / M3 Expressive 寄り）
ラーメン記録アプリ。温かみ・食欲をそそる暖色シードのM3スキーム。
「素のAndroid量産感」を避けるため anti-ai-design を常時併用（書体・シェイプ・モーションで個性付け）。
※機能・データ（localStorage `ramenLog.v1` ＋ 写真IndexedDB）・全ページ（index/stats/trophy/wiki）・PWAは維持。**見た目をM3へ刷新**。

## カラー（M3 26ロール／6グループ・暖色シード）
M3のロール構造で light/dark を定義（最小3:1ペア・指定ペアでのみ使用）。シード＝ラーメンの暖色（橙〜琥珀）。
**Light（目安・AA確認しつつ調整可）**
- primary `#8F4E00` / on-primary `#FFFFFF` / primary-container `#FFDCC2` / on-primary-container `#2E1500`
- secondary `#755844` / on-secondary `#FFFFFF` / secondary-container `#FFDCC2` / on-secondary-container `#2A1706`
- tertiary `#5F6234` / tertiary-container `#E5E8AD` / on-tertiary-container `#1B1D00`
- error `#BA1A1A` / error-container `#FFDAD6` / on-error-container `#410002`
- surface `#FFF8F5` / surface-container-lowest `#FFFFFF` / -low `#FFF1E9` / -default `#FCEBE0` / -high `#F6E5DA` / -highest `#F0E0D5`
- on-surface `#211A15` / on-surface-variant `#52443B` / outline `#85736A` / outline-variant `#D7C3B7`
**Dark**
- primary `#FFB77C` / on-primary `#4A2800` / primary-container `#6C3A00` / on-primary-container `#FFDCC2`
- surface `#19120D` / surface-container `#261D17` / -high `#312720` / on-surface `#F0E0D5` / on-surface-variant `#D7C3B7` / outline `#9F8D82`
- error `#FFB4AB`
> 純黒/純白の塗りは避ける（M3もトーン面色）。実装時に各ペアのコントラストAAを必ず確認（本文4.5:1 / 大文字・非テキスト3:1）。`prefers-color-scheme` 両対応。

## タイポグラフィ（M3 type scale ／ 和文 Noto Sans JP）
- 本文/UI＝**Noto Sans JP**（plain）。Display/Headline は太ウェイトで強調（brandフォントを足すなら可・anti-ai用）。
- M3 type scale（sp→rem=sp/16）: Display L 57/3.5625rem・M 45・S 36／Headline L 32/2rem・M 28・S 24／Title L 22/1.375rem・M 16・S 14／Body L 16/1rem・M 14・S 12／Label L 14・M 12・S 11。本文は **Body Large(16px)** 基準。
- emphasized（太め）は見出し・選択・主要アクションに。

## シェイプ（M3 角丸スケール dp）
- カード＝**Medium 12** or Large 16／ボタン＝**Full**（pill）／チップ＝Small 8〜Full／**FAB/Extended FAB＝Large 16**／ボトムシート・ダイアログ＝**Extra-large 28**（上端のみ）／テキストフィールド＝Extra-small 4（filled）。
- 入れ子は光学的角丸（内=外−padding）。情報密度の高いカードに特大角丸を付けない。

## エレベーション（M3）
- 影を多用せず **surface-container のトーン差**で高さを表現（level 0〜5）。必要な所だけ薄い影。FABはlevel3、hoverで+1。

## モーション（M3 motion tokens）
- easing: Emphasized decelerate `cubic-bezier(0.05,0.7,0.1,1)`／accelerate `cubic-bezier(0.3,0,0.8,0.15)`／Standard `cubic-bezier(0.2,0,0,1)`。
- duration: 選択/小=200ms(Standard)、シート開閉=400ms(Emphasized)、カード全画面=500ms。View Transitionsで画面/詳細遷移。**reduced-motion** で停止。
- 状態レイヤー: hover8% / focus10% / pressed10%（onColorを重ねる）。**overshootはボトムシートに使わない**（下に空白が出るため／既知の不具合）。

## コンポーネント（M3パターン）
- **Top app bar**（タイトル「麺帳」＋設定/検索）。
- **Extended FAB「＋ 記録する」**（primary-container・Large角丸・右下固定、スクロールで縮小可）。
- **Filter chips**（種類・タグ）／**Search**（filled text field）。
- **Card**（記録一覧：写真＋メニュー＋店＋★＋価格＋日付＋タグchip）。
- **Bottom sheet**（詳細：写真ヒーロー＋情報＋編集/削除）。**Extra-large28上端・overshootなし**。
- **Text fields**（記録フォーム：filled）/ 種類選択（chips/segmented）/ ★レーティング。
- **Snackbar**（保存/削除トースト・inverse-surface）。
- 既存の 2段階スワイプ削除・写真ビューア・実績(trophy)・統計(stats)・wiki も維持し、M3トークンで再スキン。

## 維持（不変・厳守）
- データ: `ramenLog.v1`（配列 or {records}）＋写真IndexedDB（DB/STORE名・スキーマ不変）。フィールド: id/menu/shop/type/stars/price/date/memo/tags/photos/createdAt 等を壊さない。
- 機能: 一覧/検索/フィルタ(種類・タグ)/統計/実績/wiki/記録追加・編集・削除/写真/バックアップ/設定/PWA(SW)。
- achievements.js 連携・各ページのクロスリンク維持。`lang="ja"`。
- オーバースクロール白対策（html背景=surface一致）。文字選択無効（入力欄除く）。

## 出力前チェック
- [ ] M3ロールで配色・全ペアAA合格・light/dark両対応（純黒/純白なし）
- [ ] Noto Sans JP・M3 type scale・角丸スケール・トーン面色エレベーション
- [ ] FAB/AppBar/Chips/Card/BottomSheet/TextField が M3 パターン
- [ ] 既存データ読み込みOK（ramenLog.v1＋写真）・全機能/全ページ動作
- [ ] motion適量＋reduced-motion・シートovershootなし・量産感回避(anti-ai)
