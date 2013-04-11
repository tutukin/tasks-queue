# tasks-queue

Put tasks in a queue and process them one by one, but not too often.

## Getting Started

### Installation

    npm install tasks-queue

### Synopsis

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
        q.setVar('value', data.n + q.getVar('value'));
        jinn.done(); // important!
    }
    
    function logResults(jinn) {
        console.log( jinn.getQueue().getVar('value') );
    }

## API

TasksQueue class inherits from [EventEmitter](http://nodejs.org/api/events.html).

### new TasksQueue([options])

Create a new queue object. `options` object may be passed to the constructor.

#### options.autostop

Default: `true`. Emit a 'stop' event when the queue is empty. If explicitly
set to `false` the queue does not emit 'stop' event. It waits for `minTime`
and checks if there are some tasks to do. 

See also `autostop()` and `noautostop()`

### pushTask(taskType,taskData)

Append a task to the tail of the queue

`taskType` is a string, that is used to distinguish the different
classes of tasks. `taskData` is any data that given task needs.

### unshiftTask(taskType,taskData)

Prepend the task to the head of the queue.
Arguments are the same as in `pushTask`. 

### taskType events

`taskType` argument to `pushTask` and `unshiftTask` is used to
distinguish between the different calsses of tasks. The queue
emits an event named after the `taskType` of the current task at
the head of the queue.

For example, the user has two types of tasks: 'simple', and 'not so simple'.
Then the code may look like this:

    queue.pushTask('simple','some data');
    // ...
    queue.pushTask('not so simple',{/*...*/});
    // ...
    queue.on('simple',function(jinn,taskData) {/*...*/; jinn.done(); });
    queue.on('not so simple', function(jinn,taskData) {/*...*/; jinn.done(); });

The arguments passed to the event listeners are an instance of `Jinn` and `taskData`.

### 'stop' event

When there is no more tasks in the queue it emits 'stop' event, passing an
instance of `Jinn` to the listeners.

    queue.on('stop',function(jinn) { /* ... */ });

### length()

Return the number of tasks the queue keeps.

### setVar(name,object)

Set the value of the variable named `name` to the `object`

### getVar(name)

Return the value of the variable named `name`

### setMinTime(minTime)

Set the minimal time interval between the tasks' executions to `minTime` milliseconds.

### getMinTime()

Return the minimal time interval between the tasks' executions.

### execute()

Execute the tasks in the queue.

When the queue is not empty take the task from top and emit a `taskType` event.
Listeners are called with an instance of `Jinn` as the first argument and
the `taskData` as the second one. `taskType` and `taskData` are the arguments passed
to `pushTask()` or `unshiftTask()` methods. `Jinn` class is discussed below.

Every task listener should call `jinn.done()` method to specify the end of task execution
(see `taskDone()` method). This allows the queue to continue execution.

What happens when the queue is empty depends on the `autostop` option passed to the
constructor. By default `autostop` is `true` and the queue immediately emits a 'stop'
event. If `autostop` option was explicitly set to `false` the queue starts
a timer that waits for `minTime` milliseconds and calls `execute()` again.

### getTask(n)

Usually you don't need this method.

Return an instance of Task corresponding to `n`-th task in the queue.
`n` is between 0 and `queue.length()-1`.

### taskDone()

Usually you don't need this method.

This method is called when a user calls `Jinn.done()` from the `taskType` event listener.
If `minTime` or more milliseconds was passed since the last `taskType` event was emitted
it calls `execute()`. 

If the method is called before `minTime` is passed, then it returns immediately. `execute()`
however will be magically called again when the `minTime` will pass. 

### isTaskRunning()

Usually you don't need this method.

Returns true if the task is executed and `Jinn.done()` was not called yet

### shouldWaitMinTime()

Usually you don't need this method.

Returns true if the time passed since the beginning of the current task
is less than `minTime` milliseconds.

### shouldAutostop()

Returns `false` if autostop is not allowed. See `TasksQueue` constructor
description.

### autostop()

You may need this method if `autostop: false` option was used. It simply
makes the queue to autostop. I.e. when the `execute()` method finds that
the queue is empty, it immediately emits 'stop' event. 

### noautostop()

The opposite of `autostop()`. Remember, if you call this method after
the queue emitted 'stop' event, you should manually call `execute()`
again to start execution.

## Jinn

This class provides useful methods to the event listeners, bound to the
TasksQueue events. An instance of `Jinn` is passed as the first argument
to the listeners. Inherits from the EventEmitter.

### getQueue()

Return an instance of queue which emitted an event.

### getType()

Return event name: 'stop' or `taskType`

### getData()

Return `taskData` for `taskType` event

### done()

Emit 'done' event. In the case of `taskType` event
TasksQueue binds to this event a listener that
calls `TasksQueue.taskDone()`.

## Task

This is an internal class that represents a task. The instance
of Task is returned by `TasksQueue.getTask(n)` method.

### setData(data)

Set the data for a task.

### getData()

Return the data for a task.

### setType(taskType)

Set type of a task.

### getType()

Return a taskType of a task.

## Examples

* See examples directory,
* see [request-queue](https://github.com/tutukin/request-queue) project

## Contributing

In lieu of a formal styleguide, take care to maintain the existing
coding style. Add unit tests for any new or changed functionality.
Lint and test your code using Grunt.

## Release History

* April 11, 2013. V. 0.0.2. 
Added 'autostop' feature control.

* April 1, 2013. V. 0.0.1.
Basic functionality

License

Copyright (c) 2013 Andrei V. Toutoukine
Licensed under the MIT license.

