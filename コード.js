const createQuickReplyMsg=(postAuther)=>{
  const message = [
    {
      "type": "text",
      "text": "今週投稿するのは "+postAuther+" だったナン！投稿できたナン？",
      "quickReply": {
        "items": [
          {
            "type": "action",
            "action": {
              "type": "postback",
              "label": "投稿したよ！",
              "displayText": "投稿したよ！",
              "data": "posted"
            }
          },
          {
            "type": "action",
            "action": {
              "type": "postback",
              "label": "今週無理やわ。誰か頼む。",
              "displayText": "今週無理やわ。誰か頼む。",
              "data": "cant"
            }
          },
        ]
      }
    }
  ];
  return message;
}

/*
 LINEの応答
  replyToken：応答トークン
  messages：応答メッセージ
*/
function replyMessage(replyToken, messages){
  var replyURL = "https://api.line.me/v2/bot/message/reply";
  var ACCESS_TOKEN = "xxxxxxxxxxxxxxxxxxxx";
  UrlFetchApp.fetch(replyURL, {
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + ACCESS_TOKEN
    },
    "method": "post",
    "payload": JSON.stringify({
      "replyToken": replyToken,
      "messages": messages
    }),
  });
}


const dateFormat =(date)=>{
  // Date型データをフォーマット
  const dateString = Utilities.formatDate(date, 'JST', 'yyyy-MM-dd');
  // フォーマットした日時を実行ログに表示
  // console.log(dateString);
  return dateString
}


const getPostAuther=(targetDate)=>{
  console.log(targetDate)
  const col = 1;
  const sheet = SpreadsheetApp.openById('1odPJZx7Mjyg_6Fn1hcEUBhMe2Uc-7aT17ikp7_PT1-s').getSheetByName('シート1');
  const dat = sheet.getDataRange().getValues(); //受け取ったシートのデータを二次元配列に取得

  for(var i=1;i<dat.length;i++){
    const date = dateFormat(new Date(dat[i][col-1]));
    if(date === targetDate){
      return dat[i][col]
    }
  }
  return "error"
}

const createImgUrl=(replyType)=>{
  const negativeImgIds = [
    "1lzRj1Dygh0MvKHpkZnpUIR0TILF1dt5M",
    "17xHb_OkT4Sl58cUIAZGE9_qYvw-9_wFb",
    "1_fYDlN_HosdEWRwd0me-UCSln24TvO1z",
    "1PcSsecSILn6YN4aPfDe0y60NEyfulu2F",
    "19N2h76IB0_izlYVxZzIIEoOT6IB8d5-H",
    "1PcSsecSILn6YN4aPfDe0y60NEyfulu2F",
    "19N2h76IB0_izlYVxZzIIEoOT6IB8d5-H",
  ]
  const positiveImgIds = [
    "11KhDVwoPbAiKZfwtyML31ynpGUPhMeMB",
    "1vNILOIwOusluYheH2-Sj7MH9Dr4xPpRN",
    "1key3WdxSluy1eT6qg366_o3FuutHqd9L",
    "1Vo__w5VWg5qyOLm44HmfTjZRe7ZRUy7L",
    "14EMIylZmQKFJPQgncfxBkOPPhjGfT4PR",
    "1YUv4mhAC4PG-K0Zlqon9vvSPJVoiHRuk",
    "1Zz9InbjXSRbLu9jxwGNEdzTAjFuwuxiH"
  ]
  const preUrl = "https://drive.google.com/uc?id=";
  
  //0~6の整数になるように数値計算
  let rand = Math.random();
  rand = Math.floor(rand*7);
  console.log(rand)
  
  let imgId = "";
  console.log(positiveImgIds[0])
  
  if(replyType==="positive"){
    imgId = positiveImgIds[rand]
  }else{
    imgId = negativeImgIds[rand]
  }
  
  const imgUrl = preUrl+imgId
  console.log(imgUrl)
  return imgUrl
}

const imageMessage=(replyType)=>{
  const imgUrl = createImgUrl(replyType)
  const message = [{
        type: 'image',
        originalContentUrl: imgUrl, 
        previewImageUrl: imgUrl
      }]
  return message
}

const makeReplyMessage=(replyType)=>{
  let text = ""
  if(replyType==="positive"){
    text = "さすがナン！この調子で頑張るナン！"
  }else{
    text = "そういうこともあるナン、、、次頑張るナン。今回は他の人頼むナン。"
  }
  const msg = [{
        type: 'text',
        text: text,
      }];
  return  msg
}


function doPost(e) {
  // WebHookで受信した応答用Token
  const replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  const type = JSON.parse(e.postData.contents).events[0].type;
  const postback = JSON.parse(e.postData.contents).events[0].postback.data;
  const replyType = postback == "posted" ? "positive": "negative";

  let message = []
  message = message.concat(imageMessage(replyType));
  message = message.concat(makeReplyMessage(replyType));
  console.log(message)
  postReplyMessage(message, replyToken);
}


function getMondayDate(d) {
  const target_date = new Date(d);
  const year = target_date.getFullYear();
  const month = target_date.getMonth();
  const date = target_date.getDate();
  const day_num = target_date.getDay();
  const sunday = date - day_num;
  return dateFormat(new Date(year, month, sunday+1));
}

function format_date(date){
  return Utilities.formatDate(date, 'Asia/Tokyo', 'MM/dd');
}

const postReplyMessage=(message, replyToken)=>{
  // 応答メッセージ用のAPI URL
  const url = 'https://api.line.me/v2/bot/message/reply';
  const TOKEN = '1xP9We56vepvT/ZwnByZYYJx6KwJES/XdCq4n208ziXv/kOhVgT5alQmGPkLIIKceFaQ287Op7L4xb4XGIotSwJ1wvMTu/lPElnsO2fRGZJIsE4vYs5UcNRg1pSZOAK3aGHBsTS7B+87nPiCK38Q3wdB04t89/1O/w1cDnyilFU=';
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': message
    }),
    });
}

const postMessage = (msg) => {
  // messageing api のurl
  const url = 'https://api.line.me/v2/bot/message/push'
  // 対象グループのID
  const targetId = 'C066bb7d1e9f375625cff0d5f0afd9c5c';
  // 個人チャット
  // const targetId = 'Ue8d8652379d98fb101ec89c6110331aa';
  // LINE developersのメッセージ送受信設定に記載のアクセストークン
  const TOKEN = '1xP9We56vepvT/ZwnByZYYJx6KwJES/XdCq4n208ziXv/kOhVgT5alQmGPkLIIKceFaQ287Op7L4xb4XGIotSwJ1wvMTu/lPElnsO2fRGZJIsE4vYs5UcNRg1pSZOAK3aGHBsTS7B+87nPiCK38Q3wdB04t89/1O/w1cDnyilFU=';

  const response =
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': targetId,
      'messages': msg
    }),
    })
  return response.getResponseCode()
}

const beginningWeeklyRemind =()=>{
  const mondayDate = getMondayDate(new Date())
  const postAuther = getPostAuther(mondayDate)
  const message = [{
        'type': 'text',
        'text': "今週投稿するのは "+postAuther+" ナン！よろしくナン！",
      }];
  postMessage(message)
  console.log(message)
}


const endOfWeeklyRemind =()=>{
  const mondayDate = getMondayDate(new Date())
  const postAuther = getPostAuther(mondayDate)
  messages = createQuickReplyMsg(postAuther)
  postMessage(messages)
  console.log(messages)
}
