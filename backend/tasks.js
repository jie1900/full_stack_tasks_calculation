const express = require('express');
const fs = require('fs/promises');
const router = express.Router();
const moment = require('moment');

const readData = async () => {
    try {
        const data = await fs.readFile('./db.json', 'utf8');
        return JSON.parse(data).tasks;
    } catch (err) {
        console.error('Error reading data from db.json:', err);
    }
};

const writeData = async (tasks) => {
    try {
        await fs.writeFile('./db.json', JSON.stringify({
            tasks
        }), 'utf8');
    } catch (err) {
        console.error('Error writing data to db.json:', err);
    }
};

router.get('/', async (req, res) => {
    const tasks = await readData();
    res.status(400).json(tasks);
});

router.get('/:id', async (req, res) => {
    const {
        id
    } = req.params;
    const tasks = await readData();
    const task = tasks.find((m) => m.id === Number(id));
    if (task) {
        res.status(200).json(task);
    } else {
        res.status(404).json({
            message: "task not found"
        });
    }
});

router.post('/', async (req, res) => {
    const {
        name,
        description,
        tags
    } = req.body;
    const tasks = await readData();

    const newId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;

    if (name && description) {
        const newTask = {
            id: newId,
            name,
            description,
            tags: tags || []
        };
        tasks.push(newTask);
        await writeData(tasks);
        res.status(201).json(newTask);
    } else {
        res.status(400).json({
            message: 'Invalid input'
        });
    }
});

router.patch('/:id', async (req, res) => {
    const {
        id
    } = req.params;
    const {
        name,
        tags
    } = req.body;
    const tasks = await readData();
    const index = tasks.findIndex((m) => m.id === Number(id));
    if (index !== -1) {
        tasks[index] = {
            ...tasks[index],
            name: name || tasks[index].name,
            tags: tags || tasks[index].tags
        };
        await writeData(tasks);
        res.status(200).json(tasks[index]);
    } else {
        res.status(404).json({
            message: 'task not found'
        });
    }
});

router.delete('/:id', async (req, res) => {
    const {
        id
    } = req.params;
    let tasks = await readData();
    const initialLength = tasks.length;
    tasks = tasks.filter((m) => m.id !== Number(id));

    tasks = tasks.map((task, index) => {
        return {
            ...task,
            id: index + 1
        };
    });

    if (tasks.length < initialLength) {
        await writeData(tasks);
        res.status(200).json({
            message: 'task Deleted'
        });
    } else {
        res.status(404).json({
            message: 'task not found'
        });
    }
});

router.put('/:id', async (req, res) => {
    const {
        id
    } = req.params;
    const {
        status
    } = req.body;
    const tasks = await readData();
    if (status == 1) {
        tasks.forEach((item) => {
            if (item.id == id) {
                item.isActive = true;
                if (!item.records) {
                    item.records = [];
                }
                item.records.push({
                    startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                })
            }
        });
    } else {
        tasks.forEach((item) => {
            if (item.id == id) {
                item.isActive = false;
                item.records[item.records.length - 1].endTime = moment().format('YYYY-MM-DD HH:mm:ss');
            }
        });
    }
    await writeData(tasks);
    res.status(200).json({
        message: 'Operation successful'
    });
});

module.exports = router;