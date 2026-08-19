with open('/Users/altcreative/Downloads/Procam afterthought/index.html', 'r') as f:
    html = f.read()

required_ids = [
    'cd-days', 'cd-hours', 'cd-mins',
    'search-workouts', 'phase-timeline-container', 'weeks-container',
    'metric-completed-km', 'metric-progress-fill', 'metric-progress-pct',
    'global-modal', 'modal-body-content', 'modal-title',
    'calc-hrs', 'calc-mins', 'calc-result-pace', 'calc-split-10k', 'calc-split-hm',
    'week-jumper-bar', 'btn-view-grid', 'btn-view-table', 'expand-toggle-label',
    'tab-plan', 'tab-procam', 'tab-course', 'tab-strength', 'tab-fueling', 'tab-calculator', 'tab-supabase'
]

missing = [i for i in required_ids if f'id="{i}"' not in html and f"id='{i}'" not in html]
if missing:
    print("Missing IDs:", missing)
else:
    print("All required DOM element IDs verified successfully!")
