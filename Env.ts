// 定数パラメーターを取得するクラス
export class Env {
    // LINE developersのメッセージ送受信設定に記載のアクセストークン
    static get LINE_ACCESS_TOKEN() {
        return Env.callProperty("LINE_ACCESS_TOKEN");
    }
    // chatGPTのAPIを叩くクラス
    static get GPT_API_KEY() {
        return Env.callProperty("GPT_API_KEY");
    }
    // sheetのID
    static get SHEET_ID() {
        return Env.callProperty("SHEET_ID");
    }
    // sheetの名前
    static get SHEET_NAME() {
        return Env.callProperty("SHEET_NAME");
    }
    // デバッグモードのときに送信するLINE_IDもしnullならエラーを返す
    static get DEBUG_LINE_ID() {
        return Env.callProperty("DEBUG_LINE_ID");
    }
    // デバッグモードでないときに送信するLINE_ID
    static get TARGET_ID() {
        return Env.callProperty("TARGET_ID");
    }
    // デバッグモードかどうか
    static get IS_DEBUG() {
        // Env.callProperty("IS_DEBUG");
        return true;
    }

    static callProperty(prop: string) {
        const val = PropertiesService.getScriptProperties().getProperty(prop);
        if (val === null) {
            throw new Error(prop + " is null");
        }
        return val;
    }
}
