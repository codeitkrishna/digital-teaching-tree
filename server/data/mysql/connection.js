import {createConnection} from 'mysql2';

export const Conn = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Krishna#9175',
    database: 'teachingDB',
});

function CreateNewConnection() {
    // Create a MySQL connection pool

    let err = Conn.connect(function(err) {
        if (err) {
            return console.error('error: ' + err.message);
        }
    });
    if (err != null) {
        console.log(err);
        return null;
    }
}