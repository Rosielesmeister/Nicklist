import React from "react"
import { MESSAGES_ADMIN, TABLE_HEADERS, UI_CONFIG_ADMIN } from "../common/Constant"
import { 
	formatDate, 
	getUserInitials, 
	getUserFullName, 
	getUserRoleBadge, 
	getUserToggleButton 
} from "../../utils/adminDashboardHelpers"

// User Avatar component
const UserAvatar = ({ user }) => (
	<div
		className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
		style={{ width: UI_CONFIG_ADMIN.AVATAR_SIZE, height: UI_CONFIG_ADMIN.AVATAR_SIZE }}
	>
		{getUserInitials(user)}
	</div>
)

// User Actions component
const UserActions = ({ user, onToggleAdmin, onDelete, loading }) => {
	const toggleInfo = getUserToggleButton(user.isAdmin)

	return (
		<div className="btn-group" role="group">
			<button
				type="button"
				className="btn btn-outline-primary btn-sm"
				onClick={() => onToggleAdmin(user._id)}
				title={toggleInfo.title}
				disabled={loading}
			>
				<i className={toggleInfo.icon}></i>
			</button>
			<button
				type="button"
				className="btn btn-outline-danger btn-sm"
				onClick={() => onDelete(user._id)}
				title="Delete User"
				disabled={loading}
			>
				<i className="bi bi-trash"></i>
			</button>
		</div>
	)
}

// User Table Row component
const UserTableRow = ({ user, onToggleAdmin, onDelete, loading }) => {
	const roleBadge = getUserRoleBadge(user.isAdmin)

	return (
		<tr key={user._id}>
			<td>
				<div className="d-flex align-items-center">
					<UserAvatar user={user} />
					<div>
						<h6 className="mb-0">{getUserFullName(user)}</h6>
					</div>
				</div>
			</td>
			<td className="text-muted">{user.email}</td>
			<td>
				<span className={`badge ${roleBadge.className}`}>
					{roleBadge.text}
				</span>
			</td>
			<td className="text-muted">{formatDate(user.createdAt)}</td>
			<td>
				<UserActions
					user={user}
					onToggleAdmin={onToggleAdmin}
					onDelete={onDelete}
					loading={loading}
				/>
			</td>
		</tr>
	)
}

const UsersTab = ({ users, onToggleUserAdmin, onDeleteUser, loading }) => {
	return (
		<div className="tab-pane fade show active">
			<div className="card shadow-sm">
				<div className="card-header bg-white">
					<h5 className="card-title mb-1">{MESSAGES_ADMIN.USER_MANAGEMENT_TITLE}</h5>
					<p className="text-muted mb-0">{MESSAGES_ADMIN.USER_MANAGEMENT_SUBTITLE}</p>
				</div>
				<div className="card-body p-0">
					<div className="table-responsive">
						<table className="table table-hover mb-0">
							<thead className="table-light">
								<tr>
									{TABLE_HEADERS.USERS.map((header) => (
										<th key={header} className="border-0">{header}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<UserTableRow
										key={user._id}
										user={user}
										onToggleAdmin={onToggleUserAdmin}
										onDelete={onDeleteUser}
										loading={loading}
									/>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UsersTab