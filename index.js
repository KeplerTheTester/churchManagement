
/*
This library project will include Electron, React, sqlLite3, 
and React material-UI, express, and chart.js
*/
/* eslint-env node, mocha */

const electron = require('electron');
const url = require('url');
const path = require('path');
var sqlLite3 = require('sqlite3').verbose();
var database = new sqlLite3.Database(':memory:');


var fs = require('fs');
//This will be to create a CSV(Excel document of data)

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow; 
let individualMemberWindow;

let usersInfo = [];

app.on('ready', function(){
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: 'La vie transformee'
    });
    //load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/pages/viewMembers.html'),
        protocol: 'file',
        slashes: true
    }));

    //Build menu from Template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});

app.on('closed', function(){
    app.quit();
});

function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 400,
        height: 720,
        title: 'Add member'
    });
    //load html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/pages/addMembers.html'),
        protocol: 'file',
        slashes: true
    }));

    addWindow.on('closed', function(){
        addWindow = null;
    });
};

function createViewIndividualMemberWindow(){
    individualMemberWindow = new BrowserWindow({
        width: 400,
        height: 720,
        title: 'Member'
    });
    //load html
    individualMemberWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/pages/viewIndividualMember.html'),
        protocol: 'file',
        slashes: true
    }));

    individualMemberWindow.on('closed', function(){
        addWindow = null;
    });
};

//Function is invoked once the button is pressed to add memebers
//correctly 
ipcMain.on('item:add', function(e, item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
    //This is where I will add the users information into the database
});

ipcMain.on('item:viewUser', function(e, item){
    console.log(item);
    createViewIndividualMemberWindow();
    individualMemberWindow.webContents.send('item:userData', item);
    
});

const mainMenuTemplate = [
    {
        label: 'Options',
        submenu:[
            {
                label: 'make window not resizable',
                click()
                {
                   mainWindow.setResizable(false);
                }
            },
            {
                label: 'Add member',
                click()
                {
                    createAddWindow();
                }
            },
            {
                label: 'dev tools',
                click(item, focusedWindow)
                {
                    focusedWindow.toggleDevTools();                       
                }
            }
        ]
    },
    {
        label: 'Quit',
        submenu:[
            {
               label: 'Quit now',
               click()
               {
                   app.quit();
               }     
            }, 
            {
                label: 'clear eveything',
                click()
                {
                    mainWindow.webContents.send('item:clear');
                    //I can call it whatever I want
                }
            }
        ]
    },
    {
        label: 'File',
        submenu:[
            {
                label: 'populate with SQL data',
                click()
                {
                    populateWithDatabase();
                }
            }
        ]
    }
];


function populateWithDatabase()
{
    var holder = [{name: "testDataInput"}];
    database.serialize(function(){
        database.run("CREATE TABLE users(id INTEGER, name TEXT, home INTEGER)");
        var stmt = database.prepare("INSERT INTO users VALUES(?,?,?)");
        stmt.run(1, 'John', 12);
        stmt.finalize();
        var stmt1 = database.prepare("INSERT INTO users VALUES(?,?,?)");
        stmt1.run(2, 'Jade', 13);
        stmt1.finalize();
        database.run("ALTER TABLE users ADD COLUMN test TEXT");
        var newColumn = database.prepare("INSERT INTO users VALUES(?,?,?,?)");
        newColumn.run(3, 'Mary', 33);
        newColumn.finalize();
        database.each("SELECT id, name, home FROM users ", function(err, row)
        {
            //console.log(row.id+" : "+row.name, "  ", row.home);
            var item = {id:row.id, name: row.name};
            //I could try to populate html directly from here
            //Test for that 
            mainWindow.webContents.send('item:datatrial', item);    
            //This was succesful in displaying all the data into the page

        });
        database.close();
        
    });
   
}