// AdminDashboard/components/TabNavigation.jsx
import React from "react"
import { TAB_CONFIG } from "../common/Constant"

const TabNavigation = ({ activeTab, setActiveTab, loading }) => {
	return (
		<ul className="nav nav-pills mb-4" role="tablist">
			{TAB_CONFIG.map((tab, index) => (
				<li key={tab.id} className={`nav-item ${index < TAB_CONFIG.length - 1 ? 'me-2' : ''}`} role="presentation">
					<button
						className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
						onClick={() => setActiveTab(tab.id)}
						disabled={loading}
					>
						<i className={`${tab.icon} me-1`}></i>
						{tab.label}
					</button>
				</li>
			))}
		</ul>
	)
}

export default TabNavigation