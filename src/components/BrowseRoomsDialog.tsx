import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {
	Modal,
	Input,
	Typography,
	List,
	message,
	Avatar,
	Spin,
	Button,
} from 'antd'

import { tryCreateRoom, RoomData } from '../actions/rooms'

const Label = styled.div`
	padding: 10px;
`

interface RoomWithAvailability extends RoomItem {
	canJoin: boolean
}

interface Props {
	isOpen: boolean
	handleClose: () => void
	tryCreateRoom: (roomData: RoomData, showCreateError?: any) => Promise<any>
	auth: Auth
	roomList: Array<RoomWithAvailability>
}

interface State {
	roomName: string
	description: string
}

class BrowseRoomsDialog extends Component<Props, State> {
	handleJoinRoom = (room: RoomWithAvailability) => {
		if (!room.canJoin) {
            console.log('redirect to that room')
            this.props.handleClose()
			return
		}

		this.props.handleClose()
	}

	render() {
		return (
			<Modal
				title="Browse Rooms"
				visible={this.props.isOpen}
				onOk={this.props.handleClose}
				onCancel={this.props.handleClose}
				okButtonProps={{ disabled: !this.props.auth.uid }}
				cancelButtonProps={{ disabled: !this.props.auth.uid }}
				bodyStyle={{ maxHeight: 450, overflowY: 'scroll' }}
			>
				<List
					dataSource={this.props.roomList}
					renderItem={item => (
						<List.Item key={item.id}>
							<List.Item.Meta
								avatar={item.avatarUrl ? <Avatar src={item.avatarUrl} /> : null}
								title={
									<a onClick={() => this.handleJoinRoom(item)}>{item.name}</a>
								}
								description={'TODO room descriptions'}
							/>
							<div>
								{item.canJoin ? (
									<Button onClick={() => this.handleJoinRoom(item)}>
										Join
									</Button>
								) : (
									<Label>joined</Label>
								)}
							</div>
						</List.Item>
					)}
				>
					{' '}
				</List>
			</Modal>
		)
	}
}

const mapStateToProps = (state: StoreState) => {
	const { available, joined } = state.rooms
	const roomList = available.map(room => {
		const canJoin = joined.find(item => item.id === room.id) === undefined
		return {
			...room,
			canJoin,
		}
	})
	return {
		roomList,
		auth: state.auth,
	}
}

export default connect(
	mapStateToProps,
	{ tryCreateRoom },
)(BrowseRoomsDialog)
