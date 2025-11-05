<template>
  <div class="stat-card reveal-on-scroll" :class="{ clickable }" @click="onClick">
    <div class="stat-icon" v-if="$slots.icon">
      <slot name="icon" />
    </div>
    <div class="stat-content">
      <div class="stat-title">{{ title }}</div>
      <div class="stat-value">{{ value }}</div>
      <div v-if="subtitle" class="stat-subtitle">{{ subtitle }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  subtitle: { type: String, default: '' },
  clickable: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])
const onClick = () => { if (props.clickable) emit('click') }
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0,191,255,0.4);
  box-shadow: 0 12px 40px rgba(0,191,255,0.15);
}
.stat-card.clickable { cursor: pointer; }
.stat-card.clickable:hover { border-color: rgba(0,191,255,0.6); }

.stat-icon { 
  width: 48px; 
  height: 48px; 
  display: grid; 
  place-items: center; 
  border-radius: 12px; 
  background: linear-gradient(135deg, rgba(0,191,255,0.15), rgba(0,191,255,0.05));
  color: #00bfff;
}
.stat-icon :deep(svg) { width: 24px; height: 24px; stroke-width: 2; }

.stat-content { display:flex; flex-direction: column; gap: 2px; }
.stat-title { color:#94a3b8; font-size: .85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-value { color: #fff; font-size: 1.8rem; font-weight: 800; line-height: 1.2; margin: 4px 0; }
.stat-subtitle { color:#9aa0a6; font-size: .8rem; }
</style>
