const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');


const middlewares = require('./middlewares');
const tasksRoute = require('./tasks'); // Import the tasks router

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());



// Directly serve tasks on root
app.use('/tasks', tasksRoute);

// Middlewares for handling errors
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
