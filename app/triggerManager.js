// トリガーマネージャー - 全体的なトリガー管理とコーディネーション
class TriggerManager {
    constructor() {
        this.initializeApplication();
    }

    // アプリケーションの初期化
    initializeApplication() {
        // ページロード時の初期化処理
        document.addEventListener('DOMContentLoaded', () => {
            this.displayWelcomeMessage();
            this.setupSystemMonitoring();
        });
    }

    // ウェルカムメッセージの表示
    displayWelcomeMessage() {
        const dataLog = document.getElementById('dataCollectionLog');
        const predictionLog = document.getElementById('predictionLog');
        
        const welcomeMessage = 'システム初期化完了 - トリガーデモンストレーション準備完了\n';
        const timestamp = new Date().toLocaleTimeString('ja-JP');
        
        dataLog.textContent = `[${timestamp}] ${welcomeMessage}`;
        predictionLog.textContent = `[${timestamp}] ${welcomeMessage}`;
    }

    // システム監視の設定
    setupSystemMonitoring() {
        // 30秒ごとにシステム状態をチェック
        setInterval(() => {
            this.checkSystemHealth();
        }, 30000);
    }

    // システムヘルスチェック
    checkSystemHealth() {
        const dataCount = window.dataCollectionTriggers.getDataCount();
        const accuracy = window.predictionTriggers.getModelAccuracy();
        
        // データ数が多すぎる場合の警告
        if (dataCount > 100) {
            this.logToSystem('警告: 収集データ数が100を超えました。古いデータの削除を検討してください。');
        }
        
        // 精度が低すぎる場合の警告
        if (accuracy < 70) {
            this.logToSystem('警告: モデル精度が70%を下回りました。再学習が必要です。');
        }
        
        this.logToSystem(`システム状態: データ数=${dataCount}, モデル精度=${accuracy.toFixed(1)}%`);
    }

    // システムログ出力
    logToSystem(message) {
        const timestamp = new Date().toLocaleTimeString('ja-JP');
        const dataLog = document.getElementById('dataCollectionLog');
        const predictionLog = document.getElementById('predictionLog');
        
        const logEntry = `[${timestamp}] [SYSTEM] ${message}\n`;
        
        dataLog.textContent += logEntry;
        predictionLog.textContent += logEntry;
        
        dataLog.scrollTop = dataLog.scrollHeight;
        predictionLog.scrollTop = predictionLog.scrollHeight;
    }

    // トリガー統計の取得
    getTriggerStatistics() {
        const dataCount = window.dataCollectionTriggers.getDataCount();
        const predictionCount = window.predictionTriggers.getPredictionResults().length;
        const accuracy = window.predictionTriggers.getModelAccuracy();
        
        return {
            totalDataCollected: dataCount,
            totalPredictionsRun: predictionCount,
            currentModelAccuracy: accuracy,
            timestamp: new Date().toISOString()
        };
    }

    // デモ用の自動実行機能
    startDemo() {
        this.logToSystem('デモモード開始');
        
        // 5秒後にデータ収集開始
        setTimeout(() => {
            document.getElementById('timeInterval').value = '3';
            window.toggleTimeBasedCollection();
        }, 5000);
        
        // 10秒後にイベントトリガー実行
        setTimeout(() => {
            window.triggerUserAction();
        }, 10000);
        
        // 15秒後に閾値シミュレート
        setTimeout(() => {
            window.simulateValueIncrease();
        }, 15000);
        
        // 20秒後に予測処理実行
        setTimeout(() => {
            window.executePrediction();
        }, 20000);
        
        // 25秒後に精度低下シミュレート
        setTimeout(() => {
            window.simulateAccuracyDrop();
        }, 25000);
    }

    // 全体リセット機能
    resetSystem() {
        // 時間ベース収集停止
        if (window.dataCollectionTriggers.isTimeBasedRunning) {
            window.toggleTimeBasedCollection();
        }
        
        // データクリア
        window.dataCollectionTriggers.collectedData = [];
        window.predictionTriggers.predictionResults = [];
        
        // ログクリア
        document.getElementById('dataCollectionLog').textContent = '';
        document.getElementById('predictionLog').textContent = '';
        
        // 状態リセット
        document.getElementById('currentValue').value = '0';
        document.getElementById('currentAccuracy').value = '90';
        
        this.displayWelcomeMessage();
        this.logToSystem('システムリセット完了');
    }
}

// トリガーマネージャーのインスタンス作成
window.triggerManager = new TriggerManager();

// デモとリセット機能をグローバルに露出
window.startDemo = () => window.triggerManager.startDemo();
window.resetSystem = () => window.triggerManager.resetSystem();
window.getTriggerStatistics = () => window.triggerManager.getTriggerStatistics();

// コンソールからアクセス可能な便利機能
console.log('トリガーデモシステムが初期化されました。');
console.log('利用可能な機能:');
console.log('- startDemo(): 自動デモを開始');
console.log('- resetSystem(): システムをリセット');
console.log('- getTriggerStatistics(): 統計情報を取得');