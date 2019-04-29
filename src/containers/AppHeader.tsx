import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Layout, Typography, Avatar, Menu, Dropdown, Icon, Button } from 'antd'

import ProfileDialog from '../components/ProfileDialog'

const { Header } = Layout
const { Title } = Typography

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

	render() {
		const { room, uid, photoURL } = this.props
		// TODO plan what is in here
		const menu = (
			<Menu>
				<Menu.Item onClick={this.handleProfileOpen}>
					<a>Profile</a>
				</Menu.Item>
				{/* <Menu.Item>
					<a>2nd menu item</a>
				</Menu.Item>
				<Menu.Item>
					<a>3rd menu item</a>
				</Menu.Item> */}
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
						<Button shape="circle" style={{ paddingTop: 1, marginRight: 10 }}>
							<Icon type="setting" />
						</Button>

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
		photoURL: auth.photoURL,
	}
}

export default connect(mapStateToProps)(AppHeader)
