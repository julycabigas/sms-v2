import React, { useState, useCallback, useRef } from 'react'
import { Input, Select, DatePicker } from 'components/Forms'
import { paymentStatus, salesRep } from 'helpers/dropdown'
import { SearchWrapper, SearchIncludes, Query, DividerQuery, SearchOverlayWrapper } from './search.style'
import { useHistory } from 'react-router-dom'
import { useQuery } from 'hooks'
import { FaFilter } from 'react-icons/fa';
import { connect } from 'react-redux';
import moment from 'moment';

function SearchBar({ allPlans }) {
  const query = useQuery()
  const history = useHistory()
  const [planForm, setPlanForm] = useState(query.get('plan') || '')
  const [showForm, setShowForm] = useState(false)
  const [paymentStatusUpdatedFrom, setPaymentStatusUpdatedFrom] = useState(null)
  const [paymentStatusUpdatedTo, setPaymentStatusUpdatedTo] = useState(null)
  const [paymentDueFrom, setPaymentDueFrom] = useState(null)
  const [paymentDueTo, setPaymentDueTo] = useState(null)
  const searchRef = useRef();

  const handleDeleteSearch = (keyword) => {
    const querySearch = new URLSearchParams(query.toString());
    querySearch.delete(keyword);
    history.push(`?${querySearch.toString()}`);
  }

  const filterResults = () => {
    const queryString = new URLSearchParams(query.toString());
    const searchResults = [];
    for (let [key, value] of queryString) {
      const textKeyword = key.split('_').join(' ');
      searchResults.push({textKeyword, keyword: key, value });
    }
    return searchResults;
  }

  const queryName = (keyword, value) => {
    if (keyword === 'plan') {
      const plan = allPlans && allPlans.find(item => item._id === value);
      return plan?.resultName;
    }
    if (new Date(value) != 'Invalid Date') {
      return moment(value).format('MMM DD, YYYY');
    }
    return value;
  }


  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    setTimeout(() => setShowForm(!showForm), 300);
    if (paymentDueTo && paymentDueFrom) {
      query.set('dues', `${paymentDueFrom}~${paymentDueTo}`);
      history.push(`/all-payment-dues?${query.toString()}`);
      document.body.style.overflow = 'unset';
      return; 
    }
    const formData = new FormData(e.target)
    if (paymentStatusUpdatedTo && paymentStatusUpdatedFrom) {
      formData.append(
        'payment_status_updated', 
        `${paymentStatusUpdatedFrom}~${paymentStatusUpdatedTo}`
      )
    }
    for (const [key, value] of formData.entries()) {
      if (value !== '') {
        query.set(key, value)
      } else {
        query.delete(key)
      }
    }
    const queries = query.toString()
    history.push(`?${queries}`)
  }, [query, history, paymentDueFrom, paymentDueTo, paymentStatusUpdatedFrom, paymentStatusUpdatedTo, showForm])

  const handleShowForm = React.useCallback((e) => {
    setShowForm(!showForm);
  }, [showForm]);


  React.useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showForm]);

  return (
    <SearchWrapper onSubmit={handleSubmit}>
      <div className="d-flex align-items-center">
        <button type="button" onClick={handleShowForm} className="btn btn-light" style={{ fontWeight: '600' }}>
          <FaFilter /> <span className="ml-2">Filter</span>
        </button>
        <div className="d-flex align-items-center">
          {filterResults().length > 0 && <DividerQuery />}
          {filterResults() && filterResults().map((item, index) => (
            <Query className="d-flex align-items-center" key={index} title={item.textKeyword}>
              <span className="text">{queryName(item.keyword, item.value)}</span>
              <button type="button" 
                className="d-flex align-items-center justify-content-center"
                onClick={() => handleDeleteSearch(item.keyword)}
              >
                &times;
              </button>
            </Query>
          ))}
        </div>
      </div>
      {showForm && (
        <SearchOverlayWrapper>
          <SearchIncludes tabIndex="0" ref={searchRef}>
            <h5 className="mb-3" style={{ color: 'var(--text-color)' }}>Filter</h5>
            <div className="row">
              <div className="col-md-6 py-1">
                <div className="form-group">
                  <Input label="Name" placeholder="Name" name="name" 
                    defaultValue={query.get('name')}
                  />
                </div>
              </div>
              <div className="col-md-6 py-1">
                <div className="form-group">
                  <Input label="Email" placeholder="Email" name="email" 
                    defaultValue={query.get('email')}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <Select 
                label="Payment Plan"
                value={planForm}
                name="plan"
                onChange={e => setPlanForm(e.target.value)}
                options={[{value: '', text: ''}, ...allPlans].map(item => ({ value: item._id, text: item.resultName }))} 
              />
            </div>
            <div className="row">
              <div className="col-md-6 py-1">
                <div className="form-group">
                  <Select 
                    label="Sales Rep"
                    name="sales_rep"
                    defaultValue={query.get('sales_rep')}
                    options={['', ...salesRep].map(value => ({ value }))} 
                  />
                </div>
              </div>
              <div className="col-md-6 py-1">
                <div className="form-group">
                  <Select 
                    defaultValue={query.get('signed_contract')}
                    label="Signed Contract"
                    name="signed_contract"
                    options={['', 'Yes', 'No'].map(value => ({ value }))} 
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <Select 
                label="Status"
                name="payment_status"
                defaultValue={query.get('payment_status')}
                options={['', ...paymentStatus].map(value => ({ value }))} 
              />
            </div>
            <div className="form-group">
              <label>Payment Status Updated At</label>
              <div className="row">
                <div className="col-md-6">
                  <DatePicker
                    placeholder="From"
                    className="regular"
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => setPaymentStatusUpdatedFrom(dateString)}
                  />
                </div>
                <div className="col-md-6">
                  <DatePicker
                    placeholder="To"
                    className="regular"
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => setPaymentStatusUpdatedTo(dateString)}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Payment Due</label>
              <div className="row">
                <div className="col-md-6">
                  <DatePicker
                    placeholder="From"
                    className="regular"
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => setPaymentDueFrom(dateString)}
                  />
                </div>
                <div className="col-md-6">
                  <DatePicker
                    placeholder="To"
                    className="regular"
                    format="YYYY-MM-DD"
                    onChange={(date, dateString) => setPaymentDueTo(dateString)}
                  />
                </div>
              </div>
            </div>
            <div className="text-right">
              <button type="button" className="btn btn-light mr-2" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </SearchIncludes>
        </SearchOverlayWrapper>
      )}
    </SearchWrapper>
  )
}

const mapStateToProps = (state) => ({
  allPlans: state.plan.all,
})

export default connect(mapStateToProps)(SearchBar)