require("@nomicfoundation/hardhat-toolbox");
require("ts-node").register({
  transpileOnly: true,
  files: true,
  compilerOptions: {
    module: "commonjs",
    resolveJsonModule: true,
    esModuleInterop: true
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 1337
    }
  }
};