<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Text } from '$lib/components/custom';
	import ThemeToggle from './theme-toggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import { getAppContext } from '../../routes/layout-context.svelte';

	const app = getAppContext();
</script>

<div
	class="flex h-14 w-full items-center justify-between border-b-1 bg-neutral-100 p-4 dark:bg-black"
>
	<div class="flex items-center justify-center gap-1">
		<Text text={`NeisanWorks Event Coordinator${app.username ? ':' : ''}`} class="font-semibold" />
		{#if app.username}
			<Text text={app.username} class="text-center" />
		{/if}
	</div>
	<div class="flex h-fit w-fit items-center justify-center">
		<ThemeToggle />
		{#if app.username}
			<Button
				label="Logout"
				variant="outline"
				class="h-9 w-18"
				onclick={async () => {
					await app.logout();
					goto('/');
				}}
			/>
		{:else if page.url.pathname !== '/auth'}
			<Button label="Sign In" variant="outline" class="h-9 w-18" onclick={() => goto('/auth')} />
		{/if}
	</div>
</div>
