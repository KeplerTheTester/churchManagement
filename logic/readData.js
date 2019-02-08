var sqlLite3 = require('sqlite3').verbose();
var database = new sqlLite3.Database('./databases/usersInfo.db');


database.serialize(function(){
    database.each("SELECT id, name,home,test FROM users ", function(err, row)
    {
        console.log(row.id+" : "+row.name, "  ", row.home, "  ", row.test);
    });
    database.close();
});
