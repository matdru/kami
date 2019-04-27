import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Modal, Input, Typography, Row, Col } from 'antd'
import { tryCreateRoom, RoomData } from '../actions/rooms'
const { TextArea } = Input
const { Text, Title } = Typography

const TextWrap = styled.div`
	margin-top: 5px;
	margin-bottom: 5px;
`

interface Props {
	isOpen: boolean
	handleClose: () => void
	tryCreateRoom: (roomData: RoomData, showCreateError?: any) => Promise<any>
	auth: Auth
}

interface State {
	roomName: string
	description: string
}

class ProfileDialog extends Component<Props, State> {
	render() {
		return (
			<Modal
				title="Profile"
				visible={this.props.isOpen}
				onOk={this.props.handleClose}
				onCancel={this.props.handleClose}
				okButtonProps={{ disabled: !this.props.auth.uid }}
				cancelButtonProps={{ disabled: !this.props.auth.uid }}
			>
				<div>
					Some user stuff here
					<Title level={3}>Login with</Title>
					<Row>
						<Col span={12}>github</Col>
						<Col span={12}>google</Col>
					</Row>
				</div>
			</Modal>
		)
	}
}

const mapStateToProps = (state: any) => ({
	auth: state.auth,
})

export default connect(
	mapStateToProps,
	{ tryCreateRoom },
)(ProfileDialog)
