// Gptクラスのテスト
//
import { Gpt } from "../Gpt";
import { expect } from "chai";


// getReplyメソッドのテスト.でもgasでしか動かないのでコメントアウト
// describe("getReply", () => {
//     it("should return a reply", () => {
//         const gpt = new Gpt();
//         const prompt = "こんにちは"
//         gpt.getReply(prompt, (reply: any) => {
//             expect(reply).to.be.a("string");
//         });
//     });
// });