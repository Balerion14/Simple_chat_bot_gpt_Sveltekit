<script lang="ts">
    import { onMount } from "svelte";

    type DBMessage = { role: string; content: string; created_at?: string };
    type Message = { role: string; text: string; created_at?: string };

    export let data: { messages?: DBMessage[] };

    let messages: Message[] = [];
    let input: string = "";
    let loading: boolean = false;

    // during load of page, get mesage from bdd
    onMount(() => {
        messages = (data?.messages ?? []).map((m) => ({
            role: m.role,
            text: m.content,
            created_at: m.created_at,
        }));
    });

    // save message in bdd
    async function saveToDB(role: string, content: string) {
        const form = new FormData();
        form.set("role", role);
        form.set("content", content);

        const res = await fetch("?/save", {
            method: "POST",
            body: form,
        });

        if (!res.ok) {
            const err = await safeJson(res);
            console.error(
                "Save DB failed:",
                (err as any)?.error || res.statusText,
            );
        }
    }

    //create json
    async function safeJson(res: Response) {
        try {
            return await res.json();
        } catch {
            return null;
        }
    }

    // sending a message (placeholder for GPT request)
    async function sendMessage() {
        if (!input.trim() || loading) return;

        const userText = input;
        input = "";
        messages = [...messages, { role: "user", text: userText }];
        loading = true;

        saveToDB("user", userText).catch((e) => console.error(e));

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText }),
            });
            const apiData = await res.json();
            const reply = apiData?.reply ?? "(no reply)";
            messages = [...messages, { role: "assistant", text: reply }];
            saveToDB("assistant", reply).catch((e) => console.error(e));
        } catch (e) {
            const fallback = "Error contacting API.";
            messages = [...messages, { role: "assistant", text: fallback }];
            saveToDB("assistant", fallback).catch((e) => console.error(e));
        } finally {
            loading = false;
        }
    }

    //reset local conversation
    function resetConversation() {
        messages = [];
    }

    // in launch if not message, we add basic mesasge default
    onMount(() => {
        if (!messages || messages.length === 0) {
            messages = [
                { role: "assistant", text: "Hello! How can I help you today?" },
            ];
        }
    });
</script>

<div
    class="flex min-h-screen items-center justify-center bg-slate-200 px-6 py-16 dark:bg-gray-950"
>
    <section
        class="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 rounded-3xl bg-gradient-to-b from-slate-100/90 via-white/80 to-slate-100/90 p-10 text-center shadow-xl backdrop-blur dark:from-gray-900/90 dark:via-gray-950/80 dark:to-gray-900/90 sm:p-16"
    >
        <h1
            class="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl dark:text-gray-50"
        >
            Speak with <span class="text-blue-600 dark:text-blue-400">GPT</span>
        </h1>

        <!-- Chat container -->
        <div
            class="flex w-full max-w-3xl flex-col rounded-2xl border border-white/40 bg-white/80 p-6 text-left shadow-lg dark:border-gray-700 dark:bg-gray-900/70"
        >
            <div
                class="mb-6 max-h-[60vh] flex-1 space-y-4 overflow-y-auto pr-2"
                id="chat-box"
            >
                {#each messages as msg}
                    <div
                        class={`max-w-[80%] rounded-xl p-3 ${
                            msg.role === "user"
                                ? "ml-auto bg-blue-100/80 text-right text-blue-900 dark:bg-blue-900/50 dark:text-blue-100"
                                : "mr-auto bg-gray-100/70 text-left text-gray-800 dark:bg-gray-800/60 dark:text-gray-100"
                        }`}
                    >
                        <p>{msg.text}</p>
                    </div>
                {/each}
                {#if loading}
                    <div
                        class="mr-auto flex items-center gap-3 rounded-xl bg-gray-100/70 px-4 py-3 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300"
                    >
                        <span
                            class="h-2 w-2 animate-ping rounded-full bg-blue-500"
                        ></span>
                        <span>GPT rédige une réponse…</span>
                    </div>
                {/if}
            </div>

            <!-- Input and buttons -->
            <div class="flex flex-col gap-3 sm:flex-row">
                <input
                    bind:value={input}
                    type="text"
                    placeholder="Type your message..."
                    class="flex-1 rounded-xl border border-gray-300 bg-white/90 px-4 py-2 text-gray-900 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    on:keydown={(e) => e.key === "Enter" && sendMessage()}
                />
                <div class="flex shrink-0 gap-2">
                    <button
                        on:click={sendMessage}
                        class="rounded-xl bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:hover:bg-blue-500"
                    >
                        Send
                    </button>
                    <button
                        on:click={resetConversation}
                        class="rounded-xl border border-gray-300 px-5 py-2 text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    </section>
</div>
