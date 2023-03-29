// 定数パラメーターを取得するクラス
export class Key {
    // LINE developersのメッセージ送受信設定に記載のアクセストークン
    static get LINE_ACCESS_TOKEN() {
        return PropertiesService.getScriptProperties().getProperty("LINE_ACCESS_TOKEN");
    }
    // chatGPTのAPIを叩くクラス
    static get GPT_API_KEY() {
        return PropertiesService.getScriptProperties().getProperty("GPT_API_KEY");
    }
    // sheetのID
    static get SHEET_ID() {
        return PropertiesService.getScriptProperties().getProperty("SHEET_ID");
    }
    // sheetの名前
    static get SHEET_NAME() {
        return PropertiesService.getScriptProperties().getProperty("SHEET_NAME");
    }
    
}
