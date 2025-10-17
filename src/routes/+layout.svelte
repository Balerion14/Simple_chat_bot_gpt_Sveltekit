<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";

	let { children, data } = $props();
	import "../app.css";

	const normalizePath = (value: string) => value.replace(/\/$/, "") || "/";
	const isActive = (path: string, current?: string) =>
		normalizePath(current ?? "/") === normalizePath(path);
</script>

<!-- Global navigation bar (visible on all pages) -->
<header
	class="sticky top-0 z-50 border-b border-slate-200 bg-slate-100/90 backdrop-blur"
>
	<div class="relative flex h-20 w-full items-center px-6">
		<!-- Logo and title displayed on the left without link -->
		<div class="flex items-center gap-3 text-3xl font-bold text-gray-900">
			<img src={favicon} alt="Logo" class="h-10 w-10" />
			<span>Mini Chat GPT</span>
		</div>

		<!-- Navigation links centrally positioned -->
		<nav
			class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-12 text-2xl font-semibold"
		>
			<a
				href="/"
				class="rounded-lg border-b-4 border-transparent px-5 pb-2 pt-1 text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
				class:border-blue-600={isActive("/", data?.currentPath)}
				class:text-blue-600={isActive("/", data?.currentPath)}
				class:bg-blue-100={isActive("/", data?.currentPath)}
				aria-current={isActive("/", data?.currentPath)
					? "page"
					: undefined}
			>
				Home
			</a>
			<a
				href="/speak-with-llm"
				class="rounded-lg border-b-4 border-transparent px-5 pb-2 pt-1 text-gray-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
				class:border-blue-600={isActive(
					"/speak-with-llm",
					data?.currentPath,
				)}
				class:text-blue-600={isActive(
					"/speak-with-llm",
					data?.currentPath,
				)}
				class:bg-blue-100={isActive(
					"/speak-with-llm",
					data?.currentPath,
				)}
				aria-current={isActive("/speak-with-llm", data?.currentPath)
					? "page"
					: undefined}
			>
				Speak with LLM
			</a>
		</nav>
	</div>
</header>

<!-- Main content area where the current page is rendered -->
<main class="mx-auto max-w-6xl px-4">
	{@render children?.()}
</main>

<!-- Simple footer -->
<footer
	class="mt-16 border-t border-slate-200 bg-slate-100/90 dark:border-gray-700 dark:bg-gray-900/80"
>
	<div
		class="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
	>
		© {new Date().getFullYear()} Mini Chat Demo
	</div>
</footer>
