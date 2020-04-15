const mysql = require('mysql');

const vscode = require("vscode");

const connectionInstance = null;

function con() {
    return new Promise(function (resolve, reject) {
        //   var connection = mysql.createConnection({
        //      host: atom.config.get('laravel-model-attributes.mysqlDatabaseHost'),
        //      user: atom.config.get('laravel-model-attributes.username'),
        //      password: atom.config.get('laravel-model-attributes.password'),
        //      database:atom.config.get('laravel-model-attributes.databaseName'),
        //   })
        var connection = mysql.createConnection({
            host: vscode.workspace.getConfiguration().get("mysql.connection.hostname"),
            user: vscode.workspace.getConfiguration().get("mysql.connection.user"),
            password: vscode.workspace.getConfiguration().get("mysql.connection.password"),
            database: vscode.workspace.getConfiguration().get("mysql.connection.database"),
        });
        connection.connect(function (err) {
            if (err) {
                reject({ message: err.stack });
            }
            else {
                resolve(connection)
            }
        });
    });
}

module.exports = { dbconn: con, connectionInstance: connectionInstance };