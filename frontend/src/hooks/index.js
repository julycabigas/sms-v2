import { useState } from 'react';
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios  from 'axios'

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  function onChange(e) {
    setValue(e.target.value);
  }
  return {
    value,
    onChange,
  } 
}

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Never use this to dependencies array to avoid memory leak!!
export function useHttp() {
  const { access_token } = useSelector(state => state.auth);
  const http = axios.create({});
  http.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  return http;
}