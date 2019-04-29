import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Modal, Input, Typography, Row, Col, Icon, Button } from 'antd'
import { tryLoginProvider } from '../actions/auth'
const { TextArea } = Input
const { Text, Title } = Typography

const LoginProviders = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`

interface Props {
	isOpen: boolean
	handleClose: () => void
	tryLoginProvider: (providerName: string) => Promise<any>
	auth: Auth
}

interface State {
	roomName: string
	description: string
}

class ProfileDialog extends Component<Props, State> {
	handleTryLogin = (providerName: string) => {
		this.props.tryLoginProvider(providerName).then(() => {
			this.props.handleClose()
		})
	}
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
					<Title level={4}>Login with</Title>
					<Row>
						<Col span={24}>
							<LoginProviders>
								<Button
									onClick={() => this.handleTryLogin('github')}
									style={{ margin: 5 }}
								>
									<Icon style={{ fontSize: 24 }} type="github" />
								</Button>
								<Button onClick={() => this.handleTryLogin('google')}>
									<Icon style={{ fontSize: 24 }} type="google" />
								</Button>
							</LoginProviders>
						</Col>
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
	{ tryLoginProvider },
)(ProfileDialog)
