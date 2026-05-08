<script setup lang="ts">
import { GhosttyCore } from '@wterm/ghostty';
import { Terminal, type WTerm } from '@wterm/vue';
import '@wterm/vue/css';

type TerminalProps = /* @vue-ignore */ InstanceType<typeof Terminal>['$props'];

const core = await GhosttyCore.load();

const props = withDefaults(defineProps<TerminalProps>(), {
  rows: 140,
  cols: 100,
  onReady(wt: WTerm) {
    wt.write('UP!');
  },
});
</script>

<template>
  <Terminal v-bind="props" :core="core" />
</template>
