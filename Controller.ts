import { Line } from "./Line";
import { Main } from "./Main";
import { Constant } from "./Constant";

const beginningWeeklyRemind = () => {
  const line = new Line();
  const constant = new Constant();
  const main = new Main(line, constant);

  main.beginningWeeklyRemind();
};

const endOfWeeklyRemind = () => {
  const line = new Line();
  const constant = new Constant();
  const main = new Main(line, constant);

  main.endOfWeeklyRemind();
};



const doPost = (e: any) => {
  console.log("fooks成功")
  const line = new Line();
  const constant = new Constant();
  const main = new Main(line, constant);


  const groupId: string | null = JSON.parse(e.postData.contents).events[0].source.groupId ?? null;
  const userId: string = JSON.parse(e.postData.contents).events[0].source.userId ?? null;
  const text: string = JSON.parse(e.postData.contents).events[0].message.text ?? null;
  const type: string = JSON.parse(e.postData.contents).events[0].type ?? null;
  const replyToken: string = JSON.parse(e.postData.contents).events[0].replyToken ?? null;

  console.log("値取得完了")
  console.log("type: " + type)
  console.log("text: " + text)
  console.log("replyToken: " + replyToken)
  isValidateId(constant, groupId, userId);
  console.log("id検証完了")

  if (type === "postback") {
    main.postBack(e, line);
  } else if (type === "message") {
    //　このbot宛のメッセージでなければエラーを投げる
    if (isNotForMinan(text)) {
      console.log("このbot宛ではありません。")
      throw new Error("このbot宛のメッセージではありません");
    }
    main.talkToMinan(groupId, userId, text, replyToken);
  } else {
    throw new Error("不正なアクセスです");
  }
}

const isValidateId = (constant: Constant, groupId: string | null, userId: string | null) => {
  if (groupId === constant.CORRECT_LINE_GROUP_ID || userId === constant.DEBUG_LINE_ID) {
    return true;
  }
  throw new Error("不正なアクセスです");
}

// @マイナンという語句が含まれるかどうか判定する関数
const isNotForMinan = (text: string): boolean => {
  const minan = "@マイナン";
  const result: boolean = text.includes(minan)
  return !result;
}


