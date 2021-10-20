import React from 'react'
import { connect } from 'react-redux'
import { BsArrowRight } from "react-icons/bs"
import { PaidBox } from './style';
import { useHttp } from 'hooks';
import { Link } from 'react-router-dom';

export const TotalPaid = ({ studentId }) => {
  const http = useHttp();
  const [deposit, setDeposit] = React.useState(null);
  const [paymentList, setPaymentList] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const { data } = await http.post('/api/student/total-paid', { studentId });
      if (data) {
        let _deposit = {
          total: 0,
          currency: '',
        }
        let _list = {
          total: 0,
          currency: ''
        }
        data.deposits && (
          data.deposits
            .forEach(item => {
              _deposit.total += Number(item.amount.$numberDecimal);
              _deposit.currency = item.currency;
            })
        )
        data.paymentLists && (
          data.paymentLists
            .forEach(item => {
              _list.total += Number(item.amount.$numberDecimal);
              _list.currency = item.currency;
            })
        )
        setDeposit(_deposit);
        setPaymentList(_list);
      }
    })()
  }, [])


  return (
    <>
      <div className="mt-4">
        {(!deposit && !paymentList) && <p>Loading...</p>}
        {deposit && (
          <PaidBox className="mb-4">
            <div className="upper--paid-box">
              <span className="total">{deposit.total}</span>
              <span className="currency">{deposit.currency}</span>
            </div>
            <div className="lower--paid-box">
              <span className="total-name">Deposit</span>
              <Link to="/deposits" className="btn btn-light d-flex align-items-center justify-content-between">
                <span className="mr-2">View</span>
                <BsArrowRight />
              </Link>
            </div>
          </PaidBox>
        )}
        {paymentList && (
          <PaidBox className="mb-4">
            <div className="upper--paid-box">
              <span className="total">{paymentList.total}</span>
              <span className="currency">{paymentList.currency}</span>
            </div>
            <div className="lower--paid-box">
              <span className="total-name">Payment List</span>
              <Link to="/payment-lists" className="btn btn-light d-flex align-items-center justify-content-between">
                <span className="mr-2">View</span>
                <BsArrowRight />
              </Link>
            </div>
          </PaidBox>
        )}
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalPaid)
