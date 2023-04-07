import { Constant } from "./Constant";
import { Env } from "./Env";

type ImageMessage = {
    type: string;
    originalContentUrl: string;
    previewImageUrl: string;
};

type TextMessage = {
    type: string;
    text: string | Promise<string>;
};

type ReplyMessage = TextMessage | ImageMessage;

export class Line {
    targetId: string;
    constant: Constant;

    constructor() {
        this.targetId = "";
        this.constant = new Constant();
    }

    postMessage = (msg: { type: string; text: string }[]) => {

        //デバッグモードならば、デバッグ用チャットに送信する
        if (Env.IS_DEBUG === true) {
            this.targetId = this.constant.DEBUG_LINE_ID;
        } else {
            this.targetId = this.constant.CORRECT_LINE_GROUP_ID;
        }

        const response = UrlFetchApp.fetch(this.constant.LINE_POST_URL, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: "Bearer " + this.constant.LINE_ACCESS_TOKEN,
            },
            method: "post",
            payload: JSON.stringify({
                to: this.targetId,
                messages: msg,
            }),
        });
        return response.getResponseCode();
    };

    postReplyMessage = (message: ReplyMessage[], replyToken: any) => {
        // 応答メッセージ用のAPI URL
        UrlFetchApp.fetch(this.constant.LINE_REPLY_URL, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: "Bearer " + this.constant.LINE_ACCESS_TOKEN,
            },
            method: "post",
            payload: JSON.stringify({
                replyToken: replyToken,
                messages: message,
            }),
        });
    };
}
