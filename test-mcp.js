import { spawn } from 'child_process';
import { HDFSConfig } from './dist/interface/types.js';

// 测试MCP服务器
async function testMCPServer() {
    console.log('启动HDFS MCP服务器进行测试...');

    // 启动MCP服务器进程
    const serverProcess = spawn('node', ['dist/index.js'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    // 监听服务器输出
    serverProcess.stderr.on('data', (data) => {
        console.log('服务器日志:', data.toString());
    });

    serverProcess.stdout.on('data', (data) => {
        console.log('服务器输出:', data.toString());
    });

    // 等待服务器启动
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 发送MCP请求测试
    const testRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
    };

    console.log('发送测试请求:', JSON.stringify(testRequest, null, 2));
    serverProcess.stdin.write(JSON.stringify(testRequest) + '\n');

    // 等待响应
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 关闭服务器
    serverProcess.kill('SIGTERM');
    console.log('测试完成');
}

// 运行测试
testMCPServer().catch(console.error); 