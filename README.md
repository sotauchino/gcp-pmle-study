# GCP Professional ML Engineer 学習ツール

Google Cloud Professional Machine Learning Engineer 試験のための、個人用の学習ツールです。ビルド不要の静的サイトで、`index.html` をブラウザで開くだけで動きます。

## 機能
- **学習**：6つの評価領域ごとの要点解説
- **問題集**：領域別の練習モード（即時解説）と模擬試験モード（タイマー付き）。選択肢は毎回シャッフル
- **暗記カード**：用語・使い分けの反復
- **メモ帳**：検索、タグ、問題からのメモ追加、JSONエクスポート/インポート
- **進捗**：領域別の正答率、間違えた問題の再挑戦、模擬試験の履歴

進捗・メモは、claude.ai のアーティファクトとして開いた場合はあなた専用のクラウド領域に保存され、別の端末でも使えます。それ以外（GitHub Pages・ローカル）ではブラウザの localStorage に保存されます。どちらの場合もリポジトリには入りません。

## 使い方
- ローカル：`index.html` を開く（または `npx serve .`）
- GitHub Pages：Settings → Pages → Branch を選んで公開

## コンテンツの編集
- `js/lessons.js`（学習）、`js/questions.js`（問題）、`js/cards.js`（カード）を編集します。

## 注意
- 非公式の学習資料です。問題はオリジナルで、実際の試験問題ではありません。
- 試験範囲は公式の[試験ガイド](https://cloud.google.com/learn/certification/machine-learning-engineer)で必ず確認してください。公式PDFは作成時に取得できず、各領域の出題比率は未確認のため記載していません。
- 試験は Vertex AI から Gemini Enterprise Agent Platform への移行を反映して改訂されています。サービス名は従来の「Vertex AI」表記で書いているため、最新の名称・機能は公式ドキュメントで確認してください。
