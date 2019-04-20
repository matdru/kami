interface Room {
	id?: string;
	people: any;
	name?: string;
	roomName: string;
	displayName?: string;
	messages: any[];
	unread?: any;
}

interface User {
	displayName: string;
}

interface Person {
	id: string;
}

interface Auth {
	uid?: string;
	displayName?: string;
}

interface RoomItem {
	id: string;
	name: string;
	people: any[];
	messages: any[];
}

interface StoreState {
	auth: Auth;
	rooms: RoomItem[];
}
