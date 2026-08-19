with open('/Users/altcreative/Downloads/Procam afterthought/index.html', 'r') as f:
    html = f.read()

# 1. Remove TMM Course & Elevation from nav bar
html = html.replace('<button class="nav-tab-btn" data-tab="course" role="tab">🌊 TMM Course & Elevation</button>', '')

# 2. Update the Procam Slam Tab Section
old_procam_section = '''<!-- TAB: PROCAM SLAM JOURNEY -->
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
    </section>'''

new_procam_section = '''<!-- TAB: PROCAM SLAM JOURNEY -->
    <section id="tab-procam" class="tab-content-panel">
      <div class="course-card" style="border-top: 3px solid var(--accent-orange);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span class="badge" style="background: rgba(249, 115, 22, 0.2); color: var(--accent-orange); font-size: 0.8rem;">PROCAM SLAM 2026-27 CYCLE</span>
            <h2 style="font-size: 1.8rem; font-weight: 800; margin-top: 0.4rem;">Road to the Procam Slam: Course & Elevation Hub</h2>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); background: rgba(0,0,0,0.3); padding: 0.5rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            🎯 Laser Focus: <strong>Tata Mumbai Marathon (Full 42.195K)</strong>
          </div>
        </div>

        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.75rem; line-height: 1.6;">
          Click on any of the 3 race cards below to inspect the <strong>detailed course elevation profile, sector-by-sector pacing blueprint, and on-course fueling/electrolyte strategy</strong> for that specific event.
        </p>

        <!-- 3 Interactive Race Selector Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-top: 1.75rem;">
          
          <!-- Event 1: VDHM -->
          <div class="procam-select-card" id="procam-card-vdhm" data-race="vdhm" onclick="selectProcamRace('vdhm')">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge" style="background: rgba(56, 189, 248, 0.2); color: var(--accent-blue);">PROCAM SLAM #1</span>
                <span style="font-size: 0.75rem; color: var(--text-dim); font-weight: 700;">WEEK 9</span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 0.75rem; color: var(--text-main);">Vedanta Delhi Half Marathon</h3>
              <div style="font-size: 0.8rem; color: var(--accent-blue); margin-top: 0.25rem; font-weight: 600;">📅 Sunday, October 18, 2026</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--text-main); font-family: 'Outfit'; margin: 0.75rem 0;">21.0975 <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">km</span></div>
              
              <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">
                <strong>Role in Plan:</strong> Controlled long training run. Zero taper before, zero recovery downtime after.
              </div>
            </div>

            <div style="margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Training Pace</div>
                <div class="mono" style="font-size: 0.95rem; font-weight: 700; color: var(--accent-blue);">7:20 – 7:35 /km</div>
              </div>
              <span class="action-pill-btn" style="flex: 0; padding: 0.3rem 0.6rem;">Inspect Course ➔</span>
            </div>
          </div>

          <!-- Event 2: Kolkata 25K -->
          <div class="procam-select-card" id="procam-card-kolkata" data-race="kolkata" onclick="selectProcamRace('kolkata')">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: var(--accent-amber);">PROCAM SLAM #2</span>
                <span style="font-size: 0.75rem; color: var(--text-dim); font-weight: 700;">WEEK 18</span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 0.75rem; color: var(--text-main);">Tata Steel World 25K Kolkata</h3>
              <div style="font-size: 0.8rem; color: var(--accent-amber); margin-top: 0.25rem; font-weight: 600;">📅 Sunday, December 20, 2026</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--text-main); font-family: 'Outfit'; margin: 0.75rem 0;">25.0000 <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">km</span></div>
              
              <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">
                <strong>Role in Plan:</strong> Marathon Goal Pace (MP) dress rehearsal on pre-fatigued legs.
              </div>
            </div>

            <div style="margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Training Pace</div>
                <div class="mono" style="font-size: 0.95rem; font-weight: 700; color: var(--accent-amber);">7:05 – 7:25 /km</div>
              </div>
              <span class="action-pill-btn" style="flex: 0; padding: 0.3rem 0.6rem;">Inspect Course ➔</span>
            </div>
          </div>

          <!-- Event 3: TMM Full Marathon (Default Active) -->
          <div class="procam-select-card active" id="procam-card-tmm" data-race="tmm" onclick="selectProcamRace('tmm')">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="badge" style="background: rgba(16, 185, 129, 0.3); color: var(--primary);">THE ULTIMATE GOAL 🏆</span>
                <span style="font-size: 0.75rem; color: var(--primary); font-weight: 800;">WEEK 22</span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; margin-top: 0.75rem; color: var(--text-main);">Tata Mumbai Marathon 2027</h3>
              <div style="font-size: 0.8rem; color: var(--primary); margin-top: 0.25rem; font-weight: 700;">📅 Sunday, January 17, 2027</div>
              <div style="font-size: 1.6rem; font-weight: 900; color: var(--primary); font-family: 'Outfit'; margin: 0.75rem 0;">42.195 <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 500;">km (Full)</span></div>
              
              <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.5;">
                <strong>Role in Plan:</strong> The Peak Race! Fully tapered, carb-loaded, executing the sub-5:00 finish across Pedder Road.
              </div>
            </div>

            <div style="margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid rgba(16, 185, 129, 0.3); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Race Goal Pace</div>
                <div class="mono" style="font-size: 0.95rem; font-weight: 800; color: var(--primary);">7:05 – 7:06 /km</div>
              </div>
              <span class="action-pill-btn" style="flex: 0; padding: 0.3rem 0.6rem; background: var(--primary); color: #000; font-weight: 800;">Inspect Course ➔</span>
            </div>
          </div>

        </div>

        <!-- Dynamic Course Elevation Profile & Strategy Container -->
        <div id="procam-race-details-container">
          <!-- Rendered dynamically by app.js when selecting VDHM, Kolkata, or TMM -->
        </div>

      </div>
    </section>'''

# Replace procam section
if old_procam_section in html:
    html = html.replace(old_procam_section, new_procam_section)

# 3. Remove standalone tab-course section if still present
import re
html = re.sub(r'<!-- TAB 2: COURSE & ELEVATION STRATEGY -->[\s\S]*?</section>\s*', '', html)

with open('/Users/altcreative/Downloads/Procam afterthought/index.html', 'w') as f:
    f.write(html)

print("Updated index.html successfully with consolidated Procam Slam Course Hub")
