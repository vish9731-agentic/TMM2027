with open('/Users/altcreative/Downloads/Procam afterthought/index.html', 'r') as f:
    html = f.read()

# Add Procam Slam tab in navigation
old_nav = '<button class="nav-tab-btn" data-tab="course" role="tab">🌊 TMM Course & Elevation</button>'
new_nav = '''<button class="nav-tab-btn" data-tab="procam" role="tab">🏅 Procam Slam</button>
        <button class="nav-tab-btn" data-tab="course" role="tab">🌊 TMM Course & Elevation</button>'''

html = html.replace(old_nav, new_nav, 1)

# Add Procam Slam filter button in controls bar
old_filter = '<button class="filter-btn" data-filter="milestone">⭐ Milestones</button>'
new_filter = '''<button class="filter-btn" data-filter="procam">🏅 Procam Slam (VDHM, Kolkata, TMM)</button>
          <button class="filter-btn" data-filter="milestone">⭐ All Milestones</button>'''

html = html.replace(old_filter, new_filter, 1)

# Add Procam Slam tab panel content right before tab-course
procam_panel = '''<!-- TAB: PROCAM SLAM JOURNEY -->
    <section id="tab-procam" class="tab-content-panel">
      <div class="course-card" style="border-top: 3px solid var(--accent-orange);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge" style="background: rgba(249, 115, 22, 0.2); color: var(--accent-orange); font-size: 0.8rem;">PROCAM SLAM 2026-27 CYCLE</span>
            <h2 style="font-size: 1.8rem; font-weight: 800; margin-top: 0.4rem;">Your Road to the Procam Slam</h2>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); background: rgba(0,0,0,0.3); padding: 0.5rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            🎯 Laser Focus: <strong>Tata Mumbai Marathon (Full 42.195K)</strong>
          </div>
        </div>

        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.75rem; line-height: 1.6;">
          Your plan does not taper or compromise for Delhi or Kolkata. They serve as <strong>fully supported, fully fueled long-distance simulation training runs</strong> to guarantee your sub-5:00 full marathon finish at Mumbai.
        </p>

        <!-- 3 Race Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 2rem;">
          
          <!-- Event 1: VDHM -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge" style="background: rgba(56, 189, 248, 0.2); color: var(--accent-blue);">PROCAM SLAM #1</span>
                <span style="font-size: 0.75rem; color: var(--text-dim); font-weight: 700;">WEEK 9</span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 0.75rem; color: var(--text-main);">Vedanta Delhi Half Marathon</h3>
              <div style="font-size: 0.8rem; color: var(--accent-blue); margin-top: 0.25rem; font-weight: 600;">📅 Sunday, October 18, 2026</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--text-main); font-family: 'Outfit'; margin: 0.75rem 0;">21.0975 <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">km</span></div>
              
              <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">
                <strong>Role in Master Plan:</strong> Controlled long training run. Zero taper before, zero recovery downtime after.
              </div>
            </div>

            <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
              <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Target Training Pace</div>
              <div class="mono" style="font-size: 1rem; font-weight: 700; color: var(--accent-blue); margin-top: 0.2rem;">7:20 – 7:35 min/km</div>
              <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.25rem;">Target: ~2:35:00 (Easy Aerobic)</div>
            </div>
          </div>

          <!-- Event 2: Kolkata 25K -->
          <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: var(--accent-amber);">PROCAM SLAM #2</span>
                <span style="font-size: 0.75rem; color: var(--text-dim); font-weight: 700;">WEEK 18</span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 0.75rem; color: var(--text-main);">Tata Steel World 25K Kolkata</h3>
              <div style="font-size: 0.8rem; color: var(--accent-amber); margin-top: 0.25rem; font-weight: 600;">📅 Sunday, December 20, 2026</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--text-main); font-family: 'Outfit'; margin: 0.75rem 0;">25.0000 <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">km</span></div>
              
              <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">
                <strong>Role in Master Plan:</strong> Marathon Goal Pace (MP) dress rehearsal on tired legs (first 15k steady, last 10k @ 7:06).
              </div>
            </div>

            <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
              <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Target Training Pace</div>
              <div class="mono" style="font-size: 1rem; font-weight: 700; color: var(--accent-amber); margin-top: 0.2rem;">7:05 – 7:25 min/km</div>
              <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.25rem;">Target: ~3:00:00 (MP Block)</div>
            </div>
          </div>

          <!-- Event 3: TMM Full Marathon -->
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.05)), rgba(0,0,0,0.4); border: 1px solid rgba(16, 185, 129, 0.5); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge" style="background: rgba(16, 185, 129, 0.3); color: var(--primary);">THE ULTIMATE GOAL 🏆</span>
                <span style="font-size: 0.75rem; color: var(--primary); font-weight: 800;">WEEK 22</span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 0.75rem; color: var(--text-main);">Tata Mumbai Marathon 2027</h3>
              <div style="font-size: 0.8rem; color: var(--primary); margin-top: 0.25rem; font-weight: 700;">📅 Sunday, January 17, 2027</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary); font-family: 'Outfit'; margin: 0.75rem 0;">42.195 <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">km (Full)</span></div>
              
              <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">
                <strong>Role in Master Plan:</strong> The Peak Race! Fully tapered, carb-loaded, and executing the sub-5:00 plan across Pedder Road.
              </div>
            </div>

            <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid rgba(16, 185, 129, 0.3);">
              <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Race Day Goal Pace</div>
              <div class="mono" style="font-size: 1.1rem; font-weight: 800; color: var(--primary); margin-top: 0.2rem;">7:05 – 7:06 min/km</div>
              <div style="font-size: 0.75rem; color: var(--primary); font-weight: 700; margin-top: 0.25rem;">Finish Target: 4:58:30 (SUB-5 HR!) 🏅</div>
            </div>
          </div>

        </div>
      </div>
    </section>

    '''

html = html.replace('<!-- TAB 2: COURSE & ELEVATION STRATEGY -->', procam_panel + '<!-- TAB 2: COURSE & ELEVATION STRATEGY -->', 1)

with open('/Users/altcreative/Downloads/Procam afterthought/index.html', 'w') as f:
    f.write(html)

print("Successfully added Procam Slam tab to index.html")
