<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet";
  import { pb } from "$lib/pocketbase";
  import { goto } from "$app/navigation";
  import { Button } from "$lib/components/ui/button";
  import { m } from "$src/paraglide/messages.js";
  import * as Select from "$lib/components/ui/select";
  import { setLocale, getLocale } from "$src/paraglide/runtime";
  import * as Popover from "$lib/components/ui/popover";
  import Languages from "lucide-svelte/icons/languages";
  import UserRoundCog from "lucide-svelte/icons/user-round-cog";
  import BadgePlus from "lucide-svelte/icons/badge-plus";
  import { eventBus } from "$lib/stores/eventBus";
  import { user } from '$lib/stores/auth';
  import { onMount } from "svelte";

  let { data, class: className } = $props();

  const localeOptions = [
    { value: "de", label: "German" },
    { value: "en", label: "English" },
  ];

  function handleLogout() {
    console.log('pb.authStore',pb.authStore);
    pb.authStore.clear();
    goto("/login");
  }

  function setValue(newValue: string) {
    console.log("setting locale");
    setLocale(newValue);
  }

  onMount(() => {
    console.log("user", $user);
    console.log("pb.authStore.isValid", pb.authStore.isValid);
  });
</script>

<nav class="py-4 {className} pointer-events-none px-4 sm:px-6 lg:px-8">
  <div class="flex justify-between">
    <div class="flex pointer-events-auto">
      <a
        href="/"
        class="flex-shrink-0 flex items-center justify-center bg-midnight rounded-full p-3"
      >
        <img src="/logo.svg" alt="Hydra Intelligence" class="size-12" />
      </a>
    </div>
    <div class="flex items-center gap-2 pointer-events-auto">
      {#if $user}
        <button
          onclick={() => eventBus.emit("ADD_MARKER")}
          class="cursor-pointer bg-midnight text-yellow-200 rounded-full p-2 flex items-center justify-center gap-2 size-16"
        >
          <BadgePlus class="size-5" />
        </button>

        <Sheet.Root>
          <Sheet.Trigger>
            <button
              class="cursor-pointer bg-midnight rounded-full p-2 flex items-center justify-center gap-2 size-16"
            >
              <span class="uppercase">
                <!-- {data.user?.email[0]}{data.user?.email[1]} -->
                <UserRoundCog class="size-5" />
              </span>
            </button>
          </Sheet.Trigger>
          <Sheet.Content class="text-emerald-500">
            <Sheet.Header>
              <Sheet.Title class="mt-2 capitalize">{m.profile()}</Sheet.Title>
              <Sheet.Description class="flex-grow flex flex-col gap-2 mt-6 justify-between">
                <div class="flex flex-col gap-2">
                  <Select.Root
                    selected={localeOptions.find((option) => option.value === getLocale())}
                    onSelectedChange={(v) => {
                      setLocale(v.value);
                    }}
                  >
                    <Select.Trigger class="">
                      <Select.Value placeholder="Language" />
                    </Select.Trigger>
                    <Select.Content>
                      {#each localeOptions as locale}
                        <Select.Item value={locale.value} label={locale.label}
                          >{locale.label}</Select.Item
                        >
                      {/each}
                    </Select.Content>
                  </Select.Root>
                </div>
                <Button onclick={handleLogout} variant="outline" class="">
                  {m.logout()}
                </Button>
              </Sheet.Description>
            </Sheet.Header>
          </Sheet.Content>
        </Sheet.Root>
      {:else}
        <!-- <a
          href="/login"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {m.login()}
        </a>
        <a
          href="/register"
          class="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {m.register()}
        </a> -->
        <Popover.Root>
          <Popover.Trigger
            class="flex items-center justify-center size-16 bg-midnight rounded-full p-2"
          >
            <Languages class="size-4" />
          </Popover.Trigger>
          <Popover.Content
            class="flex flex-col gap-2 bg-midnight rounded-md p-4 border border-black/10 mt-2"
          >
            <div class="flex flex-col gap-2 text-emerald-500">
              <Select.Root
                selected={localeOptions.find((option) => option.value === getLocale())}
                onSelectedChange={(v) => {
                  setLocale(v.value);
                }}
              >
                <Select.Trigger class="">
                  <Select.Value placeholder="Language" />
                </Select.Trigger>
                <Select.Content class="bg-midnight">
                  {#each localeOptions as locale}
                    <Select.Item value={locale.value} label={locale.label}
                      >{locale.label}</Select.Item
                    >
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>
          </Popover.Content>
        </Popover.Root>
      {/if}
    </div>
  </div>
</nav>
