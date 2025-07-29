# HDFS MCP 服务器

这是一个真正的Model Context Protocol (MCP) 服务器，用于管理Hadoop分布式文件系统。它实现了MCP标准，可以与支持MCP的客户端（如Claude Desktop）集成。

## 项目结构

```
src/
├── index.ts              # 主入口文件
├── interface/
│   └── types.ts         # 类型定义
├── connection/
│   └── HDFSConnection.ts # HDFS连接管理
├── server/
│   └── HDFSMCPServer.ts # MCP服务器实现
├── tools/
│   └── HDFSTools.ts     # HDFS操作工具
└── utils/
    └── HDFSUtils.ts     # 工具函数
```

## 功能

- 列出HDFS目录中的文件
- 读取HDFS文件内容
- 写入内容到HDFS文件
- 删除HDFS文件或目录
- 创建HDFS目录
- 获取HDFS文件或目录信息
- 测试HDFS连接

## 安装

```bash
npm install
```

## 构建

```bash
npm run build
```

## 运行

```bash
npm start
```

## 配置

服务器使用以下HDFS配置：

- NameService: `haclusterdev`
- NameNodes: `n1`, `n2`
- RPC地址: 
  - n1: `1.hadoopdev.com:8020`
  - n2: `2.hadoopdev.com:8020`
- HTTP地址:
  - n1: `1.hadoopdev.com:8090`
  - n2: `2.hadoopdev.com:8090`

### 环境变量配置

可以通过环境变量自定义配置：

```bash
export HDFS_NAMESERVICES=haclusterdev
export HDFS_NAMENODES=n1,n2
export HDFS_RPC_N1=1.hadoopdev.com:8020
export HDFS_RPC_N2=2.hadoopdev.com:8020
export HDFS_HTTP_N1=1.hadoopdev.com:8090
export HDFS_HTTP_N2=2.hadoopdev.com:8090
export HDFS_USERNAME=hadoop
export HDFS_PASSWORD=your_password
```

## MCP 工具

服务器实现了以下MCP工具：

1. **hdfs_list_files** - 列出HDFS目录内容
2. **hdfs_read_file** - 读取HDFS文件内容
3. **hdfs_write_file** - 写入内容到HDFS文件
4. **hdfs_delete_file** - 删除HDFS文件或目录
5. **hdfs_create_directory** - 创建HDFS目录
6. **hdfs_get_file_info** - 获取HDFS文件信息
7. **hdfs_test_connection** - 测试HDFS连接

## 使用方法

### 作为MCP服务器运行

1. 构建项目：
   ```bash
   npm run build
   ```

2. 启动MCP服务器：
   ```bash
   npm start
   ```

3. 在支持MCP的客户端中配置：
   ```json
   {
     "mcpServers": {
       "hdfs": {
         "command": "node",
         "args": ["dist/index.js"]
       }
     }
   }
   ```

### 作为独立客户端使用

```javascript
import { HDFSMCPServer } from './dist/server/HDFSMCPServer.js';
import { HDFSConfig } from './dist/interface/types.js';

const config: HDFSConfig = {
  nameservices: 'haclusterdev',
  namenodes: ['n1', 'n2'],
  rpcAddresses: {
    n1: '1.hadoopdev.com:8020',
    n2: '2.hadoopdev.com:8020'
  },
  httpAddresses: {
    n1: '1.hadoopdev.com:8090',
    n2: '2.hadoopdev.com:8090'
  },
  sharedEditsDir: 'qjournal://1.hadoopdev.com:8485;2.hadoopdev.com:8485;3.hadoopdev.com:8485/haclusterdev',
  failoverProvider: 'org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider'
};

const server = new HDFSMCPServer(config);
await server.initialize();
```

## 特性

- **高可用性支持**: 支持HDFS HA集群，自动故障转移
- **重试机制**: 网络错误时自动重试
- **路径验证**: 自动验证和规范化HDFS路径
- **详细日志**: 完整的操作日志记录
- **错误处理**: 友好的错误信息和处理
- **类型安全**: 完整的TypeScript类型定义

## 开发

```bash
# 开发模式运行
npm run dev

# 运行测试
npm test
```

## 许可证

MIT
