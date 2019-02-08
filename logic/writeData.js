var sqlLite3 = require('sqlite3').verbose();
var database = new sqlLite3.Database('./databases/usersInfo.db');


database.serialize(function(){
    var newColumn = database.prepare("INSERT INTO users VALUES(?,?,?,?)");
    newColumn.run(111, 'testWrite1', 33, 12);
    console.log("wrote data");
    newColumn.finalize();
    database.close();
});
