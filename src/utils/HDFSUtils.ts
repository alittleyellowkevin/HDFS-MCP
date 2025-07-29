import { HDFSFileStatus, HDFSListResponse } from '../interface/types.js';

/**
 * HDFS路径验证工具
 */
export class HDFSPathValidator {
    /**
     * 验证HDFS路径格式
     */
    static isValidPath(path: string): boolean {
        if (!path || typeof path !== 'string') {
            return false;
        }

        // HDFS路径必须以/开头
        if (!path.startsWith('/')) {
            return false;
        }

        // 检查是否包含非法字符
        const invalidChars = /[<>:"|?*]/;
        if (invalidChars.test(path)) {
            return false;
        }

        // 检查是否包含连续的斜杠
        if (path.includes('//')) {
            return false;
        }

        return true;
    }

    /**
     * 规范化HDFS路径
     */
    static normalizePath(path: string): string {
        if (!path) {
            return '/';
        }

        // 移除末尾的斜杠（除非是根路径）
        let normalized = path.replace(/\/+$/, '');
        if (normalized === '') {
            normalized = '/';
        }

        // 移除连续的斜杠
        normalized = normalized.replace(/\/+/g, '/');

        return normalized;
    }

    /**
     * 获取路径的父目录
     */
    static getParentPath(path: string): string {
        const normalized = this.normalizePath(path);
        if (normalized === '/') {
            return '/';
        }

        const lastSlashIndex = normalized.lastIndexOf('/');
        if (lastSlashIndex === 0) {
            return '/';
        }

        return normalized.substring(0, lastSlashIndex);
    }

    /**
     * 获取文件名
     */
    static getFileName(path: string): string {
        const normalized = this.normalizePath(path);
        if (normalized === '/') {
            return '';
        }

        const lastSlashIndex = normalized.lastIndexOf('/');
        return normalized.substring(lastSlashIndex + 1);
    }
}

/**
 * HDFS响应解析工具
 */
export class HDFSResponseParser {
    /**
     * 解析文件列表响应
     */
    static parseFileList(response: any): HDFSFileStatus[] {
        if (!response || !response.FileStatuses || !response.FileStatuses.FileStatus) {
            return [];
        }

        return response.FileStatuses.FileStatus;
    }

    /**
     * 格式化文件大小
     */
    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 格式化时间戳
     */
    static formatTimestamp(timestamp: number): string {
        return new Date(timestamp).toLocaleString('zh-CN');
    }

    /**
     * 格式化文件权限
     */
    static formatPermission(permission: string): string {
        if (!permission || permission.length !== 3) {
            return permission;
        }

        const permissions = ['r', 'w', 'x'];
        let result = '';

        for (let i = 0; i < 3; i++) {
            const num = parseInt(permission[i]);
            let perm = '';

            for (let j = 2; j >= 0; j--) {
                if (num & (1 << j)) {
                    perm += permissions[2 - j];
                } else {
                    perm += '-';
                }
            }

            result += perm;
        }

        return result;
    }
}

/**
 * HDFS错误处理工具
 */
export class HDFSErrorHandler {
    /**
     * 解析HDFS错误信息
     */
    static parseError(error: any): string {
        if (typeof error === 'string') {
            return error;
        }

        if (error && error.message) {
            return error.message;
        }

        if (error && error.response) {
            const status = error.response.status;
            const statusText = error.response.statusText;

            switch (status) {
                case 404:
                    return `文件或目录不存在 (404 ${statusText})`;
                case 403:
                    return `权限不足 (403 ${statusText})`;
                case 401:
                    return `需要认证 (401 ${statusText})`;
                case 500:
                    return `HDFS服务器内部错误 (500 ${statusText})`;
                default:
                    return `HTTP错误 ${status}: ${statusText}`;
            }
        }

        return '未知错误';
    }

    /**
     * 判断是否为网络错误
     */
    static isNetworkError(error: any): boolean {
        return error && (
            error.code === 'ENOTFOUND' ||
            error.code === 'ECONNREFUSED' ||
            error.code === 'ETIMEDOUT' ||
            error.message?.includes('Network Error')
        );
    }

    /**
     * 判断是否为权限错误
     */
    static isPermissionError(error: any): boolean {
        return error && (
            error.response?.status === 403 ||
            error.response?.status === 401 ||
            error.message?.includes('Permission denied')
        );
    }
}

/**
 * HDFS日志工具
 */
export class HDFSLogger {
    /**
     * 记录信息日志
     */
    static info(message: string, data?: any): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [INFO] ${message}`);
        if (data) {
            console.log(JSON.stringify(data, null, 2));
        }
    }

    /**
     * 记录错误日志
     */
    static error(message: string, error?: any): void {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] [ERROR] ${message}`);
        if (error) {
            console.error(error);
        }
    }

    /**
     * 记录调试日志
     */
    static debug(message: string, data?: any): void {
        if (process.env.NODE_ENV === 'development') {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] [DEBUG] ${message}`);
            if (data) {
                console.log(JSON.stringify(data, null, 2));
            }
        }
    }
} 