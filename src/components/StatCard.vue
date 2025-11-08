<template>
  <div class="stat-card reveal-on-scroll" :class="{ clickable }" :style="cardColor ? { '--card-color': cardColor } : {}" @click="onClick">
    <div class="stat-icon" v-if="$slots.icon || logo">
      <img v-if="logo" :src="logo" :alt="title" class="stat-logo" />
      <slot v-else name="icon" />
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
  clickable: { type: Boolean, default: false },
  logo: { type: String, default: '' },
  cardColor: { type: String, default: '' }
})

const emit = defineEmits(['click'])
const onClick = () => { if (props.clickable) emit('click') }
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 28px;
  border-radius: 16px;
  background: rgba(17, 17, 17, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--card-color, rgba(255, 255, 255, 0.15));
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px var(--card-color, rgba(255, 255, 255, 0.05)),
    inset 0 1px 0 var(--card-color, rgba(255, 255, 255, 0.1));
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    var(--card-color, rgba(255, 255, 255, 0.3)), 
    transparent);
}

.stat-card:hover {
  transform: translateY(-6px);
  border-color: var(--card-color, rgba(255, 255, 255, 0.3));
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.4),
    0 0 0 1px var(--card-color, rgba(255, 255, 255, 0.1)),
    0 0 60px var(--card-color, rgba(255, 255, 255, 0.15)),
    inset 0 1px 0 var(--card-color, rgba(255, 255, 255, 0.15));
}

.stat-card.clickable { 
  cursor: pointer; 
}

.stat-card.clickable:hover { 
  border-color: var(--card-color, rgba(255, 255, 255, 0.4));
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.4),
    0 0 0 1px var(--card-color, rgba(255, 255, 255, 0.15)),
    0 0 80px var(--card-color, rgba(255, 255, 255, 0.2)),
    inset 0 1px 0 var(--card-color, rgba(255, 255, 255, 0.2));
}

.stat-icon { 
  width: 56px; 
  height: 56px; 
  display: grid; 
  place-items: center; 
  border-radius: 14px; 
  background: var(--card-color, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--card-color, rgba(255, 255, 255, 0.1));
  color: var(--card-color, #ffffff);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 var(--card-color, rgba(255, 255, 255, 0.15));
  flex-shrink: 0;
}

.stat-icon :deep(svg) { 
  width: 28px; 
  height: 28px; 
  stroke-width: 2;
  filter: drop-shadow(0 0 8px var(--card-color, rgba(255, 255, 255, 0.3)));
}

.stat-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: drop-shadow(0 0 8px var(--card-color, rgba(255, 255, 255, 0.4)));
}

.stat-content { 
  display: flex; 
  flex-direction: column; 
  gap: 4px;
  flex: 1;
}

.stat-title { 
  color: #94a3b8; 
  font-size: 0.85rem; 
  font-weight: 600; 
  text-transform: uppercase; 
  letter-spacing: 0.8px;
  margin-bottom: 4px;
}

.stat-value { 
  color: #fff; 
  font-size: 2rem; 
  font-weight: 800; 
  line-height: 1.1; 
  text-shadow: 
    0 0 20px var(--card-color, rgba(255, 255, 255, 0.3)),
    0 0 40px var(--card-color, rgba(255, 255, 255, 0.1));
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-subtitle { 
  color: #9aa0a6; 
  font-size: 0.8rem;
  margin-top: 2px;
}
</style>
