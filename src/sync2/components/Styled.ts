import styled from 'styled-components';

interface IButton {
  width?: number;
  height?: number;
  centered?: boolean;
}

export const Button = styled.button<IButton>`
  background: red;
  border-radius: 5px;
  border: none;
  box-shadow: 0 0 10px 0px #b14444;
  color: white;
  cursor: pointer;
  display: block;
  font-size: 20px;
  height: ${props => props.height ?? '50'}px;
  margin: 10px ${props => props.centered ? 'auto' : ''};
  width: ${props => props.width ?? '170'}px;

  &:hover {
    box-shadow: 0 0 10px 3px #8a8a8a;
  }
`

export const Loader = styled.div`
  border-width: 8px;
  border-style: solid;
  border-color: red grey grey;
  border-image: initial;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  margin: 20px auto;
  animation: 1s linear 0s infinite normal none running spin;

  /* Safari */
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`