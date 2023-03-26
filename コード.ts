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

const createQuickReplyMsg = (postAuthor: string): QuickReplyMessage[] => {
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

type ReplyMessageParams = {
  replyToken: string;
  messages: QuickReplyMessage[];
};

const dateFormat = (date: Date): string => {
  const dateString = Utilities.formatDate(date, "JST", "yyyy-MM-dd");
  return dateString;
};

const getPostAuthor = (targetDate: string): string => {
  // SHEET_IDを取得
  const SHEET_ID =
    PropertiesService.getScriptProperties().getProperty("SHEET_ID");

  // SHEET_IDがnullの場合はエラーを返す
  if (SHEET_ID === null) {
    return "error";
  }

  console.log(targetDate);
  const col = 1;
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("シート1");

  // sheetがnullの場合はエラーを返す
  if (sheet === null) {
    return "error";
  }
  // sheetのデータを二次元配列で取得
  const dat = sheet.getDataRange().getValues();

  for (let i = 1; i < dat.length; i++) {
    const date = dateFormat(new Date(dat[i][col - 1]));
    if (date === targetDate) {
      return dat[i][col];
    }
  }
  return "error";
};

const createImgUrl = (replyType: string): string => {
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

const imageMessage = (replyType: string): ImageMessage[] => {
  const imgUrl: string = createImgUrl(replyType);
  const message: ImageMessage[] = [
    {
      type: "image",
      originalContentUrl: imgUrl,
      previewImageUrl: imgUrl,
    },
  ];
  return message;
};

const makeReplyMessage = (
  replyType: string
): { type: string; text: string }[] => {
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

function doPost(e: any) {
  // WebHookで受信した応答用Token
  const replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  const type = JSON.parse(e.postData.contents).events[0].type;
  const postBack = JSON.parse(e.postData.contents).events[0].postback.data;
  const replyType = postBack == "posted" ? "positive" : "negative";
  // imageMessageとmakeReplyMessageを型ごと統合
  let message: ReplyMessage[] = [];
  message = message.concat(imageMessage(replyType));
  message = message.concat(makeReplyMessage(replyType));
  console.log(message);
  postReplyMessage(message, replyToken);
}

function getMondayDateInThisWeek() {
  const target_date = new Date();
  const year = target_date.getFullYear();
  const month = target_date.getMonth();
  const date = target_date.getDate();
  const day_num = target_date.getDay();
  const sunday = date - day_num;
  return dateFormat(new Date(year, month, sunday + 1));
}

function format_date(date: Date) {
  return Utilities.formatDate(date, "Asia/Tokyo", "MM/dd");
}

const postReplyMessage = (message: ReplyMessage[], replyToken: any) => {
  // 応答メッセージ用のAPI URL
  const url = "https://api.line.me/v2/bot/message/reply";
  const TOKEN = PropertiesService.getScriptProperties().getProperty("LINE_ACCSESS_TOKEN");
  UrlFetchApp.fetch(url, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + TOKEN,
    },
    method: "post",
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: message,
    }),
  });
};

const postMessage = (msg: { type: string; text: string }[]) => {
  // messaging api のurl
  const url = "https://api.line.me/v2/bot/message/push";
  // 対象グループのID
  // const targetId = "C066bb7d1e9f375625cff0d5f0afd9c5c";
  // 個人チャット
  const targetId = 'Ue8d8652379d98fb101ec89c6110331aa';
  // LINE developersのメッセージ送受信設定に記載のアクセストークン
  const TOKEN = PropertiesService.getScriptProperties().getProperty("LINE_ACCSESS_TOKEN");

  const response = UrlFetchApp.fetch(url, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + TOKEN,
    },
    method: "post",
    payload: JSON.stringify({
      to: targetId,
      messages: msg,
    }),
  });
  return response.getResponseCode();
};

const beginningWeeklyRemind = () => {
  const mondayDate = getMondayDateInThisWeek();
  const postAuthor = getPostAuthor(mondayDate);
  const message = [
    {
      type: "text",
      text: "今週投稿するのは " + postAuthor + " ナン！よろしくナン！",
    },
  ];
  postMessage(message);
  console.log(message);
};

const endOfWeeklyRemind = () => {
  const mondayDate = getMondayDateInThisWeek();
  const postAuthor = getPostAuthor(mondayDate);
  var messages = createQuickReplyMsg(postAuthor);
  postMessage(messages);
  console.log(messages);
};
