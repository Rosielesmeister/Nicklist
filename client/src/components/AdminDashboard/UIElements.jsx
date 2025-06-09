import React from "react"
import { UI_CONFIG_ADMIN, MESSAGES_ADMIN } from "../common/Constant"

// Reusable component for displaying statistics cards
export const StatCard = ({ title, value, icon, color = "primary" }) => (
	<div className={`card border-start border-5 border-${color} shadow-sm`}>
		<div className="card-body">
			<div className="d-flex align-items-center justify-content-between">
				<div>
					<h6 className="text-muted mb-1">{title}</h6>
					<h2 className="mb-0 fw-bold">{value || 0}</h2>
				</div>
				<i className={`${icon} text-${color}`} style={{ fontSize: UI_CONFIG_ADMIN.ICON_FONT_SIZE }}></i>
			</div>
		</div>
	</div>
)

// Loading spinner component
export const LoadingSpinner = () => (
	<div className="d-flex justify-content-center align-items-center p-4">
		<div className="spinner-border text-primary" role="status">
			<span className="visually-hidden">{MESSAGES_ADMIN.LOADING_TEXT}</span>
		</div>
	</div>
)

// Error alert component
export const ErrorAlert = ({ error, onDismiss }) => {
	if (!error) return null

	return (
		<div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
			<i className="bi bi-exclamation-triangle-fill me-2"></i>
			{error}
			<button
				type="button"
				className="btn-close"
				onClick={onDismiss}
				aria-label="Close"
			></button>
		</div>
	)
}

// Dashboard header component
export const DashboardHeader = () => (
	<div className="row mb-4">
		<div className="col">
			<h1 className="display-5 fw-bold mb-2">{MESSAGES_ADMIN.HEADER_TITLE}</h1>
			<p className="text-muted lead">{MESSAGES_ADMIN.HEADER_SUBTITLE}</p>
		</div>
	</div>
)