# argus-cache-snapshot

Simple node.js script for monitoring Argus cache size. The script uses node-cron to execute once every midnight. It will take a snapshot of `cache.json` file at `CACHE_FILE_PATH`. It will also measure size of distributor data directory at `DATA_DIRECTORY_PATH`. It will save results to `OUTPUT_DIRECTORY_PATH`. The cron schedule can be overriden using `CRON_SCHEDULE` env.

## Getting started

```sh
npm i
npm run start
```

## Docker

You can also use it with Docker for easily managed and persistent service.

```sh
docker build -t argus-cache-snapshot .
docker run -d -v /root/js-data/distributor/cache:/app/cache -v /root/js-data/distributor/data:/app/data -v /root/dist-snapshots:/app/output -e CACHE_FILE_PATH=/app/cache/cache.json -e DATA_DIRECTORY_PATH=/app/data -e OUTPUT_DIRECTORY_PATH=/app/output argus-cache-snapshot
```
