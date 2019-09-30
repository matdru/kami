export default (state = {}, action: any) => {
	switch (action.type) {
		case 'REDIRECT_TO':
			return {
				redirectTo: action.redirectTo,
			}
		default:
			return state
	}
}
