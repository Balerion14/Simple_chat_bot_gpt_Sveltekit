import type { Actions, PageServerLoad } from "./$types";
import { getMessages, addMessage } from "$lib/server/supabase/client";
import { fail } from "@sveltejs/kit";

// load message from bdd
export const load: PageServerLoad = async () => {
    try {
        const messages = await getMessages(50);
        // sort to have top message before
        return { messages: messages?.reverse() ?? [] };
    } catch (error) {
        console.error("Erreur chargement messages:", error);
        return { messages: [], error: "Impossible de charger les messages." };
    }
};

// Action to save message
export const actions: Actions = {
    save: async ({ request }) => {
        const formData = await request.formData();
        const role = String(formData.get("role") ?? "user");
        const content = String(formData.get("content") ?? "").trim();

        if (!content) {
            return fail(400, { error: "Le message est vide." });
        }

        try {
            await addMessage(role, content);
            return { success: true };
        } catch (error) {
            console.error("Erreur enregistrement message:", error);
            return fail(500, { error: "Impossible d’enregistrer le message." });
        }
    },
};
