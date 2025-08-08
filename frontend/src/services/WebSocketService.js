// scr/services/WebSocketService.js

import { Client } from '@stomp/stompjs';   // STOMP 프로토콜 클라이언트 라이브러리
import SockJS from 'sockjs-client';        // SockJS를 이용해 WebSocket 연결 생성

// 메시지 종류를 정의한 상수 객체 (입장, 채팅, 퇴장)
const MessageType = {
    CHAT: 'CHAT',
    JOIN: 'JOIN',
    LEAVE: 'LEAVE',
};

class WebSocketService {
    constructor() {
        
        // STOMP 클라이언트 생성 및 초기 설정
        this.client = new Client({
            // 실제 WebSocket 연결을 SockJS로 생성 (서버 URL 지정)
            webSocketFactory: () =>
                new SockJS(import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8080/ws'),

            // 디버그용 로그 출력 함수
            debug: (str) => {
                console.log(str);
            },

            // 연결이 끊겼을 때 재연결 시도 간격 (5초)
            reconnectDelay: 5000,

            // 하트비트(서버와 클라이언트가 서로 살아있음을 확인) 설정
            heartbeatIncoming: 4000,  // 서버로부터 하트비트 수신 주기 (ms)
            heartbeatOutgoing: 4000,  // 서버에 하트비트 전송 주기 (ms)
        });

        // 여러 곳에서 등록할 수 있는 메시지 수신 콜백 함수들을 저장할 Set(집합)
        this.messageCallbacks = new Set();

        // STOMP 연결이 성공했을 때 실행할 함수 등록
        this.client.onConnect = this.onConnect.bind(this);

        // STOMP 프로토콜 에러 발생 시 실행할 함수 등록
        this.client.onStompError = this.onStompError.bind(this);
    }

    /**
     * 서버와 WebSocket 연결을 시작하고
     * 사용자 이름을 로컬 스토리지에 저장하는 메서드
     * @param {string} username - 접속자 이름
     */
    connect(username) {
        if (!this.client) return;      // client가 없으면 종료

        this.client.activate();        // 실제 연결 시작
        localStorage.setItem('chat_username', username);  // 브라우저 저장소에 이름 저장
    }

    /**
     * WebSocket 연결 종료 메서드
     */
    disconnect() {
        if (this.client && this.client.connected) {
            this.client.deactivate();   // 연결 종료
        }
    }

    /**
     * 서버에서 오는 메시지를 받을 때마다 호출될 콜백 등록 메서드
     * 여러 콜백을 등록 가능하며,
     * 나중에 구독 해제(콜백 삭제) 함수도 반환함
     * @param {function} callback - 메시지 수신 시 실행할 함수
     * @returns {function} - 구독 해제 함수
     */
    subscribeToMessages(callback) {
        this.messageCallbacks.add(callback);

        // 구독 해제 함수 반환: 호출하면 해당 콜백이 제거됨
        return () => {
            this.messageCallbacks.delete(callback);
        };
    }

    /**
     * 채팅 메시지를 서버로 전송하는 메서드
     * 연결이 되어 있지 않으면 에러 로그 출력
     * @param {object} message - 전송할 채팅 메시지 객체
     */
    sendMessage(message) {
        if (!this.client || !this.client.connected) {
            console.error('WebSocket is not connected');
            return;
        }

        // 서버의 /app/chat.sendMessage 엔드포인트로 메시지 전송
        this.client.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(message),  // 객체를 JSON 문자열로 변환
        });
    }

    /**
     * 사용자 입장 메시지를 서버에 전송하는 메서드
     * @param {string} username - 입장하는 사용자 이름
     */
    joinChat(username) {
        if (!this.client || !this.client.connected) {
            console.error('WebSocket is not connected');
            return;
        }

        // 입장 메시지 객체 생성
        const message = {
            sender: username,
            content: `${username} joined the chat`,
            type: MessageType.JOIN,
        };

        // 서버의 /app/chat.addUser 엔드포인트로 메시지 전송
        this.client.publish({
            destination: '/app/chat.addUser',
            body: JSON.stringify(message),
        });
    }

    /**
     * WebSocket 연결 성공 시 자동으로 호출되는 함수
     * 서버의 공개 채널을 구독하고,
     * 저장된 username으로 입장 메시지를 전송
     */
    onConnect() {
        console.log('Connected to WebSocket');

        // 브라우저 로컬 스토리지에서 저장된 username 읽기
        const username = localStorage.getItem('chat_username');

        if (username) {
            // 서버에서 /topic/public으로 오는 모든 메시지를 구독
            this.client.subscribe('/topic/public', (message) => {
                try {
                    // 서버에서 받은 메시지를 JS 객체로 변환
                    const chatMessage = JSON.parse(message.body);

                    // 등록된 모든 콜백에 메시지 전달
                    this.messageCallbacks.forEach((callback) => callback(chatMessage));
                } catch (e) {
                    console.error('Error parsing message', e);
                }
            });

            // 접속 후 바로 입장 메시지 서버로 전송
            this.joinChat(username);
        }
    }

    /**
     * STOMP 프로토콜 에러가 발생했을 때 호출되는 함수
     * @param {object} frame - 에러 정보
     */
    onStompError(frame) {
        console.error('STOMP error', frame);
    }
}

// 싱글톤(앱 내 한 개만 생성) 인스턴스 생성
export const webSocketService = new WebSocketService();
export default webSocketService;
export { MessageType };
