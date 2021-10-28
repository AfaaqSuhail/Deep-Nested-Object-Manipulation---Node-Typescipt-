import { Request, Response, NextFunction } from 'express';
import data from '../shared/utils/data';
import { CombinedConnectionInfo, Transaction, TransactionChildren } from '../shared/interfaces/transaction.interface';
import searcher from '../shared/utils/searcher';


// getting transactions
const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    let id: string = req.params.transactionId;
    let confidenceLevel: number = Number(req.params.confidenceLevel);
    let result: Transaction = detectFraud(id, confidenceLevel);
    if (result) {
      return res.status(200).json({result});
    } else {
      return res.status(400).json({
        result : 'record not found'
      })
    }
};


const detectFraud = (transactionId: string, confidenceLevel: number) => {
    const combinedConnectionInfo: CombinedConnectionInfo = {
        confidence : 1,
        types: []
      }
      const transaction = findTransaction(transactionId);
      if (!transaction) {
        return null as any;
      }
      let result: Transaction[] = [];
      result = flat(transaction.children, combinedConnectionInfo, confidenceLevel)
      const {children, ...rest} = transaction
      if (rest.connectionInfo) {
        delete rest.connectionInfo
      }
      result.unshift(rest);
      return result;
      }
    
    const flat = (children: any, combinedConnectionInfo: CombinedConnectionInfo, confidenceLevel: number) => {
      let result: Transaction[] = [];
      children.forEach(function (child : any) {
        let {children, ...rest} = child
        if (rest.connectionInfo.confidence >= confidenceLevel){
          rest.combinedConnectionInfo = {
            confidence: combinedConnectionInfo.confidence * rest.connectionInfo.confidence,
            types: [...combinedConnectionInfo.types, rest.connectionInfo.type]
          }
          result.push(rest);
        }
        if (Array.isArray(child.children)) {
            result = result.concat(flat(child.children, rest.combinedConnectionInfo, confidenceLevel));
        }
      });
      return result;
}
  
  const findTransaction = (id: string) => {
    let result: Transaction = null as any;
    for (let obj of data) {
      result = searcher.dfs(obj, id);
      if (result) {
        break;
      }
    }
    return result;
  }

export default { getTransactions };
