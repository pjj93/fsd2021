import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Todo} from '../models';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit, OnDestroy {

	@Input()
	todo!: Todo

	@Output()
	valid = new BehaviorSubject<boolean>(false)

	form!: FormGroup
	sub$!: Subscription

	constructor(private fb: FormBuilder) { }

	ngOnInit(): void { 
		this.resetForm()
	}
	ngOnDestroy() {
		this.sub$.unsubscribe()
	}

	resetForm(t: Partial<Todo> = {}) {
		this.form = this.fb.group({
			title: this.fb.control(t.title || '', [ Validators.required, Validators.minLength(3) ]),
			description: this.fb.control(t.description || '', [ Validators.required, Validators.minLength(3) ]),
			priority: this.fb.control(t.priority || 'low')
		})
		this.sub$ = this.form.statusChanges.subscribe(
			s => this.valid.next(s.toLowerCase() == 'valid')
		)
	}

	getValue(): Todo {
		const t = this.form.value as Todo
		if (!!this.todo)
			t.tid = this.todo.tid
		return t
	}


}
