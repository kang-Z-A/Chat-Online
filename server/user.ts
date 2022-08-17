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

    findInusers(session_id: string): number {//通过name查找
        var index = -1;
        for (var j = 0, len = this.users.length; j < len; j++) {
            if (this.users[j].session_id === session_id)
                index = j;
        }
        return index;
    }
    addUser(name: string, session_id: string): void {
        var index = this.findInusers(session_id);
        if (index === -1) //不存在则重新添加
            this.users.push({
                name: name, session_id: session_id,
                socket: null
            });
        else { //只更新name
            if (this.users[index].name !== name)
                this.users[index].name = name;
        }
    }
    setusersocket(session_id: string, socket: object): void {//更新用户socket
        var index = this.findInusers(session_id);
        if (index !== -1) {
            this.users[index].socket = socket;
        }
    }
    findUser(session_id: string): IUser | null {
        var index = this.findInusers(session_id);
        return index > -1 ? this.users[index] : null;
    }
    otherusers(session_id: string): Array<IUser> {//其他人
        var results = [] as Array<IUser>;
        for (var j = 0, len = this.users.length; j < len; j++) {
            if (this.users[j].session_id !== session_id)
                results.push({ session_id: this.users[j].session_id, name: this.users[j].name, socket: null });
        }
        return results;
    }
    delUser(session_id: string):void {
        let index = this.findInusers(session_id)
        // return index > -1 ? this.users.splice(index, 1) : null
        if(index>-1)
            this.users.splice(index,1)
    }
}

export default Users