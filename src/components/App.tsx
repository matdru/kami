import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Layout, Menu, Button, Typography } from 'antd'
import RoomContainer from './RoomContainer'
import CreateChatDialog from './CreateChatDialog'
import LoadingSpinner from './LoadingSpinner'
import { tryLogin } from '../actions/auth'
import { initSlacker } from '../actions/rooms'
import '../styles/index.css'

const { Sider } = Layout
// const { Text } = Typography

const ButtonWrap = styled.div`
	text-align: center;
	padding: 15px;
`

const MenuLabel = styled.button`
	padding-left: 10px;
	color: rgba(255, 255, 255, 0.65);
	background: none;
	border: none;
	transition: color 1s;
	cursor: pointer;
	&:hover {
		color: #fff;
	}
`

interface Props {
	tryLogin: () => void
	initSlacker: () => void
	auth: Auth
	rooms: {
		joined: RoomItem[]
		available: RoomItem[]
	}
	history: any
	location: {
		pathname: any
	}
}

interface State {
	isCreateRoomDialogOpen: boolean
}

class App extends Component<Props> {
	state = {
		isCreateRoomDialogOpen: false,
	}

	componentDidMount() {
		this.props.tryLogin()
	}

	componentWillUpdate(nextProps: Props) {
		if (!this.props.auth.uid && nextProps.auth.uid) {
			this.props.initSlacker()
		}
	}

	componentDidUpdate(prevProps: Props) {
		const { location, rooms, history } = this.props
		if (
			location.pathname === '/' &&
			prevProps.rooms.joined.length === 0 &&
			rooms.joined.length !== 0
		) {
			console.log('redirect to first room?')
			history.push(`/r/${rooms.joined[0].id}`)
		}
	}

	handleCloseCreateChatDialog = () => {
		this.setState({
			isCreateRoomDialogOpen: false,
		})
	}

	handleOpenCreateChatDialog = () => {
		this.setState({
			isCreateRoomDialogOpen: true,
		})
	}

	handleRoomSelect = ({ key }: { key: string }) => {
		this.props.history.push(key)
	}

	render() {
		return (
			<Layout style={{ height: '100%' }}>
				<Sider
					style={{
						overflow: 'auto',
						height: '100vh',
						position: 'fixed',
						left: 0,
					}}
				>
					<ButtonWrap>
						<Button
							icon="plus"
							type="primary"
							onClick={this.handleOpenCreateChatDialog}
						>
							Create room
						</Button>
					</ButtonWrap>
					<CreateChatDialog
						isOpen={this.state.isCreateRoomDialogOpen}
						handleClose={this.handleCloseCreateChatDialog}
					/>
					<MenuLabel>
						<span>Rooms:</span>
					</MenuLabel>
					<Menu
						theme="dark"
						mode="inline"
						onSelect={this.handleRoomSelect}
						defaultSelectedKeys={[this.props.location.pathname]}
					>
						{this.props.rooms.joined.map(room => (
							<Menu.Item key={`/r/${room.id}`}>
								<span className="nav-text"># {room.name}</span>
							</Menu.Item>
						))}
					</Menu>
				</Sider>
				<Layout style={{ marginLeft: 200 }}>
					<Switch>
						<Route path={'/r/:roomId'} component={RoomContainer} />
						<Route path={'/'}>
							{this.props.rooms.joined.length === 0 ? (
								<LoadingSpinner />
							) : (
								<div>No chat selected</div>
							)}
						</Route>
					</Switch>
				</Layout>
			</Layout>
		)
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth,
	rooms: state.rooms,
})

export default connect(
	mapStateToProps,
	{ tryLogin, initSlacker },
)(App)
