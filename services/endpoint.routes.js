const usersRouter = require('./users/routes')
const departRouter = require('./departments/routes')
const taskRouter = require('./tasks/routes')

const endPoint = (app)=>{ // all routes
    app.use('/users',usersRouter);
    app.use('/depart',departRouter);
    app.use('/task',taskRouter);


}

module.exports= endPoint;