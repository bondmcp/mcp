FROM python:3.11-slim
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir .[cli]
ENTRYPOINT ["bondmcp"]
CMD ["--help"]
