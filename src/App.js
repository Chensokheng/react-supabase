import React, { useEffect, useState } from "react";
import Todo from "./components/Todo";
import { supabase } from "./lib/helper/supabaseClient";

export default function App() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const session = supabase.auth.session();
		setUser(session?.user);
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				switch (event) {
					case "SIGNED_IN":
						setUser(session?.user);
						break;
					case "SIGNED_OUT":
						setUser(null);
						break;
					default:
				}
			}
		);
		return () => {
			authListener.unsubscribe();
		};
	}, []);

	const login = async () => {
		await supabase.auth.signIn({
			provider: "github",
		});
	};

	return (
		<div>
			{user ? (
				<Todo user={user} />
			) : (
				<button onClick={login}>Login with Github</button>
			)}
		</div>
	);
}
