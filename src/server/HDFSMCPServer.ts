import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { HDFSConnection } from '../connection/HDFSConnection.js';
import { HDFSTools } from '../tools/HDFSTools.js';
import { HDFSConfig } from '../interface/types.js';
import { HDFSLogger } from '../utils/HDFSUtils.js';

export class HDFSMCPServer {
    private server: Server;
    private connection: HDFSConnection;
    private tools: HDFSTools;
    private config: HDFSConfig;

    constructor(config: HDFSConfig) {
        this.config = config;
        this.connection = new HDFSConnection(config);
        this.tools = new HDFSTools(this.connection);

        this.server = new Server(
            {
                name: 'hdfs-mcp-server',
                version: '1.0.0',
            }
        );

        this.setupToolHandlers();
    }

    private setupToolHandlers(): void {
        // List tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'hdfs_list_files',
                        description: '列出HDFS目录中的文件',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: {
                                    type: 'string',
                                    description: 'HDFS路径',
                                },
                            },
                            required: ['path'],
                        },
                    },
                    {
                        name: 'hdfs_read_file',
                        description: '读取HDFS文件内容',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: {
                                    type: 'string',
                                    description: 'HDFS文件路径',
                                },
                            },
                            required: ['path'],
                        },
                    },
                    {
                        name: 'hdfs_write_file',
                        description: '写入内容到HDFS文件',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: {
                                    type: 'string',
                                    description: 'HDFS文件路径',
                                },
                                content: {
                                    type: 'string',
                                    description: '要写入的内容',
                                },
                            },
                            required: ['path', 'content'],
                        },
                    },
                    {
                        name: 'hdfs_delete_file',
                        description: '删除HDFS文件或目录',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: {
                                    type: 'string',
                                    description: 'HDFS路径',
                                },
                            },
                            required: ['path'],
                        },
                    },
                    {
                        name: 'hdfs_create_directory',
                        description: '创建HDFS目录',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: {
                                    type: 'string',
                                    description: 'HDFS目录路径',
                                },
                            },
                            required: ['path'],
                        },
                    },
                    {
                        name: 'hdfs_get_file_info',
                        description: '获取HDFS文件或目录信息',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                path: {
                                    type: 'string',
                                    description: 'HDFS路径',
                                },
                            },
                            required: ['path'],
                        },
                    },
                    {
                        name: 'hdfs_test_connection',
                        description: '测试HDFS连接',
                        inputSchema: {
                            type: 'object',
                            properties: {},
                            required: [],
                        },
                    },
                ],
            };
        });

        // Call tool
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            switch (name) {
                case 'hdfs_list_files':
                    return await this.handleListFiles(args);
                case 'hdfs_read_file':
                    return await this.handleReadFile(args);
                case 'hdfs_write_file':
                    return await this.handleWriteFile(args);
                case 'hdfs_delete_file':
                    return await this.handleDeleteFile(args);
                case 'hdfs_create_directory':
                    return await this.handleCreateDirectory(args);
                case 'hdfs_get_file_info':
                    return await this.handleGetFileInfo(args);
                case 'hdfs_test_connection':
                    return await this.handleTestConnection(args);
                default:
                    throw new Error(`未知的工具: ${name}`);
            }
        });
    }

    private async handleListFiles(args: any): Promise<any> {
        HDFSLogger.info(`列出文件: ${args.path}`);
        const result = await this.tools.listFiles(args.path);
        return {
            content: [
                {
                    type: 'text',
                    text: result.success
                        ? JSON.stringify(result.data, null, 2)
                        : result.error || result.message
                }
            ]
        };
    }

    private async handleReadFile(args: any): Promise<any> {
        HDFSLogger.info(`读取文件: ${args.path}`);
        const result = await this.tools.readFile(args.path);
        return {
            content: [
                {
                    type: 'text',
                    text: result.success
                        ? result.data
                        : result.error || result.message
                }
            ]
        };
    }

    private async handleWriteFile(args: any): Promise<any> {
        HDFSLogger.info(`写入文件: ${args.path}`);
        const result = await this.tools.writeFile(args.path, args.content);
        return {
            content: [
                {
                    type: 'text',
                    text: result.success
                        ? result.message
                        : result.error || result.message
                }
            ]
        };
    }

    private async handleDeleteFile(args: any): Promise<any> {
        HDFSLogger.info(`删除文件: ${args.path}`);
        const result = await this.tools.deleteFile(args.path);
        return {
            content: [
                {
                    type: 'text',
                    text: result.success
                        ? result.message
                        : result.error || result.message
                }
            ]
        };
    }

    private async handleCreateDirectory(args: any): Promise<any> {
        HDFSLogger.info(`创建目录: ${args.path}`);
        const result = await this.tools.createDirectory(args.path);
        return {
            content: [
                {
                    type: 'text',
                    text: result.success
                        ? result.message
                        : result.error || result.message
                }
            ]
        };
    }

    private async handleGetFileInfo(args: any): Promise<any> {
        HDFSLogger.info(`获取文件信息: ${args.path}`);
        const result = await this.tools.getFileInfo(args.path);
        return {
            content: [
                {
                    type: 'text',
                    text: result.success
                        ? JSON.stringify(result.data, null, 2)
                        : result.error || result.message
                }
            ]
        };
    }

    private async handleTestConnection(args: any): Promise<any> {
        HDFSLogger.info('测试HDFS连接');
        const result = await this.tools.testConnection();
        return {
            content: [
                {
                    type: 'text',
                    text: result.success
                        ? result.message
                        : result.error || result.message
                }
            ]
        };
    }

    async initialize(): Promise<void> {
        // 测试连接
        HDFSLogger.info('初始化HDFS MCP服务器');
        const result = await this.tools.testConnection();
        if (!result.success) {
            throw new Error(`HDFS连接失败: ${result.error}`);
        }
        HDFSLogger.info('HDFS连接成功');
    }

    async start(): Promise<void> {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        HDFSLogger.info('HDFS MCP 服务器已启动');
    }

    async shutdown(): Promise<void> {
        await this.connection.close();
        HDFSLogger.info('HDFS MCP 服务器已关闭');
    }
} 