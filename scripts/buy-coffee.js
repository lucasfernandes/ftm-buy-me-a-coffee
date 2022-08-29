const hre = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let idx = 0;

  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    let size = "";

    switch (memo.size) {
      case 1:
        size = "small";
        break;
      case 2:
        size = "medium";
        break;
      case 3:
        size = "large";
        break;
      default:
        size = "none";
        break;
    }
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) send a ${size} coffee and said: "${message}"`
    );
  }
}

async function main() {
  const [owner, skeletor, heman, teela] = await hre.ethers.getSigners();

  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("Contract deployed to:", buyMeACoffee.address);

  const addresses = [
    owner.address,
    skeletor.address,
    heman.address,
    teela.address,
    buyMeACoffee.address,
  ];
  console.log("== starting ==");
  await printBalances(addresses);

  const tip = { value: hre.ethers.utils.parseEther("1") };
  await buyMeACoffee
    .connect(skeletor)
    .buyCoffee("Skeletor", "He-man will not succeed", 1, tip);
  await buyMeACoffee
    .connect(heman)
    .buyCoffee("He-man", "I'll stop you Skeletor", 2, tip);
  await buyMeACoffee
    .connect(teela)
    .buyCoffee("Teela", "You're gonna be stoped Skeletor", 3, tip);

  console.log("== coffee's bought ==");
  await printBalances(addresses);

  await buyMeACoffee.connect(owner).withdrawtips();

  console.log("== withdrawing coffees ==");
  await printBalances(addresses);

  console.log("== memos ==");
  const memos = await buyMeACoffee.getMemos();
  await printMemos(memos);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
