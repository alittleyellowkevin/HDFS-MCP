#!/bin/bash

echo "安装依赖..."
npm install

echo "构建项目..."
npm run build

echo "启动HDFS MCP服务器..."
npm start 