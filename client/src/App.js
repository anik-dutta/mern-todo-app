// external imports
import { useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_BASE;

function App() {
	const [todos, setTodos] = useState([]);
	const [popupActive, setPopupActive] = useState(false);
	const [newTodo, setNewTodo] = useState('');
	const [updatedTodo, setUpdatedTodo] = useState('');
	const [editTodoActive, setEditTodoActive] = useState('');
	const [showError, setShowError] = useState(false);

	const getTodos = async () => {
		fetch(API_BASE + '/todos')
			.then(res => res.json())
			.then(data => setTodos(data))
			.catch(err => {
				setShowError(true);
				console.error('Error: ', err);
			});
	};

	const addTodo = async () => {
		await fetch(API_BASE + '/todos/new/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				text: newTodo
			})
		})
			.then(res => res.json())
			.catch(err => {
				setShowError(true);
				console.error('Error: ', err);
			});

		setPopupActive(false);
		setNewTodo('');
	};

	const editTodo = (value) => {
		setUpdatedTodo(value);
	};

	const handleKeyDown = async (e, id) => {
		if (e.key === 'Enter') {
			if (updatedTodo) {
				const data = await fetch(API_BASE + `/todos/edit/${id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						text: updatedTodo
					})
				})
					.then(res => res.json())
					.catch(err => {
						setShowError(true);
						console.error('Error: ', err);
					});

				setTodos(todos => todos.map(todo => {
					if (todo._id === data._id) {
						todo.text = data.text;
					}
					return todo;
				}));
				setUpdatedTodo('');
				e.preventDefault();
			}
			setEditTodoActive('');
		}
	};

	const completeTodo = async (id) => {
		const data = await fetch(API_BASE + `/todos/complete/${id}`, { method: 'PUT' })
			.then(res => res.json())
			.catch(err => {
				setShowError(true);
				console.error('Error: ', err);
			});

		setTodos(todos => todos.map(todo => {
			if (todo._id === data._id) {
				todo.complete = data.complete;
			}
			return todo;
		}));
	};

	const deleteTodo = async (id) => {
		const data = await fetch(API_BASE + `/todos/delete/${id}`, { method: 'DELETE' })
			.then(res => res.json())
			.catch(err => {
				setShowError(true);
				console.error('Error: ', err);
			});

		setTodos(todos => todos.filter(todo => todo._id !== data._id));
	};

	useEffect(() => {
		getTodos();
	}, [todos]);

	return (
		<div className="App">
			{showError ? <div className="errorBox todo">Something went wrong!!!</div> :
				(<>
					<h1 className="text-center">Task Buddy</h1>
					<>
						<h3>YOU HAVE {todos.length} TASK{todos.length > 1 && 'S'}</h3>
						<h2>{new Date(Date.now()).toString().substring(0, 16)}</h2>
					</>

					<div className="todos">
						{todos && todos.map(todo => (
							<div
								key={todo._id}
								className={'todo' + (todo.complete ? ' is-complete' : '')}
							>
								{todo._id !== editTodoActive ?
									<div className="checkbox" onClick={() => completeTodo(todo._id)} /> : null
								}

								<div className="text">{editTodoActive && todo._id === editTodoActive ? <input
									type="text"
									className="edit-input"
									value={updatedTodo || todo.text}
									onChange={(e) => editTodo(e.target.value)}
									onKeyDown={(e) => handleKeyDown(e, todo._id)}
								/> : todo.text}</div>

								<button className="edit-todo" onClick={() => setEditTodoActive(todo._id)}><i className="bi bi-pencil" /></button>

								<button className="delete-todo" onClick={() => deleteTodo(todo._id)}><i className="bi bi-x" /></button>
							</div>
						))}
					</div>
					{!popupActive && (
						<button className="addPopup" onClick={() => setPopupActive(true)} ><i className="bi bi-plus" /></button>
					)}
					{popupActive && (
						<div className="popup">
							<div className="closePopup" onClick={() => setPopupActive(false)}><i className="bi bi-x-circle" /></div>
							<div className="content">
								<input
									type="text" className="add-todo-input"
									value={newTodo}
									onChange={(e) => setNewTodo(e.target.value)}
								/>
								<button className="btn-create" onClick={addTodo}>CREATE TASK</button>
							</div>
						</div>
					)}
				</>)}
		</div>
	);
}

export default App;