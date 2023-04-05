import {Main} from '../Main';
import {Line} from '../Line';
const line = new Line();
const main = new Main(line);
  
  describe("createImgUrl", () => {
    it("should return an image URL based on replyType", () => {
      const positiveUrl = main.createImgUrl("positive");
      const negativeUrl = main.createImgUrl("negative");
  
      expect(positiveUrl.startsWith("https://drive.google.com/uc?id=")).toBe(true);
      expect(negativeUrl.startsWith("https://drive.google.com/uc?id=")).toBe(true);
    });
  });
  
  describe("createQuickReplyMsg", () => {
    it("should return a quick reply message with the post author's name", () => {
      const postAuthor = "John Doe";
      const result = main.createQuickReplyMsg(postAuthor);
  
      expect(result[0].text).toContain(postAuthor);
    });
  });
  
//   describe("dateFormat", () => {
//     it("should format the date correctly", () => {
//       const date = new Date("2023-03-26");
//       const formattedDate = dateFormat(date);
  
//       expect(formattedDate).toEqual("2023-03-26");
//     });
//   });
  
  describe("getPostAuthor", () => {
    // このテストは、Google Apps Scriptの実行環境を持っていないため、ローカルで実行できません。
    // Google Apps Scriptのプロジェクトに組み込んでテストする必要があります。
  });
  
  describe("imageMessage", () => {
    it("should return an array with an image message based on replyType", () => {
      const positiveResult = main.imageMessage("positive");
      const negativeResult = main.imageMessage("negative");
  
      expect(positiveResult[0].type).toEqual("image");
      expect(negativeResult[0].type).toEqual("image");
    });
  });
  
  describe("makeReplyMessage", () => {
    it("should return an array with a text message based on replyType", () => {
      const positiveResult = main.makeReplyMessage("positive");
      const negativeResult = main.makeReplyMessage("negative");
  
      expect(positiveResult[0].type).toEqual("text");
      expect(negativeResult[0].type).toEqual("text");
      expect(positiveResult[0].text).toContain("さすがナン！");
      expect(negativeResult[0].text).toContain("そういうこともあるナン");
    });
  });
  