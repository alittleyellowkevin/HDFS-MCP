import { HDFSConnection } from '../connection/HDFSConnection.js';
import { HDFSOperationResult } from '../interface/types.js';

export class HDFSTools {
    private connection: HDFSConnection;

    constructor(connection: HDFSConnection) {
        this.connection = connection;
    }

    /**
     * 列出HDFS目录中的文件
     */
    async listFiles(path: string): Promise<HDFSOperationResult> {
        return await this.connection.listFiles(path);
    }

    /**
     * 读取HDFS文件内容
     */
    async readFile(path: string): Promise<HDFSOperationResult> {
        return await this.connection.readFile(path);
    }

    /**
     * 写入内容到HDFS文件
     */
    async writeFile(path: string, content: string): Promise<HDFSOperationResult> {
        return await this.connection.writeFile(path, content);
    }

    /**
     * 删除HDFS文件或目录
     */
    async deleteFile(path: string): Promise<HDFSOperationResult> {
        return await this.connection.deleteFile(path);
    }

    /**
     * 创建HDFS目录
     */
    async createDirectory(path: string): Promise<HDFSOperationResult> {
        return await this.connection.createDirectory(path);
    }

    /**
     * 获取HDFS文件或目录信息
     */
    async getFileInfo(path: string): Promise<HDFSOperationResult> {
        return await this.connection.getFileInfo(path);
    }

    /**
     * 测试HDFS连接
     */
    async testConnection(): Promise<HDFSOperationResult> {
        return await this.connection.testConnection();
    }

    /**
     * 检查文件是否存在
     */
    async fileExists(path: string): Promise<boolean> {
        const result = await this.connection.getFileInfo(path);
        return result.success;
    }

    /**
     * 获取文件大小
     */
    async getFileSize(path: string): Promise<number> {
        const result = await this.connection.getFileInfo(path);
        if (result.success && result.data) {
            return result.data.FileStatus.length || 0;
        }
        return 0;
    }

    /**
     * 复制文件
     */
    async copyFile(sourcePath: string, targetPath: string): Promise<HDFSOperationResult> {
        // 读取源文件
        const readResult = await this.connection.readFile(sourcePath);
        if (!readResult.success) {
            return readResult;
        }

        // 写入目标文件
        return await this.connection.writeFile(targetPath, readResult.data);
    }

    /**
     * 移动文件
     */
    async moveFile(sourcePath: string, targetPath: string): Promise<HDFSOperationResult> {
        // 先复制文件
        const copyResult = await this.copyFile(sourcePath, targetPath);
        if (!copyResult.success) {
            return copyResult;
        }

        // 删除源文件
        return await this.connection.deleteFile(sourcePath);
    }
} 