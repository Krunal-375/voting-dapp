FROM node:18

# Install dependencies and Ganache
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g ganache

# Create data directory
RUN mkdir -p /data

# Expose port
EXPOSE 8545

# Add startup script
RUN echo "#!/bin/bash\n\
npm install -g ganache && \
ganache --server.host '0.0.0.0' \
        --wallet.deterministic true \
        --chain.networkId 1337 \
        --chain.chainId 1337 \
        --database.dbPath /data \
        --wallet.totalAccounts 5 \
        --wallet.defaultBalance 1000" > /app/start.sh

RUN chmod +x /app/start.sh

# Set start command
CMD ["/app/start.sh"]