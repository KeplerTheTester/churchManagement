
var sqlLite3 = require('sqlite3').verbose();
var database = new sqlLite3.Database('./databases/usersInfo.db');

database.serialize(function(){
    database.run("CREATE TABLE users(id INTEGER, name TEXT, home INTEGER)");
    var stmt = database.prepare("INSERT INTO users VALUES(?,?,?)");
    stmt.run(1, 'name', 12);
    stmt.finalize();
    var stmt1 = database.prepare("INSERT INTO users VALUES(?,?,?)");
    stmt1.run(13, 'name', 13);
    stmt1.finalize();
    database.run("ALTER TABLE users ADD COLUMN test TEXT");
    var newColumn = database.prepare("INSERT INTO users VALUES(?,?,?,?)");
    newColumn.run(21, 'name12', 33);
    newColumn.finalize();
    database.each("SELECT id, name, home FROM users ", function(err, row)
    {
        console.log(row.id+" : "+row.name, "  ", row.home);
    });
    //database.close();
});