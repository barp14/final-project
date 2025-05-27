CREATE TABLE message (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    message TEXT NOT NULL,
    user_id_send BIGINT UNSIGNED NOT NULL,
    user_id_receive BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id_send) REFERENCES users(id),
    FOREIGN KEY (user_id_receive) REFERENCES users(id)
);