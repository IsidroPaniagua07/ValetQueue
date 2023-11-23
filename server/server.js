const express = require('express')
// const server = express()
const cors = require('cors')
const sql = require('mssql');
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()

const port    =   process.env.PORT || 8080;

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
    // encrypt: true, // For secure connections
  },
};
const JAMSQLCONFIG = {
  user: 'IDWorks',
  password: '$qlP@ss#!%h11DH',
  database: 'IDWORKS',
  host: 'JAMSQL',
  options: {
    trustServerCertificate: true
    // encrypt: true, // For secure connections
  },
};





app.post('/api/insertuser', (req, res) => {
  const { employeeNumber } = req.body
  let firstName, lastName, isActive;

  const jamsql = mysql.createConnection(JAMSQLCONFIG);
  const jamsqlent01 = new sql.ConnectionPool(JAMSQLENT01CONFIG);
  
  jamsql.connect()

  jamsql.query(`SELECT FirstName, LastName FROM UT_HCJ_IDWORKS WHERE EmployeeNumber = ${employeeNumber}`, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
  jamsql.end()


  // jamsqlent01.connect().then(function () {
  //     const request = new sql.Request(jamsqlent01);
  //     const query = `INSERT INTO [dbo].[new_valet_checkin] ([first_name],[last_name],[employee_id],[is_active]) VALUES('${firstName}','${lastName}',${employeeNumber},${isActive})`
  //     console.log(query)
  //     request.query(query)
  //     .then(function (recordSet) { 
  //             console.log(recordSet);
  //             jamsqlent01.close();
  //     }).catch(function (err) {
  //         console.log(err);
  //         jamsqlent01.close();
  //     });
  //   }).catch(function (err) {
  //       console.log(err);
  //   });
    // res.send('lmfao').

  });

app.get('/api/getusers', (req, res) => {
    const conn = new sql.ConnectionPool(JAMSQLENT01CONFIG);
    conn.connect().then(function () {
        const request = new sql.Request(conn);
        request.query("select * from new_valet_checkin where is_active = 1").then(function (records) {
            res.send(records)
            console.dir(records);
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
// 
// app.post('/api/insert', (req, res) => {
//     var conn = new sql.ConnectionPool(config);
//     conn.connect().then(function () {
//         var request = new sql.Request(conn);
//         request.query("select * from new_valet_checkin where is_active = 1").then(function (records) {
//             res.send(records)
//             console.dir(records);
//             conn.close();
//         }).catch(function (err) {
//             res.send(err);
//             console.dir(err)
//             conn.close();
//         });
//     }).catch(function (err) {
//         console.log(err);
//     });
//   });




app.listen(port, () => {console.log(`listening on port ${port}`)})


// const pool = new sql.ConnectionPool(config);
// const poolConnect = pool.connect();


// const router = express.Router(); //get an instance of router
// router.get('/', (req, res) => {
//     res.send('Welcome to our application');  
// });

    // var conn = new sql.ConnectionPool(config);
    // conn.connect().then(function () {
    //     var request = new sql.Request(conn);
    //     request.query("select * from new_valet_checkin").then(function (recordSet) {
    //         console.log(recordSet);
    //         conn.close();
    //     }).catch(function (err) {
    //         console.log(err);
    //         conn.close();
    //     });
    // }).catch(function (err) {
    //     console.log(err);
    // });
    // res.send('lmfao')


// function listProducts() {
//     var conn = new sql.ConnectionPool(config);
//     conn.connect().then(function () {
//         var request = new sql.Request(conn);
//         request.query("select * from poker_winners").then(function (recordSet) {
//             console.log(recordSet);
//             conn.close();
//         }).catch(function (err) {
//             console.log(err);
//             conn.close();
//         });
//     }).catch(function (err) {
//         console.log(err);
//     });
// }

// module.exports = {
//   pool,
//   poolConnect,
// };

// server.get('/api/eventlist', (req, res) => {
//     const query = "SELECT * FROM EventData WHERE IsEnabled = 1";
//     sql.query(process.env.DB_CONNECTION_STRING, query, (err, rows) => {
//         if(err) console.log(err)
//         res.send(rows)
//     });    
// })








// server.post('/api/searchevent', (req, res) => {
//     const { SearchEventName } = req.body
//     sql.open(process.env.DB_CONNECTION_STRING, function (err, conn) {
//         var pm = conn.procedureMgr();
//         if(err) console.log(`connection error: ${err}`)
//         pm.callproc('dbo.usp_SearchEvents', [SearchEventName], function(err, results, output) {
//             if (err) console.log(`proc error: ${err}`)
//             res.send(results)
//     });
// });   
// })
// server.post('/api/editevent', (req, res) => {
//     const { id, name, date, enabled } = req.body
//     sql.open(process.env.DB_CONNECTION_STRING, function (err, conn) {
//         var pm = conn.procedureMgr();
//         if(err) console.log(`connection error: ${err}`)
//         pm.callproc('dbo.usp_EditEvent', [id, name, date, enabled], function(err, results, output) {
//             if (err) console.log(`proc error: ${err}`)
//             res.send(results)
//             // if(output) console.log(output)
//     });
// });   
// })

// server.get('/api/getevent/:id', (req, res) => {
//     const eventId = parseInt(req.params.id)
//     const query = `SELECT * FROM EventData WHERE EventID = ${eventId}`;
//     sql.query(process.env.DB_CONNECTION_STRING, query, (err, rows) => {
//         if(err) console.log(err)
//         res.send(rows[0])
//         console.log(rows)
//     });    

//     console.log('Event page data request')
// })

// server.post('/api/checkin', (req, res) => {
//     const { EventID, EmployeeNumber } = req.body

//     sql.open(process.env.DB_CONNECTION_STRING, function (err, conn) {
//         var pm = conn.procedureMgr();
//         if(err) console.log(`connection error: ${err}`)
//         pm.callproc('dbo.usp_CheckInUser', [EventID, EmployeeNumber], function(err, results, output) {
//         if (err) console.log(`proc error: ${err}`)
//         if (output) {
//             console.log(`output: ${output}`)
//             if(output[0]===0) res.send(['fail'])
//             else res.send(['success'])
//         }
//     });
// });  
// })


// server.post('/api/addevent', (req, res) => {
//     const { EventName, EventDate } = req.body
//     console.log(req.body)
//     const query = `INSERT INTO EventData(EventName, Date) VALUES('${EventName}', '${EventDate}')`;
//     sql.query(process.env.DB_CONNECTION_STRING, query, (err, rows) => {
//         if(err) console.log(err)
//         if(rows) console.log(rows)
//     });    
    
//     res.send(['Complete'])
// })