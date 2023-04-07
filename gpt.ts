// chatGPTのAPIを叩くクラス
import { Constant } from "./Constant";
export class Gpt {
    apiKey: string;
    url: string;
    model: string;
    temperature: number;
    maxTokens: number;

    constructor() {
        const constant = new Constant();
        this.apiKey = constant.GPT_API_KEY;
        this.model = constant.GPT_MODEL;
        this.temperature = constant.GPT_TEMPERATURE;
        this.url = constant.GPT_URL;
        this.maxTokens = constant.MAX_TOKENS;
    }

    getReply(content: string, callback: (reply: string) => void) {
        console.log("getReply");
        const requestBody = {
            "model": this.model,
            "messages": [{ 'role': 'user', 'content': content }],
            "temperature": this.temperature,
            "max_tokens": this.maxTokens,
        };
        console.log(requestBody);

        const requestOptions: any = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.apiKey
            },
            "payload": JSON.stringify(requestBody)
        };

        try {
            console.log("try");

            const response = UrlFetchApp.fetch(this.url, requestOptions);
            console.log("1");
            console.log(response);

            const jsonResponse = JSON.parse(response.getContentText());
            console.log("2");
            console.log(jsonResponse);

            const reply = jsonResponse.choices[0].message.content.trim();
            callback(reply);
        } catch (error) {
            console.log("error: " + error);
            callback("ちょっと問題発生ナン。。\nごめんねナン");
        }
    }
}