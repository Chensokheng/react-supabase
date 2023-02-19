import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/helper/supabaseClient";

export default function Todo({ user }) {
	const [todo, setTodo] = useState([]);
	const [error, setError] = useState(null);
	const inputRef = useRef();

	const logout = async () => {
		await supabase.auth.signOut();
	};

	const getTodo = async () => {
		const res = await supabase.from("demo").select("*");
		setTodo(res.data);
		setError(res.error);
	};

	const handleCreateTodo = async () => {
		const title = inputRef.current.value;

		const res = await supabase
			.from("demo")
			.insert({ title, user_id: user.id })
			.select("*")
			.single();

		inputRef.current.value = "";

		if (res.data) {
			setTodo((currentTodo) => [...currentTodo, res.data]);
		}
		setError(res.error);
	};

	const handleCompleteTodo = async (id) => {
		const res = await supabase
			.from("demo")
			.update({ complete: true })
			.eq("id", id)
			.select()
			.single();

		if (!res.error) {
			setTodo((currentTodo) =>
				currentTodo.map((todo) => {
					if (todo.id === id) {
						todo.complete = true;
					}
					return todo;
				})
			);
		}
		setError(res.error);
	};

	const handleDelete = async (id) => {
		const res = await supabase.from("demo").delete().eq("id", id);
		console.log(res);
		if (!res.error) {
			setTodo((currentTodo) =>
				currentTodo.filter((todo) => todo.id !== id)
			);
		}

		setError(res.error);
	};

	useEffect(() => {
		getTodo();
	}, []);

	return (
		<div>
			<div>
				<h1>List of Todo</h1>
				<div>
					<input ref={inputRef} />
					<button onClick={handleCreateTodo}>add</button>
					{error && <pre>{error.message}</pre>}
				</div>
				{todo.map((value, index) => {
					return (
						<div key={index}>
							<h2
								style={{
									textDecoration: value.complete
										? "line-through"
										: "",
								}}
							>
								{value.title}
							</h2>
							<button
								onClick={() => handleCompleteTodo(value.id)}
							>
								complete
							</button>
							<button onClick={() => handleDelete(value.id)}>
								Delete
							</button>
						</div>
					);
				})}

				<button onClick={logout}>Logout</button>
			</div>
		</div>
	);
}
