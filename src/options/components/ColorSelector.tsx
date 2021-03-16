import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChromePicker } from 'react-color'

interface ColorSelectorProps {
  label: string;
  id: string;
  color: string;
  onChange: (newColor: string) => void
}

export default function ColorSelector({ onChange, label, id, color }: ColorSelectorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);

  useEffect(() => {
    setCurrentColor(color)
  }, [color])

  return (
    <ColorSelectorStyled>
      <div className="flex">
        <label htmlFor={id}>{label}: </label>
        <ColorDot color={color} onClick={() => setShowColorPicker(!showColorPicker)}></ColorDot>
      </div>
      {
        showColorPicker ?
          <ChromePickerStyled
            onChangeComplete={(result) => onChange(result.hex)}
            onChange={(result) => setCurrentColor(result.hex)}
            color={currentColor}
          /> :
          null
      }
    </ColorSelectorStyled>
  )
}

const ColorSelectorStyled = styled.div`
  position: relative;

  .flex {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  input[type="color"] {
    display: none;
  }
`

const ColorDot = styled.div`
  width: 40px;
  height: 20px;
  border-radius: 3px;
  background-color: ${props => props.color};
  display: inline-block;
  margin-left: 20px;
  cursor: pointer;
`

const ChromePickerStyled = styled(ChromePicker)`
  position: absolute;
  top: 25px;
  right: 0px;
  z-index: 1;
`