import {
  SigningCosmosClient,
  Secp256k1HdWallet,
  MsgSend,
  Coin,
} from "@cosmjs/launchpad";

const URL = "http://localhost:1317";

const faucet = {
  mnemonic:
    "economy stock theory fatal elder harbor betray wasp final emotion task crumble siren bottom lizard educate guess current outdoor pair theory focus wife stone",
  pubkey: {
    type: "tendermint/PubKeySecp256k1",
    value: "A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ",
  },
  address: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
};

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

export const searchTxByID = async (searchTerm: string) => {
  const wallet = await Secp256k1HdWallet.fromMnemonic(faucet.mnemonic);
  const client = new SigningCosmosClient(URL, faucet.address, wallet);
  const result = await client.searchTx({
    id: searchTerm,
  });
  const cleanedResult = {
    hash: result[0].hash,
    height: result[0].height,
    timeStamp: result[0].timestamp,
    fromAddress: result[0].tx.value.msg[0].value.from_address,
    toAddress: result[0].tx.value.msg[0].value.to_address,
    amount: result[0].tx.value.msg[0].value.amount[0].amount,
  };
  return cleanedResult;
};
