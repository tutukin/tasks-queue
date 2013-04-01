# tasks-queue

Put tasks in a queue and process them one by one, but not too often.

##Getting Started

Install the module with:

    npm install tasks-queue

    var TasksQueue = require('tasks-queue'),
        q = new TasksQueue();
    
    // The queue should not execute more than one task in 500 ms.
    q.setMinTime(500);
    q.setVar('value',0);
    
    q.pushTask('sample task',{n:5});
    q.pushTask('sample task',{n:32});
    q.pushTask('sample task',{n:98});
    q.pushTask('sample task',{n:33});
    
    q.on('sample task', process);
    q.on('stop', logResults);
    
    q.execute();
    
    function process(jinn,data) {
        var q = jinn.getQueue();
        q.setVar('value', data.n + q.getVar('value');
        jinn.done(); // important!
    }
    
    function logResults(jinn) {
        console.log(jinn.getQueue().getVar('value');
    }

##API

###TasksQueue

Is a queue class. Inherits from [EventEmitter](http://nodejs.org/api/events.html).

####pushTask(taskType,taskData)

Append a task to the tail of the queue

`taskType` is a string, that is used to distinguish the different
classes of tasks. `taskData` is any data that given task needs.

####unshiftTask(taskType,taskData)

Prepend the task to the head of the queue.
Arguments are the same as in `pushTask`. 

####taskType events

`taskType` argument to `pushTask` and `unshiftTask` is used to
distinguish between the different calsses of tasks. The queue
emits an event named afer the `taskType` of the current task at
the head.

For example, the user has two types of tasks: 'simple', and 'not so simple'.
Then the code may look like this:

    queue.pushTask('simple','some data');
    // ...
    queue.pushTask('not so simple',{/*...*/});
    // ...
    queue.on('simple',function(jinn,data) {/*...*/; jinn.done(); });
    queue.on('not so simple', function(jinn,data) {/*...*/; jinn.done(); });

####'stop' event

When there is no more tasks in the queue it emits 'stop' event, passing an
instance of `Jinn` to the listeners.

    queue.on('stop',function(jinn) { /* ... */ });

####length()

Return the number of tasks the queue keeps.

####setVar(name,object)

Set the value of the variable named `name` to the `object`

####getVar(name)

Return the value of the variable named `name`

####setMinTime(t)

Set the minimal time interval between the tasks' executions to t milliseconds.

####getMinTime()

Return the minimal time interval between the tasks' executions.

####execute()

Start execution of the tasks in the queue. If the queue is empty the TasksQueue instance emits
'stop' event immediately, otherwise it takes the task from the head of the queue and emits
the `taskType` event, passing an instance of `Jinn` as the first argument and the `taskData`
as the second one to the listeners. `taskType` and `taskData` are those passed to `pushTask`
or `unshiftTask` methods. `Jinn` class is discussed below.

To notify the queue that the execution of task is done use `Jinn`'s `done()` method. The queue
checks that at least `t` milliseconds is passed and then executes the next task. `t` is set
with `setMinTime(t)` method.

####getTask(n)

Usually you don't need this method.

Return an instance of Task corresponding to `n`-th task in the queue.
`n` is between 0 and `queue.length()-1`.

####taskDone()

Usually you don't need this method.

This method is called when a user calls `Jinn.done()`
from the `taskType` event listener.

####isTaskRunning()

Usually you don't need this method.

Returns true if the task is executed and `Jinn.done()` was not called yet

####shouldWaitMinTime()

Usually you don't need this method.

Returns true if the time passed since the beginning of the current task
is less then `queue.getMinTime()` milliseconds.

###Jinn

This class provides useful methods to the event listeners, bound to the
TasksQueue events. An instance of `Jinn` is passed as the first argument
to the listeners. Inherits from the EventEmitter.

####getQueue()

Return an instance of queue which emitted an event.

####getType()

Return event name: 'stop' or `taskType`

####getData()

Return `taskData` for `taskType` event

####done()

Emit 'done' event. In the case of `taskType` event
TasksQueue binds to this event a listener that
calls `TasksQueue.taskDone()`.

###Task

This is an internal class that represents a task. The instance
of Task is returned by `TasksQueue.getTask(n)` method.

####setData(data)

Set the data for a task.

####getData()

Return the data for a task.

####setType(taskType)

Set type of a task.

####getType()

Return a taskType of a task.

##Examples

* See examples directory,
* see [request-queue](https://github.com/tutukin/request-queue) project

##Contributing

In lieu of a formal styleguide, take care to maintain the existing
coding style. Add unit tests for any new or changed functionality.
Lint and test your code using Grunt.

##Release History

* April 1, 2013. V. 0.0.1.
Basic functionality

License

Copyright (c) 2013 Andrei V. Toutoukine
Licensed under the MIT license.

