const hre = require("hardhat")

async function main() {
  console.log("Deploying SLERF contracts to", hre.network.name)

  // Deploy SLERF Token
  console.log("Deploying SLERFToken...")
  const SLERFToken = await hre.ethers.getContractFactory("SLERFToken")
  const slerfToken = await SLERFToken.deploy()
  await slerfToken.deployed()
  console.log("SLERFToken deployed to:", slerfToken.address)

  // Deploy SLERF Game
  console.log("Deploying SLERFGame...")
  const SLERFGame = await hre.ethers.getContractFactory("SLERFGame")
  const slerfGame = await SLERFGame.deploy(slerfToken.address)
  await slerfGame.deployed()
  console.log("SLERFGame deployed to:", slerfGame.address)

  // Add game contract as minter
  console.log("Adding SLERFGame as minter...")
  await slerfToken.addMinter(slerfGame.address)
  console.log("SLERFGame added as minter")

  // Verify contracts on Etherscan
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...")
    await slerfToken.deployTransaction.wait(6)
    await slerfGame.deployTransaction.wait(6)

    console.log("Verifying contracts...")
    try {
      await hre.run("verify:verify", {
        address: slerfToken.address,
        constructorArguments: [],
      })
    } catch (error) {
      console.log("Token verification failed:", error.message)
    }

    try {
      await hre.run("verify:verify", {
        address: slerfGame.address,
        constructorArguments: [slerfToken.address],
      })
    } catch (error) {
      console.log("Game verification failed:", error.message)
    }
  }

  console.log("\n=== Deployment Summary ===")
  console.log("Network:", hre.network.name)
  console.log("SLERFToken:", slerfToken.address)
  console.log("SLERFGame:", slerfGame.address)
  console.log("\nUpdate your .env file with these addresses:")
  console.log(`NEXT_PUBLIC_SLERF_TOKEN_ADDRESS=${slerfToken.address}`)
  console.log(`NEXT_PUBLIC_SLERF_GAME_ADDRESS=${slerfGame.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
