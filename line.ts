// line に関する操作のクラス
class Line {
    // line に関する操作のクラス
    constructor() {
        this.replyURL = "https://api.line.me/v2/bot/message/reply";
        this.token = "Bearer " + PropertiesService.getScriptProperties().getProperty("LINE_CHANNEL_ACCESS_TOKEN");
    }
    // line にメッセージを送信する
    replyMessage(replyToken, messages) {
        const payload = {
            replyToken: replyToken,
            messages: messages,
        };
        const options = {
            method: "post",
            contentType: "application/json",
            headers: {
                Authorization: this.token,
            },
            payload: JSON.stringify(payload),
        };
        UrlFetchApp.fetch(this.replyURL, options);
    }
}
//