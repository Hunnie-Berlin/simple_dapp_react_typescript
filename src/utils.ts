import {
  SigningCosmosClient,
  Secp256k1HdWallet,
  MsgSend,
  Coin,
} from "@cosmjs/launchpad";

const URL = "http://localhost:1317";

export const getClientBalance = async (
  mnemonic: string | null,
  fromAddress: string | null
) => {
  if (mnemonic === null || fromAddress === null) {
    throw Error;
  } else {
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic);
    const client = new SigningCosmosClient(URL, fromAddress, wallet);
    const account = await client.getAccount();
    const ucosmBalance = account?.balance
      .filter((item) => item.denom === "ucosm")
      .map((item) => item.amount);
    return ucosmBalance ? ucosmBalance[0] : "0";
  }
};

export const makeTx = async (
  mnemonic: string,
  fromAddress: string,
  toAddress: string,
  enteredAmount: string
) => {
  const amountInUcosm: Coin[] = [
    {
      denom: "ucosm",
      amount: enteredAmount,
    },
  ];

  const msg: MsgSend = {
    type: "cosmos-sdk/MsgSend",
    value: {
      from_address: fromAddress,
      to_address: toAddress,
      amount: amountInUcosm,
    },
  };

  const fee = {
    amount: [
      {
        denom: "ucosm",
        amount: "2000",
      },
    ],
    gas: "80000",
  };

  const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic);
  const client = new SigningCosmosClient(URL, fromAddress, wallet);
  const makeSignAndBroadcast = await client.signAndBroadcast(
    [msg],
    fee,
    "I hope this will be a right way."
  );
  const account = await client.getAccount();
  const ucosmBalance = account?.balance
    .filter((item) => item.denom === "ucosm")
    .map((item) => item.amount);
  const txID = makeSignAndBroadcast.transactionHash;
  return [ucosmBalance ? ucosmBalance[0] : "0", txID];
};
