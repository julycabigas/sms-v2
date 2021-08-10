import React from 'react'
import { connect } from 'react-redux'
import { Table } from '../index.style'
import styled from 'styled-components'
import moment from 'moment'

export const HomeView = ({ studentDetails }) => {
  return (
    <div className="row">
      <div className="col-md-6 p-0">
        <div className="p-3">
          {studentDetails && <StudentInfo studentDetails={studentDetails} />}
        </div>
      </div>
      <div className="col-md-6 p-0">
        <div className="border-left p-3">
          {studentDetails && <PaymentInfo studentDetails={studentDetails} />}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  studentDetails: state.studentDetails.studentDetails,
})
export default connect(mapStateToProps)(HomeView)

const PaymentInfo = ({ studentDetails: _ }) => {
  return (
    <Table className="table">
      <tbody>
        <TableRow label="Payment Plan:" value={_.plan && _.plan.resultName} />
        <TableRow label="Payment Date Start:" value={moment.utc(_.payment_date_start).format('MMM DD, YYYY')} />
        <TableRow label="Signed Contract:" value={_.signed_contract} />
        <TableRow label="Sales Rep:" value={_.sales_rep} />
        <TableRow label="Payment Method:" value={_.payment_method} />
        <TableRow label="Payment Status:" value={_.payment_status} />
        <TableRow label="Joined Date:" value={moment.utc(_.joined_date).format('MMM DD, YYYY')} />
      </tbody>
    </Table>
  )
}

const StudentInfo = ({ studentDetails: _ }) => (
  <Table className="table">
    <tbody>
      <TableRow label="First Name:" value={_.first_name} />
      <TableRow label="Last Name:" value={_.last_name} />
      <TableRow label="Email:" value={_.email} />
      <TableRow label="Phone:" value={_.phone} />
      <TableRow label="Country:" value={_.country} />
      <TableRow label="Pipeline:" value={_.pipeline} />
      <TableRow label="Funnel:" value={_.funnel} />
    </tbody>
  </Table>
)

const TableRow = ({ label, value }) => (
  <tr>
    <MediumTd>{label}</MediumTd>
    <td>{value}</td>
  </tr>
)

const MediumTd = styled.td`
  font-size: 0.9em;
`
