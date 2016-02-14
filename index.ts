/// <reference path="typings/tsd.d.ts"/>

var remote = require('remote');
var app = remote.require('app');
var BrowserWindow = remote.require('browser-window');
var dialog = remote.require('dialog');

var jquery :JQuery = $("#layout");

class Task {
    _taskName: string;
    subTask: Array<Task>;
    _priority: number;

    constructor(taskName: string){
        this.subTask = new Array();
        this._taskName = taskName;
        this._priority = null;
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

    draw(list: JQuery){
		var listItem = $("<li><input type=\"checkbox\">"+this._taskName+"</li>").appendTo(list);
		var subList = $("<ul></ul>").appendTo(listItem);
//		subList.append("<input type=\"text\" name=\"example\">");
        for(var sub in this.subTask){
			this.subTask[sub].draw(subList);
        }
    }
}

var rootTaskList: Task = new Task("ProjectName");

function drawTaskList(){
	var taskListElement = $("#tasklist");
	taskListElement.empty();
	rootTaskList.draw(taskListElement);
}

$(function(){
	rootTaskList.subTask.push(new Task("task1"));
	rootTaskList.subTask[0].subTask.push(new Task("subtask1"));
	rootTaskList.subTask[0].subTask[0].subTask.push(new Task("subsubtask1"));
    drawTaskList();
});
