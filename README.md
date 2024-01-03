## Available Scripts

In the project directory, you can run:
### `node app`
First the backend need to be started first from the backend file, run `node app` or `npx json-server -H localhost -p 3010 -w ./db.json` to activate backend.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `Project functions`

There are total 3 pages in the project.
In the first view: users could check, modify the name of tasks by clicking the name of tasks, activate the tasks by clicking the Activate button.
Also the tags of tasks could also be modified but one task must have at least one tag.
Then, users could enter task name, description and create new tags by themselves or choose from existing tags to create new tasks.
At the top of the first view, users could filter tasks via clicking the tags to pick tasks with chosen tags, or click Clear Filters tp clear all chosen tags.

In the second view: user could select a time interval, and the default will be midnight to current time, then users could choose the end moment. While it is not possible to choose end moment early than start moment.
After the tasks are activated, users could check the sum of tasks of interest and tags, when users click on the detail, they could find when the particular task has been active during the task details interval. And the bar chart could make it into a bar chart.

Be careful: The time will only be calculated during today. So if the avtivate time in first view are faster than second view, it should be fine.
