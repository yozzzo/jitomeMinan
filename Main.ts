import { Constant } from "./Constant";
import { Line } from "./Line";
import {Schedule} from "./Schedule";

type QuickReplyMessage = {
    type: string;
    text: string;
    quickReply: {
        items: {
            type: string;
            action: {
                type: string;
                label: string;
                displayText: string;
                data: string;
            };
        }[];
    };
};

type ReplyMessageParams = {
    replyToken: string;
    messages: QuickReplyMessage[];
};

type ImageMessage = {
    type: string;
    originalContentUrl: string;
    previewImageUrl: string;
};

type TextMessage = {
    type: string;
    text: string;
};

type ReplyMessage = TextMessage | ImageMessage;

type Schedules = {
    postDay: string;
    postAuthor: number;
};

type JsonSchedule = {
    schedules: Schedules[];
};



export class Main {
    line: Line; 
    constant: Constant;

    constructor(line:Line) {
        this.line = line;
        this.constant = new Constant();
    }

    createQuickReplyMsg = (postAuthor: string): QuickReplyMessage[] => {
        // コンストラクタで宣言したlineのインスタンスを使う
        const message: QuickReplyMessage[] = [
            {
                type: "text",
                text: "今週投稿するのは " + postAuthor + " だったナン！投稿できたナン？",
                quickReply: {
                    items: [
                        {
                            type: "action",
                            action: {
                                type: "postback",
                                label: "投稿したよ！",
                                displayText: "投稿したよ！",
                                data: "posted",
                            },
                        },
                        {
                            type: "action",
                            action: {
                                type: "postback",
                                label: "今週無理やわ。誰か頼む。",
                                displayText: "今週無理やわ。誰か頼む。",
                                data: "cant",
                            },
                        },
                    ],
                },
            },
        ];
        return message;
    };


    dateFormat = (date: Date): string => {
        const dateString = Utilities.formatDate(date, "JST", "yyyy-MM-dd");
        return dateString;
    };

    getPostAuthor = (targetDate: string) => {
        const jsonData: JsonSchedule = Schedule.getJsonData();
        let postAuthor = "";
        jsonData.schedules.forEach((item: Schedules) => {
            if (item.postDay === targetDate) {                
                console.log("見つかった")
                // Constant.authorOrderの中のindexがitem.postAuthorの値を取得する。
                console.log(this.constant.AUTHOR_ORDER)
                console.log(this.constant.AUTHOR_ORDER[0])
                console.log(item.postAuthor)
                console.log(this.constant.AUTHOR_ORDER[item.postAuthor])
                // ループから抜ける
                postAuthor = this.constant.AUTHOR_ORDER[item.postAuthor]
            }
        });
        return postAuthor;
    };

    createImgUrl = (replyType: string): string => {
        const negativeImgIds = [
            "1lzRj1Dygh0MvKHpkZnpUIR0TILF1dt5M",
            "17xHb_OkT4Sl58cUIAZGE9_qYvw-9_wFb",
            "1_fYDlN_HosdEWRwd0me-UCSln24TvO1z",
            "1PcSsecSILn6YN4aPfDe0y60NEyfulu2F",
            "19N2h76IB0_izlYVxZzIIEoOT6IB8d5-H",
            "1PcSsecSILn6YN4aPfDe0y60NEyfulu2F",
            "19N2h76IB0_izlYVxZzIIEoOT6IB8d5-H",
        ];
        const positiveImgIds = [
            "11KhDVwoPbAiKZfwtyML31ynpGUPhMeMB",
            "1vNILOIwOusluYheH2-Sj7MH9Dr4xPpRN",
            "1key3WdxSluy1eT6qg366_o3FuutHqd9L",
            "1Vo__w5VWg5qyOLm44HmfTjZRe7ZRUy7L",
            "14EMIylZmQKFJPQgncfxBkOPPhjGfT4PR",
            "1YUv4mhAC4PG-K0Zlqon9vvSPJVoiHRuk",
            "1Zz9InbjXSRbLu9jxwGNEdzTAjFuwuxiH",
        ];
        const preUrl = "https://drive.google.com/uc?id=";

        //0~6の整数になるように数値計算
        let rand = Math.random();
        rand = Math.floor(rand * 7);

        let imgId = "";
        console.log(positiveImgIds[0]);

        if (replyType === "positive") {
            imgId = positiveImgIds[rand];
        } else {
            imgId = negativeImgIds[rand];
        }

        const imgUrl = preUrl + imgId;
        console.log(imgUrl);
        return imgUrl;
    };

    imageMessage = (replyType: string): ImageMessage[] => {
        const imgUrl: string = this.createImgUrl(replyType);
        const message: ImageMessage[] = [
            {
                type: "image",
                originalContentUrl: imgUrl,
                previewImageUrl: imgUrl,
            },
        ];
        return message;
    };

    makeReplyMessage = (replyType: string): { type: string; text: string }[] => {
        let text = "";
        if (replyType === "positive") {
            text = "さすがナン！この調子で頑張るナン！";
        } else {
            text = "そういうこともあるナン、、、次頑張るナン。今回は他の人頼むナン。";
        }
        const msg = [
            {
                type: "text",
                text: text,
            },
        ];
        return msg;
    };

    doPost = (e: any) => {
        // WebHookで受信した応答用Token
        const replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
        const type = JSON.parse(e.postData.contents).events[0].type;
        const postBack = JSON.parse(e.postData.contents).events[0].postback.data;
        const replyType = postBack == "posted" ? "positive" : "negative";
        // imageMessageとmakeReplyMessageを型ごと統合
        let message: ReplyMessage[] = [];
        message = message.concat(this.imageMessage(replyType));
        message = message.concat(this.makeReplyMessage(replyType));
        console.log(message);
        this.line.postReplyMessage(message, replyToken);
    }

    getMondayDateInThisWeek = () => {
        const target_date = new Date();
        const year = target_date.getFullYear();
        const month = target_date.getMonth();
        const date = target_date.getDate();
        const day_num = target_date.getDay();
        const sunday = date - day_num;
        return this.dateFormat(new Date(year, month, sunday + 1));
    }

    format_date = (date: Date) => {
        return Utilities.formatDate(date, "Asia/Tokyo", "MM/dd");
    }



    beginningWeeklyRemind = () => {
        const mondayDate:string = this.getMondayDateInThisWeek();
        const postAuthor:string = this.getPostAuthor(mondayDate);
        const message = [
            {
                type: "text",
                text: "今週投稿するのは " + postAuthor + " ナン！よろしくナン！",
            },
        ];
        this.line.postMessage(message);
        console.log(message);
    };

    endOfWeeklyRemind = () => {
        const mondayDate:string = this.getMondayDateInThisWeek();
        const postAuthor:string = this.getPostAuthor(mondayDate);
        var messages:QuickReplyMessage[] = this.createQuickReplyMsg(postAuthor);
        this.line.postMessage(messages);
        console.log(messages);
    };

}
