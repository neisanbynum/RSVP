<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import Topbar from '../route-components/root/topbar.svelte';
	import { setAppContext } from './layout-context.svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { getUserName } from '$lib/remote/auth.remote';
	import type { LayoutProps } from './$types';
	import { onMount } from 'svelte';

	let { children }: LayoutProps = $props();

	let app = setAppContext();

	const hydrate = async () => {
		if (!app.username) {
			getUserName().refresh();
			app.username = await getUserName();
		}
	};

	onMount(hydrate);
	beforeNavigate(async (navigate) => {
		console.log(navigate);
		app.previousPage = navigate.from?.route.id
		hydrate()
	});

	$inspect(app.username);
	$inspect(app.previousPage);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Toaster richColors position="top-right" />
<div class="flex h-screen w-screen flex-col items-center justify-start">
	<Topbar />
	<div class="flex h-full w-full flex-col items-center justify-center overflow-hidden">
		{@render children?.()}
	</div>
</div>
