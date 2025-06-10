// データ収集および予測処理のトリガーシステム
// 機能ID: FR-001

class TriggerSystem {
    constructor() {
        this.isDataCollectionActive = false;
        this.isPredictionActive = false;
        this.dataCollectionTimer = null;
        this.predictionTimer = null;
        this.collectedData = [];
        this.logContainer = document.getElementById('activityLog');
        this.statusContainer = document.getElementById('systemStatus');
        
        this.initializeSystem();
    }

    initializeSystem() {
        this.log('[システム] トリガーシステム初期化中...');
        this.updateStatus('システム準備完了', 'info');
        this.updateCurrentSettings();
        this.log('[システム] 初期化完了 - データ収集とトリガー待機中');
    }

    log(message) {
        const timestamp = new Date().toLocaleTimeString('ja-JP');
        const logEntry = `[${timestamp}] ${message}`;
        this.logContainer.innerHTML += logEntry + '\n';
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
        console.log(logEntry);
    }

    updateStatus(message, type = 'info') {
        this.statusContainer.textContent = message;
        this.statusContainer.className = `status ${type}`;
    }

    updateCurrentSettings() {
        const dataSource = document.getElementById('dataSource').value;
        const interval = document.getElementById('collectionInterval').value;
        const model = document.getElementById('predictionModel').value;
        const state = this.isDataCollectionActive ? '実行中' : '停止中';

        document.getElementById('currentDataSource').textContent = this.getDataSourceLabel(dataSource);
        document.getElementById('currentInterval').textContent = `${interval}秒`;
        document.getElementById('currentModel').textContent = this.getModelLabel(model);
        document.getElementById('currentState').textContent = state;
    }

    getDataSourceLabel(value) {
        const labels = {
            'sensor': 'センサーデータ',
            'database': 'データベース',
            'api': '外部API',
            'file': 'ファイルアップロード'
        };
        return labels[value] || value;
    }

    getModelLabel(value) {
        const labels = {
            'linear': '線形回帰',
            'neural': 'ニューラルネットワーク',
            'decision': '決定木',
            'ensemble': 'アンサンブル'
        };
        return labels[value] || value;
    }

    startDataCollection() {
        if (this.isDataCollectionActive) {
            this.log('[警告] データ収集は既に実行中です');
            return;
        }

        const dataSource = document.getElementById('dataSource').value;
        const interval = parseInt(document.getElementById('collectionInterval').value) * 1000;
        const triggerCondition = document.getElementById('triggerCondition').value;

        this.isDataCollectionActive = true;
        this.updateStatus('データ収集実行中...', 'success');
        this.updateCurrentSettings();

        this.log(`[データ収集] 開始 - ソース: ${this.getDataSourceLabel(dataSource)}`);
        this.log(`[データ収集] 間隔: ${interval/1000}秒, 条件: ${this.getTriggerConditionLabel(triggerCondition)}`);

        // データ収集のシミュレーション
        this.dataCollectionTimer = setInterval(() => {
            this.simulateDataCollection(dataSource);
            this.checkPredictionTrigger();
        }, interval);

        // 初回データ収集を即座に実行
        this.simulateDataCollection(dataSource);
    }

    getTriggerConditionLabel(value) {
        const labels = {
            'time': '時間ベース',
            'threshold': '閾値ベース',
            'event': 'イベントベース',
            'manual': '手動トリガー'
        };
        return labels[value] || value;
    }

    simulateDataCollection(dataSource) {
        // ランダムなデータ生成（実際のシステムではセンサーやAPIからデータを取得）
        const dataPoint = {
            timestamp: new Date().toISOString(),
            source: dataSource,
            value: Math.random() * 100,
            quality: Math.random() > 0.1 ? 'good' : 'poor' // 90%の確率で良いデータ
        };

        this.collectedData.push(dataPoint);
        this.log(`[データ収集] 新しいデータポイント: 値=${dataPoint.value.toFixed(2)}, 品質=${dataPoint.quality}`);

        // データサイズが制限を超えた場合の処理
        if (this.collectedData.length > 1000) {
            this.collectedData = this.collectedData.slice(-500); // 最新500件を保持
            this.log('[データ収集] データプルーニング実行 - 古いデータを削除');
        }
    }

    stopDataCollection() {
        if (!this.isDataCollectionActive) {
            this.log('[警告] データ収集は実行されていません');
            return;
        }

        this.isDataCollectionActive = false;
        if (this.dataCollectionTimer) {
            clearInterval(this.dataCollectionTimer);
            this.dataCollectionTimer = null;
        }

        this.updateStatus('データ収集停止', 'warning');
        this.updateCurrentSettings();
        this.log(`[データ収集] 停止 - 収集データ件数: ${this.collectedData.length}`);
    }

    checkPredictionTrigger() {
        const predictionTrigger = document.getElementById('predictionTrigger').value;
        const batchSize = parseInt(document.getElementById('batchSize').value);

        // 様々なトリガー条件をチェック
        switch (predictionTrigger) {
            case 'dataComplete':
                if (this.collectedData.length >= batchSize) {
                    this.log(`[トリガー] データ収集完了トリガー発動 - ${this.collectedData.length}件のデータ`);
                    this.triggerPrediction();
                }
                break;
            case 'threshold':
                // 閾値ベースのトリガー（例：データ値が80を超えた場合）
                const latestData = this.collectedData[this.collectedData.length - 1];
                if (latestData && latestData.value > 80) {
                    this.log(`[トリガー] 閾値トリガー発動 - データ値: ${latestData.value.toFixed(2)}`);
                    this.triggerPrediction();
                }
                break;
            case 'schedule':
                // スケジュールベースは別途実装（簡略化のため省略）
                break;
        }
    }

    startPrediction() {
        this.log('[予測処理] 手動予測処理開始');
        this.triggerPrediction();
    }

    triggerPrediction() {
        if (this.isPredictionActive) {
            this.log('[警告] 予測処理は既に実行中です');
            return;
        }

        if (this.collectedData.length === 0) {
            this.log('[エラー] 予測に必要なデータがありません');
            return;
        }

        this.isPredictionActive = true;
        this.updateStatus('予測処理実行中...', 'warning');

        const model = document.getElementById('predictionModel').value;
        const batchSize = parseInt(document.getElementById('batchSize').value);
        const dataForPrediction = this.collectedData.slice(-batchSize);

        this.log(`[予測処理] 開始 - モデル: ${this.getModelLabel(model)}`);
        this.log(`[予測処理] データ件数: ${dataForPrediction.length}, バッチサイズ: ${batchSize}`);

        // 予測処理のシミュレーション（実際の処理時間をシミュレート）
        setTimeout(() => {
            this.completePrediction(model, dataForPrediction);
        }, 2000 + Math.random() * 3000); // 2-5秒のランダム処理時間
    }

    completePrediction(model, data) {
        this.isPredictionActive = false;

        // 予測結果のシミュレーション
        const prediction = {
            model: model,
            result: Math.random() * 100,
            confidence: 0.7 + Math.random() * 0.3, // 70-100%の信頼度
            dataPoints: data.length,
            processingTime: (2000 + Math.random() * 3000).toFixed(0) + 'ms'
        };

        this.updateStatus('予測処理完了', 'success');
        this.log(`[予測処理] 完了 - 結果: ${prediction.result.toFixed(2)}`);
        this.log(`[予測処理] 信頼度: ${(prediction.confidence * 100).toFixed(1)}%, 処理時間: ${prediction.processingTime}`);

        // 予測結果に基づく後続処理のトリガー
        this.triggerPostProcessing(prediction);
    }

    triggerPostProcessing(prediction) {
        this.log('[後続処理] 予測結果ベースの処理開始');
        
        // 閾値チェックと警告
        if (prediction.result > 75) {
            this.log('[警告] 予測値が警告閾値を超過しました');
            this.updateStatus('警告: 高リスク予測値検出', 'warning');
        }

        // 信頼度チェック
        if (prediction.confidence < 0.8) {
            this.log('[警告] 予測信頼度が低いです - 追加データ収集を推奨');
        }

        this.log('[後続処理] 完了 - 結果をダッシュボードに送信');
    }

    resetSystem() {
        this.log('[システム] リセット開始');
        
        // 全ての処理を停止
        this.stopDataCollection();
        
        if (this.predictionTimer) {
            clearInterval(this.predictionTimer);
            this.predictionTimer = null;
        }

        // データをクリア
        this.collectedData = [];
        this.isPredictionActive = false;

        // UIをリセット
        this.updateStatus('システムリセット完了', 'info');
        this.updateCurrentSettings();
        
        this.log('[システム] リセット完了 - 全データクリア');
        this.log('[システム] 新しい処理サイクルの準備完了');
    }
}

// グローバル関数（HTMLから呼び出される）
let triggerSystem;

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    triggerSystem = new TriggerSystem();
});

// HTML要素から呼び出される関数
function startDataCollection() {
    triggerSystem.startDataCollection();
}

function stopDataCollection() {
    triggerSystem.stopDataCollection();
}

function startPrediction() {
    triggerSystem.startPrediction();
}

function resetSystem() {
    triggerSystem.resetSystem();
}

// 設定変更時の自動更新
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['dataSource', 'collectionInterval', 'predictionModel', 'triggerCondition', 'predictionTrigger', 'batchSize'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', () => {
                if (triggerSystem) {
                    triggerSystem.updateCurrentSettings();
                    triggerSystem.log(`[設定変更] ${id}: ${element.value}`);
                }
            });
        }
    });
});