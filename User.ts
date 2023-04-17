import { Db } from "./Db";


// Userクラスの定義
export class User {
    // userに必要な情報を定義
    db: Db;
    
    constructor() {
        this.db = new Db();
    }

    // ユーザーの名前を取得する
    getUserName(lineUserId: string) {
        // this.db.jsonからユーザーの情報を取得する
        console.log(this.db.getDB());
        console.log(this.db.getDB().users);
        console.log(this.db.getDB().users.find((user: any) => user.lineUserId === lineUserId));
        const user = this.db.getDB().users.find((user: any) => user.lineUserId === lineUserId);
        
        // ユーザーの名前を取得する
        const name = user.name;
        return name;
    }

    getUserId(lineUserId: string) {
        // this.db.jsonからユーザーの情報を取得する
        const user = this.db.getDB().users.find((user: any) => user.lineUserId === lineUserId);
        // ユーザーのidを取得する
        const userId = user.userId;
        return userId;
    }

    // ユーザー名を更新する
    updateUserName(lineUserId: string, name: string) {
        // this.db.jsonからユーザーの情報を取得する
        const user = this.db.getDB().users.find((user: any) => user.lineUserId === lineUserId);
        // ユーザーの名前を更新する
        user.name = name;
        // this.db.jsonにユーザーの情報を保存する
        this.db.setDB(this.db);
    }

    existUser(lineUserId: string) {
        // this.db.jsonからユーザーの情報を取得する
        const user = this.db.getDB().users.find((user: any) => user.lineUserId === lineUserId);
        // ユーザーが存在するかどうかを返す
        return user ? true : false;
    }

    // 知らないuserIdだったら、ユーザーを追加する
    // addNewUser(lineUserId: string) {
    //     // ユーザーのidを取得する
    //     const id = 1

    //     // ユーザーの情報を作成する
    //     const newUser = {
    //         id: id,
    //         lineUserId: lineUserId,
    //         name: "名無しさん",
    //     };
    //     // this.db.jsonにユーザーの情報を保存する
    //     this.db.users.push(newUser);
    //     this.db.setDB(this.db);
    // }

}
