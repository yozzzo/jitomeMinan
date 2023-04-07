// Gptクラスのテスト
//
import { Gpt } from "../Gpt";
import { expect } from "chai";


describe("Gpt", () => {
    describe("getResponse", () => {
        it("should return a response from the GPT API", async () => {
        const gpt = new Gpt();
        const result = await gpt.getResponse("こんにちは");
        expect(result).to.be.a("string");
        });
    });
    });
// Path: test/gpt.test.ts
// Compare this snippet from test/main.test.ts:
// const main = new Main(line);
// 
// describe("createImgUrl", () => {
//   it("should return an image URL based on replyType", () => {
//     const positiveUrl = main.createImgUrl("positive");
//     const negativeUrl = main.createImgUrl("negative");
//

