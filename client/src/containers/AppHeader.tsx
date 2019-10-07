import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Layout, Typography, Avatar, Button, Menu, Dropdown, Modal } from 'antd'

import ProfileDialog from '../components/ProfileDialog'
import { tryLeaveRoom } from '../actions/rooms'
import { getRoomUsers } from '../actions/users'

const { Header } = Layout
const { Title } = Typography

const { confirm } = Modal

const AccountButton = styled.button`
	background: none;
	border: 1px solid transparent;
	border-radius: 4px;
	transition: border 0.5s;
	outline: none;
	padding: 0px;
	line-height: normal;
	cursor: pointer;
`

const TopRightMenu = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`

interface Props {
	room?: RoomItem
	uid?: string
	photoURL?: string
	tryLeaveRoom: (roomId: string) => void
	getRoomUsers: (roomId: string) => void
}

interface State {
	profileOpen: boolean
}

class AppHeader extends Component<Props, State> {
	state = {
		profileOpen: false,
	}

	handleProfileOpen = () => {
		this.setState({
			profileOpen: true,
		})
	}

	handleProfileClose = () => {
		this.setState({
			profileOpen: false,
		})
	}

	handleUsersFetch = () => {
		const { room } = this.props
		if (room) {
			this.props.getRoomUsers(room.id)
		}
	}

	handleConfirmLeave = () => {
		const { room } = this.props
		if (room) {
			const leaveHandler = () => this.props.tryLeaveRoom(room.id)
			confirm({
				title: 'Do you want to leave this room?',
				content: this.props.room ? this.props.room.name : '-',
				onOk() {
					leaveHandler()
				},
				onCancel() {},
			})
		}
	}

	render() {
		const { room, uid, photoURL } = this.props
		// TODO plan what is in here
		// TODO 2 -> style a tags with buttons instead
		const menu = (
			<Menu>
				<Menu.Item onClick={this.handleConfirmLeave}>
					<a>Leave chat</a>
				</Menu.Item>
				{/* {/* <Menu.Item>
					<a>2nd menu item</a>
				</Menu.Item> */}
				<Menu.Item onClick={this.handleUsersFetch}>
					<a>Fetch room users</a>
				</Menu.Item>
			</Menu>
		)
		return (
			<Header
				style={{
					background: '#fff',
					borderBottom: '1px solid #acacac',
					padding: 16,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Title style={{ margin: 0 }} level={3}>
					# {room ? room.name : ''}
				</Title>
				{!!uid && (
					<TopRightMenu>
						<Dropdown
							overlay={menu}
							trigger={['click']}
							placement="bottomRight"
						>
							<Button
								icon="setting"
								shape="circle"
								style={{ paddingTop: 1, marginRight: 10 }}
							/>
						</Dropdown>

						<AccountButton onClick={this.handleProfileOpen}>
							<Avatar src={photoURL} size={35} shape="square" />
						</AccountButton>
						<ProfileDialog
							isOpen={this.state.profileOpen}
							handleClose={this.handleProfileClose}
						/>
					</TopRightMenu>
				)}
			</Header>
		)
	}
}

const mapStateToProps = (state: StoreState) => {
	const { auth } = state
	return {
		uid: auth.uid,
		photoURL: auth.photoURL || undefined,
	}
}

export default connect(
	mapStateToProps,
	{ tryLeaveRoom, getRoomUsers },
)(AppHeader)
