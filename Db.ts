// jsonをデータベースの代わりにする。
// 本来はデータベースを使うが、今回はjsonを使う。

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dbPath = join(__dirname, 'db.json');

// dbクラスの定義
export class Db {
    // dbに必要な情報を定義
    constructor() {}
    // データベースからデータを取得する
    getDB() {
        const db = JSON.parse(readFileSync(dbPath, 'utf-8'));
        return db;
    }
    // データベースにデータを保存する
    setDB(db: any) {
        writeFileSync(dbPath, JSON.stringify(db, null, 2));
    }
}
