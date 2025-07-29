# HDFS MCP 服务器使用示例

## 基本操作

### 1. 列出目录内容
```json
{
  "name": "list_files",
  "arguments": {
    "path": "/user/hadoop"
  }
}
```

### 2. 读取文件内容
```json
{
  "name": "read_file",
  "arguments": {
    "path": "/user/hadoop/example.txt"
  }
}
```

### 3. 写入文件内容
```json
{
  "name": "write_file",
  "arguments": {
    "path": "/user/hadoop/newfile.txt",
    "content": "这是文件内容"
  }
}
```

### 4. 创建目录
```json
{
  "name": "create_directory",
  "arguments": {
    "path": "/user/hadoop/newdir"
  }
}
```

### 5. 删除文件或目录
```json
{
  "name": "delete_file",
  "arguments": {
    "path": "/user/hadoop/oldfile.txt"
  }
}
```

### 6. 获取文件信息
```json
{
  "name": "get_file_info",
  "arguments": {
    "path": "/user/hadoop/example.txt"
  }
}
```

## 配置说明

服务器会自动连接到配置的HDFS集群：
- 主NameNode: 1.hadoopdev.com:8090
- 备用NameNode: 2.hadoopdev.com:8090
- 使用WebHDFS REST API进行通信

## 错误处理

所有操作都包含错误处理，如果操作失败会返回相应的错误信息。 