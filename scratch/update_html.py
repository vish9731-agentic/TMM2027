import re

# Read index.html
with open('/Users/altcreative/Downloads/Procam afterthought/index.html', 'r') as f:
    html = f.read()

# Add view mode toggle and quick week jumper bar right above the weeks container in index.html
target_controls_bar = '<div class="controls-bar">'
replacement_controls_bar = '''<div class="controls-bar">
        <div class="filter-group">
          <span class="filter-label">Filter:</span>
          <button class="filter-btn active" data-filter="all">All Weeks</button>
          <button class="filter-btn" data-filter="deload">🔋 Deloads (W4, 8, 12, 16, 20)</button>
          <button class="filter-btn" data-filter="milestone">⭐ Milestones</button>
        </div>

        <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <div class="view-mode-toggle">
            <button class="view-mode-btn active" id="btn-view-grid" onclick="setViewMode('grid')">🎴 Cards</button>
            <button class="view-mode-btn" id="btn-view-table" onclick="setViewMode('table')">📋 Agenda Table</button>
          </div>
          
          <button class="btn-icon" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;" onclick="toggleAllWeeks()">
            <span id="expand-toggle-label">📂 Collapse All</span>
          </button>
        </div>

        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="search-workouts" class="search-input" placeholder="Search workout, tempo, hills, prehab...">
        </div>
      </div>

      <!-- Quick Week Jumper Bar -->
      <div class="week-jumper-bar" id="week-jumper-bar">
        <!-- Rendered by app.js -->
      </div>'''

html = html.replace(target_controls_bar, replacement_controls_bar, 1)

with open('/Users/altcreative/Downloads/Procam afterthought/index.html', 'w') as f:
    f.write(html)

print("Updated index.html successfully")
