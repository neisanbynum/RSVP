<script lang="ts">
	import AttendingEventsTable from '$route-components/secured/upcoming/attending-events-table.svelte';
	import CreatedEventsTable from '$route-components/secured/upcoming/created-events-table.svelte';
	import ModeratingEventsTable from '$route-components/secured/upcoming/moderating-events-table.svelte';
</script>

<div class="flex h-full min-h-fit w-full flex-col gap-4 overflow-y-auto p-4">
	<CreatedEventsTable />
	<div class="flex h-full min-h-fit w-full flex-col-reverse gap-4 lg:flex-row">
		<ModeratingEventsTable />
		<AttendingEventsTable />
	</div>
</div>
