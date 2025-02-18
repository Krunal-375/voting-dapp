FROM node:18

# Install Ganache globally
RUN npm install -g ganache

# Create a directory for persistence
RUN mkdir -p /data

# Expose Ganache port
EXPOSE 8545

# Start Ganache with specific configurations
CMD ["ganache", \
    "--server.host", "0.0.0.0", \
    "--wallet.deterministic", "true", \
    "--chain.networkId", "1337", \
    "--chain.chainId", "1337", \
    "--database.dbPath", "/data", \
    "--wallet.totalAccounts", "5", \
    "--wallet.defaultBalance", "1000"]