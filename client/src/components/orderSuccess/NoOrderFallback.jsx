// OrderSuccess/components/NoOrderFallback.jsx
import React from "react"
import { Container, Row, Col, Alert } from "react-bootstrap"
import { SUCCESS_MESSAGES } from "../common/Constant"

const NoOrderFallback = () => {
	return (
		<Container className="py-5">
			<Row className="justify-content-center">
				<Col md={6} className="text-center">
					<Alert variant="warning">
						<h5>{SUCCESS_MESSAGES.NO_ORDER_TITLE}</h5>
						<p>{SUCCESS_MESSAGES.NO_ORDER_MESSAGE}</p>
					</Alert>
				</Col>
			</Row>
		</Container>
	)
}

export default NoOrderFallback