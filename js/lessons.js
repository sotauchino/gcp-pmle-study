window.DOMAINS = [
{id:1,short:"低コードAI設計",title:"Architect low-code AI solutions",
 summary:"BigQuery ML・学習済みAPI・Model Garden・AutoMLなど、コードを最小限にしてAIソリューションを設計する領域。",
 html:`
<h3>この領域で問われること</h3>
<ul>
<li>ビジネス課題に対し「作る/借りる」を判断する（API → AutoML/BQML → カスタム学習の順に検討）</li>
<li>BigQuery ML でのモデル選択・特徴量エンジニアリング</li>
<li>Model Garden / 学習済みAPI（Vision, Speech, Natural Language, Translation, Document AI）の選択</li>
<li>ハードウェア選択（CPU / GPU / TPU / エッジ）</li>
</ul>
<h3>選択の原則（最重要）</h3>
<table><tr><th>状況</th><th>第一候補</th></tr>
<tr><td>汎用タスク（OCR、翻訳、感情分析）でデータ不要</td><td>学習済みAPI / Document AI</td></tr>
<tr><td>データはBigQueryにあり、SQL人材が中心</td><td>BigQuery ML</td></tr>
<tr><td>独自ラベル付きデータあり、コード最小で高精度</td><td>AutoML（Vertex AI）</td></tr>
<tr><td>独自アーキテクチャ・特殊な損失関数が必要</td><td>カスタム学習</td></tr>
<tr><td>生成AI（要約・Q&A・チャット）</td><td>Gemini等 + プロンプト設計 → RAG → チューニング</td></tr>
</table>
<h3>BigQuery ML</h3>
<ul>
<li><code>CREATE MODEL</code> でSQLのみで学習。線形/ロジスティック回帰、XGBoost(Boosted Tree)、DNN、K-means、行列分解、ARIMA_PLUS（時系列）、PCA、インポートしたTensorFlowモデル、リモートモデル（Gemini等）に対応。</li>
<li><code>ML.PREDICT</code>, <code>ML.EVALUATE</code>, <code>ML.FORECAST</code>, <code>ML.GENERATE_TEXT</code>, <code>ML.TRANSFORM</code>（<code>TRANSFORM</code>句で前処理を学習時・推論時に一貫適用）。</li>
<li>データを移動させずに学習できる＝データ移動コスト・ガバナンス面で有利。</li>
</ul>
<h3>ハードウェア選択</h3>
<ul>
<li><b>CPU</b>：表形式・小規模・前処理。</li>
<li><b>GPU</b>：DNNの学習/推論全般、柔軟。カスタムopが多い場合。</li>
<li><b>TPU</b>：大規模な行列演算中心のTensorFlow/JAX/PyTorch(XLA)ワークロード。巨大バッチの大規模学習。</li>
<li><b>Edge TPU / TFLite</b>：オンデバイス推論、低遅延・オフライン要件。</li>
</ul>
<h3>Model Garden と生成AI</h3>
<ul>
<li>Model Garden：Google製(Gemini等)・OSS・パートナーのモデルを探索/デプロイ/チューニング。</li>
<li>Agent Builder（Vertex AI Agent Builder / Search）：ローコードでRAG・検索・エージェントを構築。</li>
</ul>
<div class="tip">試験のコツ：「最小の工数」「コードを書かずに」「迅速に」というキーワードは、学習済みAPI → BQML/AutoML を強く示唆します。</div>`},
{id:2,short:"データ・モデル管理",title:"Collaborate within and across teams to manage data and models",
 summary:"データの探索・前処理・特徴量管理、実験管理、Responsible AI、チーム間の協働。",
 html:`
<h3>この領域で問われること</h3>
<ul>
<li>大規模データの探索・前処理（BigQuery, Dataflow, Dataproc）</li>
<li>Feature Store（Vertex AI Feature Store）による特徴量の再利用と Training-Serving Skew 防止</li>
<li>Vertex AI Experiments / TensorBoard / Model Registry によるメタデータ・実験・バージョン管理</li>
<li>Responsible AI（公平性、説明可能性、プライバシー）</li>
</ul>
<h3>データ処理サービスの使い分け</h3>
<table><tr><th>サービス</th><th>用途</th></tr>
<tr><td>BigQuery</td><td>SQLで大規模分析・特徴量作成。まずここで解決できないか考える</td></tr>
<tr><td>Dataflow (Apache Beam)</td><td>バッチ＋ストリーミングの統一パイプライン、サーバーレス。tf.Transform とも連携</td></tr>
<tr><td>Dataproc</td><td>既存のSpark/Hadoop資産の移行・再利用</td></tr>
<tr><td>Pub/Sub</td><td>ストリーミング取り込み</td></tr>
<tr><td>Cloud Storage</td><td>非構造化データ（画像・動画・TFRecord）</td></tr>
</table>
<h3>データ品質と前処理</h3>
<ul>
<li><b>データリーク</b>：未来情報や目的変数に由来する特徴量が学習に混入。時系列は時間で分割する。</li>
<li><b>クラス不均衡</b>：クラス重み、オーバー/アンダーサンプリング、PR-AUC・F1で評価。</li>
<li><b>欠損値</b>：平均/中央値補完、欠損フラグ、モデルが扱える場合はそのまま。</li>
<li><b>Training-Serving Skew</b>：学習時と推論時の前処理不一致。tf.Transform、BQML TRANSFORM句、Feature Storeで防ぐ。</li>
<li>カテゴリ変数：One-hot（低カーディナリティ）、Embedding/ハッシュ（高カーディナリティ）。</li>
</ul>
<h3>Responsible AI</h3>
<ul>
<li><b>Explainable AI</b>：Sampled Shapley、Integrated Gradients、XRAI で特徴量寄与を説明。</li>
<li><b>公平性</b>：スライス別評価、What-If Tool、データ・ラベルのバイアス確認。</li>
<li><b>プライバシー</b>：Sensitive Data Protection（旧Cloud DLP）で匿名化/マスキング、CMEK、VPC Service Controls。</li>
</ul>
<h3>IAMとコラボレーション</h3>
<ul>
<li>最小権限、用途別サービスアカウント、Vertex AI User 等の事前定義ロール。</li>
<li>Model Registry でバージョン/エイリアス管理し、チーム間でモデルを共有。</li>
</ul>`},
{id:3,short:"プロトタイプのスケール",title:"Scale prototypes into ML models",
 summary:"モデル設計、分散学習、ハイパーパラメータチューニング、評価、生成AI（ファインチューニング・RAG・エージェント）。",
 html:`
<h3>この領域で問われること</h3>
<ul>
<li>従来ML・深層学習・生成AIからのモデル選定と評価指標の選択</li>
<li>Vertex AI Training（カスタムジョブ）、分散学習（GPU/TPU）</li>
<li>ハイパーパラメータチューニング（Vertex AI Vizier）</li>
<li>生成AI：プロンプトエンジニアリング、ファインチューニング、RAG、エージェント、評価</li>
</ul>
<h3>評価指標の選び方</h3>
<table><tr><th>状況</th><th>指標</th></tr>
<tr><td>クラス不均衡、偽陰性が高コスト（がん検知・不正検知）</td><td>Recall重視、PR-AUC</td></tr>
<tr><td>偽陽性が高コスト（スパム誤判定）</td><td>Precision重視</td></tr>
<tr><td>両者のバランス</td><td>F1</td></tr>
<tr><td>閾値非依存の総合評価</td><td>ROC-AUC（不均衡ではPR-AUC）</td></tr>
<tr><td>回帰：外れ値に頑健</td><td>MAE / Huber</td></tr>
<tr><td>回帰：大きな誤差を強く罰する</td><td>RMSE</td></tr>
<tr><td>ランキング・推薦</td><td>NDCG, MAP</td></tr>
</table>
<h3>過学習・学習の問題への対処</h3>
<ul>
<li>過学習：正則化(L1/L2)、Dropout、Early stopping、データ増強、データ追加、モデル簡素化。</li>
<li>学習が遅い/不安定：学習率調整、バッチ正規化、勾配クリッピング。</li>
<li>L1は特徴量選択（スパース化）、L2は重みを小さく保つ。</li>
</ul>
<h3>分散学習</h3>
<ul>
<li><b>データ並列</b>：モデルを複製しデータを分割。同期(All-reduce)/非同期。<code>MirroredStrategy</code>(単一マシン複数GPU)、<code>MultiWorkerMirroredStrategy</code>、<code>TPUStrategy</code>。</li>
<li><b>モデル並列</b>：モデルが単一デバイスのメモリに載らない場合。</li>
<li>Reduction Server（Vertex AI）：GPUでの All-reduce を高速化。</li>
<li>TPUでは入力パイプライン（tf.data、TFRecord、prefetch）がボトルネックになりやすい。</li>
<li>Cloud Storage FUSE / TFRecord 形式で読み込みを最適化。</li>
</ul>
<h3>ハイパーパラメータチューニング</h3>
<ul>
<li>Vertex AI Vizier：ベイズ最適化で効率的に探索。グリッド/ランダムより少ない試行で収束。</li>
<li>目的指標を <code>hypertune</code> ライブラリでレポートし、max trial / parallel trial を設定。</li>
</ul>
<h3>生成AI</h3>
<table><tr><th>手法</th><th>使いどころ</th></tr>
<tr><td>プロンプト設計（Few-shot, CoT, system指示）</td><td>最初に試す。最安・最速</td></tr>
<tr><td>Grounding / RAG</td><td>最新・社内の知識が必要、幻覚(ハルシネーション)を抑えたい。再学習不要</td></tr>
<tr><td>教師ありファインチューニング(SFT)</td><td>出力の形式・トーン・特定タスクの精度改善。PEFT/LoRAでコスト削減</td></tr>
<tr><td>蒸留</td><td>大モデルの品質を小モデルへ移して低コスト・低遅延化</td></tr>
<tr><td>RLHF/選好チューニング</td><td>人間の選好への整合</td></tr>
</table>
<ul>
<li><b>RAG構成</b>：ドキュメント → チャンク分割 → Embedding → Vector Search（ベクトルDB）→ 関連チャンクをプロンプトに付与。</li>
<li><b>評価</b>：Gen AI evaluation service（pointwise / pairwise、ルーブリック、LLM-as-a-judge）、自動指標(BLEU/ROUGE)は限界あり。</li>
<li><b>エージェント</b>：関数呼び出し(Function calling)、ツール利用、Agent Builder / Agent Development Kit(ADK)、Agent Engine。</li>
<li>Safety設定、コンテンツフィルタ、Model Armor 等で安全性を確保。</li>
</ul>
<div class="tip">「最新の社内情報を回答に反映」＝RAG/Grounding。「出力形式やスタイルを揃えたい」＝ファインチューニング。この対比は頻出です。</div>`},
{id:4,short:"モデルの提供・スケール",title:"Serve and scale models",
 summary:"オンライン/バッチ推論、エンドポイント、オートスケール、最適化、コスト。",
 html:`
<h3>この領域で問われること</h3>
<ul>
<li>オンライン推論 vs バッチ推論の選択</li>
<li>Vertex AI Endpoint（Prediction）、トラフィック分割、オートスケーリング</li>
<li>推論の高速化・低コスト化（マシンタイプ、量子化、蒸留、最適化ランタイム）</li>
<li>モデルのデプロイ形態（カスタムコンテナ、Prebuilt container、GKE、エッジ）</li>
</ul>
<h3>推論方式の選択</h3>
<table><tr><th>要件</th><th>方式</th></tr>
<tr><td>ミリ秒〜秒の低遅延、リクエスト単位</td><td>オンライン推論（Endpoint）</td></tr>
<tr><td>大量データを定期的に一括、遅延許容</td><td>バッチ推論（Batch Prediction, BigQuery ML.PREDICT）</td></tr>
<tr><td>ネット接続なし/超低遅延/プライバシー</td><td>エッジ（TFLite, Edge TPU）</td></tr>
<tr><td>推論結果を事前計算して参照</td><td>バッチ推論 → BigQuery/Bigtable/Firestoreに保存</td></tr>
</table>
<h3>Vertex AI Endpoint</h3>
<ul>
<li>同一Endpointに複数モデルをデプロイし <b>traffic split</b> で カナリア/A-B テスト、段階的ロールアウト。</li>
<li>オートスケール：min/max replica、CPU/GPU使用率ターゲット。コールドスタート回避には min replica ≥ 1。</li>
<li><b>Private endpoint / Private Service Connect</b>：VPC内からのみ利用。</li>
<li>カスタムコンテナ：<code>/predict</code> と <code>/health</code> の HTTP サーバを実装。Prebuilt container（TF, PyTorch, scikit-learn, XGBoost）は簡便。</li>
<li>Optimized TensorFlow runtime、量子化(INT8)、TensorRT、モデルサイズ削減で遅延とコスト低減。</li>
<li>Co-hosting：小さなモデルを同一ノードにまとめてコスト削減。</li>
<li>Explanations を有効化するとオンライン説明も取得可能。</li>
</ul>
<h3>大規模言語モデルの提供</h3>
<ul>
<li>マネージドAPI（Gemini）：インフラ管理不要、従量課金。</li>
<li>Provisioned Throughput：安定した容量・レイテンシが必要な本番。</li>
<li>OSSモデルの自前ホスト：Model Garden からデプロイ（GPU/TPU、vLLM 等）。</li>
<li>コスト最適化：軽量モデル（Flash系）の使用、コンテキストキャッシュ、バッチ処理。</li>
</ul>
<h3>Feature の提供</h3>
<ul>
<li>オンライン推論時の特徴量取得は Feature Store の online serving（低遅延）。</li>
</ul>
<div class="tip">「トラフィックの一部だけ新モデルへ」→ traffic split。「深夜にまとめて数億件を予測」→ Batch Prediction。</div>`},
{id:5,short:"パイプライン自動化",title:"Automate and orchestrate ML pipelines",
 summary:"Vertex AI Pipelines、CI/CD、継続的学習、再現性、MLOps。",
 html:`
<h3>この領域で問われること</h3>
<ul>
<li>再現可能なMLパイプライン設計（Vertex AI Pipelines / Kubeflow Pipelines / TFX）</li>
<li>オーケストレーションツールの使い分け（Pipelines / Cloud Composer / Cloud Scheduler・Workflows）</li>
<li>CI/CD/CT：Cloud Build, Artifact Registry, Model Registry</li>
<li>メタデータ・リネージ（ML Metadata）</li>
</ul>
<h3>ツールの使い分け</h3>
<table><tr><th>ツール</th><th>使いどころ</th></tr>
<tr><td>Vertex AI Pipelines</td><td>MLワークフロー専用のサーバーレス実行。KFP v2 / TFX。成果物とメタデータを自動追跡</td></tr>
<tr><td>Cloud Composer (Airflow)</td><td>ML以外を含む広範なデータ/ETLのオーケストレーション、既存Airflow資産</td></tr>
<tr><td>Cloud Scheduler</td><td>cron的な定期トリガー</td></tr>
<tr><td>Cloud Build</td><td>コードの変更を契機とするCI/CD（テスト・コンテナビルド・パイプライン起動）</td></tr>
<tr><td>Eventarc / Pub/Sub / Cloud Run functions</td><td>イベント駆動のトリガー（新データ到着・ドリフト検知）</td></tr>
</table>
<h3>MLOpsの成熟度</h3>
<ul>
<li><b>Level 0</b>：手動。<b>Level 1</b>：学習パイプライン自動化＝継続的学習(CT)。<b>Level 2</b>：CI/CD/CTの完全自動化。</li>
<li>パイプラインを自動再学習させるトリガー：スケジュール、新データ到着、性能劣化/ドリフト検知、コード変更。</li>
</ul>
<h3>パイプライン設計の要点</h3>
<ul>
<li>コンポーネントはコンテナ化され入出力（Artifacts）が型付き。<b>キャッシュ</b>で同一入力の再実行をスキップ。</li>
<li>標準的なステップ：データ検証 → 前処理 → 学習 → 評価 → 条件分岐（基準以上のみ）→ Model Registry登録 → デプロイ。</li>
<li>データ検証（TFDV）でスキーマ異常/スキュー検知。</li>
<li>再現性：コード・データ・パラメータ・環境をバージョン管理し、メタデータでリネージを追跡。</li>
<li>Workload Identity/サービスアカウントで最小権限、Secret Manager でシークレット管理。</li>
<li>Infrastructure as Code（Terraform）で環境再現。</li>
</ul>
<h3>テスト戦略</h3>
<ul>
<li>データ/スキーマのテスト、モデル品質テスト（閾値・スライス）、インフラ統合テスト、シャドウデプロイ/カナリアで本番検証。</li>
</ul>
<div class="tip">MLに特化＋メタデータ追跡＝Vertex AI Pipelines。多数の非MLタスク・既存Airflow＝Cloud Composer。</div>`},
{id:6,short:"AIソリューションの監視",title:"Monitor AI solutions",
 summary:"モデル監視、ドリフト検知、ログ、コスト、生成AIの品質・安全性の継続評価。",
 html:`
<h3>この領域で問われること</h3>
<ul>
<li>Vertex AI Model Monitoring（スキュー・ドリフト・特徴量寄与の変化）</li>
<li>Cloud Logging / Monitoring / Alerting によるシステム・推論の可観測性</li>
<li>生成AIの品質・安全性・コスト監視</li>
<li>継続的評価と再学習の判断</li>
</ul>
<h3>ドリフトの種類</h3>
<table><tr><th>用語</th><th>意味</th><th>検知</th></tr>
<tr><td>Training-Serving Skew</td><td>学習データと本番入力の分布の差</td><td>学習データをベースラインに比較</td></tr>
<tr><td>Prediction (Feature) Drift</td><td>本番入力が時間とともに変化</td><td>過去の本番データをベースラインに比較</td></tr>
<tr><td>Concept Drift</td><td>入力と目的変数の関係そのものが変化</td><td>正解ラベルが得られてから性能指標を監視</td></tr>
<tr><td>Label/Data Drift</td><td>ラベル分布や上流データの変化</td><td>分布統計の監視</td></tr>
</table>
<ul>
<li>Model Monitoring は、分布距離（カテゴリ：L∞距離、数値：Jensen-Shannon divergence）がしきい値超過でアラート。</li>
<li>正解ラベルが遅れて届く場合：入力ドリフトを先行指標に、後でグラウンドトゥルースと突き合わせて性能を評価（Model Evaluation）。</li>
</ul>
<h3>運用の監視</h3>
<ul>
<li><b>システム指標</b>：レイテンシ、スループット、エラー率、CPU/GPU利用率 → Cloud Monitoring のダッシュボード・アラート。</li>
<li><b>Request-response logging</b>：Endpointの入出力をBigQueryに記録し、後から分析・再学習データに。</li>
<li><b>コスト</b>：Billing export、ラベル、予算アラート、min replica の見直し、バッチ化。</li>
</ul>
<h3>生成AIの監視</h3>
<ul>
<li>品質（ハルシネーション、関連性）、安全性（有害出力）、レイテンシ、トークン使用量とコスト。</li>
<li>本番トレース（Cloud Trace / OpenTelemetry）でエージェントのツール呼び出しを可観測化。</li>
<li>評価データセットで継続評価（回帰テスト）。プロンプト/モデル更新時に再評価。</li>
<li>Prompt injection 対策、入力/出力フィルタ、Model Armor。</li>
</ul>
<h3>再学習の判断</h3>
<ul>
<li>ドリフト検知・性能低下・新データ蓄積・ビジネス要件変化。自動トリガー化（アラート → Pub/Sub → パイプライン起動）。</li>
<li>再学習後は新旧を比較し、traffic split で段階的に切替、問題があればロールバック。</li>
</ul>
<div class="tip">「学習データと比べて本番入力の分布が違う」＝Skew、「本番の中で時間とともに変化」＝Drift。</div>`}
];
