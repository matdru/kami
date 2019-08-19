import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Modal, List, Avatar, Button } from 'antd'

import { tryJoinRoom } from '../actions/rooms'

const Label = styled.div`
	padding: 10px;
`

interface RoomWithAvailability extends RoomItem {
	canJoin: boolean
}

interface Props {
	isOpen: boolean
	handleClose: () => void
	tryJoinRoom: (roomId: string) => void
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

		this.props.tryJoinRoom(room.id)
		// this.props.handleClose()
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
									<button onClick={() => this.handleJoinRoom(item)}>
										{item.name}
									</button>
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
	const roomList = Object.values(available).map(room => {
		const canJoin =
			Object.values(joined).find(item => item.id === room.id) === undefined
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
	{ tryJoinRoom },
)(BrowseRoomsDialog)
