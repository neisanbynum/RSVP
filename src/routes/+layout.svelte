<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import ThemeToggle from '../lib/components/routes/index/theme-toggle.svelte';
	import Text from '$lib/components/custom/typography/text.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { userName } from '$lib/remote/auth.remote';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Toaster richColors position="top-right" />
<div class="flex h-screen w-screen flex-col items-center justify-start">
	<div
		class="flex h-12 w-full items-center justify-between border-b-1 bg-neutral-100 p-4 dark:bg-black"
	>
		<div class="flex items-center justify-center gap-1">
			<!-- <Text text="Event RSVP" class="font-semibold" /> -->
			<svelte:boundary>
				{@const username = await userName()}
				{#if username}
					<Text text="User:" class="font-semibold" />
					<Text text={username} />
				{:else}
					<Text text={'Event RSVP'} class="font-semibold" />
				{/if}

				{#snippet pending()}
					<Text text={'Event RSVP'} class="font-semibold" />
				{/snippet}
			</svelte:boundary>
		</div>
		<div><ThemeToggle /></div>
	</div>
	<div class="flex h-full w-full flex-col items-center justify-center">
		{@render children?.()}
	</div>
</div>
