// npm install -g nodemon
// nodemon server.js

const { urlencoded } = require("express");
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

MongoClient.connect(
  "mongodb+srv://admin:qwer1234@cluster0.re13wxo.mongodb.net/?retryWrites=true&w=majority",
  function (err, client) {
    if (err) return console.log(err);

    db = client.db("nodeapp");
    app.listen(8888, function () {
      console.log("웹서버 실행중입니다.");
    });
  }
);

app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/ok", function (req, res) {
  db.collection("counter").findOne(
    { name: "bCounter" },
    function (err, result) {
      var totalPost = result.totalRecord;

      db.collection("board").insertOne(
        {
          _id: totalPost + 1,
          title: req.body.title,
          name: req.body.name,
          content: req.body.memo,
          wdate: req.body.wdate,
        },
        function (err, result) {
          db.collection("counter").updateOne(
            { name: "bCounter" },
            { $inc: { totalRecord: 1 } },
            function (err, result) {
              {
                if (err) {
                  return console.log(err);
                }
              }
              res.redirect("/list");
            }
          );
          //$set : 변경 / $inc : 더하기

          //console.log(req.body);
          //res.send("전송완료"); //반드시 존재해야함
        }
      );
    }
  );
});

app.get("/list", function (req, res) {
  db.collection("board") //sort 정렬 -1 : 내림차순/ 1 : 올림차순
    .find()
    .sort({ _id: -1 })
    .toArray(function (err, result) {
      console.log(result);
      res.render("list.ejs", { rows: result });
    });
});

app.get("/detail/:id", function (req, res) {
  db.collection("board").findOne(
    {
      _id: parseInt(req.params.id),
    },
    function (err, result) {
      console.log(result);
      res.render("detail.ejs", { rows: result });
    }
  );
});
