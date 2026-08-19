import re

# ==========================================
# 1. Update styles.css
# ==========================================
with open('/Users/altcreative/Downloads/Procam afterthought/styles.css', 'r') as f:
    css = f.read()

# Add procam selector card styles
procam_css = """
/* Procam Slam Interactive Selector Cards */
.procam-select-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.procam-select-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border-highlight);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.procam-select-card.active {
  border-color: var(--primary);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.05)), rgba(17, 24, 39, 0.9);
  box-shadow: 0 0 24px var(--primary-glow);
  transform: translateY(-2px);
}

.procam-select-card.active::after {
  content: '✓ SELECTED';
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--primary);
  color: #000;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
}

.race-indicator-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  text-transform: uppercase;
}
"""

if '.procam-select-card' not in css:
    css += procam_css
    with open('/Users/altcreative/Downloads/Procam afterthought/styles.css', 'w') as f:
        f.write(css)

print("Updated styles.css with procam selector styling")
