import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Layout, Menu, Icon } from 'antd'

import RoomContainer from './Room'
import CreateChatDialog from '../components/CreateChatDialog'
import BrowseRoomsDialog from '../components/BrowseRoomsDialog'
import LoadingSpinner from '../components/LoadingSpinner'

import { initAuth } from '../actions/auth'
import { initSlacker } from '../actions/rooms'

import '../styles/index.css'

const { Sider } = Layout

const LogoWrap = styled.div`
	text-align: center;
	padding: 10px;
	height: 64px;
	border-bottom: 1px solid grey;
`

const Logo = styled.img`
	height: 100%;
`

const RoomButtons = styled.div`
	padding: 10px;
	color: rgba(255, 255, 255, 0.65);
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const MenuButton = styled.button`
	font-size: 16px;
	background: none;
	border: none;
	-webkit-transition: color 0.5s;
	transition: color 0.5s;
	cursor: pointer;
	&:hover {
		color: #fff;
	}
`

const Content = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`

interface Props {
	initAuth: () => void
	initSlacker: () => void
	auth: Auth
	joinedRooms: RoomItem[]
	availableRooms: RoomItem[]
	history: any
	location: {
		pathname: any
	}
}

interface State {
	openDialog: string | false
}

class App extends Component<Props, State> {
	state: State = {
		openDialog: false,
	}

	componentDidMount() {
		this.props.initAuth()
	}

	componentWillUpdate(nextProps: Props) {
		if (!this.props.auth.uid && nextProps.auth.uid) {
			this.props.initSlacker()
		}
	}

	componentDidUpdate(prevProps: Props) {
		const { location, joinedRooms, history } = this.props
		if (
			location.pathname === '/' &&
			prevProps.joinedRooms.length === 0 &&
			joinedRooms.length !== 0
		) {
			history.push(`/r/${joinedRooms[0].id}`)
		}
	}

	handleCloseDialog = () => {
		this.setState({
			openDialog: false,
		})
	}

	handleOpenDialog = (dialogName: string) => {
		this.setState({
			openDialog: dialogName,
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
					<LogoWrap>
						<Logo src="fox.png" />
					</LogoWrap>

					<RoomButtons>
						<MenuButton onClick={() => this.handleOpenDialog('browseRooms')}>
							<span>Rooms:</span>
						</MenuButton>
						<MenuButton onClick={() => this.handleOpenDialog('createRoom')}>
							<Icon type="plus-circle" />
						</MenuButton>
					</RoomButtons>
					<CreateChatDialog
						isOpen={this.state.openDialog === 'createRoom'}
						handleClose={this.handleCloseDialog}
					/>
					<BrowseRoomsDialog
						isOpen={this.state.openDialog === 'browseRooms'}
						handleClose={this.handleCloseDialog}
					/>
					<Menu
						theme="dark"
						mode="inline"
						onSelect={this.handleRoomSelect}
						selectedKeys={[this.props.location.pathname]}
					>
						{this.props.joinedRooms.map(room => (
							<Menu.Item key={`/r/${room.id}`}>
								<span className="nav-text"># {room.name}</span>
							</Menu.Item>
						))}
					</Menu>
				</Sider>
				<Layout style={{ marginLeft: 200, background: '#fff' }}>
					<Switch>
						<Route path={'/r/:roomId'} component={RoomContainer} />
						<Route path={'/'}>
							<Content>
								{this.props.joinedRooms.length === 0 ? (
									<LoadingSpinner />
								) : (
									<div>No chat selected</div>
								)}
							</Content>
						</Route>
					</Switch>
				</Layout>
			</Layout>
		)
	}
}

const mapStateToProps = (state: StoreState) => ({
	auth: state.auth,
	joinedRooms: Object.values(state.rooms.joined),
	availableRooms: Object.values(state.rooms.available),
})

export default connect(
	mapStateToProps,
	{ initAuth, initSlacker },
)(App)
