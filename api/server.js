const express = require('express')
const cors = require('cors')
const sql = require('mssql');
const bodyParser = require('body-parser')
const app = express()

const port = process.env.PORT || 4200;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const JAMSQLENT01CONFIG = {
  user: 'insights_svc',
  password: 'neB8exF8%h11DH',
  database: 'Insights',
  server: 'JAMSQLENT01',
  options: {
    trustServerCertificate: true
  },
};
// const JAMSQLCONFIG = {
//   user: 'IDWorks',
//   password: '$qlP@ss#!%h11DH',
//   host: 'JAMSQL',
//   // options: {
//   //   // trustServerCertificate: true
//   //   // encrypt: true, // For secure connections
//   // },
// };





app.post('/api/insertuser/:id', (req, res) => {
  const { id } = req.params  
  const regex = /^\d{9}$/;
  if (typeof id === 'undefined' || typeof id !== 'string' || id === '') return res.send({'status': 'error', 'action': 'error', 'data': 'ID is not a string or is undefined'}) 
  if (!regex.test(id)) return res.send({'status': 'error', 'action': 'error', 'data': 'ID isn\'t valid'})
  const conn = new sql.ConnectionPool(JAMSQLENT01CONFIG);
  (async () => {
    try {
      await conn.connect();
      const request = new sql.Request(conn);
      const records = await request.query(`SELECT * FROM OPENQUERY(jamsql,'SELECT FirstName, LastName, EmployeeNumber FROM [IDWORKS].dbo.[UT_HCJ_IDWORKS] WHERE EmployeeNumber = ${id}')`)
      if (records.recordset.length === 0) return console.log('no records found')
      const { EmployeeNumber } = records.recordset[0];
      const checkinRecords = await request.query(`SELECT * FROM new_valet_checkin WHERE employee_id = ${EmployeeNumber} AND is_active = 1`)

      if (checkinRecords.recordset.length > 0) {
        const updateRecords = await request.query(`UPDATE new_valet_checkin SET is_active = 0 OUTPUT Inserted.* WHERE employee_id = ${EmployeeNumber} AND is_active = 1`)
        res.send({'status': 'success', 'action': 'update', 'data': updateRecords.recordset[0]})
      }else {
        const { FirstName, LastName, EmployeeNumber } = records.recordset[0];
        const insertRecords = await request.query(`INSERT INTO new_valet_checkin OUTPUT Inserted.* VALUES ('${FirstName}', '${LastName}', ${EmployeeNumber}, 1, GETDATE())`);
        res.send({'status': 'success', 'action': 'insert', 'data': insertRecords.recordset[0]})
      }  
    } catch (error) {
        console.error(error);
        res.send({'status': 'error', 'action': 'error', 'data': error})
    } finally {
        if (conn.connected) {
          await conn.close();
      }
    }
  })();
});


app.get('/api/getusers', (req, res) => {
  const conn = new sql.ConnectionPool(JAMSQLENT01CONFIG);
  conn.connect().then(function () {
    const request = new sql.Request(conn);
    request.query("select * from new_valet_checkin where is_active = 1")
    .then(function (records) {
        res.send(records.recordset)
        conn.close();
    }).catch(function (err) {
        res.send(err);
        console.dir(err)
        conn.close();
    });
  }).catch(function (err) {
      console.log(err);
  });
});


app.listen(port, () => {console.log(`listening on port ${port}`)})
