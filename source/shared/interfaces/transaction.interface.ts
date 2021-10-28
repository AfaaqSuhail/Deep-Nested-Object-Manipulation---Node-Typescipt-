export interface Transaction {
    id: string,
    age: number,
    name: string,
    email: string,
    phone: string,
    geoInfo: GeoInfo,
    children?: Transaction[],
    connectionInfo?: ConnectionInfo,
    combinedConnectionInfo?: CombinedConnectionInfo
}

export interface TransactionChildren {
    children: Transaction[];
}

export interface ConnectionInfo {
    type: string,
    confidence: number
}

export interface CombinedConnectionInfo {
    confidence: number,
    types: Array<string>
}

interface GeoInfo {
    latitude: number,
    longitude: number
}