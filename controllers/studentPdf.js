const htmlPdf = require('html-pdf-chrome');
const moment = require('moment');

async function _htmlPdf({ student, paymentLists, deposits }) {
  let html = `

    <h1 style="color:#8bc63e; font-weight: bold;font-family: arial;margin-bottom: 40px; font-size: 40px;">
      Ecom Warrior Academy
    </h1>

    <h3>Student Info</h3>
    <table style="width: 100%;margin-bottom: 50px;">
      <tr>
        <td class="td-label-student">First Name: </td>
        <td class="td-value-student">${student.first_name || ''}</td>
        <td class="td-label-student">Funnel: </td>
        <td class="td-value-student">${student.funnel || ''}</td>
      </tr>

      <tr>
        <td class="td-label-student">Last Name: </td>
        <td class="td-value-student">${student.last_name || ''}</td>
        <td class="td-label-student">Payment Plan: </td>
        <td class="td-value-student">${student.plan && student.plan.resultName}</td>
      </tr>

      <tr>
        <td class="td-label-student">Email: </td>
        <td class="td-value-student">${student.email  || ''}</td>
        <td class="td-label-student">Payment Date Start: </td>
        <td class="td-value-student">${student.payment_date_start ? moment.utc(student.payment_date_start).format('MMM DD, YYYY') : ''}</td>
      </tr>
      <tr>
        <td class="td-label-student">Phone: </td>
        <td class="td-value-student">${student.phone  || ''}</td>
        <td class="td-label-student">Signed Contract: </td>
        <td class="td-value-student">${student.signed_contract  || ''}</td>
      </tr>
      <tr>
        <td class="td-label-student">Country: </td>
        <td class="td-value-student">${student.country  || ''}</td>
        <td class="td-label-student">Sales Rep: </td>
        <td class="td-value-student">${student.sales_rep  || ''}</td>
      </tr>
      <tr>
        <td class="td-label-student">Pipeline: </td>
        <td class="td-value-student">${student.pipeline  || ''}</td>
        <td class="td-label-student">Payment Method: </td>
        <td class="td-value-student">${student.payment_method  || ''}</td>
      </tr>
      <tr>
        <td class="td-label-student">Payment Status: </td>
        <td class="td-value-student">${student.payment_status  || ''}</td>
        <td class="td-label-student">Joined Date: </td>
        <td class="td-value-student">${student.joined_date ? moment.utc(student.joined_date).format('MMM DD, YYYY') : ''}</td>
      </tr>
    </table>

    <h3>Deposits</h3>
    <table class="table" border="1">
      <tr>
        <td class="td-value-student">Amount</td>
        <td class="td-value-student">Date</td>
      </tr>
      ${deposits && deposits.map(item => (`
        <tr>
          <td class="td-label-student">${item.amount.$numberDecimal || item.amount} ${item.currency}</td>
          <td class="td-label-student">${item.date ? moment.utc(item.date).format('MMM DD, YYYY') : ''}</td>
        </tr>
      `)).join(' ')}
    </table>

    <h3>Payment Lists</h3>
    <table class="table" border="1">
      <tr>
        <td class="td-value-student">Amount</td>
        <td class="td-value-student">Due Date</td>
        <td class="td-value-student">Date Paid</td>
        <td class="td-value-student">Status</td>
      </tr>
      ${paymentLists && paymentLists.map(item => (`
        <tr>
          <td class="td-label-student">
            ${item.amount && (item.amount.$numberDecimal || item.amount)} ${item.currency}
          </td>
          <td class="td-label-student">
            ${item.due_date ? moment.utc(item.due_date).format('MMM DD, YYYY') : ''}
          </td>
          <td class="td-label-student">
            ${item.date_paid ? moment.utc(item.date_paid).format('MMM DD, YYYY') : ''}
          </td>
          <td class="td-label-student">
            ${item.status || ''}
          </td>
        </tr>
      `)).join(' ')}
    </table>

    <style>
      .td-label-student {
        padding: 8px;
        color: #5f6368;
      }
      .td-value-student {
        padding: 8px;
      }
      .table {
        width:100%;
        border-collapse: collapse; 
        border: 1px solid #dee2e6;
        margin-bottom: 30px;
      }
    </style>
  `;
  const options = {};
  const pdf = await htmlPdf.create(html, options);
  return pdf;
}

function _createPdf(base64) {
  const pdfViewer = `
    <title>Student</title>
    <iframe src="data:application/pdf;base64, ${base64}"></iframe>
    <style>
      iframe {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
      }
      body {
        margin: 0;
      }
    </style>
  `;
  return pdfViewer;
}

module.exports = {
  _htmlPdf,
  _createPdf
}