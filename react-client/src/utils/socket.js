import io from 'socket.io-client'

const socket = io('http://localhost:8080')


socket.emit('clientAuth', 'reactClientKey')

export default socket;



