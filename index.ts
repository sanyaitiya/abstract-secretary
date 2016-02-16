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
    _htmlId: number;
    _completed: boolean;

    constructor(taskName: string){
        this.subTask = new Array();
        this._taskName = taskName;
        this._priority = null;
        this._completed = false;
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
        var checked = "";
        if(this._completed){
            checked = "checked=\"checked\"";
        }
		var listItem = $("<li></li>").appendTo(list);
        listItem.append("<input type=\"checkbox\" id=\"" + this._htmlId + "\" onClick=\"check(this)\" "+ checked +">");
        if(this._completed){
            listItem.append("<S>" + this._taskName + "</S>");
        }else{
            listItem.append(this._taskName);
        }
		var subList = $("<ul></ul>").appendTo(listItem);
        var addText = $("<input type=\"text\" name=\"example\">").appendTo(subList);
//		subList.append("<input type=\"text\" name=\"example\">");
        var nextId: number = taskId + 1;
        for(var sub in this.subTask){
			nextId = this.subTask[sub].draw(subList, nextId);
        }
        return nextId;
    }

    check(id: number){
        if(this._htmlId === id){
            this._completed = !(this._completed);
            console.log(this._completed);
            console.log(this._htmlId);
        }
        for(var sub in this.subTask){
            this.subTask[sub].check(id);
        }
    }
}

var rootTaskList: Task = new Task("ProjectName");

function drawTaskList(){
	var taskListElement = $("#tasklist");
	taskListElement.empty();
	rootTaskList.draw(taskListElement, 0);
}

function check(element: HTMLElement){
    rootTaskList.check(Number(element.id));
    drawTaskList();
}

$(function(){
	rootTaskList.subTask.push(new Task("task1"));
	rootTaskList.subTask[0].subTask.push(new Task("subtask1"));
	rootTaskList.subTask[0].subTask[0].subTask.push(new Task("subsubtask1"));
    drawTaskList();
});
