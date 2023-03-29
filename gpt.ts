// chatGPTのAPIを叩くクラス

class GPT {
    apiKey: string | null;
    url: string;
    
    constructor() {
        this.url = "https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk";
        this.apiKey = PropertiesService.getScriptProperties().getProperty("GPT_API_KEY");
    }
    
    async getResponse(message: string) {
        const response = await UrlFetchApp.fetch(this.url, {
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        method: "post",
        payload: JSON.stringify({
            apikey: this.apiKey,
            query: message,
        }),
        });
        const json = JSON.parse(response.getContentText());
        return json.results[0].reply;
    }
}
