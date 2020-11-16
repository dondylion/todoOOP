'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted, todoContainer) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoContainer = document.querySelector(todoContainer);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
    }

    addToStorage() {
        localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem (todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
			<div class="todo-buttons">
				<button class="todo-remove"></button>
				<button class="todo-complete"></button>
            </div>
        `);

        if(todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();

        if(this.input.value.trim()) {
            const newTodo = {
                value : this.input.value,
                completed: false,
                key : this.generateKey()
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
            this.input.value = '';
        } else {
            alert('строка не должна быть пустой');
        }
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(target) {
        let dataArr = [...this.todoData],
            i = 0;
        const removeButtons = document.querySelectorAll('.todo-remove');
        removeButtons.forEach((elem, index)=>{
            if (elem===target) {
                i = index;
            }
        });
        this.todoData.delete(dataArr[i][0]);
        this.render();
    }

    completedItem(target) {
        let dataArr = [...this.todoData],
            i = 0,
            newTodo = {};
        const completeButtons = document.querySelectorAll('.todo-complete');
        completeButtons.forEach((elem, index)=>{
            if (elem===target) {
                i = index;
            }
        });
        newTodo = this.todoData.get(dataArr[i][0]);
        newTodo.completed = !newTodo.completed;
        this.todoData.set(dataArr[i][0], newTodo);
        this.render();
    }

    handler() {
        this.todoContainer.addEventListener('click', (event)=>{
            let target = event.target;
            if (target.classList.contains('todo-complete')) {
                this.completedItem(target);
            }
            if (target.classList.contains('todo-remove')) {
                this.deleteItem(target);
            }
        });
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');

todo.init();
todo.handler();