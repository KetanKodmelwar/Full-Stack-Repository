var bcrypt = require("bcryptjs");
var pool = require("../db/index.js");
var mysql = require("mysql");
async function handle_request(msg, callback) {
  console.log(
    "=====================In the kafka-backend top5jobs====================="
  );
  console.log("Message body:" + JSON.stringify(msg));
  //msg.id = 1;
  //   let queryString =
  //     "select * from job_application_submitted where recruiter_id= " +
  //     mysql.escape(1);
  let queryString =
    "SELECT" +
    " job_name AS x, COUNT(applicant_id) AS y" +
    " FROM" +
    " job_application_submitted" +
    " WHERE " +
    " recruiter_id = " +
    mysql.escape(msg.id) +
    " GROUP BY (job_id)" +
    " ORDER BY y" +
    " LIMIT 5";

  console.log(queryString);

  pool.getConnection((err, con) => {
    if (err) {
      console.log("Error occurred while creating a connection ", err);
      callback("Error occured", null);
    } else {
      con.query(queryString, (err, rows) => {
        if (err) {
          console.log("Error occurred while executing query ", err);
          callback("Error occured", null);
        } else {
          console.log("result:" + JSON.stringify(rows));
          if (rows.length > 0) {
            console.log("Rows: " + JSON.stringify(rows));
            callback(null, rows);
          } else {
            callback("No such user present", null);
          }
          console.log(
            "============================Out of the kafka-backend top5Jobs====================="
          );
        }
      });
    }
    con.release();
  });

  console.log("After wait......");
}

exports.handle_request = handle_request;
