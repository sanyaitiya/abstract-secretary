/// <reference path="typings/tsd.d.ts"/>

import * as electron from 'electron';
var jquery :JQuery = $("#layout");

class Task {
    _taskName: string;
    subTask: Array<Task>;
    _priority: number;
    _htmlId: number;
    _completed: boolean;
    _addTaskAppear: boolean;
    _subtaskAppear: boolean;

    constructor(taskName: string);

    constructor(input: any){
        this.subTask = new Array();
        this._priority = null;
        this._completed = false;
        this._addTaskAppear = false;
        this._subtaskAppear = false;

        if (input instanceof Object) {
            for (var propName in input){

                if (propName === "subTask") {
                    var subTask = input[propName];
                    for (var index in subTask){
                        this.subTask.push(new Task(subTask[index]));
                    }
                } else {
                    this[propName] = input[propName];
                }
            }
        } else {
            this._taskName = input;
        }
    }

    get priority(): number{
        return this.priority;
    }

    set priority(value: number){
        this._priority = value;
    }

    get taskName(): string{
        return this._taskName;
    }

    set taskName(value: string){
        this._taskName = value;
    }

    draw(list: JQuery, taskId: number): number{
        this._htmlId = taskId;

        // checkbox
        var checked = "";
        if(this._completed){
            checked = "checked=\"checked\"";
        }
		var listItem = $("<li></li>").appendTo(list);
        if(this._completed){
            var taskItem = $("<div class=\"task-label task-label-check\"></div>").appendTo(listItem);
        }else{
            var taskItem = $("<div class=\"task-label\"></div>").appendTo(listItem);
        }
        if(this._completed){
            taskItem.append("<span class=\"checkbox-check\" onClick=\"check(this)\" id=\"" + this._htmlId + "\"></span>");
        }else{
            taskItem.append("<span class=\"checkbox-uncheck\" onClick=\"check(this)\" id=\"" + this._htmlId + "\"></span>");
        }
        if(this.subTask.length > 0){
            if ( this._subtaskAppear){
                taskItem.append("<input type=\"button\" onClick=\"subTaskExpand(this)\" value=\"↓\" id=\"" + this._htmlId + "\">");
            } else {
                taskItem.append("<input type=\"button\" onClick=\"subTaskExpand(this)\" value=\">\" id=\"" + this._htmlId + "\">");
            }
        } else {
            taskItem.append("<input type=\"button\" onClick=\"subTaskExpand(this)\" value=\"□\" id=\"" + this._htmlId + "\">");
        }

        // input textbox
        taskItem.append("<input type=\"button\" onClick=\"toggle(this)\" value=\"+\" id=\"" + this._htmlId + "\">");

        // task name
        if(this._completed){
            taskItem.append("<span><S>" + this._taskName + "</S></span>");
        }else{
            taskItem.append("<span>" + this._taskName + "</span>");
        }

		var subList = $("<ul></ul>").appendTo(listItem);
        if(this._addTaskAppear){
            var addText = $("<input type=\"text\" id=\"" + this._htmlId + "\" name=\"example\" onkeypress=\"textKeyPress(event.keyCode, this)\">").appendTo(subList);
        }
//		subList.append("<input type=\"text\" name=\"example\">");
        var nextId: number = taskId + 1;
        if(this._subtaskAppear){
            for(var sub in this.subTask){
	               nextId = this.subTask[sub].draw(subList, nextId);
            }
        }
        return nextId;
    }

    check(id: number){
        if(this._htmlId === id){
            this._completed = !(this._completed);
        }
        for(var sub in this.subTask){
            this.subTask[sub].check(id);
        }
    }

    addTask(id: number, taskName: string){
        if(this._htmlId === id){
            this.subTask.push(new Task(taskName));
        }
        for(var sub in this.subTask){
            this.subTask[sub].addTask(id, taskName);
        }
//        this.subTask.push(new Task(taskName));
    }
    toggleTextBox(id: number){
        if(this._htmlId === id){
            this._addTaskAppear = !(this._addTaskAppear);
        }else{
            this._addTaskAppear = false;
        }
        for(var sub in this.subTask){
            this.subTask[sub].toggleTextBox(id);
        }
    }
    subTaskExpandAndFold(id: number){
        if(this._htmlId === id){
            this._subtaskAppear = !(this._subtaskAppear);
            if(this._subtaskAppear === false){
                this.subTaskFold();
            }
        }
        for(var sub in this.subTask){
            this.subTask[sub].subTaskExpandAndFold(id);
        }
    }
    subTaskFold(){
        this._subtaskAppear = false;
        for(var sub in this.subTask){
            this.subTask[sub].subTaskFold();
        }
    }
}

var rootTaskList: Task = null;

function drawTaskList(){
	var taskListElement = $("#tasklist");
	taskListElement.empty();
	rootTaskList.draw(taskListElement, 0);
}

function check(element: HTMLElement){
    rootTaskList.check(Number(element.id));
    drawTaskList();
}

function toggle(element: HTMLElement){
    rootTaskList.toggleTextBox(Number(element.id));
    drawTaskList();
}

function subTaskExpand(element: HTMLElement){
    rootTaskList.subTaskExpandAndFold(Number(element.id));
    drawTaskList();
}

function textKeyPress(code: number, element: HTMLInputElement){
    if(code == 13){
        rootTaskList.addTask(Number(element.id), element.value);
        drawTaskList();
    }
}

import fs = require('fs');
var remote = electron.remote;
var dialog = remote.dialog;
var app = remote.app;
app.on('window-all-closed', function(){

});

var browserWindow = remote.BrowserWindow;
$(function(){
    fs.readFile('./test.txt', 'utf8', function(err, text){
        rootTaskList = new Task(JSON.parse(text));
        drawTaskList();
    });

    remote.getCurrentWindow().on('close', function(){
        //fs.writeFile('./test.txt', JSON.stringify(rootTaskList));
    });
});
