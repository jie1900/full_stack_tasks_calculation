export default function Info() {
    return <h1>
        <p>Author Name:
            Jie Li
        </p>
        <p>
        Introduction:
        </p>
        <h4>
            First using 'node app' or 'npx json-server -H localhost -p 3010 -w ./db.json' implement backend
            Then using 'npm start' implement frontend.
            What will change for M part: The samll icons in the dropdown menu and icons before head like To Do List etc, also the introduction except command to start frontend and backend.
            Also in the first view, the filter wilkl change to vertical when it is smaller than 500px.
        </h4>
        <div class="mobile-only">
        <h5>In the first view: users could check, modify the name of tasks by clicking the name of tasks, activate the tasks by clicking the Activate button.
            <p>
            Also the tags of tasks could also be modified but one task must have at least one tag.
            </p>
            Then, users could enter task name, description and create new tags by themselves or choose from existing tags to create new tasks.
            <p>
            At the top of the first view, users could filter tasks via clicking the tags to pick tasks with chosen tags, or click Clear Filters tp clear all chosen tags.
            </p>
        </h5>
        <h5>
            In the second view: user could select a time interval, and the default will be midnight to current time, then users could choose the end moment. While it is not possible
            to choose end moment early than start moment.
            <p>
            After the tasks are activated, users could check the sum of tasks of interest and tags, when users click on the detail, they could find when the particular task has been active during the task details interval.
            And the bar chart could make it into a bar chart.
            </p>
        </h5>
        <h4>
                Be careful:
                The time will only be calculated during today. So if the avtivate time in first view are faster than second view, it should be fine.
        </h4>
        </div>

        </h1>
}