# Design: 麺帳（ramen-log）

## 路線
**Apple HIG（iOS）**（参照: apple-hig スキル）。Clarity / Deference / Depth。
**料理写真が主役**、UIシェルは控えめ。システム書体・セマンティック色・Large Title・インセットグループ・両テーマ・44pt標的・セーフエリア。
脱・量産感: tint を既定blueでなく **暖色（醤油/ラーメンの琥珀）**。**ロゴは絵文字なしのワードマーク「麺帳」**（anti-ai-design）。

## アクセシビリティ: WCAG AA（必須・wcag-accessibility）
- コントラスト4.5:1(UI/大3:1)／キーボード全操作／`:focus-visible`／タップ44px／`<html lang="ja">`／`prefers-reduced-motion`／通知 `aria-live`／色のみ依存しない

## カラートークン（HIG Web翻訳・CSS変数）
### Light
```
--label:#1C1C1E; --secondary-label:rgba(60,60,67,.6); --tertiary-label:rgba(60,60,67,.3);
--bg:#F2F2F7; --bg-elevated:#FFFFFF; --separator:rgba(60,60,67,.29);
--tint:#B85C1E;            /* 醤油の琥珀（systemBlueの代わり＝個性付け） */
--tint-weak:rgba(184,92,30,.12);
--red:#FF3B30; --green:#34C759; --yellow:#FFB300; /* 評価★に */
--font-sys:-apple-system,"SF Pro Text","Hiragino Kaku Gothic ProN",system-ui,sans-serif;
```
### Dark
```
--label:#FFFFFF; --secondary-label:rgba(235,235,245,.6); --tertiary-label:rgba(235,235,245,.3);
--bg:#000000; --bg-elevated:#1C1C1E; --separator:rgba(84,84,88,.6);
--tint:#F0A35E; --tint-weak:rgba(240,163,94,.18);
--red:#FF453A; --green:#30D158; --yellow:#FFD426;
```
> light背景 #F2F2F7（純白回避）・文字 #1C1C1E（純黒回避）。dark の #000/#FFF は iOS標準として可。

## タイポグラフィ（HIG / Dynamic Type を rem 近似）
- 書体 `--font-sys`。Large Title 34/41 bold（「麺帳」）/ Title2 22 / Headline 17 semibold / Body 17 / Subhead 15 / Footnote 13。
- 料理名=Headline、店名=Subhead(secondary)、日付/価格=Footnote。数字は `tabular-nums`。

## レイアウト / 形状 / 余白
- セーフエリア `env(safe-area-inset-*)`、8ptグリッド、端マージン16px、角丸12〜16（iOS継続曲線風）。
- 上部に Large Title。スクロールで控えめ化（任意）。すりガラスは使い過ぎない（写真主役）。

## 主要UI（既存機能を iOS の見た目に翻訳。機能は据え置き）
- **記録カード/リスト**: 写真サムネ＋料理名(Headline)＋店名(secondary)＋種類チップ＋★＋日付/価格。写真を主役に、カードは bg-elevated・薄い境界・角丸。
- **2段階スワイプ削除**: 既存ロジック維持。露出する「削除」は iOS の赤（destructive）。
- **フィルタ/タグ**: iOS の filled/tinted チップ（選択= tint）。
- **★評価**: --yellow。種類チップ= tint-weak 背景。
- **追加/詳細シート**: iOS ボトムシート風（角丸上部・グリップ・bg-elevated）。
- **ヘッダのページ移動ボタン（賞/統/辞/⚙）**: iOS の丸 or テキストボタン（44px・aria-label）。
- **ストリーク表示**: tint-weak の控えめバー。**FAB「＋記録する」**: iOS の prominent な角丸ボタン（tint塗り・下部固定・セーフエリア）。
- 空状態: ワードマーク的に静かに（絵文字主役にしない）。

## 「色は何に担わせるか」
- **料理写真**が主役。UI（チップ/ボタン/リング）は tint を最小限。★だけ yellow。

## 量産感回避（anti-ai-design 併用）
- **ロゴは絵文字なしのワードマーク「麺帳」**（💧🍜等を付けない）。tint=暖色（既定blue回避）。純白背景/紫青グラデ不使用。写真に色を担わせ UI は静か。

## データ・機能は完全維持（重要）
- localStorage `ramenLog.v1` / IndexedDB `menchoDB`(写真) / トロフィー `mencho.trophies` 等のキーは**変更しない**。
- 既存機能（写真複数+EXIF、タグ、検索/並替/日付、詳細+メモ、2段階スワイプ削除、店検索→マップ、トロフィー/ストリーク/草、保存演出、全画面ビューア、PWA）は**全て維持**。JSロジックは触らず**見た目層のみ**作り替える。
