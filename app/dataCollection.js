// データ収集モジュール
class DataCollectionTriggers {
    constructor() {
        this.timeBasedInterval = null;
        this.collectedData = [];
        this.isTimeBasedRunning = false;
    }

    // ログ出力用ヘルパー
    log(message, type = 'data') {
        const timestamp = new Date().toLocaleTimeString('ja-JP');
        const logElement = document.getElementById('dataCollectionLog');
        const logEntry = `[${timestamp}] ${message}\n`;
        logElement.textContent += logEntry;
        logElement.scrollTop = logElement.scrollHeight;
    }

    // 時間ベーストリガー
    toggleTimeBasedCollection() {
        const statusElement = document.getElementById('timeBasedStatus');
        const intervalInput = document.getElementById('timeInterval');
        
        if (this.isTimeBasedRunning) {
            // 停止
            clearInterval(this.timeBasedInterval);
            this.isTimeBasedRunning = false;
            statusElement.className = 'status stopped';
            statusElement.textContent = '停止中';
            this.log('時間ベースデータ収集を停止しました');
        } else {
            // 開始
            const interval = parseInt(intervalInput.value) * 1000;
            this.timeBasedInterval = setInterval(() => {
                this.collectTimeBasedData();
            }, interval);
            this.isTimeBasedRunning = true;
            statusElement.className = 'status running';
            statusElement.textContent = `実行中 (${intervalInput.value}秒間隔)`;
            this.log(`時間ベースデータ収集を開始しました (間隔: ${intervalInput.value}秒)`);
        }
    }

    // 時間ベースデータ収集実行
    collectTimeBasedData() {
        const data = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: 'time-based',
            value: Math.floor(Math.random() * 100),
            source: 'scheduled'
        };
        
        this.collectedData.push(data);
        this.log(`データ収集完了: ID=${data.id}, 値=${data.value}`);
        
        // データ量チェック（予測処理トリガー用）
        window.predictionTriggers.checkDataCount();
    }

    // イベントベーストリガー
    triggerUserAction() {
        const data = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: 'event-based',
            value: Math.floor(Math.random() * 50),
            source: 'user-action'
        };
        
        this.collectedData.push(data);
        this.updateEventStatus('ユーザーアクションによるデータ収集');
        this.log(`イベントトリガー: ユーザーアクション - 値=${data.value}`);
    }

    triggerDataChange() {
        const data = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: 'event-based',
            value: Math.floor(Math.random() * 75),
            source: 'data-change'
        };
        
        this.collectedData.push(data);
        this.updateEventStatus('データ変更によるデータ収集');
        this.log(`イベントトリガー: データ変更 - 値=${data.value}`);
    }

    triggerSystemEvent() {
        const data = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: 'event-based',
            value: Math.floor(Math.random() * 200),
            source: 'system-event'
        };
        
        this.collectedData.push(data);
        this.updateEventStatus('システムイベントによるデータ収集');
        this.log(`イベントトリガー: システムイベント - 値=${data.value}`);
    }

    updateEventStatus(message) {
        const statusElement = document.getElementById('eventBasedStatus');
        statusElement.className = 'status running';
        statusElement.textContent = message;
        
        setTimeout(() => {
            statusElement.className = 'status stopped';
            statusElement.textContent = '待機中';
        }, 2000);
    }

    // 閾値ベーストリガー
    checkThreshold() {
        const thresholdInput = document.getElementById('threshold');
        const currentValueInput = document.getElementById('currentValue');
        const statusElement = document.getElementById('thresholdStatus');
        
        const threshold = parseInt(thresholdInput.value);
        const currentValue = parseInt(currentValueInput.value);
        
        if (currentValue >= threshold) {
            const data = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                type: 'threshold-based',
                value: currentValue,
                source: 'threshold-trigger'
            };
            
            this.collectedData.push(data);
            statusElement.className = 'status running';
            statusElement.textContent = `閾値到達！データ収集実行 (${currentValue} >= ${threshold})`;
            this.log(`閾値トリガー: 閾値${threshold}に到達 - 値=${currentValue}`);
            
            setTimeout(() => {
                statusElement.className = 'status stopped';
                statusElement.textContent = '閾値未達';
            }, 3000);
        } else {
            statusElement.className = 'status stopped';
            statusElement.textContent = `閾値未達 (${currentValue} < ${threshold})`;
            this.log(`閾値チェック: 未達成 (${currentValue} < ${threshold})`);
        }
    }

    simulateValueIncrease() {
        const currentValueInput = document.getElementById('currentValue');
        const currentValue = parseInt(currentValueInput.value);
        const newValue = currentValue + Math.floor(Math.random() * 20) + 5;
        currentValueInput.value = newValue;
        this.log(`値シミュレート: ${currentValue} → ${newValue}`);
        this.checkThreshold();
    }

    // データ取得メソッド
    getCollectedData() {
        return this.collectedData;
    }

    getDataCount() {
        return this.collectedData.length;
    }
}

// グローバルインスタンス作成
window.dataCollectionTriggers = new DataCollectionTriggers();

// HTMLで使用される関数をグローバルスコープに露出
window.toggleTimeBasedCollection = () => window.dataCollectionTriggers.toggleTimeBasedCollection();
window.triggerUserAction = () => window.dataCollectionTriggers.triggerUserAction();
window.triggerDataChange = () => window.dataCollectionTriggers.triggerDataChange();
window.triggerSystemEvent = () => window.dataCollectionTriggers.triggerSystemEvent();
window.checkThreshold = () => window.dataCollectionTriggers.checkThreshold();
window.simulateValueIncrease = () => window.dataCollectionTriggers.simulateValueIncrease();