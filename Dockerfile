FROM node:18

# Install dependencies and Ganache
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g ganache

# Create data directory
RUN mkdir -p /data

# Expose port
EXPOSE 8545

# Create startup script
COPY <<-'EOF' /app/start.sh
#!/bin/bash
ganache \
  --server.host "0.0.0.0" \
  --wallet.deterministic true \
  --chain.networkId 1337 \
  --chain.chainId 1337 \
  --database.dbPath /data \
  --wallet.totalAccounts 5 \
  --wallet.defaultBalance 1000
EOF

RUN chmod +x /app/start.sh

# Set start command
CMD ["/app/start.sh"]