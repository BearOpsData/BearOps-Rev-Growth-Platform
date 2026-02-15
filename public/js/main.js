
        // Tab switching
        function showTab(tabName, btn) {
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));

            const tabBtns = document.querySelectorAll('.tab-btn');
            tabBtns.forEach(b => b.classList.remove('active'));

            const tabEl = document.getElementById(tabName);
            if (tabEl) tabEl.classList.add('active');
            if (btn) btn.classList.add('active');

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Cost calculator
        function calculateCost() {
            const arr = parseFloat(document.getElementById('arr').value) || 0;
            const teamSize = parseInt(document.getElementById('team-size').value) || 0;
            const attainment = parseFloat(document.getElementById('attainment').value) || 0;

            if (arr === 0 || teamSize === 0 || attainment === 0) {
                alert('Please fill in all fields');
                return;
            }

            const targetAttainment = 70;
            const avgQuotaPerRep = (arr * 1000000) / teamSize;
            const quarterlyQuotaPerRep = avgQuotaPerRep / 4;
            
            const currentQuarterlyRevenue = quarterlyQuotaPerRep * teamSize * (attainment / 100);
            const targetQuarterlyRevenue = quarterlyQuotaPerRep * teamSize * (targetAttainment / 100);
            
            const quarterlyLoss = targetQuarterlyRevenue - currentQuarterlyRevenue;
            const annualLoss = quarterlyLoss * 4;
            const inefficiencyCost = teamSize * 30000;
            const totalCost = annualLoss + inefficiencyCost;

            document.getElementById('quarterly-loss').textContent = '$' + Math.round(quarterlyLoss / 1000) + 'K';
            document.getElementById('annual-loss').textContent = '$' + (Math.round(annualLoss / 100000) / 10) + 'M';
            document.getElementById('inefficiency-cost').textContent = '$' + Math.round(inefficiencyCost / 1000) + 'K';
            document.getElementById('total-cost').textContent = '$' + (Math.round(totalCost / 100000) / 10) + 'M';

            document.getElementById('results').classList.add('show');
        }

        // ===== Dynamic Heatmap (27 dimensions, adapted from HeatMap.html) =====
        const heatmapDimensions = [
            {
                pillar: "Alignment",
                label: "Pillar 1 – Alignment & Operating Discipline",
                items: [
                    { name: "Strategic Clarity & VTO", desc: "Clear 3-year vision, 1-year goals, quarterly priorities everyone can recite?" },
                    { name: "ICP Definition", desc: "Specific, data-backed ICP that sales/marketing agree on?" },
                    { name: "Leadership Alignment", desc: "Exec team agrees on priorities without revisiting issues?" },
                    { name: "Quarterly Rocks", desc: "3–5 Rocks per quarter with 70%+ completion?" },
                    { name: "Meeting Rhythm", desc: "Weekly L10s, monthly reviews, quarterly planning?" },
                    { name: "Scorecard & KPIs", desc: "8–12 metrics tracked weekly with accountability?" },
                    { name: "Value Proposition", desc: "One clear value prop used consistently?" }
                ]
            },
            {
                pillar: "People",
                label: "Pillar 2 – People, Roles & GTM Process",
                items: [
                    { name: "Role Definition", desc: "Every role has documented responsibilities and metrics?" },
                    { name: "Sales Methodology", desc: "One documented methodology everyone uses?" },
                    { name: "Coaching Cadence", desc: "Regular 1:1s, deal reviews, development plans?" },
                    { name: "Onboarding Program", desc: "Structured 60–90 day onboarding with milestones?" },
                    { name: "Lead Routing", desc: "Automated routing with clear MQL→SQL→SAO rules?" },
                    { name: "Sales → CS Handoff", desc: "Documented handoff with kickoffs and success plans?" },
                    { name: "Deal Reviews", desc: "Weekly reviews with qualification criteria?" },
                    { name: "Compensation Plans", desc: "Comp aligned to goals with clear accelerators?" }
                ]
            },
            {
                pillar: "Systems",
                label: "Pillar 3 – Systems, Data & Reporting",
                items: [
                    { name: "CRM Foundation", desc: "CRM is single source of truth with 95%+ quality?" },
                    { name: "Tech Stack Integration", desc: "All tools integrated with bidirectional sync?" },
                    { name: "Lead Scoring", desc: "Automated scoring based on fit + intent?" },
                    { name: "Journey Tracking", desc: "Can track full journey with attribution?" },
                    { name: "Forecasting Accuracy", desc: "Within 10% of actuals for 3 consecutive quarters?" },
                    { name: "Revenue Analytics", desc: "Real-time dashboards for win rates, velocity?" },
                    { name: "Board Reporting", desc: "Automated decks without manual data pulls?" },
                    { name: "Customer Health Scoring", desc: "Predicts churn 60–90 days in advance?" }
                ]
            }
        ];

        const heatmapScores = {};

        function initHeatmap() {
            const tbody = document.getElementById('heatmapRows');
            if (!tbody) return;

            let html = '';

            heatmapDimensions.forEach(pillar => {
                html += `<tr><td class="pillar-label" colspan="6">${pillar.label}</td></tr>`;

                pillar.items.forEach(item => {
                    html += `
                        <tr data-pillar="${pillar.pillar}" data-item="${item.name}">
                            <td>
                                <div class="row-label-main">${item.name}</div>
                                <div class="row-label-sub">${item.desc}</div>
                            </td>
                            <td class="level-cell lvl-1" data-score="1"><span>1</span></td>
                            <td class="level-cell lvl-2" data-score="2"><span>2</span></td>
                            <td class="level-cell lvl-3" data-score="3"><span>3</span></td>
                            <td class="level-cell lvl-4" data-score="4"><span>4</span></td>
                            <td class="level-cell lvl-5" data-score="5"><span>5</span></td>
                        </tr>
                    `;
                });
            });

            tbody.innerHTML = html;

            tbody.querySelectorAll('.level-cell').forEach(cell => {
                cell.addEventListener('click', onHeatmapCellClick);
            });
        }

        function onHeatmapCellClick(e) {
            const cell = e.currentTarget;
            const row = cell.closest('tr');
            const pillar = row.dataset.pillar;
            const item = row.dataset.item;
            const score = parseInt(cell.dataset.score, 10);

            // Toggle selected styling within the row
            row.querySelectorAll('.level-cell').forEach(c => c.classList.remove('selected'));
            cell.classList.add('selected');

            // Store latest score
            heatmapScores[item] = { score, pillar };

            updateHeatmapResults();
        }

        function updateHeatmapResults() {
            const resultsEl = document.getElementById('heatmapResults');
            if (!resultsEl) return;

            const entries = Object.entries(heatmapScores);
            if (!entries.length) {
                resultsEl.innerHTML = `
                    <div style="text-align:center; color:#94a3b8; padding:1.5rem;">
                        👆 Click a few rows above to see your overall maturity and where to focus first.
                    </div>
                `;
                return;
            }

            const pillarData = {};
            entries.forEach(([item, data]) => {
                if (!pillarData[data.pillar]) {
                    pillarData[data.pillar] = { total: 0, count: 0, items: [] };
                }
                pillarData[data.pillar].total += data.score;
                pillarData[data.pillar].count++;
                pillarData[data.pillar].items.push({ name: item, score: data.score });
            });

            Object.values(pillarData).forEach(p => {
                p.items.sort((a, b) => a.score - b.score);
            });

            const overallAvg = entries.reduce((sum, [, v]) => sum + v.score, 0) / entries.length;
            const overallColor = getHeatmapColor(overallAvg);

            let html = `
                <div style="background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(16,185,129,0.12)); border-radius: 12px; padding: 1.75rem;">
                    <h2 style="color:#3b82f6; margin-bottom:1.25rem; font-size:1.2rem;">📊 Your Revenue Engine Maturity</h2>

                    <div style="text-align:center; padding:1.25rem; background:rgba(15,23,42,0.9); border-radius:12px; margin-bottom:1.5rem;">
                        <div style="font-size:0.85rem; color:#94a3b8; margin-bottom:0.25rem;">Overall Score</div>
                        <div style="font-size:2.4rem; font-weight:700; color:${overallColor};">${overallAvg.toFixed(1)}/5</div>
                        <div style="margin-top:0.4rem; color:#cbd5e1;">${getHeatmapLabel(overallAvg)}</div>
                    </div>
            `;

            for (const [pillarKey, data] of Object.entries(pillarData)) {
                const avg = data.total / data.count;
                const color = getHeatmapColor(avg);
                const pillarName =
                    pillarKey === 'Alignment' ? 'Alignment & Operating Discipline' :
                    pillarKey === 'People'    ? 'People, Roles & GTM Process' :
                                                'Systems, Data & Reporting';

                html += `
                    <div style="margin-bottom:1.5rem; background:rgba(15,23,42,0.9); border-radius:12px; padding:1.25rem; border-left:4px solid ${color};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                            <h3 style="color:#e2e8f0; margin:0; font-size:1rem;">${pillarName}</h3>
                            <div style="font-size:1.4rem; font-weight:700; color:${color};">${avg.toFixed(1)}</div>
                        </div>

                        <div style="display:grid; gap:0.6rem;">
                `;

                data.items.forEach(item => {
                    const barWidth = (item.score / 5) * 100;
                    const itemColor = getHeatmapColor(item.score);

                    html += `
                        <div style="display:flex; align-items:center; gap:0.75rem;">
                            <div style="flex:1; color:#cbd5e1; font-size:0.85rem;">${item.name}</div>
                            <div style="flex:0 0 180px; position:relative; height:20px; background:rgba(15,23,42,0.9); border-radius:4px; overflow:hidden;">
                                <div style="position:absolute; height:100%; width:${barWidth}%; background:${itemColor};"></div>
                                <div style="position:absolute; width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:600; color:#fff; text-shadow:0 1px 2px rgba(0,0,0,0.5);">
                                    ${item.score}/5
                                </div>
                            </div>
                        </div>
                    `;
                });

                html += `</div></div>`;
            }

            // Identify weakest pillar for a simple recommendation
            const weakest = Object.entries(pillarData)
                .sort((a, b) => (a[1].total / a[1].count) - (b[1].total / b[1].count))[0];

            if (weakest) {
                const weakestAvg = weakest[1].total / weakest[1].count;
                const weakestName =
                    weakest[0] === 'Alignment' ? 'Alignment & Operating Discipline' :
                    weakest[0] === 'People'    ? 'People, Roles & GTM Process' :
                                                 'Systems, Data & Reporting';

                html += `
                    <div style="margin-top:1.5rem; padding:1.25rem; background:rgba(16,185,129,0.12); border-radius:12px; border:1px solid rgba(16,185,129,0.5);">
                        <h3 style="color:#10b981; margin-bottom:0.75rem; font-size:1rem;">🎯 Priority Recommendation</h3>
                        <div style="color:#e2e8f0; font-size:0.9rem; line-height:1.7;">
                            <strong>Start with: ${weakestName}</strong> (${weakestAvg.toFixed(1)}/5)<br><br>
                            This is your biggest bottleneck. Focus here first over the next 4–6 weeks to lift revenue predictability before adding more headcount or complexity.
                        </div>
                    </div>
                `;
            }

            html += `</div>`;
            resultsEl.innerHTML = html;
        }

        function getHeatmapColor(score) {
            if (score >= 4.5) return '#22c55e';
            if (score >= 3.5) return '#34d399';
            if (score >= 2.5) return '#eab308';
            if (score >= 1.5) return '#fb923c';
            return '#f87171';
        }

        function getHeatmapLabel(score) {
            if (score >= 4.5) return '🎯 Integrated & Scalable';
            if (score >= 3.5) return '✅ Strong';
            if (score >= 2.5) return '⚠️ Defined but Inconsistent';
            if (score >= 1.5) return '🟡 Emerging';
            return '🔴 Ad hoc / Fragile';
        }

        // Build the heatmap once the DOM is ready
        document.addEventListener('DOMContentLoaded', initHeatmap);
    