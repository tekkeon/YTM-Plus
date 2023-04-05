import React from "react";
import styled from "styled-components";

export default function LoadingPanel() {
  return (
    <StyledLoadingPanel>
      <div className="loader"></div>
    </StyledLoadingPanel>
  );
}

const StyledLoadingPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;

  .loader {
    border: 5px solid #5a5a5a;
    border-radius: 50%;
    border-top: 5px solid #8e8e8e;
    display: block;
    width: 30px;
    height: 30px;
    margin: 30px auto;
    -webkit-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
