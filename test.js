import { hdfsServer } from './dist/simple-server.js';

async function testHDFSOperations() {
    console.log('=== HDFS MCP 服务器测试 ===\n');

    // 测试连接
    console.log('1. 测试HDFS连接...');
    const connectionResult = await hdfsServer.testConnection();
    console.log('连接结果:', JSON.stringify(connectionResult, null, 2));
    console.log('');

    // 测试列出文件
    console.log('2. 测试列出文件...');
    const listResult = await hdfsServer.listFiles('/user/hadoop');
    console.log('列出文件结果:', JSON.stringify(listResult, null, 2));
    console.log('');

    // 测试创建目录
    console.log('3. 测试创建目录...');
    const createDirResult = await hdfsServer.createDirectory('/user/hadoop/testdir');
    console.log('创建目录结果:', JSON.stringify(createDirResult, null, 2));
    console.log('');

    // 测试写入文件
    console.log('4. 测试写入文件...');
    const writeResult = await hdfsServer.writeFile('/user/hadoop/testfile.txt', 'Hello HDFS!');
    console.log('写入文件结果:', JSON.stringify(writeResult, null, 2));
    console.log('');

    // 测试读取文件
    console.log('5. 测试读取文件...');
    const readResult = await hdfsServer.readFile('/user/hadoop/testfile.txt');
    console.log('读取文件结果:', JSON.stringify(readResult, null, 2));
    console.log('');

    // 测试获取文件信息
    console.log('6. 测试获取文件信息...');
    const infoResult = await hdfsServer.getFileInfo('/user/hadoop/testfile.txt');
    console.log('文件信息结果:', JSON.stringify(infoResult, null, 2));
    console.log('');

    // 测试删除文件
    console.log('7. 测试删除文件...');
    const deleteResult = await hdfsServer.deleteFile('/user/hadoop/testfile.txt');
    console.log('删除文件结果:', JSON.stringify(deleteResult, null, 2));
    console.log('');

    console.log('=== 测试完成 ===');
}

// 运行测试
testHDFSOperations().catch(console.error); 