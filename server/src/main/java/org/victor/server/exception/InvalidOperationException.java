package org.victor.server.exception;

public class InvalidOperationException extends RuntimeException {
    public InvalidOperationException() {

    }

    public InvalidOperationException(String message) {
        super(message);
    }
}
