import { Transaction } from "../interfaces/transaction.interface";

const searcher = {
    dfs(obj: Transaction, id: string): Transaction {
        if (obj.id === id) {
            return obj;
        }
        if (obj.children) {
            for (let child of obj.children) {
                let result: Transaction = this.dfs(child, id);
                if (result) return result
            }
        }
        return null as any;
    }
}

export default searcher;
