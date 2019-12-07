CREATE TABLE IF NOT EXISTS Reservations
( 
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    start_date TEXT NOT NULL , 
    end_date TEXT NOT NULL , 
    resource_id INT NOT NULL , 
    owner_email TEXT NOT NULL,
    comments TEXT
);