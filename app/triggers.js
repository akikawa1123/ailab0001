// データ収集および予測処理トリガー JavaScript
// FR-001: Data Collection and Prediction Processing Triggers

// 状態管理
let isDataCollectionRunning = false;
let isPredictionRunning = false;
let isWorkflowRunning = false;
let scheduledCollectionInterval = null;

// ログ機能
function logMessage(message) {
    const timestamp = new Date().toLocaleTimeString('ja-JP');
    const logElement = document.getElementById('log');
    logElement.textContent += `[${timestamp}] ${message}\n`;
    logElement.scrollTop = logElement.scrollHeight;
}

// ステータス更新機能
function updateStatus(elementId, status, message) {
    const element = document.getElementById(elementId);
    element.className = `status ${status}`;
    element.textContent = message;
}

// ボタンの有効/無効切り替え
function toggleButtons(disabled) {
    const buttons = document.querySelectorAll('.trigger-button');
    buttons.forEach(button => {
        if (!button.textContent.includes('ログクリア')) {
            button.disabled = disabled;
        }
    });
}

// データ収集トリガー機能
async function triggerDataCollection() {
    if (isDataCollectionRunning) {
        logMessage('⚠️ データ収集は既に実行中です');
        return;
    }

    isDataCollectionRunning = true;
    updateStatus('dataCollectionStatus', 'processing', '🔄 データ収集中...');
    logMessage('📊 データ収集トリガーが起動されました');
    
    try {
        // シミュレートされたデータ収集プロセス
        const dataSourceTypes = ['センサーデータ', 'API データ', 'ファイルデータ', 'データベース'];
        
        for (let i = 0; i < dataSourceTypes.length; i++) {
            await sleep(1000);
            logMessage(`📥 ${dataSourceTypes[i]} を収集中... (${i + 1}/${dataSourceTypes.length})`);
        }
        
        // ランダムなデータ量をシミュレート
        const collectedRecords = Math.floor(Math.random() * 1000) + 100;
        
        await sleep(1500);
        updateStatus('dataCollectionStatus', 'completed', '✅ データ収集完了');
        logMessage(`✅ データ収集完了: ${collectedRecords} レコードを収集しました`);
        
    } catch (error) {
        updateStatus('dataCollectionStatus', 'error', '❌ エラー発生');
        logMessage(`❌ データ収集エラー: ${error.message}`);
    } finally {
        isDataCollectionRunning = false;
        setTimeout(() => {
            if (!isPredictionRunning && !isWorkflowRunning) {
                updateStatus('dataCollectionStatus', 'idle', '待機中');
            }
        }, 3000);
    }
}

// 定期データ収集設定
function scheduleDataCollection() {
    if (scheduledCollectionInterval) {
        clearInterval(scheduledCollectionInterval);
        scheduledCollectionInterval = null;
        logMessage('⏹️ 定期データ収集を停止しました');
        return;
    }
    
    const intervalMinutes = 2; // 2分間隔でデモ
    scheduledCollectionInterval = setInterval(() => {
        if (!isDataCollectionRunning) {
            logMessage('⏰ 定期収集時刻に達しました');
            triggerDataCollection();
        }
    }, intervalMinutes * 60 * 1000);
    
    logMessage(`⏰ 定期データ収集を設定しました (${intervalMinutes}分間隔)`);
}

// リアルタイム予測トリガー
async function triggerPrediction() {
    if (isPredictionRunning) {
        logMessage('⚠️ 予測処理は既に実行中です');
        return;
    }

    isPredictionRunning = true;
    updateStatus('predictionStatus', 'processing', '🔄 予測処理中...');
    logMessage('🔮 リアルタイム予測トリガーが起動されました');
    
    try {
        // シミュレートされた予測プロセス
        const predictionSteps = [
            'データ前処理',
            '特徴量抽出',
            'モデル読み込み',
            '予測計算',
            '結果検証'
        ];
        
        for (let i = 0; i < predictionSteps.length; i++) {
            await sleep(800);
            logMessage(`🔮 ${predictionSteps[i]}... (${i + 1}/${predictionSteps.length})`);
        }
        
        // ランダムな予測結果をシミュレート
        const accuracy = (Math.random() * 0.3 + 0.7).toFixed(3); // 0.7-1.0の範囲
        const predictions = Math.floor(Math.random() * 50) + 10;
        
        await sleep(1000);
        updateStatus('predictionStatus', 'completed', '✅ 予測完了');
        logMessage(`✅ リアルタイム予測完了: ${predictions} 件の予測 (精度: ${accuracy})`);
        
    } catch (error) {
        updateStatus('predictionStatus', 'error', '❌ エラー発生');
        logMessage(`❌ 予測処理エラー: ${error.message}`);
    } finally {
        isPredictionRunning = false;
        setTimeout(() => {
            if (!isDataCollectionRunning && !isWorkflowRunning) {
                updateStatus('predictionStatus', 'idle', '待機中');
            }
        }, 3000);
    }
}

// バッチ予測トリガー
async function triggerBatchPrediction() {
    if (isPredictionRunning) {
        logMessage('⚠️ 予測処理は既に実行中です');
        return;
    }

    isPredictionRunning = true;
    updateStatus('predictionStatus', 'processing', '🔄 バッチ予測中...');
    logMessage('📊 バッチ予測トリガーが起動されました');
    
    try {
        // バッチ処理のシミュレート
        const batchSize = Math.floor(Math.random() * 500) + 100;
        const batches = Math.ceil(batchSize / 50);
        
        logMessage(`📊 バッチサイズ: ${batchSize} レコード (${batches} バッチ)`);
        
        for (let i = 1; i <= batches; i++) {
            await sleep(1200);
            const progress = Math.round((i / batches) * 100);
            logMessage(`📊 バッチ ${i}/${batches} 処理中... (${progress}% 完了)`);
        }
        
        const totalPredictions = batchSize;
        const avgAccuracy = (Math.random() * 0.2 + 0.8).toFixed(3);
        
        await sleep(1000);
        updateStatus('predictionStatus', 'completed', '✅ バッチ予測完了');
        logMessage(`✅ バッチ予測完了: ${totalPredictions} 件処理 (平均精度: ${avgAccuracy})`);
        
    } catch (error) {
        updateStatus('predictionStatus', 'error', '❌ エラー発生');
        logMessage(`❌ バッチ予測エラー: ${error.message}`);
    } finally {
        isPredictionRunning = false;
        setTimeout(() => {
            if (!isDataCollectionRunning && !isWorkflowRunning) {
                updateStatus('predictionStatus', 'idle', '待機中');
            }
        }, 3000);
    }
}

// ワークフロートリガー（データ収集→予測の連携）
async function triggerWorkflow() {
    if (isWorkflowRunning || isDataCollectionRunning || isPredictionRunning) {
        logMessage('⚠️ 他の処理が実行中のため、ワークフローを開始できません');
        return;
    }

    isWorkflowRunning = true;
    updateStatus('workflowStatus', 'processing', '🔄 ワークフロー実行中...');
    logMessage('🔗 データ収集→予測連携ワークフローが開始されました');
    
    try {
        // フェーズ1: データ収集
        logMessage('🔗 フェーズ1: データ収集を開始します');
        await triggerDataCollection();
        
        // 少し待機
        await sleep(2000);
        
        // フェーズ2: 予測処理
        logMessage('🔗 フェーズ2: 予測処理を開始します');
        await triggerPrediction();
        
        await sleep(1000);
        updateStatus('workflowStatus', 'completed', '✅ ワークフロー完了');
        logMessage('🔗 ✅ データ収集→予測連携ワークフローが正常に完了しました');
        
    } catch (error) {
        updateStatus('workflowStatus', 'error', '❌ エラー発生');
        logMessage(`❌ ワークフローエラー: ${error.message}`);
    } finally {
        isWorkflowRunning = false;
        setTimeout(() => {
            updateStatus('workflowStatus', 'idle', '待機中');
        }, 3000);
    }
}

// ログクリア機能
function clearLog() {
    document.getElementById('log').textContent = 'ログがクリアされました...\n';
    logMessage('システム準備完了');
}

// ユーティリティ関数: 指定時間だけ待機
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
    logMessage('🚀 データ収集および予測処理トリガーシステム初期化完了');
    logMessage('💡 各ボタンをクリックして機能をテストしてください');
});

// ページを離れる前のクリーンアップ
window.addEventListener('beforeunload', function() {
    if (scheduledCollectionInterval) {
        clearInterval(scheduledCollectionInterval);
    }
});