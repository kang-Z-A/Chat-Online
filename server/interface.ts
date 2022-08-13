// import { Socket } from 'socket.io-client';

interface IUser{
    name:string
    session_id:string
    socket:object|null
}

export type{
    IUser
}