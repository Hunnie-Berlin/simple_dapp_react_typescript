import React, {
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import styled from "styled-components";
import { getClientBalance, makeTx } from "../utils";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  min-width: 1200px;
  min-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputCard = styled.div`
  position: relative;
  height: 80%;
  width: 40%;
  margin-left: 10%;
  background-color: #fbfbfc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  all: unset;
  width: 80%;
  min-width: 400px;
  height: 50px;
  padding: 4px 16px;
  border-radius: 5px;
  margin: 10px 0;
  background-color: #e9ecf1;
`;

const Button = styled.button`
  all: unset;
  width: 200px;
  height: 30px;
  border-radius: 5px;
  margin-top: 30px;
  padding: 4px 8px;
  text-align: center;
  color: white;
  background-color: #0b3687;
`;

const Message = styled.div`
  color: white;
  background-color: ${(prop) => prop.color};
  width: 300px;
  height: 50px;
  margin-bottom: 10px;
  border-radius: 25px;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AccountCard = styled.div`
  height: 80%;
  width: 30%;
  background-color: #fddc01;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  height: 100px;
  width: 80%;
  font-size: 24px;
  font-weight: 200;
  color: #0b3687;
  display: grid;
  place-items: center;
`;
const Balance = styled.div`
  height: 50px;
  width: 80%;
  padding: 8px 24px;
  border-radius: 5px;
  background-color: #fbfbfc;
  line-height: 50px;
  text-align: right;
  span:first-child {
    color: #ed6753;
    font-size: 22px;
    font-weight: 400;
  }
  span:nth-child(2) {
    color: #0b3687;
    font-size: 18px;
    font-weight: 300;
  }
`;

const Remark = styled.div`
  height: 30px;
  width: 80%;
  padding: 8px 24px;
  font-size: 12px;
  font-weight: 500;
  color: #ed6753;
  opacity: 0.7;
  text-align: right;
`;

const Result = styled.div`
  width: 90%;
  min-width: 400px;
  height: 190px;
  font-size: 16px;
  color: black;
  font-weight: 300;
  line-height: 1.5em;
  padding: 8px 24px;
  margin: 20px 0;
  word-wrap: break-word;
  h3 {
    font-size: 14px;
    font-weight: 700;
    color: #ed6753;
  }
`;

interface IProps {}

const Home = (props: IProps) => {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [senderAddress, setSenderAddress] = useState<string>("");
  const [isUserInfo, setIsUserInfo] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [txId, setTxId] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [ucosmAmount, setUcosmAmount] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [fee, setFee] = useState<number>(2000);
  const mnemonicInput = useRef<HTMLInputElement>(null);
  const recipientAddressInput = useRef<HTMLInputElement>(null);
  const senderAddressInput = useRef<HTMLInputElement>(null);
  const ucosmAmountInput = useRef<HTMLInputElement>(null);

  const onChangeMnemonic = (e: ChangeEvent<HTMLInputElement>) => {
    setMnemonic(e.target.value);
  };

  const onChangeSenderAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setSenderAddress(e.target.value);
  };

  const onChangeRicipientAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(e.target.value);
  };

  const onChangeUcosmAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setUcosmAmount(e.target.value);
  };

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (mnemonic && senderAddress) {
        onClick();
      } else {
        onFocus();
      }
    }
  };

  const onFocus = () => {
    if (mnemonic === "") {
      mnemonicInput.current?.focus();
    } else if (senderAddress === "") {
      senderAddressInput.current?.focus();
    } else if (recipientAddress === "") {
      recipientAddressInput.current?.focus();
    } else if (ucosmAmount === "") {
      ucosmAmountInput.current?.focus();
    }
  };

  const onClick = (e?: MouseEvent<HTMLElement>) => {
    if (!isUserInfo) {
      if (mnemonic === "" || senderAddress === "") {
        setError("Please enter entire information.");
        onFocus();
      } else {
        getBalance();
      }
    } else {
      if (recipientAddress === "" || ucosmAmount === "") {
        setError("Please enter entire information.");
        onFocus();
      } else if (ucosmAmount[0] === "0" || ucosmAmount.includes("-")) {
        setError("Please enter valid amount.");
        onFocus();
      } else if (recipientAddress === senderAddress) {
        setError("You entered same address.");
        onFocus();
      } else if (Number(ucosmAmount) > Number(balance) - Number(fee)) {
        setError("Your balance is short.");
        onFocus();
      } else {
        makeTransaction();
      }
    }
  };

  const goBack = () => {
    setMnemonic("");
    setSenderAddress("");
    setRecipientAddress("");
    setUcosmAmount("");
    setIsUserInfo(false);
    setIsSuccess(false);
    setError(null);
    onFocus();
  };

  const getBalance = async () => {
    try {
      const currentBalance = await getClientBalance(mnemonic, senderAddress);
      setBalance(currentBalance ? currentBalance : "0");
      setError(null);
      setIsUserInfo(true);
    } catch (error) {
      console.log(error);
      setError("Please enter valid information.");
    }
  };

  const makeTransaction = async () => {
    try {
      const [currentBalance, txId] = await makeTx(
        mnemonic,
        senderAddress,
        recipientAddress,
        ucosmAmount
      );
      setFee(Number(balance) - Number(ucosmAmount) - Number(currentBalance));
      setBalance(currentBalance ? currentBalance : "0");
      setTxId(txId);
      setError(null);
      setRecipientAddress("");
      setUcosmAmount("");
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
      setError("Please enter valid information.");
    }
  };

  return (
    <Container>
      <InputCard>
        {error && <Message color={"#ed6753;"}>{error}</Message>}
        {isSuccess && !error && (
          <Message color={"#35C997"}>The transaction was successful.</Message>
        )}

        <Input
          ref={!isUserInfo ? mnemonicInput : recipientAddressInput}
          type="text"
          name={!isUserInfo ? "mnemonic" : "recipientAddress"}
          placeholder={
            !isUserInfo ? "Enter your Mnemonic" : "Enter Ricipient Address"
          }
          value={!isUserInfo ? mnemonic : recipientAddress}
          onChange={!isUserInfo ? onChangeMnemonic : onChangeRicipientAddress}
          onKeyPress={onKeyPress}
        />
        <Input
          ref={!isUserInfo ? senderAddressInput : ucosmAmountInput}
          type="text"
          name={!isUserInfo ? "senderAddress" : "ucosmAmount"}
          placeholder={
            !isUserInfo
              ? "Enter your Wallet Address"
              : "How many UCOSM do you want to send?"
          }
          value={!isUserInfo ? senderAddress : ucosmAmount}
          onChange={!isUserInfo ? onChangeSenderAddress : onChangeUcosmAmount}
          onKeyPress={onKeyPress}
        />
        <Button onClick={onClick}>Submit</Button>
        {isUserInfo ? (
          <Button onClick={goBack} style={{ backgroundColor: "#ed6753" }}>
            Back
          </Button>
        ) : null}
      </InputCard>
      <AccountCard>
        <Title>
          <span>Your Balance in UCSOM:</span>
        </Title>
        <Balance>
          <span>{balance}</span>
          <span> UCOSM</span>
        </Balance>
        <Remark>
          ※ Fee: {fee} UCOSM({isSuccess ? "costed" : "expected"})
        </Remark>
        <Result>
          {isSuccess && (
            <>
              <h3>Transaction ID:</h3>
              <div>{txId}</div>
            </>
          )}
        </Result>
      </AccountCard>
    </Container>
  );
};

export default Home;
