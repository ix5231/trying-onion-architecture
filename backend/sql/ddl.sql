-- ログインアカウント
CREATE TABLE TbmLogin (
  id INTEGER PRIMARY KEY NOT NULL,
  loginId TEXT NOT NULL,
  password TEXT NOT NULL
) STRICT;