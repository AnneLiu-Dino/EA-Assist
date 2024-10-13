# 使用官方Python基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制项目的依赖文件
COPY myapp/requirements.txt /app/

# 安装依赖
RUN pip install --no-cache-dir -r /app/requirements.txt

# 复制项目文件
COPY myapp /app/myapp
COPY myproject /app/myproject

# 暴露Django默认的端口
EXPOSE 8000

# 运行Django开发服务器
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
