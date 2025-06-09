import React from "react"
import { Form, Row, Col } from "react-bootstrap"
import { US_STATES, REGIONS } from "./common/Constant"

const LocationForm = ({ formData, onChange, isLoading }) => {
	return (
		<>
			{/* State and City */}
			<Row>
				<Col md={6}>
					<Form.Group className="mb-3">
						<Form.Label>State *</Form.Label>
						<Form.Select
							name="state"
							value={formData.state}
							onChange={onChange}
							required
							disabled={isLoading}>
							<option value="">Select a state</option>
							{US_STATES.map((state) => (
								<option key={state} value={state}>
									{state}
								</option>
							))}
						</Form.Select>
					</Form.Group>
				</Col>
				<Col md={6}>
					<Form.Group className="mb-3">
						<Form.Label>City *</Form.Label>
						<Form.Control
							type="text"
							name="city"
							value={formData.city}
							onChange={onChange}
							placeholder="Enter city name"
							required
							disabled={isLoading}
						/>
					</Form.Group>
				</Col>
			</Row>

			{/* Region */}
			<Row>
				<Col md={12}>
					<Form.Group className="mb-3">
						<Form.Label>Region *</Form.Label>
						<Form.Select
							name="region"
							value={formData.region}
							onChange={onChange}
							required
							disabled={isLoading}>
							<option value="">Select a region</option>
							{REGIONS.map((region) => (
								<option key={region} value={region}>
									{region}
								</option>
							))}
						</Form.Select>
					</Form.Group>
				</Col>
			</Row>
		</>
	)
}

export default LocationForm