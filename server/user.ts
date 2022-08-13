// import type {User} from './class'
import type { IUser } from './interface.js'

class Users implements IUser {
    name: string
    session_id: string
    socket: object | null
    constructor() {
        this.name = ''
        this.session_id = ''
        this.socket = null
    }

    users = [] as Array<IUser>

    findInusers(name: string): number {//通过name查找
        var index = -1;
        for (var j = 0, len = this.users.length; j < len; j++) {
            if (this.users[j].name === name)
                index = j;
        }
        return index;
    }
    addUser(name: string, session_id: string): void {
        var index = this.findInusers(name);
        if (index === -1) //不存在则重新添加
            this.users.push({
                name: name, session_id: session_id,
                socket: null
            });
        else { //只更新session_id
            if (this.users[index].session_id !== session_id)
                this.users[index].session_id = session_id;
        }
    }
    setusersocket(name: string, socket: object): void {//更新用户socket
        var index = this.findInusers(name);
        if (index !== -1) {
            this.users[index].socket = socket;
        }
    }
    findUser(name: string): IUser | null {
        var index = this.findInusers(name);
        return index > -1 ? this.users[index] : null;
    }
    otherusers(name: string): Array<IUser> {//其他人
        var results = [] as Array<IUser>;
        for (var j = 0, len = this.users.length; j < len; j++) {
            if (this.users[j].name !== name)
                results.push({ session_id: this.users[j].session_id, name: this.users[j].name, socket: null });
        }
        return results;
    }
    getUsersName(): string[] {
        let nameList: string[] = []
        this.users.forEach((item) => { nameList.push(item.name) })
        return nameList
    }
    delUser(name: string):void {
        let index = this.findInusers(name)
        // return index > -1 ? this.users.splice(index, 1) : null
        if(index>-1)
            this.users.splice(index,1)
    }
}

// let this.users: Array<IUser> = [] as Array<IUser>

/* 
function findInthis.users(session_id) {//通过session_id查找
    var index = -1;
    for (var j = 0, len = this.users.length; j < len; j++) {
        if (this.users[j].session_id === session_id)
            index = j;
    }
    return index;
}
function addUser(name, session_id) {
    var index = findInthis.users(session_id);
    if (index === -1) //不存在则重新添加
        this.users.push({name: name, session_id: session_id, 
            socket: null});
    else { //只更新昵称
        if (this.users[index].name !== name)
            this.users[index].name = name;
    }
}
function setthis.usersocket(session_id, socket){//更新用户socket
    var index = findInthis.users(session_id);
    if (index !== -1){
        this.users[index].socket = socket;
    }
}
function findUser(session_id) {
    var index = findInthis.users(session_id);
    return index > -1 ? this.users[index] : null;
}
function otherthis.users(session_id){//其他人
    var results = [] as Array<IUser>;
    for (var j = 0, len = this.users.length; j < len; j++) {
        if (this.users[j].session_id !== session_id)
            results.push({session_id: this.users[j].session_id, name: this.users[j].name, socket:null});
    }
    return results;
} */

export default Users