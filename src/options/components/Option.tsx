import React from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface OptionProps {
  checked: boolean;
  description?: string;
  disabled?: boolean;
  onClick?: () => void;
  title: string;
}

export default function Option({
  onClick,
  title,
  checked,
  disabled,
  description,
}: OptionProps) {
  return (
    <OptionCheckStyled checked={checked} disabled={disabled}>
      <div className="main">
        <div className="checkbox" onClick={onClick}>
          <CheckMarkIcon icon={faCheck} />
        </div>
        <h3>{title}</h3>
      </div>
      {description ? <p className="check-option-extra">{description}</p> : null}
    </OptionCheckStyled>
  );
}

interface OptionsCheckStyledProps {
  checked: boolean;
  disabled?: boolean;
}

const OptionCheckStyled = styled.div<OptionsCheckStyledProps>`
  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}

  .main {
    display: flex;
    margin: 15px 0;
  }

  h3 {
    margin: 0;
    color: white;
    font-weight: 500;
    font-family: 'Open Sans', sans-serif;
    line-height: 18px;

    ${(props) =>
      props.disabled &&
      css`
        color: rgb(175, 175, 175);
        text-decoration: line-through;
      `}
  }

  .check-option-extra {
    color: rgb(175, 175, 175);

    a,
    a:visited {
      color: rgb(175, 175, 175);
    }
  }

  .checkbox {
    margin: 0px 15px 0px 5px;
    background-color: ${(props) =>
      props.checked
        ? props.disabled
          ? 'rgb(175, 175, 175)'
          : 'rgb(232, 72, 68)'
        : 'white'};
    display: inline-block;
    height: 15px;
    width: 15px;
    padding: 2px;
    border-radius: 4px;
  }
`;

const CheckMarkIcon = styled(FontAwesomeIcon)`
  color: white;
  margin: 1.5px;
  display: block;
`;
