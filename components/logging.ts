import winston from 'winston';

//create winston File and console logger transport
export function logger() {
    winston.add(new winston.transports.File({ filename: "error.log", level: 'error' }));
    winston.add(new winston.transports.File({ filename: "logfile.log" }));
    winston.add(new winston.transports.Console());
}