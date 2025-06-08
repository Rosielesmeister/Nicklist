import React from "react"
import { StatCard } from "./UIElements"
import { STAT_CARDS_CONFIG, UI_CONFIG_ADMIN, MESSAGES_ADMIN } from "../common/Constant"
import { formatDate, getUserFullName } from "../../utils/adminDashboardHelpers"

// Recent Users Card component
const RecentUsersCard = ({ recentUsers }) => (
	<div className="col-lg-6">
		<div className="card shadow-sm">
			<div className="card-header bg-white">
				<h5 className="card-title mb-0">{MESSAGES_ADMIN.RECENT_USERS_TITLE}</h5>
			</div>
			<div className="card-body">
				{recentUsers?.slice(0, UI_CONFIG_ADMIN.RECENT_ITEMS_LIMIT).map((user) => (
					<div
						key={user._id}
						className="d-flex align-items-center justify-content-between py-2 border-bottom"
					>
						<div>
							<h6 className="mb-1">{getUserFullName(user)}</h6>
							<small className="text-muted">{user.email}</small>
						</div>
						<small className="text-muted">{formatDate(user.createdAt)}</small>
					</div>
				))}
			</div>
		</div>
	</div>
)

// Recent Products Card component
const RecentProductsCard = ({ recentProducts }) => (
	<div className="col-lg-6">
		<div className="card shadow-sm">
			<div className="card-header bg-white">
				<h5 className="card-title mb-0">{MESSAGES_ADMIN.RECENT_PRODUCTS_TITLE}</h5>
			</div>
			<div className="card-body">
				{recentProducts?.slice(0, UI_CONFIG_ADMIN.RECENT_ITEMS_LIMIT).map((product) => (
					<div
						key={product._id}
						className="d-flex align-items-center justify-content-between py-2 border-bottom"
					>
						<div>
							<h6 className="mb-1">{product.name}</h6>
							<small className="text-muted">
								by {getUserFullName(product.user)}
							</small>
						</div>
						<small className="text-muted">{formatDate(product.createdAt)}</small>
					</div>
				))}
			</div>
		</div>
	</div>
)

const OverviewTab = ({ stats, recentActivity }) => {
	return (
		<div className="tab-pane fade show active">
			{/* Statistics Cards Grid */}
			<div className="row g-4 mb-5">
				{STAT_CARDS_CONFIG.map((config) => (
					<div key={config.key} className="col-12 col-sm-6 col-lg-3">
						<StatCard
							title={config.title}
							value={stats[config.key]}
							icon={config.icon}
							color={config.color}
						/>
					</div>
				))}
			</div>

			{/* Recent Activity Section */}
			<div className="row g-4">
				<RecentUsersCard recentUsers={recentActivity.recentUsers} />
				<RecentProductsCard recentProducts={recentActivity.recentProducts} />
			</div>
		</div>
	)
}

export default OverviewTab