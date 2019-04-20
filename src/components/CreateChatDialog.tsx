import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Modal, Input, Typography } from 'antd'
import { tryCreateRoom, RoomData } from '../actions/rooms'

const { TextArea } = Input
const { Text } = Typography

const TextWrap = styled.div`
	margin-top: 5px;
	margin-bottom: 5px;
`

interface Props {
	isOpen: boolean;
	handleClose: () => void;
	tryCreateRoom: (roomData: RoomData, showCreateError?: any) => Promise<any>;
	auth: Auth;
}

interface State {
	roomName: string;
	description: string;
}

class CreateChatDialog extends Component<Props, State> {
	state = {
		roomName: '',
		description: '',
	}

	handleChange = (e: any) => {
		console.log(e.target.name)
		// @ts-ignore
		this.setState({
			[e.target.name]: e.target.value,
		})
	}

	handleSubmit = () => {
		const { uid, displayName: userDisplayName } = this.props.auth
		if (uid) {
			console.log('Create this room pls')
			const roomName = this.state.roomName
			if (roomName && roomName.length > 0) {
				// this.setState({ error: '' })
				const room = {
					name: roomName,
					people: {
						id: uid,
						name: userDisplayName,
						unread: 0,
						lastRead: 0,
					},
				}
				this.props.tryCreateRoom(room)
				this.props.handleClose()
			}
		}
	}

	render() {
		return (
			<Modal
				title="Create Room"
				visible={this.props.isOpen}
				onOk={this.handleSubmit}
				onCancel={this.props.handleClose}
				okButtonProps={{ disabled: !this.props.auth.uid }}
				cancelButtonProps={{ disabled: !this.props.auth.uid }}
			>
				<TextWrap>
					<Text>Name:</Text>
				</TextWrap>
				<Input
					name="roomName"
					value={this.state.roomName}
					onChange={this.handleChange}
				/>
				<TextWrap>
					<Text>Description:</Text>
				</TextWrap>
				<TextArea
					name="description"
					value={this.state.description}
					onChange={this.handleChange}
					rows={4}
				/>
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
)(CreateChatDialog)
