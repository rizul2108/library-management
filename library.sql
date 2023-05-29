DROP TABLE IF EXISTS 'users';
DROP TABLE IF EXISTS 'books';
DROP TABLE IF EXISTS 'requests';

CREATE TABLE 'users' (
    'user_id' int() NOT NULL AUTO_INCREMENT,
    'full_name' varchar(255) NOT NULL,
    'username' varchar(255) NOT NULL,
    'salt' char(60) NOT NULL,
    'type' char(60) NOT NULL,
    'hash' char(60) NOT NULL,
    PRIMARY KEY('user_id')
);

CREATE TABLE 'books' (
    'book_id' int(11) NOT NULL AUTO_INCREMENT,
    'title' varchar(255) NOT NULL,
    'author' varchar(255) NOT NULL,
    'number' int(10) NOT NULL,
    'user_id' char(255) ,
    FOREIGN KEY ('user_id') REFERENCES 'users'('user_id'),
    PRIMARY KEY('book_id')

);

CREATE TABLE 'requests'(
    'request_id' int(11) NOT NULL AUTO_INCREMENT,
    'user_id' int(11) NOT NULL,
    'book_id' int(11) NOT NULL,
    'type' varchar(3) NOT NULL,
    'request_date' DATE NOT NULL,
    FOREIGN KEY ('book_id') REFERENCES 'books'('book_id'),
    FOREIGN KEY ('user_id') REFERENCES 'users'('user_id'),
    PRIMARY KEY('request_id')
);