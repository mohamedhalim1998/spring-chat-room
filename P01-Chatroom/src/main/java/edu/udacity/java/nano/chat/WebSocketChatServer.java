package edu.udacity.java.nano.chat;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.annotation.JsonAlias;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebSocket Server
 *
 * @see ServerEndpoint WebSocket Client
 * @see Session   WebSocket Session
 */

@Component
@ServerEndpoint(value = "/chat")
public class WebSocketChatServer {

    /**
     * All chat sessions.
     */
    private static Map<String, Session> onlineSessions = new ConcurrentHashMap<>();

    private static void sendMessageToAll(String msg) {
        for (Map.Entry<String, Session> e : onlineSessions.entrySet()) {
            try {
                e.getValue().getBasicRemote().sendText(msg);
            } catch (Exception exception) {
                System.out.println("ERROR: " + exception.getMessage());
            }
        }
    }

    /**
     * Open connection, 1) add session, 2) add user.
     */
    @OnOpen
    public void onOpen(Session session) {
        System.out.println("session: open " + session.getId());
        onlineSessions.put(session.getId(), session);
    }

    /**
     * Send message, 1) get username and session, 2) send message to all.
     */
    @OnMessage
    public void onMessage(Session session, String jsonStr) {
        System.out.println("RECV: " + jsonStr);
        Message message = JSON.parseObject(jsonStr, Message.class);
        if (message.getType().equals(Message.CONNECT)) {
            message.setOnlineCount(onlineSessions.size());
        } else if (message.getType().equals(Message.DISCONNECT)) {
            message.setOnlineCount(onlineSessions.size() - 1);
        }
        sendMessageToAll(JSON.toJSONString(message));
    }

    /**
     * Close connection, 1) remove session, 2) update user.
     */
    @OnClose
    public void onClose(Session session) {
        onlineSessions.remove(session.getId());

    }

    /**
     * Print exception.
     */
    @OnError
    public void onError(Session session, Throwable error) {
        error.printStackTrace();
    }

}
