<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import X from "lucide-svelte/icons/x";
	import { fly } from "svelte/transition";
	import {
		SheetOverlay,
		SheetPortal,
		type Side,
		sheetTransitions,
		sheetVariants,
	} from "./index.js";
	import { cn } from "$lib/utils.js";

	type $$Props = SheetPrimitive.ContentProps & {
		side?: Side;
	};

	let className: $$Props["class"] = undefined;
	export let side: $$Props["side"] = "right";
	export { className as class };
	export let inTransition: $$Props["inTransition"] = fly;
	export let inTransitionConfig: $$Props["inTransitionConfig"] =
		sheetTransitions[side ?? "right"].in;
	export let outTransition: $$Props["outTransition"] = fly;
	export let outTransitionConfig: $$Props["outTransitionConfig"] =
		sheetTransitions[side ?? "right"].out;
</script>

<SheetPortal >
	<SheetOverlay />
	<SheetPrimitive.Content
		{inTransition}
		{inTransitionConfig}
		{outTransition}
		{outTransitionConfig}
		class={cn(sheetVariants({ side }), className, "bg-midnight border-none flex flex-col gap-2")}
		{...$$restProps}
	>
		<slot />
		<SheetPrimitive.Close
			class="size-16 bg-cyan-950 ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute right-4 top-4 rounded-full opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none flex items-center justify-center"
		>
			<X class="size-5" />
			<span class="sr-only">Close</span>
		</SheetPrimitive.Close>
	</SheetPrimitive.Content>
</SheetPortal>
