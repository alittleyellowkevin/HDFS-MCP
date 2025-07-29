// HDFS配置接口
export interface HDFSConfig {
    nameservices: string;
    namenodes: string[];
    rpcAddresses: Record<string, string>;
    httpAddresses: Record<string, string>;
    sharedEditsDir: string;
    failoverProvider: string;
    authentication?: {
        username?: string;
        password?: string;
        token?: string;
    };
}

// HDFS文件状态接口
export interface HDFSFileStatus {
    pathSuffix: string;
    type: 'FILE' | 'DIRECTORY';
    length: number;
    modificationTime: number;
    accessTime: number;
    blockSize: number;
    replication: number;
    owner: string;
    group: string;
    permission: string;
    storagePolicy: number;
    fileId: number;
    childrenNum?: number;
}

// HDFS列表响应接口
export interface HDFSListResponse {
    FileStatuses: {
        FileStatus: HDFSFileStatus[];
    };
}

// HDFS操作结果接口
export interface HDFSOperationResult {
    success: boolean;
    data?: any;
    error?: string;
    message: string;
}

// MCP 请求接口
export interface MCPRequest {
    jsonrpc: '2.0';
    id: string | number;
    method: string;
    params?: any;
}

// MCP 响应接口
export interface MCPResponse {
    jsonrpc: '2.0';
    id: string | number;
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}

// HDFS连接接口
export interface HDFSConnection {
    listFiles(path: string): Promise<HDFSOperationResult>;
    readFile(path: string): Promise<HDFSOperationResult>;
    writeFile(path: string, content: string): Promise<HDFSOperationResult>;
    deleteFile(path: string): Promise<HDFSOperationResult>;
    createDirectory(path: string): Promise<HDFSOperationResult>;
    getFileInfo(path: string): Promise<HDFSOperationResult>;
    testConnection(): Promise<HDFSOperationResult>;
    close(): Promise<void>;
}

// HDFS MCP 服务器接口
export interface HDFSServer {
    initialize(): Promise<void>;
    handleRequest(request: MCPRequest): Promise<MCPResponse>;
    shutdown(): Promise<void>;
} 