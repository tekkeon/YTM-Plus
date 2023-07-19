import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChromePicker } from 'react-color';

interface ColorSelectorProps {
  label: string;
  id: string;
  color: string;
  onChange: (newColor: string) => void;
}

export default function ColorSelector({
  onChange,
  label,
  id,
  color,
}: ColorSelectorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);
  const pickerRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    setCurrentColor(color);
  }, [color]);

  useEffect(() => {
    const handleClickEvent = (e: MouseEvent) => {
      if (e.target && !pickerRef.current?.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.body.addEventListener('click', handleClickEvent);
    return () => document.body.removeEventListener('click', handleClickEvent);
  });

  return (
    <ColorSelectorStyled ref={pickerRef}>
      <div className="flex">
        <ColorDot
          color={color}
          onClick={() => setShowColorPicker(!showColorPicker)}
        ></ColorDot>
        <label htmlFor={id}>{label}</label>
      </div>
      {showColorPicker ? (
        <ChromePickerStyled
          onChangeComplete={(result) => onChange(result.hex)}
          onChange={(result) => setCurrentColor(result.hex)}
          color={currentColor}
        />
      ) : null}
    </ColorSelectorStyled>
  );
}

const ColorSelectorStyled = styled.div`
  position: relative;

  .flex {
    display: flex;
    justify-content: flex-start;
    margin-top: 20px;

    label {
      margin-left: 20px;
      font-size: 14px;
      color: white;
    }
  }

  input[type='color'] {
    display: none;
  }
`;

const ColorDot = styled.div`
  width: 40px;
  height: 20px;
  border-radius: 3px;
  background-color: ${(props) => props.color};
  display: inline-block;
  cursor: pointer;
`;

const ChromePickerStyled = styled(ChromePicker)`
  position: absolute;
  top: 25px;
  z-index: 1;
`;
