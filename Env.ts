// 定数パラメーターを取得するクラス
export class Env {
    // デバッグモードかどうか
    static get IS_DEBUG() {
        // Env.callProperty("IS_DEBUG");
        // return false;
        return true;
    }
}
