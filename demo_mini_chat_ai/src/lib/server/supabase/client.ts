import { createClient } from "@supabase/supabase-js";
import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY
} from "$env/static/public";

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_ANON_KEY;

const supabase =
	supabaseUrl && supabaseKey
		? createClient(supabaseUrl, supabaseKey)
		: null;

if (!supabase) {
	console.warn(
		"[supabase] PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY manquants. Les opérations seront ignorées côté Supabase."
	);
}

// Ajouter un message
export async function addMessage(role: string, content: string) {
	if (!supabase) {
		return null;
	}

	const { data, error } = await supabase
		.from("messages")
		.insert([{ role, content }]);

	if (error) console.error("Erreur :", error);
	return data;
}

// Récupérer les derniers messages
export async function getMessages(limit = 20) {
	if (!supabase) {
		return [];
	}

	const { data, error } = await supabase
		.from("messages")
		.select("*")
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) console.error("Erreur :", error);
	return data ?? [];
}
