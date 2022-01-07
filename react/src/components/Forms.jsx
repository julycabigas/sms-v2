import React from 'react';
import styled from 'styled-components';
import { DatePicker as AntDatePicker } from "antd"

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 3px;
  width: ${props => props.labelWidth};
  margin: ${props => props.labelMargin};
`;

const DatePickerWrapper = styled.div`
  .ant-picker.regular {
    height: calc(1.75em + .76rem + 2px) !important;
    border-radius: .25rem !important;
    width: 100%;
  }
`;

export const Input = React.forwardRef(({label, labelWidth, labelMargin, horizontal, id, className, onChange, value, ...rest}, ref) => (
  <div className={horizontal ? 'd-flex align-items-center' : ''}>
    {label && (
      <Label 
        htmlFor={id} 
        labelWidth={labelWidth}
        labelMargin={labelMargin}
      >
        {label}
      </Label>
    )}
    <input 
      className={`form-control ${className || ''}`} 
      onChange={onChange} 
      value={value} 
      ref={ref} 
      {...rest}
    />
  </div>
))

export const DatePicker = React.forwardRef(({label,id, className, onChange, value, ...rest}, ref) => (
  <>
    {label && <Label htmlFor={id}>{label}</Label>}
    <DatePickerWrapper>
      <AntDatePicker 
        id={id} 
        className={className || ''} 
        ref={ref} 
        onChange={onChange}
        value={value}
        {...rest} 
      />
    </DatePickerWrapper>
    
  </>
))

export const Select = React.forwardRef(({ value, onChange, id, label, options, className, ...rest }, ref) => (
  <>
    {label && <Label htmlFor={id}>{label}</Label>}
    <select 
      value={value}
      onChange={onChange}
      className={`form-control ${className || ''}`} 
      ref={ref}
      {...rest}
    >
      {options && options.map((item, key) => (
        <option value={item.value} key={key}>{item.text || item.value}</option>
      ))}
    </select>
  </>
));