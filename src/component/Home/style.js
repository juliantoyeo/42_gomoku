import styled from 'styled-components';

export const MainContainer = styled.div`
  display: flex;
  background-color: black;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const MenuContainer = styled.div`
  border: 1px solid white;
  background-color: #333333;
  width: 1000px;
  height: 300px;
  border-radius: 5px;
  color: white;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  padding: 20px;
`;

export const MenuTitle = styled.div`
  /* border: 1px solid white; */
  text-align: center;
  margin: 10px 0px;
`;

export const InputContainer = styled.div`
  /* border: 1px solid white; */
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin: 20px 0px;
  input {
    margin-right: 10px;
    cursor: pointer;
  }
`;

export const InputTitle = styled.div`
`;

export const StartButton = styled.div`
  border: 1px solid white;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  background-color: #55AA55;
  :hover {
    background-color: #559955;
  }
`;