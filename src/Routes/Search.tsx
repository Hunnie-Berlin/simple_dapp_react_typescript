import React, {
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import styled from "styled-components";
import { searchTxByID } from "../utils";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  min-width: 1200px;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InputCard = styled.div`
  height: 20%;
  width: 70%;
  background-color: #fbfbfc;
  margin-left: 10%;
  display: flex;
  flex-direction: column;

  align-items: center;
  div {
    width: 70%;
    display: flex;
    justify-content: center;
  }
`;

const Input = styled.input`
  all: unset;
  width: 80%;
  min-width: 400px;
  height: 50px;
  padding: 4px 16px;
  border-radius: 5px 0 0 5px;
  background-color: #e9ecf1;
  margin-top: 30px;
`;
const Button = styled.button`
  all: unset;
  width: 100px;
  height: 50px;
  border-radius: 0 5px 5px 0;
  margin-top: 30px;
  padding: 4px 8px;
  text-align: center;
  color: white;
  background-color: #0b3687;
`;

const Message = styled.div`
  color: ${(prop) => prop.color};
  width: 300px;
  height: 50px;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Result = styled.div`
  width: 70%;
  height: 60%;
  margin-left: 10%;
  background-color: #fddc01;
  display: flex;
  flex-direction: column;
  justify-content: center;
  div {
    width: 80%;
    height: 40px;
    background-color: #fbfbfc;
    margin: 10px 10%;
    display: flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 5px;
    h3 {
      font-size: 12px;
      font-weight: 700;
      height: 28px;
      width: 130px;
      margin-right: 20px;
      border-radius: 3px;
      background-color: #ed6753;
      color: #e9ecf1;
      display: grid;
      place-items: center;
    }
  }
`;

interface Props {}
interface IResult {
  hash: string | null;
  height: number | null;
  timeStamp: string | null;
  fromAddress: string | null;
  toAddress: string | null;
  amount: string | null;
}

const Search = (props: Props) => {
  const [searchTerm, setSerchTerm] = useState<string>("");
  const [result, setResult] = useState<IResult>({
    hash: null,
    height: null,
    timeStamp: null,
    fromAddress: null,
    toAddress: null,
    amount: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const searchInput = useRef<HTMLInputElement>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSerchTerm(e.target.value);
  };

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      onClick();
    }
  };

  const onClick = (e?: MouseEvent<HTMLElement>) => {
    if (searchTerm === "") {
      setError("Please enter Transaction ID");
      searchInput.current?.focus();
    } else {
      setError(null);
      getBlock();
    }
  };

  const getBlock = async () => {
    try {
      const cleanedResult = await searchTxByID(searchTerm);
      setResult(cleanedResult);
      setIsSuccess(true);
    } catch (error) {
      console.log(error);
      setError("Can't find Block by the ID.");
    }
  };

  return (
    <Container>
      <InputCard>
        <div>
          <Input
            type="text"
            name="searchTerm"
            placeholder="Search by Transaction ID"
            value={searchTerm}
            ref={searchInput}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
          <Button onClick={onClick}>Search</Button>
        </div>
        {error && <Message color={"#ed6753;"}>{error}</Message>}
      </InputCard>
      <Result>
        <div>
          <h3>Hash</h3> {isSuccess && result.hash}
        </div>
        <div>
          <h3>Height</h3> {isSuccess && result.height}
        </div>
        <div>
          <h3>TimeStamp</h3> {isSuccess && result.timeStamp}
        </div>
        <div>
          <h3>Sender Addres</h3>
          {isSuccess && result.fromAddress}
        </div>
        <div>
          <h3>Recipient Address</h3> {isSuccess && result.toAddress}
        </div>
        <div>
          <h3>Amount</h3> {isSuccess && `${result.amount} UCSOM`}
        </div>
      </Result>
    </Container>
  );
};

export default Search;
