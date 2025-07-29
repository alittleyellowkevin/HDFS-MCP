import dotenv from 'dotenv';
import { HDFSMCPServer } from './server/HDFSMCPServer.js';
import { HDFSConfig } from './interface/types.js';

// 加载环境变量
dotenv.config();

async function main() {
    try {
        // 从环境变量中读取HDFS配置
        const config: HDFSConfig = {
            nameservices: process.env.HDFS_NAMESERVICES || 'haclusterdev',
            namenodes: (process.env.HDFS_NAMENODES || 'n1,n2').split(','),
            rpcAddresses: {
                n1: process.env.HDFS_RPC_N1 || '1.hadoopdev.com:8020',
                n2: process.env.HDFS_RPC_N2 || '2.hadoopdev.com:8020'
            },
            httpAddresses: {
                n1: process.env.HDFS_HTTP_N1 || '1.hadoopdev.com:8090',
                n2: process.env.HDFS_HTTP_N2 || '2.hadoopdev.com:8090'
            },
            sharedEditsDir: process.env.HDFS_SHARED_EDITS_DIR || 'qjournal://1.hadoopdev.com:8485;2.hadoopdev.com:8485;3.hadoopdev.com:8485/haclusterdev',
            failoverProvider: process.env.HDFS_FAILOVER_PROVIDER || 'org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider',
            authentication: {
                username: process.env.HDFS_USERNAME || 'hadoop',
                password: process.env.HDFS_PASSWORD,
                token: process.env.HDFS_TOKEN
            }
        };

        // 启动服务前输出配置信息
        console.log('Starting HDFS MCP Server...');
        console.log('Configuration:', {
            nameservices: config.nameservices,
            namenodes: config.namenodes,
            httpAddresses: config.httpAddresses,
        });

        // 创建并初始化 HDFS MCP Server
        const server = new HDFSMCPServer(config);
        await server.initialize();
        await server.start();

        // 优雅关闭处理，监听 SIGINT 信号（如 Ctrl+C）
        process.on('SIGINT', async () => {
            console.log('\nReceived SIGINT, shutting down gracefully...');
            await server.shutdown();
            process.exit(0);
        });

        // 优雅关闭处理，监听 SIGTERM 信号
        process.on('SIGTERM', async () => {
            console.log('\nReceived SIGTERM, shutting down gracefully...');
            await server.shutdown();
            process.exit(0);
        });

        // 服务启动成功提示
        console.log('HDFS MCP Server is running...');
    } catch (error) {
        // 启动失败时输出错误信息并退出
        console.error('Failed to start HDFS MCP Server:', error);
        process.exit(1);
    }
}

// 捕获未处理的异常，防止进程崩溃
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// 捕获未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// 启动主函数
main().catch((error) => {
    console.error('Main function error:', error);
    process.exit(1);
}); 