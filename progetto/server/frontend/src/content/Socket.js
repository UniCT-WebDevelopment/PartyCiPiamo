import io from 'socket.io-client';


const serverUrl = window.location.hostname === 'localhost'
    ? ('http://localhost:' + process.env.REACT_APP_PORT)
    : ('http://' + process.env.REACT_APP_SERVER_URL + ':' + process.env.REACT_APP_PORT);
const SERVER_URL = serverUrl;

let socket;

const getSocket = () => {
    if (!socket) {
        socket = io(SERVER_URL);
        return socket;
    }
    return socket;
};

export default getSocket;
