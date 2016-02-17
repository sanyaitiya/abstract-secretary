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
    _addTaskAppear: boolean;
    _subtaskAppear: boolean;

    constructor(taskName: string){
        this.subTask = new Array();
        this._taskName = taskName;
        this._priority = null;
        this._completed = false;
        this._addTaskAppear = false;
        this._subtaskAppear = false;
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
        listItem.append("<input type=\"checkbox\" id=\"" + this._htmlId + "\" onClick=\"check(this)\" "+ checked +">");

        // task name
        if(this._completed){
            listItem.append("<S>" + this._taskName + "</S>");
        }else{
            listItem.append(this._taskName);
        }

        if(this.subTask.length > 0){
            listItem.append("<input type=\"button\" onClick=\"subTaskExpand(this)\" value=\"SubTask\" id=\"" + this._htmlId + "\">");
        }

        // input textbox
        listItem.append("<input type=\"button\" onClick=\"toggle(this)\" value=\"AddTask\" id=\"" + this._htmlId + "\">");
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
            console.log(this._completed);
            console.log(this._htmlId);
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

$(function(){
	rootTaskList.subTask.push(new Task("task1"));
	rootTaskList.subTask[0].subTask.push(new Task("subtask1"));
	rootTaskList.subTask[0].subTask[0].subTask.push(new Task("subsubtask1"));
    drawTaskList();
});
