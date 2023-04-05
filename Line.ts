import { Env } from "./Env";

export class Line {
    targetId: string;

    constructor() {
        this.targetId = "";
    }
    
    postMessage = (msg: { type: string; text: string }[]) => {
        // Keyクラスをインスタンス化
        // messaging api のurl
        const url = "https://api.line.me/v2/bot/message/push";
        // 対象グループのID
        const targetGroupId = "C066bb7d1e9f375625cff0d5f0afd9c5c";

        //デバッグモードならば、デバッグ用チャットに送信する
        if (Env.IS_DEBUG === true) {
            this.targetId = Env.DEBUG_LINE_ID;
        } else {
            this.targetId = Env.TARGET_ID;
        }

        // LINE developersのメッセージ送受信設定に記載のアクセストークン
        const TOKEN =
            PropertiesService.getScriptProperties().getProperty("LINE_ACCESS_TOKEN");

        const response = UrlFetchApp.fetch(url, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: "Bearer " + TOKEN,
            },
            method: "post",
            payload: JSON.stringify({
                to: this.targetId,
                messages: msg,
            }),
        });
        return response.getResponseCode();
    };
}
