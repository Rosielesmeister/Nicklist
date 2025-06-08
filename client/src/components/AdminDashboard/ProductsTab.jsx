// AdminDashboard/components/ProductsTab.jsx
import React from "react"
import { MESSAGES_ADMIN, TABLE_HEADERS, UI_CONFIG_ADMIN } from "../common/Constant"
import { 
	formatDate, 
	formatPrice, 
	getUserFullName, 
	getProductStatusBadge, 
	getProductToggleButton 
} from "../../utils/adminDashboardHelpers"

// Product Icon component
const ProductIcon = () => (
	<div
		className="bg-light rounded d-flex align-items-center justify-content-center me-3"
		style={{ width: UI_CONFIG_ADMIN.PRODUCT_ICON_SIZE, height: UI_CONFIG_ADMIN.PRODUCT_ICON_SIZE }}
	>
		<i
			className="bi bi-box text-muted"
			style={{ fontSize: UI_CONFIG_ADMIN.TABLE_ICON_SIZE }}
		></i>
	</div>
)

// Product Actions component
const ProductActions = ({ product, onToggleActive, onDelete, loading }) => {
	const toggleInfo = getProductToggleButton(product.isActive)

	return (
		<div className="btn-group" role="group">
			<button
				type="button"
				className="btn btn-outline-primary btn-sm"
				onClick={() => onToggleActive(product._id)}
				title={toggleInfo.title}
				disabled={loading}
			>
				<i className={toggleInfo.icon}></i>
			</button>
			<button
				type="button"
				className="btn btn-outline-danger btn-sm"
				onClick={() => onDelete(product._id)}
				title="Delete Product"
				disabled={loading}
			>
				<i className="bi bi-trash"></i>
			</button>
		</div>
	)
}

// Product Table Row component
const ProductTableRow = ({ product, onToggleActive, onDelete, loading }) => {
	const statusBadge = getProductStatusBadge(product.isActive)

	return (
		<tr key={product._id}>
			<td>
				<div className="d-flex align-items-center">
					<ProductIcon />
					<div>
						<h6 className="mb-0">{product.name}</h6>
						<small className="text-muted">{product.category}</small>
					</div>
				</div>
			</td>
			<td>
				<div>
					<h6 className="mb-0">{getUserFullName(product.user)}</h6>
					<small className="text-muted">{product.user?.email}</small>
				</div>
			</td>
			<td className="fw-bold">{formatPrice(product.price)}</td>
			<td>
				<span className={`badge ${statusBadge.className}`}>
					{statusBadge.text}
				</span>
			</td>
			<td className="text-muted">{formatDate(product.createdAt)}</td>
			<td>
				<ProductActions
					product={product}
					onToggleActive={onToggleActive}
					onDelete={onDelete}
					loading={loading}
				/>
			</td>
		</tr>
	)
}

const ProductsTab = ({ products, onToggleProductActive, onDeleteProduct, loading }) => {
	return (
		<div className="tab-pane fade show active">
			<div className="card shadow-sm">
				<div className="card-header bg-white">
					<h5 className="card-title mb-1">{MESSAGES_ADMIN.PRODUCT_MANAGEMENT_TITLE}</h5>
					<p className="text-muted mb-0">{MESSAGES_ADMIN.PRODUCT_MANAGEMENT_SUBTITLE}</p>
				</div>
				<div className="card-body p-0">
					<div className="table-responsive">
						<table className="table table-hover mb-0">
							<thead className="table-light">
								<tr>
									{TABLE_HEADERS.PRODUCTS.map((header) => (
										<th key={header} className="border-0">{header}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{products.map((product) => (
									<ProductTableRow
										key={product._id}
										product={product}
										onToggleActive={onToggleProductActive}
										onDelete={onDeleteProduct}
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

export default ProductsTab