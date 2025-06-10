// 予測処理トリガーモジュール
class PredictionProcessingTriggers {
    constructor() {
        this.predictionResults = [];
        this.modelAccuracy = 90; // 初期精度
        this.nextScheduledTime = null;
    }

    // ログ出力用ヘルパー
    log(message) {
        const timestamp = new Date().toLocaleTimeString('ja-JP');
        const logElement = document.getElementById('predictionLog');
        const logEntry = `[${timestamp}] ${message}\n`;
        logElement.textContent += logEntry;
        logElement.scrollTop = logElement.scrollHeight;
    }

    // データ量ベーストリガー
    checkDataCount() {
        const requiredCountInput = document.getElementById('requiredDataCount');
        const statusElement = document.getElementById('dataCountStatus');
        const requiredCount = parseInt(requiredCountInput.value);
        
        if (window.dataCollectionTriggers) {
            const currentCount = window.dataCollectionTriggers.getDataCount();
            
            if (currentCount >= requiredCount) {
                statusElement.className = 'status running';
                statusElement.textContent = `データ充足！予測処理実行 (${currentCount}/${requiredCount})`;
                this.executePrediction('data-volume-trigger');
                this.log(`データ量トリガー: ${currentCount}件のデータで予測処理実行`);
            } else {
                statusElement.className = 'status stopped';
                statusElement.textContent = `データ不足 (${currentCount}/${requiredCount})`;
                this.log(`データ量チェック: 不足 (${currentCount}/${requiredCount})`);
            }
        }
    }

    // スケジュールベーストリガー
    scheduleNextPrediction() {
        const scheduleTypeSelect = document.getElementById('scheduleType');
        const statusElement = document.getElementById('scheduleStatus');
        const scheduleType = scheduleTypeSelect.value;
        
        const now = new Date();
        let nextTime = new Date(now);
        
        switch (scheduleType) {
            case 'hourly':
                nextTime.setHours(now.getHours() + 1, 0, 0, 0);
                break;
            case 'daily':
                nextTime.setDate(now.getDate() + 1);
                nextTime.setHours(0, 0, 0, 0);
                break;
            case 'weekly':
                nextTime.setDate(now.getDate() + (7 - now.getDay()));
                nextTime.setHours(0, 0, 0, 0);
                break;
        }
        
        this.nextScheduledTime = nextTime;
        const timeString = nextTime.toLocaleString('ja-JP');
        
        statusElement.className = 'status running';
        statusElement.textContent = `次回実行予定: ${timeString}`;
        this.log(`スケジュール設定: ${scheduleType} - 次回実行 ${timeString}`);
    }

    // 予測処理の即座実行
    executePrediction(triggerType = 'manual') {
        const predictionResult = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            triggerType: triggerType,
            accuracy: this.modelAccuracy + (Math.random() - 0.5) * 10, // ±5%の変動
            processingTime: Math.floor(Math.random() * 5000) + 1000, // 1-6秒
            dataPointsUsed: window.dataCollectionTriggers ? window.dataCollectionTriggers.getDataCount() : 0
        };
        
        // 精度を0-100の範囲に制限
        predictionResult.accuracy = Math.max(0, Math.min(100, predictionResult.accuracy));
        
        this.predictionResults.push(predictionResult);
        
        // 処理時間をシミュレート
        this.log(`予測処理開始: トリガー=${triggerType}, データ数=${predictionResult.dataPointsUsed}`);
        
        setTimeout(() => {
            this.log(`予測処理完了: 精度=${predictionResult.accuracy.toFixed(1)}%, 処理時間=${predictionResult.processingTime}ms`);
            
            // 精度を更新
            this.modelAccuracy = predictionResult.accuracy;
            document.getElementById('currentAccuracy').value = Math.floor(this.modelAccuracy);
        }, 1000);
    }

    // 精度ベーストリガー
    checkAccuracy() {
        const accuracyThresholdInput = document.getElementById('accuracyThreshold');
        const currentAccuracyInput = document.getElementById('currentAccuracy');
        const statusElement = document.getElementById('accuracyStatus');
        
        const threshold = parseFloat(accuracyThresholdInput.value);
        const currentAccuracy = parseFloat(currentAccuracyInput.value);
        
        if (currentAccuracy < threshold) {
            statusElement.className = 'status running';
            statusElement.textContent = `精度低下！再学習実行 (${currentAccuracy.toFixed(1)}% < ${threshold}%)`;
            this.executePrediction('accuracy-trigger');
            this.log(`精度トリガー: 閾値${threshold}%を下回る - 現在${currentAccuracy.toFixed(1)}%`);
            
            setTimeout(() => {
                const newAccuracy = parseFloat(document.getElementById('currentAccuracy').value);
                if (newAccuracy >= threshold) {
                    statusElement.className = 'status running';
                    statusElement.textContent = '精度基準満たす';
                }
            }, 2000);
        } else {
            statusElement.className = 'status running';
            statusElement.textContent = `精度基準満たす (${currentAccuracy.toFixed(1)}% >= ${threshold}%)`;
            this.log(`精度チェック: 基準満たす (${currentAccuracy.toFixed(1)}% >= ${threshold}%)`);
        }
    }

    simulateAccuracyDrop() {
        const currentAccuracyInput = document.getElementById('currentAccuracy');
        const currentAccuracy = parseFloat(currentAccuracyInput.value);
        const dropAmount = Math.random() * 20 + 5; // 5-25%低下
        const newAccuracy = Math.max(0, currentAccuracy - dropAmount);
        
        currentAccuracyInput.value = Math.floor(newAccuracy);
        this.modelAccuracy = newAccuracy;
        this.log(`精度低下シミュレート: ${currentAccuracy.toFixed(1)}% → ${newAccuracy.toFixed(1)}%`);
        this.checkAccuracy();
    }

    // 予測結果取得
    getPredictionResults() {
        return this.predictionResults;
    }

    getModelAccuracy() {
        return this.modelAccuracy;
    }
}

// グローバルインスタンス作成
window.predictionTriggers = new PredictionProcessingTriggers();

// HTMLで使用される関数をグローバルスコープに露出
window.checkDataCount = () => window.predictionTriggers.checkDataCount();
window.scheduleNextPrediction = () => window.predictionTriggers.scheduleNextPrediction();
window.executePrediction = () => window.predictionTriggers.executePrediction();
window.checkAccuracy = () => window.predictionTriggers.checkAccuracy();
window.simulateAccuracyDrop = () => window.predictionTriggers.simulateAccuracyDrop();