import axios, { AxiosError } from 'axios';
import { HDFSConfig, HDFSOperationResult } from '../interface/types.js';
import { HDFSPathValidator, HDFSErrorHandler, HDFSLogger } from '../utils/HDFSUtils.js';

type NamenodeKey = 'n1' | 'n2';

export class HDFSConnection {
    private config: HDFSConfig;
    private currentNamenode: NamenodeKey = 'n1';
    private retryCount = 3;
    private retryDelay = 1000;

    constructor(config: HDFSConfig) {
        this.config = config;
    }

    private async request<T = any>(
        method: 'get' | 'put' | 'delete',
        path: string,
        options?: { data?: any; params?: any; headers?: any }
    ): Promise<HDFSOperationResult> {
        // 验证路径
        if (!HDFSPathValidator.isValidPath(path)) {
            return {
                success: false,
                error: '无效的HDFS路径',
                message: `路径格式错误: ${path}`
            };
        }

        // 规范化路径
        const normalizedPath = HDFSPathValidator.normalizePath(path);
        HDFSLogger.debug(`HDFS请求: ${method.toUpperCase()} ${normalizedPath}`);

        let retries = this.retryCount;
        let error: AxiosError | undefined;
        const allErrors: string[] = [];

        while (retries > 0) {
            try {
                const namenode = this.config.httpAddresses[this.currentNamenode as keyof typeof this.config.httpAddresses];
                const baseUrl = `http://${namenode}/webhdfs/v1`;
                const fullUrl = `${baseUrl}${normalizedPath}`;

                HDFSLogger.debug(`尝试连接NameNode: ${this.currentNamenode} (${namenode})`);

                const response = await axios({
                    method,
                    url: fullUrl,
                    data: options?.data,
                    params: options?.params,
                    headers: {
                        'User-Agent': 'HDFS-MCP-Client/1.0',
                        ...options?.headers
                    },
                    timeout: 10000,
                });

                HDFSLogger.info(`HDFS操作成功: ${method.toUpperCase()} ${normalizedPath}`);
                return {
                    success: true,
                    data: response.data,
                    message: `操作成功: ${normalizedPath}`
                };
            } catch (err) {
                error = err as AxiosError;
                const errorMsg = HDFSErrorHandler.parseError(error);
                const fullErrorMsg = `请求失败 (${String(this.currentNamenode)}): ${errorMsg}`;
                allErrors.push(fullErrorMsg);

                HDFSLogger.error(`HDFS操作失败: ${method.toUpperCase()} ${normalizedPath}`, error);

                // 尝试切换到另一个 NameNode
                const previousNamenode = this.currentNamenode;
                this.currentNamenode = this.currentNamenode === 'n1' ? 'n2' : 'n1';
                retries--;

                if (retries > 0) {
                    HDFSLogger.debug(`切换到NameNode: ${this.currentNamenode}, 剩余重试次数: ${retries}`);
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                }
            }
        }

        const finalError = `多次尝试失败:\n${allErrors.join('\n')}`;
        HDFSLogger.error(`HDFS操作最终失败: ${method.toUpperCase()} ${normalizedPath}`, finalError);

        return {
            success: false,
            error: finalError,
            message: `无法访问 HDFS: ${normalizedPath}`
        };
    }

    async listFiles(path: string): Promise<HDFSOperationResult> {
        return this.request('get', path, { params: { op: 'LISTSTATUS' } });
    }

    async readFile(path: string): Promise<HDFSOperationResult> {
        return this.request('get', path, { params: { op: 'OPEN' } });
    }

    async writeFile(path: string, content: string): Promise<HDFSOperationResult> {
        return this.request('put', path, {
            params: { op: 'CREATE', overwrite: true },
            headers: { 'Content-Type': 'application/octet-stream' },
            data: content
        });
    }

    async deleteFile(path: string): Promise<HDFSOperationResult> {
        return this.request('delete', path, {
            params: { op: 'DELETE', recursive: true }
        });
    }

    async createDirectory(path: string): Promise<HDFSOperationResult> {
        return this.request('put', path, {
            params: { op: 'MKDIRS' }
        });
    }

    async getFileInfo(path: string): Promise<HDFSOperationResult> {
        return this.request('get', path, {
            params: { op: 'GETFILESTATUS' }
        });
    }

    async testConnection(): Promise<HDFSOperationResult> {
        return this.request('get', '/', { params: { op: 'LISTSTATUS' } });
    }

    async close(): Promise<void> {
        // HDFS连接不需要显式关闭
    }
} 