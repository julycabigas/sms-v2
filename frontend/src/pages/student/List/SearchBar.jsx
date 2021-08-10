import React, { useState, useEffect, useCallback } from 'react'
import { Input, Select } from 'components/Forms'
import { paymentStatus, salesRep } from 'helpers/dropdown'
import { SearchWrapper, SearchIncludes } from './search.style'
import { useHistory } from 'react-router-dom'
import { useQuery, useHttp } from 'hooks'

function SearchBar() {
  const [plans, setPlans] = useState([])
  const query = useQuery()
  const history = useHistory()
  const [planForm, setPlanForm] = useState(query.get('plan') || '')
  const http = useHttp()

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    for (const [key, value] of formData.entries()) {
      if (value !== '') {
        query.set(key, value)
      } else {
        query.delete(key)
      }
    }
    const queries = query.toString()
    history.push(`?${queries}`)
  }, [query, history])

  useEffect(() => {
    let unmount = true
    if (unmount) {
      (async () => {
        const { data } = await http.get('/api/plan/all')
        if (unmount) {
          setPlans(data)
        }
      })()
    }
    return () => unmount = false
  }, [])

  return (
    <SearchWrapper onSubmit={handleSubmit}>
      <div className="filter-input" tabIndex="0">
        Filter
      </div>
      <SearchIncludes tabIndex="0">
        <h5 className="mb-3">Filter</h5>
        <div className="row">
          <div className="col-md-6 py-1">
            <Input label="Name" placeholder="Name" name="name" 
              defaultValue={query.get('name')}
            />
          </div>
          <div className="col-md-6 py-1">
            <Input label="Email" placeholder="Email" name="email" 
              defaultValue={query.get('email')}
            />
          </div>
        </div>
        <Select 
          label="Payment Plan"
          value={planForm}
          name="plan"
          onChange={e => setPlanForm(e.target.value)}
          options={[{value: '', text: ''}, ...plans].map(item => ({ value: item._id, text: item.resultName }))} 
        />
        <div className="row">
          <div className="col-md-6 py-1">
            <Select 
              label="Sales Rep"
              name="sales_rep"
              defaultValue={query.get('sales_rep')}
              options={['', ...salesRep].map(value => ({ value }))} 
            />
          </div>
          <div className="col-md-6 py-1">
            <Select 
              defaultValue={query.get('signed_contract')}
              label="Signed Contract"
              name="signed_contract"
              options={['', 'Yes', 'No'].map(value => ({ value }))} 
            />
          </div>
        </div>
        <Select 
          label="Status"
          name="payment_status"
          defaultValue={query.get('payment_status')}
          options={['', ...paymentStatus].map(value => ({ value }))} 
        />
        <div className="text-right">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </SearchIncludes>
    </SearchWrapper>
  )
}

export default SearchBar